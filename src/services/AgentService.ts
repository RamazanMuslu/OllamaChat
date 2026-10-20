import * as vscode from 'vscode';
import * as childProcess from 'child_process';
import { AgentFileAction } from './types';

// In-memory document provider for showing side-by-side diffs
export class DiffContentProvider implements vscode.TextDocumentContentProvider {
    public static readonly scheme = 'ollamachat-preview';
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    public readonly onDidChange = this._onDidChange.event;
    private _documents = new Map<string, string>();

    public provideTextDocumentContent(uri: vscode.Uri): string {
        return this._documents.get(uri.toString()) || '';
    }

    public setContent(uri: vscode.Uri, content: string): void {
        this._documents.set(uri.toString(), content);
        this._onDidChange.fire(uri);
    }

    public deleteContent(uri: vscode.Uri): void {
        this._documents.delete(uri.toString());
    }
}

export class AgentService {
    private static _diffProvider?: DiffContentProvider;

    public static register(context: vscode.ExtensionContext): DiffContentProvider {
        const provider = new DiffContentProvider();
        this._diffProvider = provider;
        context.subscriptions.push(
            vscode.workspace.registerTextDocumentContentProvider(DiffContentProvider.scheme, provider)
        );
        return provider;
    }

    public static getWorkspaceRoot(): vscode.WorkspaceFolder | undefined {
        const folders = vscode.workspace.workspaceFolders;
        return folders && folders.length > 0 ? folders[0] : undefined;
    }

    public static resolveUri(relativePath: string): vscode.Uri | undefined {
        const root = this.getWorkspaceRoot();
        if (!root) {
            return undefined;
        }
        // Remove leading slash if any
        const cleaned = relativePath.replace(/^(\.\/|\/)/, '');
        return vscode.Uri.joinPath(root.uri, cleaned);
    }

    public static async listFiles(limit = 80): Promise<string[]> {
        const root = this.getWorkspaceRoot();
        if (!root) {
            return [];
        }

        try {
            const uris = await vscode.workspace.findFiles(
                '**/*',
                '{**/node_modules/**,**/.git/**,**/dist/**,**/out/**,**/.next/**,**/build/**,**/.venv/**}',
                limit
            );
            return uris.map(u => vscode.workspace.asRelativePath(u));
        } catch {
            return [];
        }
    }

    public static async listDirectory(relativePath = ''): Promise<{ name: string; isDirectory: boolean }[]> {
        const uri = relativePath ? this.resolveUri(relativePath) : this.getWorkspaceRoot()?.uri;
        if (!uri) {
            throw new Error(`Workspace root not found`);
        }

        const entries = await vscode.workspace.fs.readDirectory(uri);
        return entries
            .map(([name, fileType]) => ({
                name,
                isDirectory: (fileType & vscode.FileType.Directory) !== 0,
            }))
            .sort((a, b) => {
                if (a.isDirectory && !b.isDirectory) { return -1; }
                if (!a.isDirectory && b.isDirectory) { return 1; }
                return a.name.localeCompare(b.name);
            });
    }

    public static async findFiles(pattern: string, limit = 60): Promise<string[]> {
        const root = this.getWorkspaceRoot();
        if (!root) {
            return [];
        }
        const glob = pattern.includes('*') ? pattern : `**/*${pattern}*`;
        try {
            const uris = await vscode.workspace.findFiles(
                glob,
                '{**/node_modules/**,**/.git/**,**/dist/**,**/out/**,**/.next/**,**/build/**,**/.venv/**}',
                limit
            );
            return uris.map(u => vscode.workspace.asRelativePath(u));
        } catch {
            return [];
        }
    }

