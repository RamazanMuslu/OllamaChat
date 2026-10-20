"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode3 = __toESM(require("vscode"));

// src/providers/ChatViewProvider.ts
var vscode2 = __toESM(require("vscode"));

// src/services/OllamaService.ts
var OllamaService = class {
  static async getInstalledModels(baseUrl) {
    const url = `${baseUrl.replace(/\/+$/, "")}/api/tags`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });
    if (!response.ok) {
      throw new Error(`Ollama modelleri al\u0131namad\u0131: HTTP ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.models || [];
  }
  static async streamChat(params) {
    const {
      baseUrl,
      model,
      messages,
      systemPrompt,
      temperature,
      numCtx,
      numPredict,
      signal,
      onChunk,
      onDone,
      onError
    } = params;
    const finalMessages = [...messages];
    if (systemPrompt && systemPrompt.trim()) {
      if (finalMessages.length > 0 && finalMessages[0].role === "system") {
        finalMessages[0] = { role: "system", content: systemPrompt };
      } else {
        finalMessages.unshift({ role: "system", content: systemPrompt });
      }
    }
    const options = {};
    if (typeof temperature === "number") {
      options.temperature = temperature;
    }
    if (typeof numCtx === "number" && numCtx > 0) {
      options.num_ctx = numCtx;
    }
    if (typeof numPredict === "number" && numPredict > 0) {
      options.num_predict = numPredict;
    }
    const url = `${baseUrl.replace(/\/+$/, "")}/api/chat`;
    let response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: finalMessages,
          stream: true,
          options: Object.keys(options).length > 0 ? options : void 0
        }),
        signal
      });
    } catch (err) {
      if (signal?.aborted) {
        return;
      }
      const error = err instanceof Error ? err : new Error(String(err));
      onError(new Error(`Ollama servisine ba\u011Flan\u0131lamad\u0131 (${baseUrl}): ${error.message}`));
      return;
    }
    if (!response.ok) {
      let errorDetail = "";
      try {
        const errJson = await response.json();
        errorDetail = errJson.error || "";
      } catch {
      }
      onError(new Error(`Ollama hatas\u0131 [${response.status}]: ${errorDetail || response.statusText}`));
      return;
    }
    if (!response.body) {
      onError(new Error("Ollama yan\u0131t g\xF6vdesi (body) bo\u015F d\xF6nd\xFC."));
      return;
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullText = "";
    let stats = {};
    let buffer = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) {
            continue;
          }
          try {
            const parsed = JSON.parse(trimmed);
            if (parsed.message?.content) {
              const chunk = parsed.message.content;
              fullText += chunk;
              onChunk(chunk);
            }
            if (parsed.done) {
              const evalCount = parsed.eval_count || 0;
              const evalDurationSec = (parsed.eval_duration || 0) / 1e9;
              const tokensPerSec = evalDurationSec > 0 ? evalCount / evalDurationSec : 0;
              stats = {
                totalDurationMs: (parsed.total_duration || 0) / 1e6,
                loadDurationMs: (parsed.load_duration || 0) / 1e6,
                promptEvalCount: parsed.prompt_eval_count,
                promptEvalDurationMs: (parsed.prompt_eval_duration || 0) / 1e6,
                evalCount: parsed.eval_count,
                evalDurationMs: (parsed.eval_duration || 0) / 1e6,
                tokensPerSecond: tokensPerSec
              };
            }
          } catch {
          }
        }
      }
      if (buffer.trim()) {
        try {
          const parsed = JSON.parse(buffer.trim());
          if (parsed.message?.content) {
            fullText += parsed.message.content;
            onChunk(parsed.message.content);
          }
        } catch {
        }
      }
      onDone(stats, fullText);
    } catch (err) {
      if (signal?.aborted) {
        return;
      }
      const error = err instanceof Error ? err : new Error(String(err));
      onError(error);
    }
  }
};

// src/services/AgentService.ts
var vscode = __toESM(require("vscode"));
var childProcess = __toESM(require("child_process"));
var DiffContentProvider = class {
  static scheme = "ollamachat-preview";
  _onDidChange = new vscode.EventEmitter();
  onDidChange = this._onDidChange.event;
  _documents = /* @__PURE__ */ new Map();
  provideTextDocumentContent(uri) {
    return this._documents.get(uri.toString()) || "";
  }
  setContent(uri, content) {
    this._documents.set(uri.toString(), content);
    this._onDidChange.fire(uri);
  }
  deleteContent(uri) {
    this._documents.delete(uri.toString());
  }
};
var AgentService = class {
  static _diffProvider;
  static register(context) {
    const provider = new DiffContentProvider();
    this._diffProvider = provider;
    context.subscriptions.push(
      vscode.workspace.registerTextDocumentContentProvider(DiffContentProvider.scheme, provider)
    );
    return provider;
  }
  static getWorkspaceRoot() {
    const folders = vscode.workspace.workspaceFolders;
    return folders && folders.length > 0 ? folders[0] : void 0;
  }
  static resolveUri(relativePath) {
    const root = this.getWorkspaceRoot();
    if (!root) {
      return void 0;
    }
    const cleaned = relativePath.replace(/^(\.\/|\/)/, "");
    return vscode.Uri.joinPath(root.uri, cleaned);
  }
  static async listFiles(limit = 80) {
    const root = this.getWorkspaceRoot();
    if (!root) {
      return [];
    }
    try {
      const uris = await vscode.workspace.findFiles(
        "**/*",
        "{**/node_modules/**,**/.git/**,**/dist/**,**/out/**,**/.next/**,**/build/**,**/.venv/**}",
        limit
      );
      return uris.map((u) => vscode.workspace.asRelativePath(u));
    } catch {
      return [];
    }
  }
  static async listDirectory(relativePath = "") {
    const uri = relativePath ? this.resolveUri(relativePath) : this.getWorkspaceRoot()?.uri;
    if (!uri) {
      throw new Error(`Workspace root not found`);
    }
    const entries = await vscode.workspace.fs.readDirectory(uri);
    return entries.map(([name, fileType]) => ({
      name,
      isDirectory: (fileType & vscode.FileType.Directory) !== 0
    })).sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) {
        return -1;
      }
      if (!a.isDirectory && b.isDirectory) {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });
  }
  static async findFiles(pattern, limit = 60) {
    const root = this.getWorkspaceRoot();
    if (!root) {
      return [];
    }
    const glob = pattern.includes("*") ? pattern : `**/*${pattern}*`;
    try {
      const uris = await vscode.workspace.findFiles(
        glob,
        "{**/node_modules/**,**/.git/**,**/dist/**,**/out/**,**/.next/**,**/build/**,**/.venv/**}",
        limit
      );
      return uris.map((u) => vscode.workspace.asRelativePath(u));
    } catch {
      return [];
    }
  }
  static async grepSearch(query, pathPrefix, isRegex = false, maxResults = 50) {
    const globPattern = pathPrefix ? `${pathPrefix.replace(/\/$/, "")}/**/*` : "**/*";
    const files = await vscode.workspace.findFiles(
      globPattern,
      "{**/node_modules/**,**/.git/**,**/dist/**,**/out/**,**/.next/**,**/build/**,**/.venv/**,**/*.png,**/*.jpg,**/*.jpeg,**/*.gif,**/*.lock,**/*.pdf,**/*.ico,**/*.mp4,**/*.zip,**/*.wasm}",
      120
    );
    const results = [];
    let matcher;
    try {
      matcher = isRegex ? new RegExp(query, "i") : new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    } catch {
      matcher = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    }
    for (const fileUri of files) {
      if (results.length >= maxResults) {
        break;
      }
      try {
        const data = await vscode.workspace.fs.readFile(fileUri);
        const buffer = Buffer.from(data);
        if (buffer.includes(0)) {
          continue;
        }
        const content = buffer.toString("utf8");
        const lines = content.split(/\r?\n/);
        const relPath = vscode.workspace.asRelativePath(fileUri);
        for (let i = 0; i < lines.length; i++) {
          if (matcher.test(lines[i])) {
            results.push({
              file: relPath,
              line: i + 1,
              content: lines[i].trim().slice(0, 200)
            });
            if (results.length >= maxResults) {
              break;
            }
          }
        }
      } catch {
      }
    }
    return results;
  }
  static async createDirectory(relativePath) {
    const uri = this.resolveUri(relativePath);
    if (!uri) {
      throw new Error(`Workspace root not found`);
    }
    await vscode.workspace.fs.createDirectory(uri);
  }
  static async deletePath(relativePath, useTrash = true) {
    const uri = this.resolveUri(relativePath);
    if (!uri) {
      throw new Error(`Workspace root not found`);
    }
    await vscode.workspace.fs.delete(uri, { recursive: true, useTrash });
  }
  static async movePath(fromRelativePath, toRelativePath) {
    const fromUri = this.resolveUri(fromRelativePath);
    const toUri = this.resolveUri(toRelativePath);
    if (!fromUri || !toUri) {
      throw new Error(`Workspace root not found`);
    }
    const toParent = vscode.Uri.joinPath(toUri, "..");
    try {
      await vscode.workspace.fs.createDirectory(toParent);
    } catch {
    }
    await vscode.workspace.fs.rename(fromUri, toUri, { overwrite: false });
  }
  static async executeCommand(command, timeoutMs = 25e3) {
    const root = this.getWorkspaceRoot();
    const cwd = root ? root.uri.fsPath : process.cwd();
    return new Promise((resolve) => {
      childProcess.exec(
        command,
        {
          cwd,
          timeout: timeoutMs,
          maxBuffer: 1024 * 1024,
          env: { ...process.env, CI: "true", LANG: "en_US.UTF-8" }
        },
        (error, stdout, stderr) => {
          resolve({
            stdout: stdout ? stdout.toString() : "",
            stderr: stderr ? stderr.toString() : error ? error.message : "",
            exitCode: error && error.code !== void 0 ? error.code : 0
          });
        }
      );
    });
  }
  static async readFile(relativePath) {
    const uri = this.resolveUri(relativePath);
    if (!uri) {
      throw new Error(`Workspace root not found`);
    }
    const data = await vscode.workspace.fs.readFile(uri);
    return Buffer.from(data).toString("utf8");
  }
  static async writeFile(relativePath, content) {
    const uri = this.resolveUri(relativePath);
    if (!uri) {
      throw new Error(`Workspace root not found`);
    }
    let originalContent = "";
    let wasCreated = false;
    try {
      originalContent = await this.readFile(relativePath);
    } catch {
      wasCreated = true;
    }
    try {
      const parentUri = vscode.Uri.joinPath(uri, "..");
      await vscode.workspace.fs.createDirectory(parentUri);
    } catch {
    }
    const data = Buffer.from(content, "utf8");
    await vscode.workspace.fs.writeFile(uri, data);
    try {
      const doc = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(doc, { preview: false });
    } catch {
    }
    return { originalContent, wasCreated };
  }
  static async revertAction(action) {
    if (action.type === "move" && action.targetPath) {
      await this.movePath(action.targetPath, action.path);
      return;
    }
    if (action.type === "create_dir") {
      await this.deletePath(action.path, true);
      return;
    }
    const uri = this.resolveUri(action.path);
    if (!uri) {
      throw new Error(`Workspace root not found for path: ${action.path}`);
    }
    if (action.wasCreated) {
      await vscode.workspace.fs.delete(uri, { recursive: false, useTrash: true });
    } else if (action.originalContent !== void 0) {
      const data = Buffer.from(action.originalContent, "utf8");
      await vscode.workspace.fs.writeFile(uri, data);
      try {
        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc, { preview: false });
      } catch {
      }
    }
  }
  static async applySearchReplace(relativePath, search, replace) {
    const originalContent = await this.readFile(relativePath);
    const normOriginal = originalContent.replace(/\r\n/g, "\n");
    const normSearch = search.replace(/\r\n/g, "\n").trim();
    if (!normSearch) {
      throw new Error("Search block cannot be empty");
    }
    if (!normOriginal.includes(normSearch)) {
      const lines = normOriginal.split("\n");
      const searchLines = normSearch.split("\n").map((l) => l.trim());
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
      const newLines = [
        ...lines.slice(0, foundIdx),
        replace,
        ...lines.slice(foundIdx + searchLines.length)
      ];
      const newContent2 = newLines.join("\n");
      await this.writeFile(relativePath, newContent2);
      return { newContent: newContent2, originalContent };
    }
    const newContent = normOriginal.replace(normSearch, replace);
    await this.writeFile(relativePath, newContent);
    return { newContent, originalContent };
  }
  static async showDiff(relativePath, newContent, title) {
    const originalUri = this.resolveUri(relativePath);
    if (!originalUri || !this._diffProvider) {
      return;
    }
    const previewUri = vscode.Uri.parse(
      `${DiffContentProvider.scheme}:${encodeURIComponent(relativePath)}`
    );
    this._diffProvider.setContent(previewUri, newContent);
    const diffTitle = title || `${relativePath} (Proposed Changes \u2194 Current)`;
    await vscode.commands.executeCommand("vscode.diff", originalUri, previewUri, diffTitle);
  }
  static parseAgentActions(text) {
    const actions = [];
    let actionIdCounter = 1;
    const writeRegex = /<write_file\s+path=["']([^"']+)["']\s*>([\s\S]*?)<\/write_file>/gi;
    let match;
    while ((match = writeRegex.exec(text)) !== null) {
      const path = match[1].trim();
      const content = match[2];
      actions.push({
        id: `act_write_${Date.now()}_${actionIdCounter++}`,
        type: "write",
        path,
        content,
        status: "pending",
        newContent: content
      });
    }
    const editRegex = /<edit_file\s+path=["']([^"']+)["']\s*>([\s\S]*?)<\/edit_file>/gi;
    while ((match = editRegex.exec(text)) !== null) {
      const path = match[1].trim();
      const body = match[2];
      const searchMatch = /<search>([\s\S]*?)<\/search>/i.exec(body);
      const replaceMatch = /<replace>([\s\S]*?)<\/replace>/i.exec(body);
      if (searchMatch && replaceMatch) {
        actions.push({
          id: `act_edit_${Date.now()}_${actionIdCounter++}`,
          type: "edit",
          path,
          search: searchMatch[1],
          replace: replaceMatch[1],
          status: "pending"
        });
      } else if (body.trim()) {
        actions.push({
          id: `act_write_${Date.now()}_${actionIdCounter++}`,
          type: "write",
          path,
          content: body,
          status: "pending",
          newContent: body
        });
      }
    }
    const readRegex = /<(?:read_file|cat)\s+path=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:read_file|cat)>|\s*>)/gi;
    while ((match = readRegex.exec(text)) !== null) {
      const path = match[1].trim();
      actions.push({
        id: `act_read_${Date.now()}_${actionIdCounter++}`,
        type: "read",
        path,
        status: "pending"
      });
    }
    const createDirRegex = /<(?:create_folder|create_dir)\s+path=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:create_folder|create_dir)>|\s*>)/gi;
    while ((match = createDirRegex.exec(text)) !== null) {
      const path = match[1].trim();
      actions.push({
        id: `act_mkdir_${Date.now()}_${actionIdCounter++}`,
        type: "create_dir",
        path,
        status: "pending"
      });
    }
    const deleteRegex = /<(?:delete_path|delete_file|delete_folder)\s+path=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:delete_path|delete_file|delete_folder)>|\s*>)/gi;
    while ((match = deleteRegex.exec(text)) !== null) {
      const path = match[1].trim();
      actions.push({
        id: `act_del_${Date.now()}_${actionIdCounter++}`,
        type: "delete",
        path,
        status: "pending"
      });
    }
    const moveRegex = /<(?:move_path|rename_path)\s+from=["']([^"']+)["']\s+to=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:move_path|rename_path)>|\s*>)/gi;
    while ((match = moveRegex.exec(text)) !== null) {
      const fromPath = match[1].trim();
      const toPath = match[2].trim();
      actions.push({
        id: `act_move_${Date.now()}_${actionIdCounter++}`,
        type: "move",
        path: fromPath,
        targetPath: toPath,
        status: "pending"
      });
    }
    const listDirRegex = /<(?:list_dir|list_files)(?:\s+path=["']([^"']*)["'])?(?:\s*\/>|\s*>[\s\S]*?<\/(?:list_dir|list_files)>|\s*>)/gi;
    while ((match = listDirRegex.exec(text)) !== null) {
      const path = (match[1] || "").trim();
      actions.push({
        id: `act_list_${Date.now()}_${actionIdCounter++}`,
        type: "list_dir",
        path: path || ".",
        status: "pending"
      });
    }
    const findRegex = /<find_files\s+pattern=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/find_files>|\s*>)/gi;
    while ((match = findRegex.exec(text)) !== null) {
      const pattern = match[1].trim();
      actions.push({
        id: `act_find_${Date.now()}_${actionIdCounter++}`,
        type: "find_files",
        path: pattern,
        pattern,
        status: "pending"
      });
    }
    const grepRegex = /<grep\s+query=["']([^"']+)["'](?:\s+path=["']([^"']*)["'])?(?:\s+is_regex=["'](true|false)["'])?(?:\s*\/>|\s*>[\s\S]*?<\/grep>|\s*>)/gi;
    while ((match = grepRegex.exec(text)) !== null) {
      const query = match[1].trim();
      const path = (match[2] || "").trim();
      const isRegex = match[3] === "true";
      actions.push({
        id: `act_grep_${Date.now()}_${actionIdCounter++}`,
        type: "grep",
        path: path || ".",
        query,
        isRegex,
        status: "pending"
      });
    }
    const cmdRegex = /<(?:run_command|execute_command)>([\s\S]*?)<\/(?:run_command|execute_command)>/gi;
    while ((match = cmdRegex.exec(text)) !== null) {
      const command = match[1].trim();
      if (command) {
        actions.push({
          id: `act_cmd_${Date.now()}_${actionIdCounter++}`,
          type: "command",
          path: "terminal",
          command,
          status: "pending"
        });
      }
    }
    const webSearchRegex = /<web_search(?:\s+query=["']([^"']+)["'])?(?:\s*\/>|\s*>([\s\S]*?)<\/web_search>|\s*>)/gi;
    while ((match = webSearchRegex.exec(text)) !== null) {
      const query = (match[1] || match[2] || "").trim();
      if (query) {
        actions.push({
          id: `act_web_${Date.now()}_${actionIdCounter++}`,
          type: "web_search",
          path: "web",
          query,
          status: "pending"
        });
      }
    }
    if (actions.length === 0) {
      const fencePathRegex = /```(?:[a-zA-Z0-9_-]+:)?([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)\r?\n([\s\S]*?)```/g;
      while ((match = fencePathRegex.exec(text)) !== null) {
        const path = match[1].trim();
        const content = match[2];
        if (/\.[a-zA-Z0-9]{1,10}$/.test(path) && !path.startsWith("http")) {
          actions.push({
            id: `act_fallback_${Date.now()}_${actionIdCounter++}`,
            type: "write",
            path,
            content,
            status: "pending",
            newContent: content
          });
        }
      }
      if (actions.length === 0) {
        const headerFileRegex = /(?:###|##|\*\*|File:?|Dosya:?)\s*`?([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)`?\s*(?:\*\*)?\s*\r?\n```(?:[a-zA-Z0-9_-]+)?\r?\n([\s\S]*?)```/gi;
        while ((match = headerFileRegex.exec(text)) !== null) {
          const path = match[1].trim();
          const content = match[2];
          if (/\.[a-zA-Z0-9]{1,10}$/.test(path)) {
            actions.push({
              id: `act_fallback_${Date.now()}_${actionIdCounter++}`,
              type: "write",
              path,
              content,
              status: "pending",
              newContent: content
            });
          }
        }
      }
    }
    return actions;
  }
  static getAgentSystemPrompt(customPrompt, fileList = [], webAccessEnabled = false) {
    const fileListStr = fileList.length > 0 ? fileList.slice(0, 60).map((f) => `- ${f}`).join("\n") : "(No files listed)";
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
` : ""}
=== RULES FOR SUCCESSFUL AGENT EXECUTION ===
1. Use relative file paths from the workspace root (e.g. "src/components/Header.tsx", "package.json").
2. The <search> block MUST match the existing file code character-for-character.
3. When investigating bugs, use <read_file>, <grep>, or <run_command> to gather real facts before applying code modifications.
4. You may emit multiple actions in a single response (e.g. create a folder, write two files, and run tests).
5. Always keep conversational text concise and let the tool actions do the heavy lifting.

${customPrompt ? `=== USER PREFERENCES & CUSTOM INSTRUCTIONS ===
${customPrompt}` : ""}`;
  }
};

// src/services/GuardService.ts
var GuardService = class {
  // Dangerous shell command patterns
  static DANGEROUS_COMMAND_PATTERNS = [
    /\brm\s+(-[rfRF]{1,4}\s+|--recursive\s+|--force\s+)*(\/|~|\$HOME|\.\.|\*)/i,
    /\bsudo\b/i,
    /\bmkfs\b/i,
    /\bdd\s+if=/i,
    /:[(][{]\s*:[|]:[&]\s*[}];:/,
    // Fork bomb
    /\bchmod\s+(-R\s+)?(777|000)\s+(\/|~)/i,
    /\b(curl|wget)\s+[^|]+\|\s*(ba)?sh\b/i,
    />\s*\/dev\/(sd[a-z]|nvme|null|zero)/i
  ];
  // Sensitive file names or paths
  static SENSITIVE_FILE_PATTERNS = [
    /(^|\/)\.env(\.[a-z0-9_-]+)?$/i,
    /(^|\/)(id_rsa|id_ed25519|id_dsa)(\.pub)?$/i,
    /(^|\/)[a-z0-9_-]+\.(pem|key|pfx|p12)$/i,
    /(^|\/)\.npmrc$/i,
    /(^|\/)\.bashrc|\.zshrc|\.profile$/i,
    /^\/etc\/|^\/usr\/|^\/bin\/|^\/sbin\/|^\/var\/|^\/System\//i,
    /^\.\.\/|^\.\.\\/i
    // Path traversal outside workspace
  ];
  /**
   * Finds the best candidate prosecutor model (prefers 1.5b, 1b, 2b, 3b, or installed models).
   */
  static resolveProsecutorModel(settings, installedModels) {
    if (settings.prosecutorModelId && settings.prosecutorModelId !== "auto") {
      return settings.prosecutorModelId;
    }
    const candidates = installedModels.map((m) => m.name);
    const preferred = candidates.find(
      (name) => /1\.5b|1b|2b|3b|0\.5b|tiny/i.test(name)
    );
    if (preferred) {
      return preferred;
    }
    return candidates[0] || void 0;
  }
  /**
   * Performs rule-based check on a file action or command.
   */
  static evaluateRules(action) {
    const path = (action.path || "").trim();
    if (action.type === "command") {
      const cmd = (action.command || "").trim();
      if (!cmd) {
        return {
          isSafe: false,
          risk: "high",
          reason: "Bo\u015F terminal komutu.",
          blocked: true
        };
      }
      for (const pattern of this.DANGEROUS_COMMAND_PATTERNS) {
        if (pattern.test(cmd)) {
          return {
            isSafe: false,
            risk: "high",
            reason: `Y\u0131k\u0131c\u0131 veya zararl\u0131 olabilecek terminal komutu engellendi: "${cmd}"`,
            blocked: true
          };
        }
      }
      return {
        isSafe: true,
        risk: "low",
        reason: "Komut g\xFCvenlik filtresinden ba\u015Far\u0131yla ge\xE7ti.",
        blocked: false
      };
    }
    if (action.type === "delete") {
      if (!path || path === "." || path === "/" || path === "*" || path === "~" || path.startsWith("..")) {
        return {
          isSafe: false,
          risk: "high",
          reason: `Kritik veya ge\xE7ersiz dizin silme giri\u015Fimi engellendi: "${path}"`,
          blocked: true
        };
      }
    }
    if (action.type === "move" && action.targetPath) {
      for (const pattern of this.SENSITIVE_FILE_PATTERNS) {
        if (pattern.test(action.targetPath.trim())) {
          return {
            isSafe: false,
            risk: "high",
            reason: `Hassas hedef dosya yolu tespit edildi: "${action.targetPath}"`,
            blocked: true
          };
        }
      }
    }
    if (path && path !== "terminal") {
      for (const pattern of this.SENSITIVE_FILE_PATTERNS) {
        if (pattern.test(path)) {
          return {
            isSafe: false,
            risk: "high",
            reason: `Hassas veya sistem d\xFCzeyinde dosya yolu tespit edildi: "${path}"`,
            blocked: true
          };
        }
      }
    }
    const content = action.type === "write" ? action.content || "" : action.type === "edit" ? action.replace || "" : "";
    if (content) {
      for (const pattern of this.DANGEROUS_COMMAND_PATTERNS) {
        if (pattern.test(content)) {
          return {
            isSafe: false,
            risk: "high",
            reason: `Y\u0131k\u0131c\u0131 veya zararl\u0131 olabilecek komut/kod tespit edildi (rm -rf / sudo vb.)`,
            blocked: true
          };
        }
      }
    }
    return {
      isSafe: true,
      risk: "low",
      reason: "Kural tabanl\u0131 denetimden ba\u015Far\u0131yla ge\xE7ti.",
      blocked: false
    };
  }
  /**
   * Audits an action using the designated Prosecutor model (e.g. 1.5B) + deterministic rules.
   */
  static async auditAction(action, settings, installedModels) {
    const ruleResult = this.evaluateRules(action);
    if (ruleResult.blocked || ruleResult.risk === "high") {
      return ruleResult;
    }
    if (["read", "list_dir", "grep", "find_files"].includes(action.type)) {
      return ruleResult;
    }
    if (settings.enableProsecutor === false) {
      return ruleResult;
    }
    const prosecutorModel = this.resolveProsecutorModel(settings, installedModels);
    if (!prosecutorModel) {
      return ruleResult;
    }
    try {
      let actionSnippet = "";
      if (action.type === "command") {
        actionSnippet = `COMMAND TO EXECUTE: ${action.command}`;
      } else if (action.type === "delete") {
        actionSnippet = `DELETE PATH: ${action.path}`;
      } else if (action.type === "move") {
        actionSnippet = `MOVE FROM: ${action.path} TO: ${action.targetPath}`;
      } else if (action.type === "create_dir") {
        actionSnippet = `CREATE DIRECTORY: ${action.path}`;
      } else if (action.type === "write") {
        actionSnippet = `WRITE FILE: ${action.path}
CONTENT:
${(action.content || "").slice(0, 500)}`;
      } else if (action.type === "edit") {
        actionSnippet = `EDIT FILE: ${action.path}
SEARCH:
${(action.search || "").slice(0, 200)}
REPLACE:
${(action.replace || "").slice(0, 200)}`;
      }
      const prompt = `You are a strict Security Prosecutor (Savc\u0131) auditing an AI coding agent inside VS Code.
Analyze whether the following proposed action is safe or poses a security/data loss threat:

Action Type: ${action.type.toUpperCase()}
Action Details:
"""
${actionSnippet}
"""

Evaluate for:
1. Data destruction (wiping critical project files, rm -rf, emptying code without reason)
2. Malicious payload / backdoors / shell execution / unauthorized credential harvesting
3. Accessing sensitive files (.env, private keys, system files)

Respond ONLY in valid raw JSON format:
{
  "isSafe": true | false,
  "risk": "low" | "medium" | "high",
  "reason": "short explanation in Turkish or English"
}`;
      let responseText = "";
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4e3);
      await OllamaService.streamChat({
        baseUrl: settings.ollamaUrl,
        model: prosecutorModel,
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        numPredict: 150,
        signal: controller.signal,
        onChunk: (chunk) => {
          responseText += chunk;
        },
        onDone: () => {
        },
        onError: (err) => {
          console.warn("Prosecutor model audit error:", err.message);
        }
      });
      clearTimeout(timeoutId);
      const jsonMatch = /\{[\s\S]*\}/.exec(responseText);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const isSafe = Boolean(parsed.isSafe);
        const risk = ["low", "medium", "high"].includes(parsed.risk) ? parsed.risk : isSafe ? "low" : "high";
        const reason = parsed.reason || (isSafe ? "Savc\u0131 onaylad\u0131." : "\u015E\xFCpheli i\u015Flem tespit edildi.");
        return {
          isSafe,
          risk,
          reason,
          prosecutorName: prosecutorModel,
          blocked: !isSafe || risk === "high"
        };
      }
    } catch (err) {
      console.warn("Prosecutor audit fallback to rules:", err.message);
    }
    return {
      ...ruleResult,
      prosecutorName: prosecutorModel
    };
  }
};

// src/services/WebSearchService.ts
var WebSearchService = class {
  static USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
  /**
   * Executes a web search and gathers sources according to the configured depth and filters.
   */
  static async search(query, settings) {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return [];
    }
    const maxResults = Math.min(10, Math.max(1, settings.webSearchMaxResults ?? 5));
    const depth = settings.webSearchDepth || "standard";
    const engine = settings.webSearchEngine || "duckduckgo";
    let rawResults = [];
    if (engine === "searxng") {
      rawResults = await this._searchSearXNG(cleanQuery, maxResults * 2);
    }
    if (rawResults.length === 0) {
      rawResults = await this._searchDuckDuckGo(cleanQuery, maxResults * 2);
    }
    rawResults = this._applyDomainFilters(rawResults, settings.webSearchBlacklist, settings.webSearchWhitelist);
    const topResults = rawResults.slice(0, maxResults);
    if (depth === "fast") {
      return topResults;
    }
    const pagesToFetch = depth === "deep" ? Math.min(topResults.length, 5) : Math.min(topResults.length, 3);
    const fetchPromises = topResults.slice(0, pagesToFetch).map(async (item) => {
      try {
        const pageText = await this.fetchPageContent(item.url, depth === "deep" ? 3500 : 1800);
        if (pageText) {
          item.content = pageText;
          if (depth === "deep") {
            item.summary = this._extractKeySentences(pageText, cleanQuery, 400);
          }
        }
      } catch {
      }
      return item;
    });
    await Promise.all(fetchPromises);
    return topResults;
  }
  /**
   * DuckDuckGo HTML Search
   */
  static async _searchDuckDuckGo(query, limit) {
    const results = [];
    try {
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8e3);
      const res = await fetch(searchUrl, {
        method: "GET",
        headers: {
          "User-Agent": this.USER_AGENT,
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        return results;
      }
      const html = await res.text();
      const blocks = html.split(/class="[^"]*result__body[^"]*"/);
      for (let i = 1; i < blocks.length && results.length < limit; i++) {
        const block = blocks[i];
        const linkMatch = /<a [^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i.exec(block);
        if (!linkMatch) {
          continue;
        }
        let rawUrl = linkMatch[1];
        const title = this._stripHtml(linkMatch[2]);
        if (rawUrl.includes("uddg=")) {
          const uddgMatch = /uddg=([^&]+)/.exec(rawUrl);
          if (uddgMatch) {
            try {
              rawUrl = decodeURIComponent(uddgMatch[1]);
            } catch {
            }
          }
        }
        if (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
          continue;
        }
        const snippetMatch = /<a [^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i.exec(block);
        const snippet = snippetMatch ? this._stripHtml(snippetMatch[1]) : "";
        let domain = "";
        try {
          domain = new URL(rawUrl).hostname.replace(/^www\./, "");
        } catch {
        }
        results.push({
          title: title || domain || rawUrl,
          url: rawUrl,
          snippet,
          domain
        });
      }
    } catch (err) {
      console.warn("DuckDuckGo search failed:", err);
    }
    return results;
  }
  /**
   * SearXNG Search (local instance or public API)
   */
  static async _searchSearXNG(query, limit) {
    const results = [];
    const endpoints = [
      `http://127.0.0.1:8080/search?q=${encodeURIComponent(query)}&format=json`,
      `https://searx.be/search?q=${encodeURIComponent(query)}&format=json`
    ];
    for (const ep of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5e3);
        const res = await fetch(ep, {
          headers: {
            "User-Agent": this.USER_AGENT,
            "Accept": "application/json"
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!res.ok) {
          continue;
        }
        const data = await res.json();
        if (Array.isArray(data.results)) {
          for (const item of data.results) {
            if (results.length >= limit) {
              break;
            }
            if (item.url && (item.url.startsWith("http://") || item.url.startsWith("https://"))) {
              let domain = "";
              try {
                domain = new URL(item.url).hostname.replace(/^www\./, "");
              } catch {
              }
              results.push({
                title: item.title || domain || item.url,
                url: item.url,
                snippet: item.content || item.snippet || "",
                domain
              });
            }
          }
        }
        if (results.length > 0) {
          break;
        }
      } catch {
      }
    }
    return results;
  }
  /**
   * Fetches and cleans textual content of a webpage
   */
  static async fetchPageContent(url, maxChars = 2e3) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6e3);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": this.USER_AGENT,
          "Accept": "text/html,text/plain"
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        return "";
      }
      const html = await res.text();
      return this._cleanHtmlToText(html, maxChars);
    } catch {
      return "";
    }
  }
  /**
   * Cleans raw HTML to readable text, removing scripts, styles, navigations
   */
  static _cleanHtmlToText(html, maxChars) {
    let text = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<head[\s\S]*?<\/head>/gi, "").replace(/<nav[\s\S]*?<\/nav>/gi, "").replace(/<header[\s\S]*?<\/header>/gi, "").replace(/<footer[\s\S]*?<\/footer>/gi, "").replace(/<aside[\s\S]*?<\/aside>/gi, "").replace(/<svg[\s\S]*?<\/svg>/gi, "").replace(/<!--[\s\S]*?-->/g, "");
    text = text.replace(/<\/(p|div|h\d|li|tr)>/gi, "\n").replace(/<br\s*\/?>/gi, "\n");
    text = this._stripHtml(text);
    text = text.split("\n").map((line) => line.trim()).filter((line) => line.length > 20).join("\n\n");
    if (text.length > maxChars) {
      text = text.substring(0, maxChars) + "...";
    }
    return text;
  }
  /**
   * Strips HTML tags and entities
   */
  static _stripHtml(str) {
    return str.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
  }
  /**
   * Extracts sentences that contain search terms for deep analysis
   */
  static _extractKeySentences(text, query, maxLen) {
    const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
    const sentences = text.split(/[.!?\n]+/).map((s) => s.trim()).filter(Boolean);
    const scored = sentences.map((s) => {
      const lower = s.toLowerCase();
      let score = 0;
      terms.forEach((t) => {
        if (lower.includes(t)) {
          score += 1;
        }
      });
      return { s, score };
    });
    const relevant = scored.filter((item) => item.score > 0).sort((a, b) => b.score - a.score).map((item) => item.s);
    const result = relevant.join(". ");
    return result.length > maxLen ? result.substring(0, maxLen) + "..." : result;
  }
  /**
   * Domain filtering for Blacklist & Whitelist
   */
  static _applyDomainFilters(results, blacklistStr, whitelistStr) {
    const blacklist = (blacklistStr || "").split(/[,;\n]/).map((d) => d.trim().toLowerCase()).filter(Boolean);
    const whitelist = (whitelistStr || "").split(/[,;\n]/).map((d) => d.trim().toLowerCase()).filter(Boolean);
    return results.filter((item) => {
      if (!item.domain) {
        return true;
      }
      const dom = item.domain.toLowerCase();
      if (blacklist.some((b) => dom === b || dom.endsWith("." + b))) {
        return false;
      }
      if (whitelist.length > 0 && !whitelist.some((w) => dom === w || dom.endsWith("." + w))) {
        return false;
      }
      return true;
    });
  }
  /**
   * Formats gathered web sources into a clean markdown prompt block for the LLM
   */
  static formatSourcesForPrompt(sources, depth = "standard") {
    if (!sources || sources.length === 0) {
      return "";
    }
    const now = /* @__PURE__ */ new Date();
    const dateOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    const dateStr = now.toLocaleDateString("tr-TR", dateOptions);
    const currentYear = now.getFullYear();
    const lines = [
      "=== \u{1F310} G\xDCNCEL \u0130NTERNET VE CANLI ARA\u015ETIRMA VER\u0130LER\u0130 ===",
      `[ZAMAN VE TAR\u0130H B\u0130LG\u0130S\u0130: Bug\xFCn\xFCn ger\xE7ek d\xFCnya tarihi: ${dateStr}. Mevcut y\u0131l: ${currentYear}.]`,
      `[TEMPORAL CONTEXT: Today is ${dateStr}, and the current year is ${currentYear}.]`,
      "A\u015Fa\u011F\u0131daki bilgiler kullan\u0131c\u0131n\u0131n sorusu do\u011Frultusunda canl\u0131 internet aramas\u0131ndan derlenmi\u015Ftir.",
      `\xD6NEML\u0130 TAL\u0130MAT: Modelinin e\u011Fitim kesilme tarihi (training cutoff) ge\xE7mi\u015Fte kalm\u0131\u015F olabilir. Yan\u0131t\u0131n\u0131 verirken ge\xE7mi\u015F e\u011Fitim veri s\u0131n\u0131r\u0131n yerine yukar\u0131daki bug\xFCn\xFCn y\u0131l\u0131n\u0131 (${currentYear}) ve a\u015Fa\u011F\u0131daki canl\u0131 web arama sonu\xE7lar\u0131n\u0131 kesin olarak esas alacaks\u0131n. Kaynak numaralar\u0131yla ([1], [2] vb.) bilgiye at\u0131f yapabilirsin.`,
      ""
    ];
    sources.forEach((src, idx) => {
      lines.push(`### [${idx + 1}] ${src.title}`);
      lines.push(`- **URL**: ${src.url}`);
      if (src.domain) {
        lines.push(`- **Kaynak Site**: ${src.domain}`);
      }
      if (src.snippet) {
        lines.push(`- **Arama \xD6zeti (Snippet)**: ${src.snippet}`);
      }
      if (src.summary && depth === "deep") {
        lines.push(`- **\xD6ne \xC7\u0131kan Bulgular**: ${src.summary}`);
      }
      if (src.content && depth !== "fast") {
        const maxLen = depth === "deep" ? 1600 : 1e3;
        lines.push(`- **Sayfa \u0130\xE7eri\u011Fi/Al\u0131nt\u0131**: ${src.content.substring(0, maxLen)}...`);
      }
      lines.push("");
    });
    lines.push("=== G\xDCNCEL WEB VER\u0130LER\u0130N\u0130N SONU ===");
    return lines.join("\n");
  }
  /**
   * Formats gathered web sources into a readable standalone Markdown document for the user
   */
  static generateSourcesMarkdown(sessionOrQuery, msgOrSources, settings) {
    let query = "";
    let sources = [];
    let sessionTitle = "";
    if (typeof sessionOrQuery === "object" && "title" in sessionOrQuery) {
      const session = sessionOrQuery;
      sessionTitle = session.title;
      const msg = msgOrSources;
      sources = msg.webSources || [];
      const msgIdx = session.messages.findIndex((m) => m.id === msg.id);
      if (msgIdx > 0) {
        query = session.messages[msgIdx - 1]?.content || session.title;
      } else {
        query = session.title;
      }
    } else {
      query = sessionOrQuery;
      sources = msgOrSources;
    }
    const depth = settings?.webSearchDepth || "standard";
    const engine = settings?.webSearchEngine || "duckduckgo";
    const dateStr = (/* @__PURE__ */ new Date()).toLocaleString();
    const lines = [
      `# \u{1F310} Web Ara\u015Ft\u0131rma Kaynaklar\u0131 Raporu`,
      ``,
      `| Parametre | De\u011Fer |`,
      `| :--- | :--- |`,
      ...sessionTitle ? [`| **Oturum** | \`${sessionTitle}\` |`] : [],
      `| **Arama Sorgusu / Ba\u011Flam** | \`${query.length > 80 ? query.slice(0, 80) + "..." : query}\` |`,
      `| **Arama Motoru** | ${engine === "duckduckgo" ? "DuckDuckGo" : engine} |`,
      `| **Analiz Derinli\u011Fi** | ${depth === "deep" ? "\u{1F50D} Derin Analiz" : depth === "fast" ? "\u26A1 H\u0131zl\u0131 (Snippet)" : "\u{1F4C4} Standart (Sayfa \xD6zeti)"} |`,
      `| **Bulunan Kaynak Say\u0131s\u0131** | ${sources.length} adet |`,
      `| **Tarih** | ${dateStr} |`,
      ``,
      `---`,
      ``,
      `## \u{1F4D1} Ba\u015Fvurulan Kaynaklar ve \u0130nceleme Detaylar\u0131`,
      ``
    ];
    if (sources.length === 0) {
      lines.push(`*Bu arama i\xE7in herhangi bir web kayna\u011F\u0131 bulunamad\u0131 veya sonu\xE7lar filtreye tak\u0131ld\u0131.*`);
      return lines.join("\n");
    }
    sources.forEach((src, idx) => {
      lines.push(`### ${idx + 1}. [${src.title}](${src.url})`);
      lines.push(`- **Kaynak Web Sitesi**: \`${src.domain || src.url}\``);
      lines.push(`- **Do\u011Frudan Ba\u011Flant\u0131**: [${src.url}](${src.url})`);
      lines.push(``);
      if (src.snippet) {
        lines.push(`> **Arama Snippet'\u0131:**  `);
        lines.push(`> ${src.snippet}`);
        lines.push(``);
      }
      if (src.summary) {
        lines.push(`**\u{1F50D} Derin Analiz \xD6zeti:**  `);
        lines.push(`${src.summary}`);
        lines.push(``);
      }
      if (src.content) {
        lines.push(`<details>`);
        lines.push(`<summary><b>\u{1F4C4} Taranan Sayfa Metni (Geni\u015Flet)</b></summary>`);
        lines.push(``);
        lines.push(`\`\`\`text`);
        lines.push(src.content);
        lines.push(`\`\`\``);
        lines.push(`</details>`);
        lines.push(``);
      }
      lines.push(`---`);
      lines.push(``);
    });
    lines.push(`*Bu rapor OllamaChat \u0130nternet & Web Ara\u015Ft\u0131rma motoru taraf\u0131ndan otomatik olu\u015Fturulmu\u015Ftur.*`);
    return lines.join("\n");
  }
};