    public static async grepSearch(
        query: string,
        pathPrefix?: string,
        isRegex = false,
        maxResults = 50
    ): Promise<{ file: string; line: number; content: string }[]> {
        const globPattern = pathPrefix ? `${pathPrefix.replace(/\/$/, '')}/**/*` : '**/*';
        const files = await vscode.workspace.findFiles(
            globPattern,
            '{**/node_modules/**,**/.git/**,**/dist/**,**/out/**,**/.next/**,**/build/**,**/.venv/**,**/*.png,**/*.jpg,**/*.jpeg,**/*.gif,**/*.lock,**/*.pdf,**/*.ico,**/*.mp4,**/*.zip,**/*.wasm}',
            120
        );

        const results: { file: string; line: number; content: string }[] = [];
        let matcher: RegExp;
        try {
            matcher = isRegex ? new RegExp(query, 'i') : new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        } catch {
            matcher = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        }

        for (const fileUri of files) {
            if (results.length >= maxResults) {
                break;
            }
            try {
                const data = await vscode.workspace.fs.readFile(fileUri);
                const buffer = Buffer.from(data);
                if (buffer.includes(0)) {
                    continue; // Skip binary
                }
                const content = buffer.toString('utf8');
                const lines = content.split(/\r?\n/);
                const relPath = vscode.workspace.asRelativePath(fileUri);

                for (let i = 0; i < lines.length; i++) {
                    if (matcher.test(lines[i])) {
                        results.push({
                            file: relPath,
                            line: i + 1,
                            content: lines[i].trim().slice(0, 200),
                        });
                        if (results.length >= maxResults) {
                            break;
                        }
                    }
                }
            } catch {
                // Ignore unreadable
            }
        }
        return results;
    }

    public static async createDirectory(relativePath: string): Promise<void> {
        const uri = this.resolveUri(relativePath);
        if (!uri) {
            throw new Error(`Workspace root not found`);
        }
        await vscode.workspace.fs.createDirectory(uri);
    }

    public static async deletePath(relativePath: string, useTrash = true): Promise<void> {
        const uri = this.resolveUri(relativePath);
        if (!uri) {
            throw new Error(`Workspace root not found`);
        }
        await vscode.workspace.fs.delete(uri, { recursive: true, useTrash });
    }

    public static async movePath(fromRelativePath: string, toRelativePath: string): Promise<void> {
        const fromUri = this.resolveUri(fromRelativePath);
        const toUri = this.resolveUri(toRelativePath);
        if (!fromUri || !toUri) {
            throw new Error(`Workspace root not found`);
        }
        const toParent = vscode.Uri.joinPath(toUri, '..');
        try {
            await vscode.workspace.fs.createDirectory(toParent);
        } catch {
            // Parent exists
        }
        await vscode.workspace.fs.rename(fromUri, toUri, { overwrite: false });
    }

    public static async executeCommand(
        command: string,
        timeoutMs = 25000
    ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
        const root = this.getWorkspaceRoot();
        const cwd = root ? root.uri.fsPath : process.cwd();

        return new Promise((resolve) => {
            childProcess.exec(
                command,
                {
                    cwd,
                    timeout: timeoutMs,
                    maxBuffer: 1024 * 1024,
                    env: { ...process.env, CI: 'true', LANG: 'en_US.UTF-8' },
                },
                (error, stdout, stderr) => {
                    resolve({
                        stdout: stdout ? stdout.toString() : '',
                        stderr: stderr ? stderr.toString() : (error ? error.message : ''),
                        exitCode: error && error.code !== undefined ? error.code : 0,
                    });
                }
            );
        });
    }

    public static async readFile(relativePath: string): Promise<string> {
        const uri = this.resolveUri(relativePath);
        if (!uri) {
            throw new Error(`Workspace root not found`);
        }
        const data = await vscode.workspace.fs.readFile(uri);
        return Buffer.from(data).toString('utf8');
    }

    public static async writeFile(
        relativePath: string,
        content: string
    ): Promise<{ originalContent: string; wasCreated: boolean }> {
        const uri = this.resolveUri(relativePath);
        if (!uri) {
            throw new Error(`Workspace root not found`);
        }

        let originalContent = '';
        let wasCreated = false;
        try {
            originalContent = await this.readFile(relativePath);
        } catch {
            wasCreated = true;
        }

        // Ensure parent directory exists before writing
        try {
            const parentUri = vscode.Uri.joinPath(uri, '..');
            await vscode.workspace.fs.createDirectory(parentUri);
        } catch {
            // Directory might already exist, continue
        }

        const data = Buffer.from(content, 'utf8');
        await vscode.workspace.fs.writeFile(uri, data);

        // Open text document in editor to show the change
        try {
            const doc = await vscode.workspace.openTextDocument(uri);
            await vscode.window.showTextDocument(doc, { preview: false });
        } catch {
            // Ignore open error if file cannot be displayed
        }

        return { originalContent, wasCreated };
    }

    public static async revertAction(action: AgentFileAction): Promise<void> {
        if (action.type === 'move' && action.targetPath) {
            // Revert move: move back from targetPath to original path
            await this.movePath(action.targetPath, action.path);
            return;
        }

        if (action.type === 'create_dir') {
            await this.deletePath(action.path, true);
            return;
        }

        const uri = this.resolveUri(action.path);
        if (!uri) {
            throw new Error(`Workspace root not found for path: ${action.path}`);
        }

        if (action.wasCreated) {
            // File was brand new; delete it to rollback
            await vscode.workspace.fs.delete(uri, { recursive: false, useTrash: true });
        } else if (action.originalContent !== undefined) {
            // Restore exact original content
            const data = Buffer.from(action.originalContent, 'utf8');
            await vscode.workspace.fs.writeFile(uri, data);
            try {
                const doc = await vscode.workspace.openTextDocument(uri);
                await vscode.window.showTextDocument(doc, { preview: false });
            } catch {
                // Ignore open error
            }
        }
    }

    public static async applySearchReplace(
        relativePath: string,
        search: string,
        replace: string
    ): Promise<{ newContent: string; originalContent: string }> {
        const originalContent = await this.readFile(relativePath);

        // Normalize line endings for reliable matching
        const normOriginal = originalContent.replace(/\r\n/g, '\n');
        const normSearch = search.replace(/\r\n/g, '\n').trim();

        if (!normSearch) {
            throw new Error('Search block cannot be empty');
        }

        if (!normOriginal.includes(normSearch)) {
            // Attempt fuzzy/trimmed search matching
            const lines = normOriginal.split('\n');
            const searchLines = normSearch.split('\n').map(l => l.trim());
            let foundIdx = -1;

            for (let i = 0; i <= lines.length - searchLines.length; i++) {
                let match = true;
                for (let j = 0; j < searchLines.length; j++) {
                    if (lines[i + j].trim() !== searchLines[j]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    foundIdx = i;
                    break;
                }
            }

            if (foundIdx === -1) {
                throw new Error(`Could not find target search block in "${relativePath}". Please verify the code.`);
            }

            // Replace line range
            const newLines = [
                ...lines.slice(0, foundIdx),
                replace,
                ...lines.slice(foundIdx + searchLines.length),
            ];
            const newContent = newLines.join('\n');
            await this.writeFile(relativePath, newContent);
            return { newContent, originalContent };
        }

        const newContent = normOriginal.replace(normSearch, replace);
        await this.writeFile(relativePath, newContent);
        return { newContent, originalContent };
    }

    public static async showDiff(
        relativePath: string,
        newContent: string,
        title?: string
    ): Promise<void> {
        const originalUri = this.resolveUri(relativePath);
        if (!originalUri || !this._diffProvider) {
            return;
        }

        const previewUri = vscode.Uri.parse(
            `${DiffContentProvider.scheme}:${encodeURIComponent(relativePath)}`
        );
        this._diffProvider.setContent(previewUri, newContent);

        const diffTitle = title || `${relativePath} (Proposed Changes ↔ Current)`;
        await vscode.commands.executeCommand('vscode.diff', originalUri, previewUri, diffTitle);
    }

    public static parseAgentActions(text: string): AgentFileAction[] {
        const actions: AgentFileAction[] = [];
        let actionIdCounter = 1;

        // 1. Primary: Match <write_file path="...">...</write_file>
        const writeRegex = /<write_file\s+path=["']([^"']+)["']\s*>([\s\S]*?)<\/write_file>/gi;
        let match: RegExpExecArray | null;

        while ((match = writeRegex.exec(text)) !== null) {
            const path = match[1].trim();
            const content = match[2];
            actions.push({
                id: `act_write_${Date.now()}_${actionIdCounter++}`,
                type: 'write',
                path,
                content,
                status: 'pending',
                newContent: content,
            });
        }

        // 2. Primary: Match <edit_file path="...">...<search>...</search>...<replace>...</replace>...</edit_file>
        const editRegex = /<edit_file\s+path=["']([^"']+)["']\s*>([\s\S]*?)<\/edit_file>/gi;

        while ((match = editRegex.exec(text)) !== null) {
            const path = match[1].trim();
            const body = match[2];

            const searchMatch = /<search>([\s\S]*?)<\/search>/i.exec(body);
            const replaceMatch = /<replace>([\s\S]*?)<\/replace>/i.exec(body);

            if (searchMatch && replaceMatch) {
                actions.push({
                    id: `act_edit_${Date.now()}_${actionIdCounter++}`,
                    type: 'edit',
                    path,
                    search: searchMatch[1],
                    replace: replaceMatch[1],
                    status: 'pending',
                });
            } else if (body.trim()) {
                actions.push({
                    id: `act_write_${Date.now()}_${actionIdCounter++}`,
                    type: 'write',
                    path,
                    content: body,
                    status: 'pending',
                    newContent: body,
                });
            }
        }

        // 3. Match <read_file path="..."> or <cat path="...">
        const readRegex = /<(?:read_file|cat)\s+path=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:read_file|cat)>|\s*>)/gi;
        while ((match = readRegex.exec(text)) !== null) {
            const path = match[1].trim();
            actions.push({
                id: `act_read_${Date.now()}_${actionIdCounter++}`,
                type: 'read',
                path,
                status: 'pending',
            });
        }