// src/locales/en.ts
var en = {
  common: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    copy: "Copy",
    copied: "Copied!",
    close: "Close",
    add: "+ Add",
    search: "Search",
    loading: "Loading...",
    error: "Error",
    default: "Default",
    unlimited: "Unlimited"
  },
  header: {
    listSessions: "List Sessions",
    newSession: "New Chat",
    untitledSession: "New Chat"
  },
  chat: {
    inputPlaceholder: "Ask a question or request code... (Enter to send, Shift+Enter for new line)",
    send: "Send (Enter)",
    stop: "Stop (Esc)",
    thinking: "Thinking...",
    tokenPerSec: "t/s",
    duration: "Duration",
    speed: "Speed",
    tokens: "tokens",
    emptyTitle: "Welcome to OllamaChat",
    emptySubtitle: "Your local and private AI coding assistant. Select a model below and ask a question to begin.",
    retry: "Retry",
    sourcesBtn: "Sources",
    sourcesTitle: "Inspect web sources and references",
    webAccessBtn: "Web",
    webSearching: "Searching the web..."
  },
  dropdowns: {
    searchSessions: "Search sessions...",
    noSessions: "No sessions found",
    searchModels: "Search models...",
    noModels: "No models found (You can add from Settings > Models)",
    selectModel: "Select Model",
    customTag: "Custom"
  },
  kvCache: {
    title: "Context & KV-Cache",
    model: "Model:",
    context: "Context (num_ctx):",
    temperature: "Temperature:",
    lastSpeed: "Last Speed:",
    badge: "\u26A1 KVCache"
  },
  settings: {
    title: "Settings",
    tabSessions: "Sessions",
    tabModels: "Models",
    tabSettings: "Extension Settings",
    saveSettings: "Save Settings",
    savedToast: "Settings saved.",
    languageLabel: "Language",
    languageHint: "Select interface language or match VS Code automatically.",
    langAuto: "Automatic (VS Code Language)",
    langEn: "English",
    langTr: "T\xFCrk\xE7e",
    ollamaUrlLabel: "Ollama API URL",
    ollamaUrlHint: "Local Ollama server connection endpoint.",
    systemPromptLabel: "Global System Prompt",
    systemPromptToggle: "Enable global system prompt",
    systemPromptPlaceholder: "Default assistant system prompt...",
    systemPromptHint: "Sets base behavior instructions for models without custom prompt.",
    maxTokensLabel: "Max Tokens Limit (num_predict)",
    maxTokensToggle: "Enable max token limit",
    maxTokensHint: "When off, tokens are unlimited. When on, minimum is 4096 tokens.",
    autoApplyLabel: "Auto-apply Agent File Edits",
    autoApplyHint: "When enabled, Agent mode writes file changes immediately without confirmation.",
    autoPermissionsTitle: "Autonomous Agent Permissions",
    autoPermissionsHint: "Control what actions the Agent can execute automatically:",
    allowFileEdits: "Always allow file edits (Search & Replace)",
    allowFileCreate: "Always allow new file creation",
    allowFolderCreate: "Always allow directory creation",
    prosecutorTitle: "Security Prosecutor (Guard Model)",
    prosecutorHint: "Uses a lightweight model (e.g. 1.5B) to audit agent commands and file edits for dangerous operations (e.g. rm -rf, file wipes).",
    prosecutorToggle: "Enable Security Prosecutor Audit",
    prosecutorModelLabel: "Prosecutor Model",
    prosecutorAuto: "Auto-detect small model (1.5B)",
    webSearchTitle: "Web Search & Internet Access",
    webEngineLabel: "Search Engine",
    webDepthLabel: "Search & Analysis Depth",
    webDepthFast: "Fast (Snippets only)",
    webDepthStandard: "Standard (Page summaries)",
    webDepthDeep: "Deep Analysis (Full page inspection & synthesis)",
    webMaxResultsLabel: "Max Web Sources",
    webBlacklistLabel: "Domain Blacklist (Blocked sites)",
    webBlacklistHint: "Comma-separated domains to ignore (e.g. pinterest.com, spam.com)",
    webWhitelistLabel: "Domain Whitelist (Allowed sites)",
    webWhitelistHint: "Comma-separated domains to restrict/prioritize"
  },
  mode: {
    chat: "Chat",
    agent: "Agent",
    chatDesc: "Conversation & coding assistant (Read-only, no workspace edits)",
    agentDesc: "Autonomous coding agent (Can read and edit project files)",
    apply: "Apply Changes",
    reject: "Reject",
    viewDiff: "View Diff",
    applied: "Changes applied successfully.",
    rejected: "Changes rejected.",
    readingFile: "Reading file...",
    editingFile: "Editing file...",
    creatingFile: "Creating file...",
    fileNotFound: "File not found in workspace.",
    prosecutorSafe: "Audited & Safe",
    prosecutorWarning: "Suspicious / Potential Risk",
    prosecutorBlocked: "Blocked by Security Prosecutor",
    prosecutorAuditing: "Prosecutor auditing action...",
    revert: "Revert",
    accept: "Keep",
    reverted: "Changes reverted.",
    accepted: "Changes kept permanently.",
    autoAppliedBadge: "Applied (Reversible)",
    actionDetailsTitle: "Action & Code Details",
    revertToast: "Change reverted.",
    acceptToast: "Change kept permanently.",
    reapply: "Re-apply",
    dragDropHint: "Drop files here to add as context",
    searchFilesPlaceholder: "Search files with @ or #...",
    contextFilesCount: (count) => `${count} context files`,
    blackboxBtn: "Black Box",
    blackboxTitle: "Inspect all tokens, commands and response details in markdown",
    runCommand: "Run",
    toolOutputTitle: "Tool Output",
    executedBadge: "Executed",
    failedBadge: "Failed"
  },
  sessions: {
    hint: "You can export or delete your saved conversation sessions.",
    export: "Export",
    exportMarkdown: "Markdown (.md)",
    exportJson: "JSON (.json)",
    deleteConfirm: "Are you sure you want to delete this session?",
    deletedToast: "Session deleted.",
    messagesCount: (count) => `${count} msg`
  },
  models: {
    title: "All Models (Ollama & Custom)",
    addDropdown: "+ Add \u25BE",
    importFromOllama: "Import from Ollama",
    createCustom: "Create custom model profile",
    deletedToast: "Model deleted.",
    editorTitleEdit: "Edit Model Profile",
    editorTitleNew: "New Model Profile",
    nameLabel: "Display Name",
    namePlaceholder: "e.g. Qwen Code Assistant",
    baseModelLabel: "Base Ollama Model",
    customPromptLabel: "Custom System Prompt",
    customPromptPlaceholder: "Role and instructions specific to this model...",
    numCtxLabel: "KV-Cache / Context (num_ctx)",
    temperatureLabel: "Temperature",
    nameRequired: "Please enter a model name.",
    savedToast: "Model saved.",
    importModalTitle: "Import Model from Ollama",
    importModalHint: "Locally installed Ollama models are listed below. Click import or customize:",
    importBtn: "Import",
    importedToast: "Model imported.",
    noOllamaModels: "No new Ollama models found to import."
  },
  export: {
    createdDate: "Created Date:",
    model: "Model:",
    quantization: "Quantization:",
    user: "\u{1F464} User",
    assistant: "\u{1F916} Assistant"
  }
};