        // 4. Match <create_folder path="..."> or <create_dir path="...">
        const createDirRegex = /<(?:create_folder|create_dir)\s+path=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:create_folder|create_dir)>|\s*>)/gi;
        while ((match = createDirRegex.exec(text)) !== null) {
            const path = match[1].trim();
            actions.push({
                id: `act_mkdir_${Date.now()}_${actionIdCounter++}`,
                type: 'create_dir',
                path,
                status: 'pending',
            });
        }

        // 5. Match <delete_path path="..."> or <delete_file path="..."> or <delete_folder path="...">
        const deleteRegex = /<(?:delete_path|delete_file|delete_folder)\s+path=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:delete_path|delete_file|delete_folder)>|\s*>)/gi;
        while ((match = deleteRegex.exec(text)) !== null) {
            const path = match[1].trim();
            actions.push({
                id: `act_del_${Date.now()}_${actionIdCounter++}`,
                type: 'delete',
                path,
                status: 'pending',
            });
        }

        // 6. Match <move_path from="..." to="..."> or <rename_path from="..." to="...">
        const moveRegex = /<(?:move_path|rename_path)\s+from=["']([^"']+)["']\s+to=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:move_path|rename_path)>|\s*>)/gi;
        while ((match = moveRegex.exec(text)) !== null) {
            const fromPath = match[1].trim();
            const toPath = match[2].trim();
            actions.push({
                id: `act_move_${Date.now()}_${actionIdCounter++}`,
                type: 'move',
                path: fromPath,
                targetPath: toPath,
                status: 'pending',
            });
        }

        // 7. Match <list_dir (path="...")?> or <list_files (path="...")?>
        const listDirRegex = /<(?:list_dir|list_files)(?:\s+path=["']([^"']*)["'])?(?:\s*\/>|\s*>[\s\S]*?<\/(?:list_dir|list_files)>|\s*>)/gi;
        while ((match = listDirRegex.exec(text)) !== null) {
            const path = (match[1] || '').trim();
            actions.push({
                id: `act_list_${Date.now()}_${actionIdCounter++}`,
                type: 'list_dir',
                path: path || '.',
                status: 'pending',
            });
        }

        // 8. Match <find_files pattern="...">
        const findRegex = /<find_files\s+pattern=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/find_files>|\s*>)/gi;
        while ((match = findRegex.exec(text)) !== null) {
            const pattern = match[1].trim();
            actions.push({
                id: `act_find_${Date.now()}_${actionIdCounter++}`,
                type: 'find_files',
                path: pattern,
                pattern,
                status: 'pending',
            });
        }

        // 9. Match <grep query="..." (path="...")? (is_regex="true|false")?>
        const grepRegex = /<grep\s+query=["']([^"']+)["'](?:\s+path=["']([^"']*)["'])?(?:\s+is_regex=["'](true|false)["'])?(?:\s*\/>|\s*>[\s\S]*?<\/grep>|\s*>)/gi;
        while ((match = grepRegex.exec(text)) !== null) {
            const query = match[1].trim();
            const path = (match[2] || '').trim();
            const isRegex = match[3] === 'true';
            actions.push({
                id: `act_grep_${Date.now()}_${actionIdCounter++}`,
                type: 'grep',
                path: path || '.',
                query,
                isRegex,
                status: 'pending',
            });
        }

        // 10. Match <run_command>cmd</run_command> or <execute_command>cmd</execute_command>
        const cmdRegex = /<(?:run_command|execute_command)>([\s\S]*?)<\/(?:run_command|execute_command)>/gi;
        while ((match = cmdRegex.exec(text)) !== null) {
            const command = match[1].trim();
            if (command) {
                actions.push({
                    id: `act_cmd_${Date.now()}_${actionIdCounter++}`,
                    type: 'command',
                    path: 'terminal',
                    command,
                    status: 'pending',
                });
            }
        }

        // 11. Match <web_search query="..."> or <web_search>query</web_search>
        const webSearchRegex = /<web_search(?:\s+query=["']([^"']+)["'])?(?:\s*\/>|\s*>([\s\S]*?)<\/web_search>|\s*>)/gi;
        while ((match = webSearchRegex.exec(text)) !== null) {
            const query = (match[1] || match[2] || '').trim();
            if (query) {
                actions.push({
                    id: `act_web_${Date.now()}_${actionIdCounter++}`,
                    type: 'web_search',
                    path: 'web',
                    query,
                    status: 'pending',
                });
            }
        }

        // 11. Fallback Parser: If no explicit XML tags were found, detect markdown codeblocks that label files
        if (actions.length === 0) {
            // Pattern A: ```lang:path/to/file.ext or ```path/to/file.ext
            const fencePathRegex = /```(?:[a-zA-Z0-9_-]+:)?([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)\r?\n([\s\S]*?)```/g;
            while ((match = fencePathRegex.exec(text)) !== null) {
                const path = match[1].trim();
                const content = match[2];
                if (/\.[a-zA-Z0-9]{1,10}$/.test(path) && !path.startsWith('http')) {
                    actions.push({
                        id: `act_fallback_${Date.now()}_${actionIdCounter++}`,
                        type: 'write',
                        path,
                        content,
                        status: 'pending',
                        newContent: content,
                    });
                }
            }

            // Pattern B: **File: path/to/file.ext** or File: `path/to/file.ext` immediately followed by codeblock
            if (actions.length === 0) {
                const headerFileRegex = /(?:###|##|\*\*|File:?|Dosya:?)\s*`?([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)`?\s*(?:\*\*)?\s*\r?\n```(?:[a-zA-Z0-9_-]+)?\r?\n([\s\S]*?)```/gi;
                while ((match = headerFileRegex.exec(text)) !== null) {
                    const path = match[1].trim();
                    const content = match[2];
                    if (/\.[a-zA-Z0-9]{1,10}$/.test(path)) {
                        actions.push({
                            id: `act_fallback_${Date.now()}_${actionIdCounter++}`,
                            type: 'write',
                            path,
                            content,
                            status: 'pending',
                            newContent: content,
                        });
                    }
                }
            }
        }

        return actions;
    }

    public static getAgentSystemPrompt(
        customPrompt?: string,
        fileList: string[] = [],
        webAccessEnabled = false
    ): string {
        const fileListStr = fileList.length > 0
            ? fileList.slice(0, 60).map(f => `- ${f}`).join('\n')
            : '(No files listed)';

        return `CRITICAL DIRECTIVE: You are OllamaChat AGENT, an autonomous software engineering and debugging agent inside Visual Studio Code.
You are equipped with a complete suite of system and project tools. When the user asks you to inspect, debug, fix, test, refactor, or build code, YOU MUST USE THE EXECUTABLE XML ACTIONS BELOW.

DO NOT merely speak or show conversational snippets. Emit executable tool action tags so that VS Code executes them, displays diffs, shows command outputs, or performs workspace operations.

=== WORKSPACE CONTEXT ===
Project files currently available in this workspace:
${fileListStr}

=== FULL AGENT TOOLKIT & ACTION FORMATS ===

1. [INSPECT / READ FILE CONTENTS (cat)]
Use this when you need to inspect existing code or configuration:
<read_file path="src/index.ts" />

2. [LIST DIRECTORY CONTENTS (ls / list_dir)]
Use this to see files and subdirectories inside a specific folder:
<list_dir path="src/components" />

3. [FIND FILES BY PATTERN (find / glob)]
Use this to locate files matching a wildcard or pattern across the project:
<find_files pattern="*.config.js" />

4. [SEARCH CODE ACROSS PROJECT (grep)]
Use this to locate specific functions, imports, error messages, or identifiers:
<grep query="export interface AgentFileAction" path="src" />

5. [CREATE DIRECTORY / FOLDER (mkdir)]
Use this to create a new folder structure:
<create_folder path="src/utils/auth" />

6. [DELETE FILE OR DIRECTORY (rm)]
Use this to delete unnecessary or obsolete files/folders:
<delete_path path="temp/scratch.ts" />

7. [MOVE OR RENAME FILE / DIRECTORY (mv / rename)]
Use this to rename or move files or folders:
<move_path from="src/oldName.ts" to="src/newName.ts" />

8. [RUN TERMINAL COMMAND (DEBUGGING, TESTS, BUILD)]
Use this to execute terminal commands (e.g., test runners, linters, git status, build commands). NOTE: Never run destructive commands like rm -rf / or sudo:
<run_command>npm test</run_command>

9. [CREATE OR OVERWRITE FULL FILE]
Use this to create a new code file or completely overwrite an existing file:
<write_file path="src/example.ts">
export function example() {
    return true;
}
</write_file>

10. [SEARCH & REPLACE IN FILE (PRECISE EDIT)]
Use this for updating specific blocks in existing files without rewriting the entire file:
<edit_file path="src/example.ts">
<search>
    return true;
</search>
<replace>
    return false;
</replace>
</edit_file>
${webAccessEnabled ? `
11. [SEARCH THE WEB (LIVE INTERNET RESEARCH)]
Use this when you need latest documentation, external library APIs, error solutions, or up-to-date web information:
<web_search query="React 19 useActionState documentation" />
` : ''}
=== RULES FOR SUCCESSFUL AGENT EXECUTION ===
1. Use relative file paths from the workspace root (e.g. "src/components/Header.tsx", "package.json").
2. The <search> block MUST match the existing file code character-for-character.
3. When investigating bugs, use <read_file>, <grep>, or <run_command> to gather real facts before applying code modifications.
4. You may emit multiple actions in a single response (e.g. create a folder, write two files, and run tests).
5. Always keep conversational text concise and let the tool actions do the heavy lifting.

${customPrompt ? `=== USER PREFERENCES & CUSTOM INSTRUCTIONS ===\n${customPrompt}` : ''}`;
    }
}