// src/locales/tr.ts
var tr = {
  common: {
    save: "Kaydet",
    cancel: "\u0130ptal",
    delete: "Sil",
    edit: "D\xFCzenle",
    copy: "Kopyala",
    copied: "Kopyaland\u0131!",
    close: "Kapat",
    add: "+ Ekle",
    search: "Ara",
    loading: "Y\xFCkleniyor...",
    error: "Hata",
    default: "Varsay\u0131lan",
    unlimited: "S\u0131n\u0131rs\u0131z"
  },
  header: {
    listSessions: "Oturumlar\u0131 Listele",
    newSession: "Yeni Sohbet",
    untitledSession: "Yeni Sohbet"
  },
  chat: {
    inputPlaceholder: "Bir soru sorun veya kod isteyin... (Enter ile g\xF6nder, Shift+Enter alt sat\u0131r)",
    send: "G\xF6nder (Enter)",
    stop: "Durdur (Esc)",
    thinking: "D\xFC\u015F\xFCn\xFCyor...",
    tokenPerSec: "token/sn",
    duration: "S\xFCre",
    speed: "H\u0131z",
    tokens: "tokens",
    emptyTitle: "OllamaChat'e Ho\u015F Geldiniz",
    emptySubtitle: "Yerel ve gizli yapay zeka kodlama asistan\u0131n\u0131z. Ba\u015Flamak i\xE7in a\u015Fa\u011F\u0131dan bir model se\xE7ip sorunuzu yaz\u0131n.",
    retry: "Yeniden Dene",
    sourcesBtn: "Kaynaklar",
    sourcesTitle: "Web arama kaynaklar\u0131n\u0131 ve referanslar\u0131 incele",
    webAccessBtn: "Web",
    webSearching: "\u0130nternette ara\u015Ft\u0131r\u0131l\u0131yor..."
  },
  dropdowns: {
    searchSessions: "Oturumlarda ara...",
    noSessions: "Oturum bulunamad\u0131",
    searchModels: "Model ara...",
    noModels: "Model bulunamad\u0131 (Ayarlar > Modeller sekmesinden ekleyebilirsiniz)",
    selectModel: "Model Se\xE7",
    customTag: "\xD6zel"
  },
  kvCache: {
    title: "Ba\u011Flam & KV-Cache",
    model: "Model:",
    context: "Context (num_ctx):",
    temperature: "S\u0131cakl\u0131k:",
    lastSpeed: "Son Yan\u0131t H\u0131z\u0131:",
    badge: "\u26A1 KVCache"
  },
  settings: {
    title: "Ayarlar",
    tabSessions: "Oturumlar",
    tabModels: "Modeller",
    tabSettings: "Eklenti Ayarlar\u0131",
    saveSettings: "Ayarlar\u0131 Kaydet",
    savedToast: "Ayarlar kaydedildi.",
    languageLabel: "Dil Se\xE7imi",
    languageHint: "Aray\xFCz dilini belirleyin veya VS Code diline otomatik e\u015Fitleyin.",
    langAuto: "Otomatik (VS Code Dili)",
    langEn: "English",
    langTr: "T\xFCrk\xE7e",
    ollamaUrlLabel: "Ollama API URL",
    ollamaUrlHint: "Ollama yerel sunucu ba\u011Flant\u0131 noktas\u0131.",
    systemPromptLabel: "Genel Sistem Promptu",
    systemPromptToggle: "Genel sistem promptunu etkinle\u015Ftir",
    systemPromptPlaceholder: "Varsay\u0131lan asistan sistem promptu...",
    systemPromptHint: "\xD6zel promptu bulunmayan t\xFCm modeller i\xE7in ge\xE7erli temel rol talimatlar\u0131.",
    maxTokensLabel: "Maksimum Token S\u0131n\u0131r\u0131 (num_predict)",
    maxTokensToggle: "Maksimum token s\u0131n\u0131r\u0131n\u0131 etkinle\u015Ftir",
    maxTokensHint: "Kapal\u0131yken \xFCretim s\u0131n\u0131rs\u0131zd\u0131r. A\xE7\u0131kken s\u0131n\u0131r minimum 4096 tokendir.",
    autoApplyLabel: "Agent Dosya G\xFCncellemelerini Otomatik Uygula",
    autoApplyHint: "Etkinle\u015Ftirildi\u011Finde, Agent modunda dosya de\u011Fi\u015Fiklikleri onay beklemeden do\u011Frudan kaydedilir.",
    autoPermissionsTitle: "Agent Otomatik \u0130zinleri",
    autoPermissionsHint: "Agent modunun onay istemeden do\u011Frudan yapabilece\u011Fi i\u015Flemleri belirleyin:",
    allowFileEdits: "Dosya d\xFCzenlemelerine her zaman izin ver (Search & Replace)",
    allowFileCreate: "Yeni dosya olu\u015Fturmaya her zaman izin ver",
    allowFolderCreate: "Klas\xF6r olu\u015Fturmaya her zaman izin ver",
    prosecutorTitle: "Savc\u0131 Modeli (G\xFCvenlik Denet\xE7isi)",
    prosecutorHint: "K\xFC\xE7\xFCk ve h\u0131zl\u0131 bir modeli (\xF6rn: 1.5B) savc\u0131 olarak konumland\u0131r\u0131p, komut ve dosya de\u011Fi\u015Fikliklerini zararl\u0131 m\u0131 (rm -rf, veri kayb\u0131 vb.) diye denetletir.",
    prosecutorToggle: "Savc\u0131 G\xFCvenlik Denetimini Etkinle\u015Ftir",
    prosecutorModelLabel: "Savc\u0131 Modeli",
    prosecutorAuto: "Otomatik K\xFC\xE7\xFCk Model Se\xE7 (1.5B)",
    webSearchTitle: "\u0130nternet & Web Arama Ayarlar\u0131",
    webEngineLabel: "Arama Motoru",
    webDepthLabel: "Arama ve Analiz Derinli\u011Fi",
    webDepthFast: "H\u0131zl\u0131 (Yaln\u0131zca arama snippet'lar\u0131)",
    webDepthStandard: "Standart (Sayfa \xF6zetleri ve ilk sayfalar)",
    webDepthDeep: "Derin Analiz (Sayfa metinleri ve sentezleme)",
    webMaxResultsLabel: "Maksimum Kaynak Say\u0131s\u0131",
    webBlacklistLabel: "Alan Ad\u0131 Kara Listesi (Yasakl\u0131 Siteler)",
    webBlacklistHint: "Virg\xFClle ayr\u0131lm\u0131\u015F engellenecek siteler (\xF6rn: pinterest.com, spam.com)",
    webWhitelistLabel: "Alan Ad\u0131 Beyaz Listesi (\xD6ncelikli Siteler)",
    webWhitelistHint: "Virg\xFClle ayr\u0131lm\u0131\u015F odaklan\u0131lacak veya k\u0131s\u0131tlanacak siteler"
  },
  mode: {
    chat: "Chat",
    agent: "Agent",
    chatDesc: "Sohbet ve kod dan\u0131\u015Fman\u0131 (Salt okunur, dosyalara dokunmaz)",
    agentDesc: "Otonom kod yaz\u0131c\u0131 (Proje dosyalar\u0131n\u0131 okuyabilir ve g\xFCncelleyebilir)",
    apply: "De\u011Fi\u015Fiklikleri Uygula",
    reject: "Reddet",
    viewDiff: "Fark\u0131 G\xF6r (Diff)",
    applied: "De\u011Fi\u015Fiklikler ba\u015Far\u0131yla uyguland\u0131.",
    rejected: "De\u011Fi\u015Fiklik reddedildi.",
    readingFile: "Dosya okunuyor...",
    editingFile: "Dosya g\xFCncelleniyor...",
    creatingFile: "Yeni dosya olu\u015Fturuluyor...",
    fileNotFound: "Dosya proje \xE7al\u0131\u015Fma alan\u0131nda bulunamad\u0131.",
    prosecutorSafe: "Savc\u0131 Onaylad\u0131 (G\xFCvenli)",
    prosecutorWarning: "\u015E\xFCpheli / Dikkat Gerektiren Eylem",
    prosecutorBlocked: "Savc\u0131 Taraf\u0131ndan Engellendi!",
    prosecutorAuditing: "Savc\u0131 eylemi denetliyor...",
    revert: "Geri D\xF6nd\xFCr",
    accept: "Kal\u0131c\u0131 Yap",
    reverted: "De\u011Fi\u015Fiklik geri al\u0131nd\u0131.",
    accepted: "De\u011Fi\u015Fiklik kal\u0131c\u0131 yap\u0131ld\u0131.",
    autoAppliedBadge: "Uyguland\u0131 (Geri D\xF6nd\xFCr\xFClebilir)",
    actionDetailsTitle: "Eylem ve Kod Detaylar\u0131",
    revertToast: "De\u011Fi\u015Fiklik geri al\u0131nd\u0131.",
    acceptToast: "De\u011Fi\u015Fiklik kal\u0131c\u0131 olarak onayland\u0131.",
    reapply: "Yeniden Uygula",
    dragDropHint: "Dosyalar\u0131 ba\u011Flam olarak eklemek i\xE7in buraya b\u0131rak\u0131n",
    searchFilesPlaceholder: "@ veya # ile dosya aray\u0131n...",
    contextFilesCount: (count) => `${count} hedef dosya ba\u011Flamda`,
    blackboxBtn: "Kara Kutu",
    blackboxTitle: "Yan\u0131t\u0131n t\xFCm tokenlar\u0131n\u0131, komutlar\u0131n\u0131 ve ayr\u0131nt\u0131lar\u0131n\u0131 markdown olarak incele",
    runCommand: "\xC7al\u0131\u015Ft\u0131r",
    toolOutputTitle: "Ara\xE7 \xC7\u0131kt\u0131s\u0131",
    executedBadge: "Y\xFCr\xFCt\xFCld\xFC",
    failedBadge: "Ba\u015Far\u0131s\u0131z"
  },
  sessions: {
    hint: "Kay\u0131tl\u0131 oturumlar\u0131 d\u0131\u015Fa aktarabilir veya silebilirsiniz.",
    export: "D\u0131\u015Fa Aktar",
    exportMarkdown: "Markdown (.md)",
    exportJson: "JSON (.json)",
    deleteConfirm: "Bu oturumu silmek istedi\u011Finize emin misiniz?",
    deletedToast: "Oturum silindi.",
    messagesCount: (count) => `${count} mesaj`
  },
  models: {
    title: "T\xFCm Modeller (Ollama & \xD6zel)",
    addDropdown: "+ Ekle \u25BE",
    importFromOllama: "Ollama'dan aktar",
    createCustom: "Kopya model olu\u015Ftur",
    deletedToast: "Model silindi.",
    editorTitleEdit: "Model Profili D\xFCzenle",
    editorTitleNew: "Yeni Model Profili",
    nameLabel: "G\xF6r\xFCnen Ad",
    namePlaceholder: "\xD6rn: Qwen Kod Asistan\u0131",
    baseModelLabel: "Taban Ollama Modeli",
    customPromptLabel: "\xD6zel Sistem Promptu",
    customPromptPlaceholder: "Bu modele \xF6zg\xFC rol ve talimatlar...",
    numCtxLabel: "KV-Cache / Context (num_ctx)",
    temperatureLabel: "S\u0131cakl\u0131k (Temperature)",
    nameRequired: "L\xFCtfen model ad\u0131n\u0131 girin.",
    savedToast: "Model kaydedildi.",
    importModalTitle: "Ollama'dan Model Aktar",
    importModalHint: "Cihaz\u0131n\u0131zda kurulu Ollama modelleri listeleniyor. Direkt aktarabilir veya parametrelerini d\xFCzenleyebilirsiniz:",
    importBtn: "Aktar",
    importedToast: "Model aktar\u0131ld\u0131.",
    noOllamaModels: "Aktar\u0131lacak yeni Ollama modeli bulunamad\u0131."
  },
  export: {
    createdDate: "Olu\u015Fturulma Tarihi:",
    model: "Model:",
    quantization: "Kuantizasyon:",
    user: "\u{1F464} Kullan\u0131c\u0131",
    assistant: "\u{1F916} Asistan"
  }
};

// src/locales/index.ts
var locales = {
  en,
  tr
};
var defaultLanguage = "en";
function resolveLanguage(settingLang, vscodeLang) {
  if (settingLang && settingLang !== "auto") {
    if (settingLang in locales) {
      return settingLang;
    }
  }
  if (vscodeLang) {
    const primary = vscodeLang.split("-")[0].toLowerCase();
    if (primary in locales) {
      return primary;
    }
  }
  return defaultLanguage;
}
function getTranslation(lang) {
  if (lang && lang in locales) {
    return locales[lang];
  }
  return locales[defaultLanguage];
}

// src/providers/ChatViewProvider.ts
var ChatViewProvider = class {
  constructor(_extensionUri, _storageService) {
    this._extensionUri = _extensionUri;
    this._storageService = _storageService;
  }
  _extensionUri;
  _storageService;
  static viewType = "ollamachat.chatView";
  _view;
  _abortControllers = /* @__PURE__ */ new Map();
  resolveWebviewView(webviewView, _context, _token) {
    this._view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    webviewView.webview.onDidReceiveMessage(async (data) => {
      await this._handleMessage(data);
    });
  }
  async _handleMessage(data) {
    switch (data.type) {
      case "ready": {
        await this._sendInitialData();
        break;
      }
      case "getWorkspaceFiles": {
        const files = await AgentService.listFiles(300);
        this._postMessage({
          type: "workspaceFiles",
          files
        });
        break;
      }
      case "sendMessage": {
        await this._handleSendMessage(data.sessionId, data.prompt, data.modelId, data.mode, data.webAccessEnabled);
        break;
      }
      case "stopGeneration": {
        const controller = this._abortControllers.get(data.sessionId);
        if (controller) {
          controller.abort();
          this._abortControllers.delete(data.sessionId);
        }
        break;
      }
      case "switchMode": {
        const session = this._storageService.getSession(data.sessionId);
        if (session) {
          session.mode = data.mode;
          await this._storageService.saveSession(session);
        }
        await this._storageService.setLastSelectedMode(data.mode);
        this._postMessage({
          type: "modeUpdated",
          sessionId: data.sessionId,
          mode: data.mode
        });
        break;
      }
      case "toggleWebAccess": {
        const isEnabled = !!data.enabled;
        await this._storageService.setLastSelectedWebAccess(isEnabled);
        const session = this._storageService.getSession(data.sessionId);
        if (session) {
          session.webAccessEnabled = isEnabled;
          await this._storageService.saveSession(session);
        }
        this._postMessage({
          type: "webAccessUpdated",
          sessionId: data.sessionId,
          enabled: isEnabled
        });
        break;
      }
      case "applyAgentAction": {
        try {
          const { sessionId, messageId, actionId } = data;
          const session = this._storageService.getSession(sessionId);
          const msg = session?.messages.find((m) => m.id === messageId);
          const action = msg?.actions?.find((a) => a.id === actionId);
          if (action && session && msg) {
            const settings = this._storageService.getSettings();
            const installed = await this._getInstalledOllamaModels();
            const audit = action.securityAudit || await GuardService.auditAction(action, settings, installed);
            action.securityAudit = audit;
            if (audit.blocked) {
              this._postMessage({
                type: "toast",
                message: `Savc\u0131 Engelledi: ${audit.reason}`
              });
              this._postMessage({
                type: "agentActionUpdated",
                sessionId,
                messageId,
                actionId,
                status: "rejected",
                securityAudit: audit
              });
              break;
            }
            if (action.type === "write" && action.content !== void 0) {
              const res = await AgentService.writeFile(action.path, action.content);
              action.originalContent = res.originalContent;
              action.wasCreated = res.wasCreated;
              action.status = "applied";
            } else if (action.type === "edit" && action.search && action.replace) {
              const res = await AgentService.applySearchReplace(action.path, action.search, action.replace);
              action.originalContent = res.originalContent;
              action.wasCreated = false;
              action.status = "applied";
            } else if (action.type === "create_dir") {
              await AgentService.createDirectory(action.path);
              action.status = "applied";
            } else if (action.type === "delete") {
              await AgentService.deletePath(action.path);
              action.status = "applied";
            } else if (action.type === "move" && action.targetPath) {
              await AgentService.movePath(action.path, action.targetPath);
              action.status = "applied";
            } else if (action.type === "read") {
              action.output = await AgentService.readFile(action.path);
              action.status = "executed";
            } else if (action.type === "list_dir") {
              const items = await AgentService.listDirectory(action.path === "." ? "" : action.path);
              action.output = items.map((i) => `${i.isDirectory ? "\u{1F4C1}" : "\u{1F4C4}"} ${i.name}`).join("\n") || "(Bo\u015F dizin)";
              action.status = "executed";
            } else if (action.type === "find_files" && action.pattern) {
              const files = await AgentService.findFiles(action.pattern);
              action.output = files.map((f) => `\u{1F4C4} ${f}`).join("\n") || "(Dosya bulunamad\u0131)";
              action.status = "executed";
            } else if (action.type === "grep" && action.query) {
              const matches = await AgentService.grepSearch(action.query, action.path === "." ? "" : action.path, action.isRegex);
              action.output = matches.map((m) => `${m.file}:${m.line}: ${m.content}`).join("\n") || "(E\u015Fle\u015Fme bulunamad\u0131)";
              action.status = "executed";
            } else if (action.type === "command" && action.command) {
              const res = await AgentService.executeCommand(action.command);
              action.output = res.stdout + (res.stderr ? `
[STDERR]
${res.stderr}` : "");
              action.status = res.exitCode === 0 ? "executed" : "failed";
            }
            await this._storageService.saveSession(session);
            this._postMessage({
              type: "agentActionUpdated",
              sessionId,
              messageId,
              actionId,
              status: action.status,
              securityAudit: audit,
              originalContent: action.originalContent,
              wasCreated: action.wasCreated,
              output: action.output
            });
            const msgTitle = action.type === "command" ? action.command : action.path;
            this._postMessage({ type: "toast", message: `${msgTitle}: \u0130\u015Flem tamamland\u0131 (${action.status}).` });
          }
        } catch (err) {
          this._postMessage({ type: "toast", message: `Hata: ${err.message}` });
        }
        break;
      }
      case "revertAgentAction": {
        try {
          const { sessionId, messageId, actionId } = data;
          const session = this._storageService.getSession(sessionId);
          const msg = session?.messages.find((m) => m.id === messageId);
          const action = msg?.actions?.find((a) => a.id === actionId);
          if (action && session && msg) {
            await AgentService.revertAction(action);
            action.status = "reverted";
            await this._storageService.saveSession(session);
            this._postMessage({
              type: "agentActionUpdated",
              sessionId,
              messageId,
              actionId,
              status: "reverted",
              securityAudit: action.securityAudit
            });
            this._postMessage({ type: "toast", message: `${action.path}: De\u011Fi\u015Fiklik geri al\u0131nd\u0131.` });
          }
        } catch (err) {
          this._postMessage({ type: "toast", message: `Geri alma hatas\u0131: ${err.message}` });
        }
        break;
      }
      case "acceptAgentAction": {
        const { sessionId, messageId, actionId } = data;
        const session = this._storageService.getSession(sessionId);
        const msg = session?.messages.find((m) => m.id === messageId);
        const action = msg?.actions?.find((a) => a.id === actionId);
        if (action && session && msg) {
          action.status = "accepted";
          await this._storageService.saveSession(session);
          this._postMessage({
            type: "agentActionUpdated",
            sessionId,
            messageId,
            actionId,
            status: "accepted",
            securityAudit: action.securityAudit
          });
          this._postMessage({ type: "toast", message: `${action.path}: De\u011Fi\u015Fiklik kal\u0131c\u0131 yap\u0131ld\u0131.` });
        }
        break;
      }
      case "rejectAgentAction": {
        const { sessionId, messageId, actionId } = data;
        const session = this._storageService.getSession(sessionId);
        const msg = session?.messages.find((m) => m.id === messageId);
        const action = msg?.actions?.find((a) => a.id === actionId);
        if (action && session && msg) {
          action.status = "rejected";
          await this._storageService.saveSession(session);
          this._postMessage({
            type: "agentActionUpdated",
            sessionId,
            messageId,
            actionId,
            status: "rejected"
          });
        }
        break;
      }
      case "viewAgentDiff": {
        try {
          const { path, newContent, search, replace } = data;
          let previewContent = newContent;
          if (previewContent === void 0 && search && replace) {
            try {
              const orig = await AgentService.readFile(path);
              previewContent = orig.replace(search.trim(), replace);
            } catch {
              previewContent = replace;
            }
          }
          if (previewContent !== void 0) {
            await AgentService.showDiff(path, previewContent);
          }
        } catch (err) {
          this._postMessage({ type: "toast", message: `Diff a\xE7\u0131lamad\u0131: ${err.message}` });
        }
        break;
      }
      case "createSession": {
        const chosenModel = data.modelId || this._storageService.getLastSelectedModelId();
        const chosenMode = data.mode || this._storageService.getLastSelectedMode();
        const draftSession = this._storageService.createDraftSession(data.title, chosenModel, chosenMode);
        this._postMessage({
          type: "newSessionDraft",
          session: draftSession
        });
        break;
      }
      case "switchSession": {
        await this._storageService.setActiveSessionId(data.sessionId);
        const session = this._storageService.getSession(data.sessionId);
        if (session?.modelId) {
          await this._storageService.setLastSelectedModelId(session.modelId);
        }
        this._postMessage({
          type: "sessionsUpdated",
          sessions: this._storageService.getSessions(),
          activeSessionId: data.sessionId
        });
        break;
      }
      case "openMessageBlackbox": {
        try {
          const { sessionId, messageId } = data;
          const session = this._storageService.getSession(sessionId);
          const msg = session?.messages.find((m) => m.id === messageId);
          if (session && msg) {
            const blackboxMd = this._buildBlackboxMarkdown(session, msg);
            const doc = await vscode2.workspace.openTextDocument({
              content: blackboxMd,
              language: "markdown"
            });
            await vscode2.window.showTextDocument(doc, { preview: true });
          }
        } catch (err) {
          this._postMessage({ type: "toast", message: `Kara kutu a\xE7\u0131lamad\u0131: ${err.message}` });
        }
        break;
      }
      case "openWebSources": {
        try {
          const { sessionId, messageId } = data;
          const session = this._storageService.getSession(sessionId);
          const msg = session?.messages.find((m) => m.id === messageId);
          if (session && msg && msg.webSources && msg.webSources.length > 0) {
            const settings = this._storageService.getSettings();
            const sourcesMd = WebSearchService.generateSourcesMarkdown(session, msg, settings);
            const doc = await vscode2.workspace.openTextDocument({
              content: sourcesMd,
              language: "markdown"
            });
            await vscode2.window.showTextDocument(doc, { preview: true });
          } else {
            this._postMessage({ type: "toast", message: "Bu yan\u0131ta ait web kayna\u011F\u0131 bulunamad\u0131." });
          }
        } catch (err) {
          this._postMessage({ type: "toast", message: `Kaynaklar a\xE7\u0131lamad\u0131: ${err.message}` });
        }
        break;
      }
      case "deleteSession": {
        await this._storageService.deleteSession(data.sessionId);
        this._postMessage({
          type: "sessionsUpdated",
          sessions: this._storageService.getSessions(),
          activeSessionId: this._storageService.getActiveSessionId()
        });
        this._postMessage({ type: "toast", message: "Oturum silindi." });
        break;
      }
      case "renameSession": {
        const session = this._storageService.getSession(data.sessionId);
        if (session) {
          session.title = data.newTitle;
          await this._storageService.saveSession(session);
          this._postMessage({
            type: "sessionsUpdated",
            sessions: this._storageService.getSessions(),
            activeSessionId: session.id
          });
        }
        break;
      }
      case "exportSession": {
        const settings = this._storageService.getSettings();
        const resolvedLang = resolveLanguage(settings.language, vscode2.env.language);
        await this._exportSession(data.sessionId, data.format, resolvedLang);
        break;
      }
      case "selectModel": {
        await this._storageService.setLastSelectedModelId(data.modelId);
        const session = this._storageService.getSession(data.sessionId);
        if (session) {
          session.modelId = data.modelId;
          await this._storageService.saveSession(session);
        }
        break;
      }
      case "saveSettings": {
        const updated = await this._storageService.saveSettings(data.settings);
        const resolvedLang = resolveLanguage(updated.language, vscode2.env.language);
        this._postMessage({
          type: "settingsUpdated",
          settings: updated,
          language: resolvedLang
        });
        break;
      }
      case "saveCustomModel": {
        await this._storageService.saveCustomModel(data.model);
        const installed = await this._getInstalledOllamaModels();
        this._postMessage({
          type: "modelsUpdated",
          models: this._storageService.getCustomModels(),
          installedOllamaModels: installed
        });
        this._postMessage({ type: "toast", message: `"${data.model.name}" modeli kaydedildi.` });
        break;
      }
      case "deleteCustomModel": {
        await this._storageService.deleteCustomModel(data.modelId);
        const installed = await this._getInstalledOllamaModels();
        this._postMessage({
          type: "modelsUpdated",
          models: this._storageService.getCustomModels(),
          installedOllamaModels: installed
        });
        this._postMessage({ type: "toast", message: "Model silindi." });
        break;
      }
    }
  }
  async _sendInitialData() {
    const settings = this._storageService.getSettings();
    let customModels = this._storageService.getCustomModels();
    const installedOllamaModels = await this._getInstalledOllamaModels();
    if (customModels.length === 0 && installedOllamaModels.length > 0) {
      for (const om of installedOllamaModels) {
        await this._storageService.saveCustomModel({
          id: om.name,
          name: om.name,
          baseModel: om.name,
          numCtx: 4096,
          temperature: 0.7,
          isCustom: false
        });
      }
      customModels = this._storageService.getCustomModels();
    }
    const lastSelectedModelId = this._storageService.getLastSelectedModelId();
    let sessions = this._storageService.getSessions();
    let activeSessionId = this._storageService.getActiveSessionId();
    if (sessions.length === 0) {
      const draftSession = this._storageService.createDraftSession("Yeni Sohbet", lastSelectedModelId);
      sessions = [draftSession];
      activeSessionId = draftSession.id;
    } else if (!activeSessionId || !sessions.some((s) => s.id === activeSessionId)) {
      activeSessionId = sessions[0].id;
    }
    const username = process.env.USER || process.env.USERNAME || "Geli\u015Ftirici";
    const resolvedLanguage = resolveLanguage(settings.language, vscode2.env.language);
    const lastSelectedMode = this._storageService.getLastSelectedMode();
    const workspaceFiles = await AgentService.listFiles(300);
    this._postMessage({
      type: "initData",
      sessions,
      activeSessionId,
      models: customModels,
      installedOllamaModels,
      settings,
      username,
      lastSelectedModelId,
      lastSelectedMode,
      lastSelectedWebAccess: this._storageService.getLastSelectedWebAccess(),
      language: resolvedLanguage,
      workspaceFiles
    });
  }
  async _getInstalledOllamaModels() {
    const settings = this._storageService.getSettings();
    try {
      return await OllamaService.getInstalledModels(settings.ollamaUrl);
    } catch (err) {
      console.warn("Ollama modelleri y\xFCklenemedi:", err);
      return [];
    }
  }
  async _handleSendMessage(sessionId, prompt, modelId, mode, clientWebAccess) {
    let session = this._storageService.getSession(sessionId);
    const lastWeb = this._storageService.getLastSelectedWebAccess();
    const effectiveWebAccess = clientWebAccess !== void 0 ? !!clientWebAccess : session?.webAccessEnabled !== void 0 ? !!session.webAccessEnabled : lastWeb;
    if (!session) {
      const chosenModel = modelId || this._storageService.getLastSelectedModelId();
      const chosenMode = mode || this._storageService.getLastSelectedMode();
      session = {
        id: sessionId || "session_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        title: "Yeni Sohbet",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [],
        modelId: chosenModel,
        mode: chosenMode,
        webAccessEnabled: effectiveWebAccess
      };
      sessionId = session.id;
    } else {
      session.webAccessEnabled = effectiveWebAccess;
    }
    await this._storageService.setLastSelectedWebAccess(effectiveWebAccess);
    const currentMode = mode || session.mode || this._storageService.getLastSelectedMode() || "chat";
    session.mode = currentMode;
    await this._storageService.setLastSelectedMode(currentMode);
    const mentionRegex = /(?:^|\s)(?:@|#)(?:\[([^\]]+)\]|"([^"]+)"|'([^']+)'|([a-zA-Z0-9_\-./]+))/g;
    const mentionedPaths = [];
    let mentionMatch;
    while ((mentionMatch = mentionRegex.exec(prompt)) !== null) {
      const rawPath = (mentionMatch[1] || mentionMatch[2] || mentionMatch[3] || mentionMatch[4] || "").trim();
      if (rawPath && !mentionedPaths.includes(rawPath)) {
        mentionedPaths.push(rawPath);
      }
    }
    const loadedFiles = [];
    for (const p of mentionedPaths) {
      try {
        const content = await AgentService.readFile(p);
        loadedFiles.push({ path: p, content });
      } catch {
      }
    }
    const userMsg = {
      id: "user_" + Date.now(),
      role: "user",
      content: prompt,
      createdAt: Date.now()
    };
    if (session.messages.length === 0 && session.title === "Yeni Sohbet") {
      session.title = prompt.slice(0, 30).trim() + (prompt.length > 30 ? "..." : "");
    }
    session.messages.push(userMsg);
    session.updatedAt = Date.now();
    session.modelId = modelId;
    await this._storageService.setLastSelectedModelId(modelId);
    await this._storageService.saveSession(session);
    await this._storageService.setActiveSessionId(session.id);
    this._postMessage({
      type: "sessionsUpdated",
      sessions: this._storageService.getSessions(),
      activeSessionId: session.id
    });
    const settings = this._storageService.getSettings();
    const customModels = this._storageService.getCustomModels();
    const customConfig = customModels.find((m) => m.id === modelId);
    const actualModelName = customConfig ? customConfig.baseModel : modelId;
    let systemPrompt = customConfig?.systemPrompt || (settings.enableSystemPrompt !== false ? settings.defaultSystemPrompt : void 0);
    const webAccessEnabled = !!session.webAccessEnabled;
    const now = /* @__PURE__ */ new Date();
    const dateOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    const dateStr = now.toLocaleDateString("tr-TR", dateOptions);
    const currentYear = now.getFullYear();
    const temporalDirective = `[ZAMAN B\u0130LG\u0130S\u0130: Bug\xFCn\xFCn ger\xE7ek d\xFCnya tarihi ${dateStr}, mevcut y\u0131l ${currentYear}. Model e\u011Fitim veri s\u0131n\u0131r\u0131n (cutoff) ge\xE7mi\u015Fte olsa dahi, kullan\u0131c\u0131n\u0131n y\u0131l, tarih, g\xFCn ve g\xFCncellik i\xE7eren sorular\u0131nda bu reel zaman\u0131 (${currentYear}) esas alacaks\u0131n.]
[TEMPORAL CONTEXT: Today is ${dateStr}, current year is ${currentYear}.]`;
    if (currentMode === "agent") {
      const files = await AgentService.listFiles(80);
      systemPrompt = AgentService.getAgentSystemPrompt(systemPrompt, files, webAccessEnabled);
    }
    if (systemPrompt && systemPrompt.trim()) {
      systemPrompt = `${temporalDirective}

${systemPrompt}`;
    } else {
      systemPrompt = temporalDirective;
    }
    const temperature = customConfig?.temperature;
    const numCtx = customConfig?.numCtx;
    let numPredict;
    if (customConfig?.numPredict !== void 0) {
      numPredict = customConfig.numPredict;
    } else if (settings.enableMaxTokens) {
      numPredict = Math.max(4096, settings.defaultMaxTokens || 4096);
    } else {
      numPredict = void 0;
    }
    const installed = await this._getInstalledOllamaModels();
    const matchingOllama = installed.find((m) => m.name === actualModelName);
    const quantLevel = matchingOllama?.details?.quantization_level || "";
    session.modelQuantization = quantLevel;
    await this._storageService.saveSession(session);
    let activeWebSources = [];
    if (webAccessEnabled) {
      this._postMessage({
        type: "webSearching",
        sessionId,
        searching: true
      });
      try {
        activeWebSources = await WebSearchService.search(prompt, settings);
      } catch (err) {
        console.warn("Web search failed:", err);
      } finally {
        this._postMessage({
          type: "webSearching",
          sessionId,
          searching: false
        });
      }
    }
    const abortController = new AbortController();
    this._abortControllers.set(sessionId, abortController);
    let streamAccumulated = "";
    const messagesForOllama = session.messages.map((m, idx) => {
      if (idx === session.messages.length - 1) {
        let enhancedPrompt = m.content;
        if (loadedFiles.length > 0) {
          const fileBlocks = loadedFiles.map(
            (f) => `=== TARGET FILE CONTENT: "${f.path}" ===
${f.content}
=== END OF FILE: "${f.path}" ===`
          ).join("\n\n");
          const modeDirective = currentMode === "agent" ? `[AGENT DIRECTIVE: The user has targeted the file(s) above for editing. Review the code carefully and output exact file actions using <edit_file path="${loadedFiles[0].path}"> or <write_file path="${loadedFiles[0].path}"> tags.]` : `[CHAT DIRECTIVE: The user has provided the file(s) above for reference in CHAT mode. Analyze and discuss this code in your conversational response. DO NOT output file modification actions.]`;
          enhancedPrompt = `${fileBlocks}

${modeDirective}

User Question/Request:
${m.content}`;
        }
        if (webAccessEnabled) {
          if (activeWebSources.length > 0) {
            const webContext = WebSearchService.formatSourcesForPrompt(activeWebSources, settings.webSearchDepth);
            enhancedPrompt = `${webContext}

=== KULLANICI SORUSU ===
${enhancedPrompt}`;
          } else {
            enhancedPrompt = `[\u0130NTERNET ER\u0130\u015E\u0130M\u0130 AKT\u0130F - ZAMAN B\u0130LG\u0130S\u0130: Bug\xFCn\xFCn tarihi ${dateStr}, mevcut y\u0131l ${currentYear}.]

${enhancedPrompt}`;
          }
        }
        return {
          role: m.role,
          content: enhancedPrompt
        };
      }
      return {
        role: m.role,
        content: m.content
      };
    });
    await OllamaService.streamChat({
      baseUrl: settings.ollamaUrl,
      model: actualModelName,
      messages: messagesForOllama,
      systemPrompt,
      temperature,
      numCtx,
      numPredict,
      signal: abortController.signal,
      onChunk: (chunk) => {
        streamAccumulated += chunk;
        this._postMessage({
          type: "streamChunk",
          sessionId,
          chunk,
          fullText: streamAccumulated
        });
      },
      onDone: async (stats, fullText) => {
        this._abortControllers.delete(sessionId);
        const actions = currentMode === "agent" ? AgentService.parseAgentActions(fullText) : [];
        if (actions.length > 0) {
          for (const act of actions) {
            try {
              const audit = await GuardService.auditAction(act, settings, installed);
              act.securityAudit = audit;
            } catch (err) {
              console.warn("Prosecutor audit failed:", err);
            }
          }
        }
        for (const act of actions) {
          if (act.securityAudit?.blocked) {
            continue;
          }
          try {
            if (act.type === "write" && act.content !== void 0) {
              const res = await AgentService.writeFile(act.path, act.content);
              act.originalContent = res.originalContent;
              act.wasCreated = res.wasCreated;
              act.status = "applied";
            } else if (act.type === "edit" && act.search && act.replace) {
              const res = await AgentService.applySearchReplace(act.path, act.search, act.replace);
              act.originalContent = res.originalContent;
              act.wasCreated = false;
              act.status = "applied";
            } else if (act.type === "create_dir") {
              await AgentService.createDirectory(act.path);
              act.status = "applied";
            } else if (act.type === "move" && act.targetPath) {
              await AgentService.movePath(act.path, act.targetPath);
              act.status = "applied";
            } else if (act.type === "read") {
              act.output = await AgentService.readFile(act.path);
              act.status = "executed";
            } else if (act.type === "list_dir") {
              const items = await AgentService.listDirectory(act.path === "." ? "" : act.path);
              act.output = items.map((i) => `${i.isDirectory ? "\u{1F4C1}" : "\u{1F4C4}"} ${i.name}`).join("\n") || "(Bo\u015F dizin)";
              act.status = "executed";
            } else if (act.type === "find_files" && act.pattern) {
              const files = await AgentService.findFiles(act.pattern);
              act.output = files.map((f) => `\u{1F4C4} ${f}`).join("\n") || "(Dosya bulunamad\u0131)";
              act.status = "executed";
            } else if (act.type === "grep" && act.query) {
              const matches = await AgentService.grepSearch(act.query, act.path === "." ? "" : act.path, act.isRegex);
              act.output = matches.map((m) => `${m.file}:${m.line}: ${m.content}`).join("\n") || "(E\u015Fle\u015Fme bulunamad\u0131)";
              act.status = "executed";
            } else if (act.type === "command" && act.command) {
              const res = await AgentService.executeCommand(act.command);
              act.output = res.stdout + (res.stderr ? `
[STDERR]
${res.stderr}` : "");
              act.status = res.exitCode === 0 ? "executed" : "failed";
            } else if (act.type === "web_search" && act.query) {
              try {
                const searchSources = await WebSearchService.search(act.query, settings);
                if (searchSources.length > 0) {
                  for (const s of searchSources) {
                    if (!activeWebSources.some((existing) => existing.url === s.url)) {
                      activeWebSources.push(s);
                    }
                  }
                  act.output = searchSources.map((s) => `[${s.title}](${s.url})
${s.snippet}`).join("\n\n");
                  act.status = "executed";
                } else {
                  act.output = "Arama sonucu bulunamad\u0131.";
                  act.status = "executed";
                }
              } catch (err) {
                act.output = `Web aramas\u0131 ba\u015Far\u0131s\u0131z: ${err.message}`;
                act.status = "failed";
              }
            }
          } catch (err) {
            console.warn("Auto apply failed for action:", act, err);
            act.status = "failed";
            act.output = `Hata: ${err.message}`;
          }
        }
        const assistantMsg = {
          id: "asst_" + Date.now(),
          role: "assistant",
          content: fullText,
          createdAt: Date.now(),
          stats,
          modelName: actualModelName,
          modelQuantization: quantLevel,
          actions: actions.length > 0 ? actions : void 0,
          webSources: activeWebSources.length > 0 ? activeWebSources : void 0
        };
        session.messages.push(assistantMsg);
        session.updatedAt = Date.now();
        await this._storageService.saveSession(session);
        this._postMessage({
          type: "streamDone",
          sessionId,
          stats,
          message: assistantMsg
        });
      },
      onError: (err) => {
        this._abortControllers.delete(sessionId);
        this._postMessage({
          type: "streamError",
          sessionId,
          error: err.message
        });
      }
    });
  }
  async _exportSession(sessionId, format, lang) {
    const session = this._storageService.getSession(sessionId);
    if (!session) {
      return;
    }
    const content = format === "markdown" ? this._storageService.exportSessionAsMarkdown(sessionId, lang) : this._storageService.exportSessionAsJson(sessionId);
    const doc = await vscode2.workspace.openTextDocument({
      content,
      language: format === "markdown" ? "markdown" : "json"
    });
    await vscode2.window.showTextDocument(doc);
    const t = getTranslation(lang);
    this._postMessage({ type: "toast", message: `${session.title} (${format.toUpperCase()}) ${t.common.copied.toLowerCase()}` });
  }
  _buildBlackboxMarkdown(session, msg) {
    const stats = msg.stats;
    const totalDurationSec = ((stats?.totalDurationMs || 0) / 1e3).toFixed(2);
    const tps = (stats?.tokensPerSecond || 0).toFixed(1);
    const evalTokens = stats?.evalCount || 0;
    const promptTokens = stats?.promptEvalCount || 0;
    const loadDurationMs = stats?.loadDurationMs || 0;
    const promptEvalDurationMs = stats?.promptEvalDurationMs || 0;
    const evalDurationMs = stats?.evalDurationMs || 0;
    const createdAtStr = new Date(msg.createdAt).toLocaleString();
    let actionsTable = "_(Herhangi bir ara\xE7 veya eylem y\xFCr\xFCt\xFClmedi)_";
    if (msg.actions && msg.actions.length > 0) {
      actionsTable = msg.actions.map((act, idx) => {
        const auditText = act.securityAudit ? `Risk: **${act.securityAudit.risk.toUpperCase()}** | G\xFCvenli: **${act.securityAudit.isSafe ? "Evet" : "Hay\u0131r"}**${act.securityAudit.blocked ? " \u{1F6AB} **(ENGELLEND\u0130)**" : ""}
> Gerek\xE7e: ${act.securityAudit.reason}` : "Denetim bilgisi yok";
        const outputBlock = act.output ? `
**Sonu\xE7 / \xC7\u0131kt\u0131:**
\`\`\`
${act.output}
\`\`\`` : "";
        let detail = "";
        if (act.type === "command") {
          detail = `Komut: \`${act.command}\``;
        } else if (act.type === "move") {
          detail = `Kaynak: \`${act.path}\` \u279C Hedef: \`${act.targetPath}\``;
        } else if (act.type === "grep") {
          detail = `Sorgu: "${act.query}" (Dizin: \`${act.path}\`)`;
        } else if (act.type === "find_files") {
          detail = `Desen: "${act.pattern}"`;
        } else {
          detail = `Hedef Dosya/Klas\xF6r: \`${act.path}\``;
        }
        return `### ${idx + 1}. [${act.type.toUpperCase()}] Durum: \`${act.status}\`
- **Ayr\u0131nt\u0131:** ${detail}
- **Savc\u0131 Denetimi:**
> ${auditText}
${outputBlock}`;
      }).join("\n\n---\n\n");
    }
    return `# \u{1F4E6} Yan\u0131t Kara Kutusu (Black Box Log)

## \u2139\uFE0F Genel Bilgiler
- **Mesaj ID:** \`${msg.id}\`
- **Tarih & Saat:** ${createdAtStr}
- **Oturum Ba\u015Fl\u0131\u011F\u0131:** ${session.title}
- **Kullan\u0131lan Model:** \`${msg.modelName || "Varsay\u0131lan"}\`
- **Kuantizasyon D\xFCzeyi:** \`${msg.modelQuantization || "-"}\`
- **G\xF6rev Modu:** \`${session.mode || "chat"}\`

---

## \u26A1 Token ve Performans Metrikleri
| Metrik | De\u011Fer |
| :--- | :--- |
| **\xDCretim H\u0131z\u0131 (Tokens/sec)** | \`${tps} tok/s\` |
| **Toplam Yan\u0131t S\xFCresi** | \`${totalDurationSec}s\` (\`${stats?.totalDurationMs || 0} ms\`) |
| **\xDCretilen Token Say\u0131s\u0131 (eval_count)** | \`${evalTokens}\` |
| **Prompt Token Say\u0131s\u0131 (prompt_eval_count)** | \`${promptTokens}\` |
| **Model Y\xFCkleme S\xFCresi (load_duration)** | \`${loadDurationMs} ms\` |
| **Prompt De\u011Ferlendirme S\xFCresi** | \`${promptEvalDurationMs} ms\` |
| **\xDCretim De\u011Ferlendirme S\xFCresi** | \`${evalDurationMs} ms\` |

---

## \u{1F6E0}\uFE0F Y\xFCr\xFCt\xFClen Sistem Ara\xE7lar\u0131 ve Eylemler (Agent Actions)
${actionsTable}

---

## \u{1F4DC} Ham Yan\u0131t \u0130\xE7eri\u011Fi (Raw Response Content)
\`\`\`markdown
${msg.content}
\`\`\`
`;
  }
  _postMessage(message) {
    this._view?.webview.postMessage(message);
  }
  _getHtmlForWebview(webview) {
    const scriptUri = webview.asWebviewUri(vscode2.Uri.joinPath(this._extensionUri, "dist", "webview.js"));
    const styleUri = webview.asWebviewUri(vscode2.Uri.joinPath(this._extensionUri, "dist", "webview.css"));
    return `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${styleUri}" rel="stylesheet">
    <title>OllamaChat</title>
</head>
<body>
    <!-- Top Header -->
    <header class="app-header">
        <button class="session-selector-btn" id="sessionSelectorBtn" title="Oturumlar\u0131 Listele">
            <span class="session-title" id="sessionTitle">Yeni Sohbet</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </button>

        <div class="header-actions">
            <button class="icon-btn" id="newSessionBtn" title="Yeni Sohbet">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
            <button class="icon-btn" id="settingsBtn" title="Ayarlar">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
            </button>
        </div>
    </header>

    <!-- Sessions Dropdown -->
    <div class="dropdown-menu" id="sessionDropdown">
        <div class="dropdown-search">
            <input type="text" id="sessionSearchInput" placeholder="Oturumlarda ara..." autocomplete="off">
        </div>
        <div class="dropdown-list" id="sessionList"></div>
    </div>

    <!-- Models Dropdown -->
    <div class="dropdown-menu" id="modelDropdown" style="top: auto; bottom: 65px;">
        <div class="dropdown-search">
            <input type="text" id="modelSearchInput" placeholder="Model ara..." autocomplete="off">
        </div>
        <div class="dropdown-list" id="modelList"></div>
    </div>

    <!-- Mode / Task Dropdown -->
    <div class="dropdown-menu" id="modeDropdown" style="top: auto; bottom: 65px; width: 240px;">
        <div class="dropdown-list" id="modeList"></div>
    </div>

    <!-- Drag & Drop Overlay -->
    <div class="drag-drop-overlay" id="dragDropOverlay">
        <div class="drag-drop-modal">
            <span class="drag-drop-icon">\u{1F4C2}</span>
            <span class="drag-drop-text" id="dragDropText">Dosyay\u0131 buraya b\u0131rak\u0131n (@dosya olarak hedefler)</span>
        </div>
    </div>

    <!-- Main Chat Messages / Welcome Hero -->
    <main class="chat-container" id="chatContainer"></main>

    <!-- Bottom Chat Input (3 Rows Qwen Code Design) -->
    <div class="chat-input-wrapper" id="chatInputWrapper">
        <!-- Autocomplete Suggestions Popup for @ and # -->
        <div class="mention-autocomplete" id="mentionAutocomplete"></div>

        <div class="chat-input-card">
            <!-- Row 1 & 2: Textarea (Expands from 2 lines up to 4 text lines, scrolls after) -->
            <textarea
                class="chat-textarea"
                id="chatTextarea"
                rows="2"
                placeholder="Bir soru sorun veya kod isteyin... (Enter ile g\xF6nder, Shift+Enter alt sat\u0131r)"
            ></textarea>

            <!-- Row 3: Options Toolbar -->
            <div class="chat-input-toolbar">
                <div class="toolbar-left">
                    <button class="model-badge-btn" id="modelBadgeBtn">
                        <span class="model-badge-name" id="modelBadgeName">Model Se\xE7</span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>

                    <button class="mode-badge-btn" id="modeBadgeBtn" title="G\xF6rev / Mod Se\xE7">
                        <span class="mode-badge-icon" id="modeBadgeIcon">\u{1F4AC}</span>
                        <span class="mode-badge-name" id="modeBadgeName">Chat</span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>

                    <button class="web-access-btn" id="webAccessBtn" title="\u0130nternet Eri\u015Fimi (A\xE7\u0131k/Kapal\u0131)">
                        <span class="web-access-icon">\u{1F310}</span>
                        <span class="web-access-label" id="webAccessLabel">Web</span>
                    </button>
                </div>

                <div class="toolbar-right" style="position: relative;">
                    <button class="token-stat-badge" id="tokenStatBadge">
                        <span>\u26A1 KVCache</span>
                    </button>

                    <!-- KVCache Popover Tooltip -->
                    <div class="kvcache-popover" id="kvCachePopover">
                        <div class="kvcache-popover-title">Ba\u011Flam & KV-Cache</div>
                        <div class="kvcache-detail-row">
                            <span>Model:</span>
                            <strong id="kvModelName">-</strong>
                        </div>
                        <div class="kvcache-detail-row">
                            <span>Context (num_ctx):</span>
                            <strong id="kvCtxSize">-</strong>
                        </div>
                        <div class="kvcache-detail-row">
                            <span>S\u0131cakl\u0131k:</span>
                            <strong id="kvTemperature">-</strong>
                        </div>
                        <div class="kvcache-detail-row">
                            <span>Son Yan\u0131t H\u0131z\u0131:</span>
                            <strong id="kvSpeed">-</strong>
                        </div>
                    </div>

                    <button class="send-btn" id="sendBtn" title="G\xF6nder (Enter)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Settings Modal -->
    <div class="modal-overlay" id="settingsModal">
        <div class="modal-card">
            <div class="modal-header">
                <span class="modal-title">Ayarlar</span>
                <button class="icon-btn" id="closeSettingsBtn">\u2715</button>
            </div>
            <div class="modal-tabs">
                <button class="tab-btn active" data-tab="tabSessions">Oturumlar</button>
                <button class="tab-btn" data-tab="tabModels">Modeller</button>
                <button class="tab-btn" data-tab="tabSettings">Eklenti Ayarlar\u0131</button>
            </div>
            <div class="modal-body">
                <!-- Tab 1: Oturumlar -->
                <div class="tab-pane active" id="tabSessions">
                    <p class="form-hint">Kay\u0131tl\u0131 oturumlar\u0131 d\u0131\u015Fa aktarabilir veya silebilirsiniz.</p>
                    <div id="settingsSessionList" style="display: flex; flex-direction: column; gap: 6px;"></div>
                </div>

                <!-- Tab 2: Modeller -->
                <div class="tab-pane" id="tabModels">
                    <div style="display: flex; justify-content: space-between; align-items: center; position: relative;">
                        <span class="form-label">T\xFCm Modeller (Ollama & \xD6zel)</span>
                        <div style="position: relative;">
                            <button class="btn-primary" id="addModelBtn">+ Ekle \u25BE</button>
                            <div class="dropdown-menu" id="addModelMenu" style="top: 32px; right: 0; left: auto; width: 170px;">
                                <div class="dropdown-item" id="importFromOllamaBtn">Ollama'dan aktar</div>
                                <div class="dropdown-item" id="createNewModelBtn">Kopya model olu\u015Ftur</div>
                            </div>
                        </div>
                    </div>

                    <div id="settingsModelList" style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px;"></div>
                </div>

                <!-- Tab 3: Eklenti Ayarlar\u0131 -->
                <div class="tab-pane" id="tabSettings">
                    <div class="form-group">
                        <label class="form-label" id="settingLanguageLabel">Dil Se\xE7imi / Language</label>
                        <select class="form-select" id="settingLanguage">
                            <option value="auto">Otomatik (VS Code Dili) / Auto</option>
                            <option value="en">English</option>
                            <option value="tr">T\xFCrk\xE7e</option>
                        </select>
                        <span class="form-hint" id="settingLanguageHint">Aray\xFCz dilini belirleyin veya VS Code diline otomatik e\u015Fitleyin.</span>
                    </div>

                    <div class="form-group">
                        <label class="form-label" id="settingOllamaUrlLabel">Ollama API URL</label>
                        <input class="form-input" id="settingOllamaUrl" placeholder="http://127.0.0.1:11434">
                        <span class="form-hint" id="settingOllamaUrlHint">Ollama yerel sunucu ba\u011Flant\u0131 noktas\u0131.</span>
                    </div>

                    <div class="form-group">
                        <div class="toggle-row">
                            <label class="form-label" id="settingPromptLabel" style="margin-bottom: 0;">Genel Sistem Promptu</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="settingEnablePromptToggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div id="settingPromptContainer" class="setting-collapsible">
                            <textarea class="form-textarea" id="settingDefaultPrompt" placeholder="Varsay\u0131lan asistan sistem promptu..."></textarea>
                            <span class="form-hint" id="settingPromptHint">\xD6zel promptu bulunmayan t\xFCm modeller i\xE7in ge\xE7erli temel rol talimatlar\u0131.</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="toggle-row">
                            <label class="form-label" id="settingTokensLabel" style="margin-bottom: 0;">Maksimum Token S\u0131n\u0131r\u0131 (num_predict)</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="settingEnableTokensToggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div id="settingTokensContainer" class="setting-collapsible">
                            <input type="number" class="form-input" id="settingMaxTokens" value="4096" min="4096" step="512">
                            <span class="form-hint" id="settingTokensHint">Kapal\u0131yken \xFCretim s\u0131n\u0131rs\u0131zd\u0131r. A\xE7\u0131kken s\u0131n\u0131r minimum 4096 tokendir.</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="toggle-row">
                            <label class="form-label" id="settingAutoApplyLabel" style="margin-bottom: 0;">Agent Dosya G\xFCncellemelerini Otomatik Uygula</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="settingAutoApplyToggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <span class="form-hint" id="settingAutoApplyHint">Etkinle\u015Ftirildi\u011Finde, Agent modunda dosya de\u011Fi\u015Fiklikleri onay beklemeden do\u011Frudan kaydedilir.</span>
                    </div>

                    <!-- Granular Permissions -->
                    <div class="form-group" style="border-top: 1px solid var(--vscode-widget-border, #333); padding-top: 12px; margin-top: 12px;">
                        <label class="form-label" id="settingPermissionsTitle" style="font-weight: 600;">Otomatik \u0130zinler (Agent Modu)</label>
                        
                        <div class="toggle-row" style="margin-top: 8px;">
                            <label class="form-label" id="settingAutoFileEditsLabel" style="margin-bottom: 0;">Mevcut Dosya D\xFCzenlemelerine Otomatik \u0130zin Ver</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="settingAutoFileEditsToggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <span class="form-hint" id="settingAutoFileEditsHint">Varolan dosyalardaki search/replace veya write i\u015Flemlerine izin verir.</span>

                        <div class="toggle-row" style="margin-top: 8px;">
                            <label class="form-label" id="settingAutoFileCreateLabel" style="margin-bottom: 0;">Yeni Dosya Olu\u015Fturmaya Otomatik \u0130zin Ver</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="settingAutoFileCreateToggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <span class="form-hint" id="settingAutoFileCreateHint">Projeye yeni dosya eklenmesine otomatik onay verir.</span>

                        <div class="toggle-row" style="margin-top: 8px;">
                            <label class="form-label" id="settingAutoFolderCreateLabel" style="margin-bottom: 0;">Yeni Klas\xF6r Olu\u015Fturmaya Otomatik \u0130zin Ver</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="settingAutoFolderCreateToggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <span class="form-hint" id="settingAutoFolderCreateHint">Yeni alt klas\xF6rler olu\u015Fturulmas\u0131na izin verir.</span>
                    </div>

                    <!-- Prosecutor (Savc\u0131) Security Guard -->
                    <div class="form-group" style="border-top: 1px solid var(--vscode-widget-border, #333); padding-top: 12px; margin-top: 12px;">
                        <label class="form-label" id="settingProsecutorTitle" style="font-weight: 600;">Savc\u0131 G\xFCvenlik Denet\xE7isi (Guard Model)</label>
                        
                        <div class="toggle-row" style="margin-top: 8px;">
                            <label class="form-label" id="settingEnableProsecutorLabel" style="margin-bottom: 0;">Savc\u0131 Denet\xE7isini Etkinle\u015Ftir</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="settingEnableProsecutorToggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <span class="form-hint" id="settingEnableProsecutorHint">Y\u0131k\u0131c\u0131 komutlar\u0131 (rm -rf, sudo vb.) ve hassas dosya eri\u015Fimlerini otomatik engeller.</span>

                        <div id="settingProsecutorContainer" class="setting-collapsible" style="margin-top: 8px;">
                            <label class="form-label" id="settingProsecutorModelLabel">Savc\u0131 Modeli (Hafif LLM / 1.5B)</label>
                            <select class="form-select" id="settingProsecutorModel">
                                <option value="auto">Otomatik (1.5B / En Hafif Model)</option>
                            </select>
                            <span class="form-hint" id="settingProsecutorModelHint">Her eylemi an\u0131nda sorgulay\u0131p onaylayan hafif Ollama modeli.</span>
                        </div>
                    </div>

                    <!-- Web Search Settings -->
                    <div class="form-group" style="border-top: 1px solid var(--vscode-widget-border, #333); padding-top: 12px; margin-top: 12px;">
                        <label class="form-label" id="settingWebSearchTitle" style="font-weight: 600;">Web Arama ve \u0130nternet Eri\u015Fimi Ayarlar\u0131</label>

                        <div class="form-group" style="margin-top: 8px;">
                            <label class="form-label" id="settingWebEngineLabel">Arama Motoru</label>
                            <select class="form-select" id="settingWebEngine">
                                <option value="duckduckgo">DuckDuckGo</option>
                                <option value="searxng">SearXNG (Yerel/A\xE7\u0131k)</option>
                            </select>
                        </div>

                        <div class="form-group" style="margin-top: 8px;">
                            <label class="form-label" id="settingWebDepthLabel">Arama ve Analiz Derinli\u011Fi</label>
                            <select class="form-select" id="settingWebDepth">
                                <option value="fast">H\u0131zl\u0131 (Yaln\u0131zca Arama Sonu\xE7 Ba\u015Fl\u0131klar\u0131 ve \xD6zetleri)</option>
                                <option value="standard">Standart (Sayfa \u0130\xE7erikleri Analiz Edilir)</option>
                                <option value="deep">Derin (Her Sayfa Detayl\u0131 \u0130ncelenir ve \xD6zetlenir)</option>
                            </select>
                        </div>

                        <div class="form-group" style="margin-top: 8px;">
                            <label class="form-label" id="settingWebMaxResultsLabel">Maksimum Kaynak Say\u0131s\u0131 (1-10)</label>
                            <input type="number" class="form-input" id="settingWebMaxResults" min="1" max="10" value="5">
                        </div>

                        <div class="form-group" style="margin-top: 8px;">
                            <label class="form-label" id="settingWebBlacklistLabel">Kara Liste (Blacklist - Virg\xFClle Ayr\u0131lm\u0131\u015F Alan Adlar\u0131)</label>
                            <input class="form-input" id="settingWebBlacklist" placeholder="ornek.com, spam-site.net">
                            <span class="form-hint" id="settingWebBlacklistHint">Bu alan adlar\u0131 arama sonu\xE7lar\u0131ndan filtrelenir ve sayfalar\u0131na girilmez.</span>
                        </div>

                        <div class="form-group" style="margin-top: 8px;">
                            <label class="form-label" id="settingWebWhitelistLabel">Beyaz Liste (Whitelist - \u0130ste\u011Fe Ba\u011Fl\u0131 Alan Adlar\u0131)</label>
                            <input class="form-input" id="settingWebWhitelist" placeholder="github.com, stackoverflow.com">
                            <span class="form-hint" id="settingWebWhitelistHint">Doldurulursa, sadece bu alan adlar\u0131ndaki sonu\xE7lar kullan\u0131l\u0131r.</span>
                        </div>
                    </div>

                    <div style="margin-top: 14px;">
                        <button class="btn-primary" id="saveSettingsBtn">Ayarlar\u0131 Kaydet</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Model Edit / Create Pop-up Modal -->
    <div class="modal-overlay" id="modelEditorModal">
        <div class="modal-card" style="max-height: 520px; max-width: 460px;">
            <div class="modal-header">
                <span class="modal-title" id="modelEditorTitle">Model Profili D\xFCzenle</span>
                <button class="icon-btn" id="closeModelEditorBtn">\u2715</button>
            </div>
            <div class="modal-body" style="display: flex; flex-direction: column; gap: 12px;">
                <div class="form-group">
                    <label class="form-label" id="editorModelNameLabel">G\xF6r\xFCnen Ad</label>
                    <input class="form-input" id="editorModelName" placeholder="\xD6rn: Qwen Kod Asistan\u0131">
                </div>
                <div class="form-group">
                    <label class="form-label" id="editorBaseModelLabel">Taban Ollama Modeli</label>
                    <select class="form-select" id="editorBaseModel"></select>
                </div>
                <div class="form-group">
                    <label class="form-label" id="editorSystemPromptLabel">\xD6zel Sistem Promptu</label>
                    <textarea class="form-textarea" id="editorSystemPrompt" placeholder="Bu modele \xF6zg\xFC rol ve talimatlar..."></textarea>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div class="form-group">
                        <label class="form-label" id="editorNumCtxLabel">KV-Cache / Context (num_ctx)</label>
                        <input type="number" class="form-input" id="editorNumCtx" value="4096" step="1024">
                    </div>
                    <div class="form-group">
                        <label class="form-label" id="editorTemperatureLabel">S\u0131cakl\u0131k (Temperature)</label>
                        <input type="number" class="form-input" id="editorTemperature" value="0.7" step="0.1" min="0" max="2">
                    </div>
                </div>
                <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px;">
                    <button class="btn-secondary" id="cancelModelEditorBtn">\u0130ptal</button>
                    <button class="btn-primary" id="saveModelEditorBtn">Kaydet</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Ollama'dan Aktar Pop-up Modal -->
    <div class="modal-overlay" id="ollamaImportModal">
        <div class="modal-card" style="max-height: 520px; max-width: 480px;">
            <div class="modal-header">
                <span class="modal-title" id="ollamaImportModalTitle">Ollama'dan Model Aktar</span>
                <button class="icon-btn" id="closeOllamaImportBtn">\u2715</button>
            </div>
            <div class="modal-body">
                <p class="form-hint" id="ollamaImportModalHint" style="margin-bottom: 10px;">Cihaz\u0131n\u0131zda kurulu Ollama modelleri listeleniyor. Direkt aktarabilir veya parametrelerini d\xFCzenleyebilirsiniz:</p>
                <div id="ollamaImportList" style="display: flex; flex-direction: column; gap: 6px;"></div>
            </div>
        </div>
    </div>

    <!-- Toast Notification -->
    <div class="toast-msg" id="toast"></div>

    <script src="${scriptUri}"></script>
</body>
</html>`;
  }
};

// src/services/StorageService.ts
var SESSIONS_KEY = "ollamachat.sessions";
var ACTIVE_SESSION_ID_KEY = "ollamachat.activeSessionId";
var LAST_SELECTED_MODEL_ID_KEY = "ollamachat.lastSelectedModelId";
var LAST_SELECTED_MODE_KEY = "ollamachat.lastSelectedMode";
var CUSTOM_MODELS_KEY = "ollamachat.customModels";
var SETTINGS_KEY = "ollamachat.settings";
var LAST_SELECTED_WEB_ACCESS_KEY = "ollamachat.lastSelectedWebAccess";
var DEFAULT_SETTINGS = {
  ollamaUrl: "http://127.0.0.1:11434",
  defaultSystemPrompt: "You are a helpful, accurate, and concise AI coding assistant in Visual Studio Code.",
  enableSystemPrompt: true,
  defaultMaxTokens: 4096,
  enableMaxTokens: false,
  language: "auto",
  autoApplyAgentEdits: false,
  autoAllowFileEdits: false,
  autoAllowFileCreate: false,
  autoAllowFolderCreate: false,
  enableProsecutor: true,
  prosecutorModelId: "auto",
  webSearchEngine: "duckduckgo",
  webSearchDepth: "standard",
  webSearchMaxResults: 5,
  webSearchBlacklist: "",
  webSearchWhitelist: ""
};
var StorageService = class {
  constructor(context) {
    this.context = context;
  }
  context;
  // --- Settings ---
  getSettings() {
    const stored = this.context.globalState.get(SETTINGS_KEY);
    return {
      ...DEFAULT_SETTINGS,
      ...stored || {}
    };
  }
  async saveSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    await this.context.globalState.update(SETTINGS_KEY, updated);
    return updated;
  }
  getLastSelectedModelId() {
    const id = this.context.globalState.get(LAST_SELECTED_MODEL_ID_KEY);
    const models = this.getCustomModels();
    if (models.length > 0) {
      if (id && models.some((m) => m.id === id)) {
        return id;
      }
      return models[0].id;
    }
    return id;
  }
  async setLastSelectedModelId(modelId) {
    if (modelId) {
      await this.context.globalState.update(LAST_SELECTED_MODEL_ID_KEY, modelId);
    }
  }
  getLastSelectedMode() {
    return this.context.globalState.get(LAST_SELECTED_MODE_KEY, "chat");
  }
  async setLastSelectedMode(mode) {
    if (mode) {
      await this.context.globalState.update(LAST_SELECTED_MODE_KEY, mode);
    }
  }
  getLastSelectedWebAccess() {
    return this.context.globalState.get(LAST_SELECTED_WEB_ACCESS_KEY, false);
  }
  async setLastSelectedWebAccess(enabled) {
    await this.context.globalState.update(LAST_SELECTED_WEB_ACCESS_KEY, !!enabled);
  }
  // --- Sessions ---
  getSessions() {
    const list = this.context.globalState.get(SESSIONS_KEY, []);
    const nonEmpty = list.filter((s) => s.messages && s.messages.length > 0);
    return nonEmpty.sort((a, b) => b.updatedAt - a.updatedAt);
  }
  getSession(id) {
    const sessions = this.getSessions();
    return sessions.find((s) => s.id === id);
  }
  async saveSession(session) {
    const sessions = this.getSessions();
    const index = sessions.findIndex((s) => s.id === session.id);
    if (session.messages && session.messages.length > 0) {
      if (index >= 0) {
        sessions[index] = session;
      } else {
        sessions.unshift(session);
      }
    } else if (index >= 0) {
      sessions.splice(index, 1);
    }
    await this.context.globalState.update(SESSIONS_KEY, sessions);
    if (session.modelId) {
      await this.setLastSelectedModelId(session.modelId);
    }
    if (session.mode) {
      await this.setLastSelectedMode(session.mode);
    }
    if (session.webAccessEnabled !== void 0) {
      await this.setLastSelectedWebAccess(session.webAccessEnabled);
    }
  }
  createDraftSession(title, modelId, mode) {
    const now = Date.now();
    const chosenModelId = modelId || this.getLastSelectedModelId() || this.getSettings().defaultModelId;
    const chosenMode = mode || this.getLastSelectedMode();
    const chosenWebAccess = this.getLastSelectedWebAccess();
    return {
      id: "session_" + now + "_" + Math.random().toString(36).substring(2, 7),
      title: title || "Yeni Sohbet",
      createdAt: now,
      updatedAt: now,
      messages: [],
      modelId: chosenModelId,
      mode: chosenMode,
      webAccessEnabled: chosenWebAccess
    };
  }
  async createSession(title, modelId, mode) {
    const newSession = this.createDraftSession(title, modelId, mode);
    await this.setActiveSessionId(newSession.id);
    return newSession;
  }
  async deleteSession(id) {
    const sessions = this.getSessions().filter((s) => s.id !== id);
    await this.context.globalState.update(SESSIONS_KEY, sessions);
    if (this.getActiveSessionId() === id) {
      const next = sessions[0];
      await this.setActiveSessionId(next ? next.id : "");
    }
  }
  getActiveSessionId() {
    return this.context.globalState.get(ACTIVE_SESSION_ID_KEY, "");
  }
  async setActiveSessionId(id) {
    await this.context.globalState.update(ACTIVE_SESSION_ID_KEY, id);
  }
  exportSessionAsMarkdown(sessionId, lang) {
    const session = this.getSession(sessionId);
    if (!session) {
      return "";
    }
    const t = getTranslation(lang);
    const dateStr = new Date(session.createdAt).toLocaleString();
    const modelInfo = session.modelId || t.common.default;
    const quantInfo = session.modelQuantization ? ` (${session.modelQuantization})` : "";
    let md = `# ${session.title}

*${t.export.createdDate} ${dateStr}*
*${t.export.model} ${modelInfo}${quantInfo}*

---

`;
    for (const msg of session.messages) {
      const roleName = msg.role === "user" ? `${t.export.user}` : `${t.export.assistant}`;
      const timeStr = new Date(msg.createdAt).toLocaleTimeString();
      md += `### ${roleName} (${timeStr})

${msg.content}

`;
      const details = [];
      if (msg.modelName) {
        details.push(`${t.export.model} ${msg.modelName}`);
      }
      if (msg.modelQuantization) {
        details.push(`${t.export.quantization} ${msg.modelQuantization}`);
      }
      if (msg.stats?.tokensPerSecond) {
        details.push(`${t.chat.speed}: ${msg.stats.tokensPerSecond.toFixed(1)} ${t.chat.tokenPerSec}`);
      }
      if (msg.stats?.totalDurationMs) {
        details.push(`${t.chat.duration}: ${((msg.stats.totalDurationMs || 0) / 1e3).toFixed(1)}s`);
      }
      if (details.length > 0) {
        md += `> \u2139\uFE0F *${details.join(" | ")}*

`;
      }
      md += `---

`;
    }
    return md;
  }
  exportSessionAsJson(sessionId) {
    const session = this.getSession(sessionId);
    if (!session) {
      return "{}";
    }
    return JSON.stringify(session, null, 2);
  }
  // --- Custom Models ---
  getCustomModels() {
    return this.context.globalState.get(CUSTOM_MODELS_KEY, []);
  }
  async saveCustomModel(model) {
    const models = this.getCustomModels();
    const index = models.findIndex((m) => m.id === model.id);
    if (index >= 0) {
      models[index] = model;
    } else {
      models.push(model);
    }
    await this.context.globalState.update(CUSTOM_MODELS_KEY, models);
  }
  async deleteCustomModel(id) {
    const models = this.getCustomModels().filter((m) => m.id !== id);
    await this.context.globalState.update(CUSTOM_MODELS_KEY, models);
    const lastModelId = this.context.globalState.get(LAST_SELECTED_MODEL_ID_KEY);
    if (lastModelId === id) {
      await this.context.globalState.update(LAST_SELECTED_MODEL_ID_KEY, models[0] ? models[0].id : "");
    }
  }
};

// src/extension.ts
function activate(context) {
  AgentService.register(context);
  const storageService = new StorageService(context);
  const chatViewProvider = new ChatViewProvider(context.extensionUri, storageService);
  context.subscriptions.push(
    vscode3.window.registerWebviewViewProvider(
      ChatViewProvider.viewType,
      chatViewProvider,
      {
        webviewOptions: {
          retainContextWhenHidden: true
        }
      }
    )
  );
  const newChatCommand = vscode3.commands.registerCommand("ollamachat.newChat", async () => {
    await storageService.createSession("Yeni Sohbet");
    await vscode3.commands.executeCommand("ollamachat.chatView.focus");
  });
  const openSettingsCommand = vscode3.commands.registerCommand("ollamachat.openSettings", async () => {
    await vscode3.commands.executeCommand("ollamachat.chatView.focus");
  });
  context.subscriptions.push(newChatCommand, openSettingsCommand);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
