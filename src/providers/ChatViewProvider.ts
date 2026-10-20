import * as vscode from 'vscode';
import { OllamaService } from '../services/OllamaService';
import { StorageService } from '../services/StorageService';
import { AgentService } from '../services/AgentService';
import { GuardService } from '../services/GuardService';
import { WebSearchService } from '../services/WebSearchService';
import { ChatMessage, ChatSession, CustomModelConfig, ExtensionSettings, OllamaTagModel, TaskMode, WebSourceItem } from '../services/types';
import { getTranslation, resolveLanguage } from '../locales';

export class ChatViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'ollamachat.chatView';
    private _view?: vscode.WebviewView;
    private _abortControllers: Map<string, AbortController> = new Map();

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly _storageService: StorageService,
    ) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (data) => {
            await this._handleMessage(data);
        });
    }

    private async _handleMessage(data: any): Promise<void> {
        switch (data.type) {
            case 'ready': {
                await this._sendInitialData();
                break;
            }

            case 'getWorkspaceFiles': {
                const files = await AgentService.listFiles(300);
                this._postMessage({
                    type: 'workspaceFiles',
                    files,
                });
                break;
            }

            case 'sendMessage': {
                await this._handleSendMessage(data.sessionId, data.prompt, data.modelId, data.mode, data.webAccessEnabled);
                break;
            }

            case 'stopGeneration': {
                const controller = this._abortControllers.get(data.sessionId);
                if (controller) {
                    controller.abort();
                    this._abortControllers.delete(data.sessionId);
                }
                break;
            }

            case 'switchMode': {
                const session = this._storageService.getSession(data.sessionId);
                if (session) {
                    session.mode = data.mode;
                    await this._storageService.saveSession(session);
                }
                await this._storageService.setLastSelectedMode(data.mode);
                this._postMessage({
                    type: 'modeUpdated',
                    sessionId: data.sessionId,
                    mode: data.mode,
                });
                break;
            }

            case 'toggleWebAccess': {
                const isEnabled = !!data.enabled;
                await this._storageService.setLastSelectedWebAccess(isEnabled);
                const session = this._storageService.getSession(data.sessionId);
                if (session) {
                    session.webAccessEnabled = isEnabled;
                    await this._storageService.saveSession(session);
                }
                this._postMessage({
                    type: 'webAccessUpdated',
                    sessionId: data.sessionId,
                    enabled: isEnabled,
                });
                break;
            }

            case 'applyAgentAction': {
                try {
                    const { sessionId, messageId, actionId } = data;
                    const session = this._storageService.getSession(sessionId);
                    const msg = session?.messages.find(m => m.id === messageId);
                    const action = msg?.actions?.find(a => a.id === actionId);
                    if (action && session && msg) {
                        const settings = this._storageService.getSettings();
                        const installed = await this._getInstalledOllamaModels();
                        const audit = action.securityAudit || await GuardService.auditAction(action, settings, installed);
                        action.securityAudit = audit;

                        if (audit.blocked) {
                            this._postMessage({
                                type: 'toast',
                                message: `Savcı Engelledi: ${audit.reason}`,
                            });
                            this._postMessage({
                                type: 'agentActionUpdated',
                                sessionId,
                                messageId,
                                actionId,
                                status: 'rejected',
                                securityAudit: audit,
                            });
                            break;
                        }

                        if (action.type === 'write' && action.content !== undefined) {
                            const res = await AgentService.writeFile(action.path, action.content);
                            action.originalContent = res.originalContent;
                            action.wasCreated = res.wasCreated;
                            action.status = 'applied';
                        } else if (action.type === 'edit' && action.search && action.replace) {
                            const res = await AgentService.applySearchReplace(action.path, action.search, action.replace);
                            action.originalContent = res.originalContent;
                            action.wasCreated = false;
                            action.status = 'applied';
                        } else if (action.type === 'create_dir') {
                            await AgentService.createDirectory(action.path);
                            action.status = 'applied';
                        } else if (action.type === 'delete') {
                            await AgentService.deletePath(action.path);
                            action.status = 'applied';
                        } else if (action.type === 'move' && action.targetPath) {
                            await AgentService.movePath(action.path, action.targetPath);
                            action.status = 'applied';
                        } else if (action.type === 'read') {
                            action.output = await AgentService.readFile(action.path);
                            action.status = 'executed';
                        } else if (action.type === 'list_dir') {
                            const items = await AgentService.listDirectory(action.path === '.' ? '' : action.path);
                            action.output = items.map(i => `${i.isDirectory ? '📁' : '📄'} ${i.name}`).join('\n') || '(Boş dizin)';
                            action.status = 'executed';
                        } else if (action.type === 'find_files' && action.pattern) {
                            const files = await AgentService.findFiles(action.pattern);
                            action.output = files.map(f => `📄 ${f}`).join('\n') || '(Dosya bulunamadı)';
                            action.status = 'executed';
                        } else if (action.type === 'grep' && action.query) {
                            const matches = await AgentService.grepSearch(action.query, action.path === '.' ? '' : action.path, action.isRegex);
                            action.output = matches.map(m => `${m.file}:${m.line}: ${m.content}`).join('\n') || '(Eşleşme bulunamadı)';
                            action.status = 'executed';
                        } else if (action.type === 'command' && action.command) {
                            const res = await AgentService.executeCommand(action.command);
                            action.output = res.stdout + (res.stderr ? `\n[STDERR]\n${res.stderr}` : '');
                            action.status = res.exitCode === 0 ? 'executed' : 'failed';
                        }
                        await this._storageService.saveSession(session);
                        this._postMessage({
                            type: 'agentActionUpdated',
                            sessionId,
                            messageId,
                            actionId,
                            status: action.status,
                            securityAudit: audit,
                            originalContent: action.originalContent,
                            wasCreated: action.wasCreated,
                            output: action.output,
                        });
                        const msgTitle = action.type === 'command' ? action.command : action.path;
                        this._postMessage({ type: 'toast', message: `${msgTitle}: İşlem tamamlandı (${action.status}).` });
                    }
                } catch (err: any) {
                    this._postMessage({ type: 'toast', message: `Hata: ${err.message}` });
                }
                break;
            }

            case 'revertAgentAction': {
                try {
                    const { sessionId, messageId, actionId } = data;
                    const session = this._storageService.getSession(sessionId);
                    const msg = session?.messages.find(m => m.id === messageId);
                    const action = msg?.actions?.find(a => a.id === actionId);
                    if (action && session && msg) {
                        await AgentService.revertAction(action);
                        action.status = 'reverted';
                        await this._storageService.saveSession(session);
                        this._postMessage({
                            type: 'agentActionUpdated',
                            sessionId,
                            messageId,
                            actionId,
                            status: 'reverted',
                            securityAudit: action.securityAudit,
                        });
                        this._postMessage({ type: 'toast', message: `${action.path}: Değişiklik geri alındı.` });
                    }
                } catch (err: any) {
                    this._postMessage({ type: 'toast', message: `Geri alma hatası: ${err.message}` });
                }
                break;
            }

            case 'acceptAgentAction': {
                const { sessionId, messageId, actionId } = data;
                const session = this._storageService.getSession(sessionId);
                const msg = session?.messages.find(m => m.id === messageId);
                const action = msg?.actions?.find(a => a.id === actionId);
                if (action && session && msg) {
                    action.status = 'accepted';
                    await this._storageService.saveSession(session);
                    this._postMessage({
                        type: 'agentActionUpdated',
                        sessionId,
                        messageId,
                        actionId,
                        status: 'accepted',
                        securityAudit: action.securityAudit,
                    });
                    this._postMessage({ type: 'toast', message: `${action.path}: Değişiklik kalıcı yapıldı.` });
                }
                break;
            }

            case 'rejectAgentAction': {
                const { sessionId, messageId, actionId } = data;
                const session = this._storageService.getSession(sessionId);
                const msg = session?.messages.find(m => m.id === messageId);
                const action = msg?.actions?.find(a => a.id === actionId);
                if (action && session && msg) {
                    action.status = 'rejected';
                    await this._storageService.saveSession(session);
                    this._postMessage({
                        type: 'agentActionUpdated',
                        sessionId,
                        messageId,
                        actionId,
                        status: 'rejected',
                    });
                }
                break;
            }

            case 'viewAgentDiff': {
                try {
                    const { path, newContent, search, replace } = data;
                    let previewContent = newContent;
                    if (previewContent === undefined && search && replace) {
                        try {
                            const orig = await AgentService.readFile(path);
                            previewContent = orig.replace(search.trim(), replace);
                        } catch {
                            previewContent = replace;
                        }
                    }
                    if (previewContent !== undefined) {
                        await AgentService.showDiff(path, previewContent);
                    }
                } catch (err: any) {
                    this._postMessage({ type: 'toast', message: `Diff açılamadı: ${err.message}` });
                }
                break;
            }

            case 'createSession': {
                const chosenModel = data.modelId || this._storageService.getLastSelectedModelId();
                const chosenMode = data.mode || this._storageService.getLastSelectedMode();
                const draftSession = this._storageService.createDraftSession(data.title, chosenModel, chosenMode);
                this._postMessage({
                    type: 'newSessionDraft',
                    session: draftSession,
                });
                break;
            }

            case 'switchSession': {
                await this._storageService.setActiveSessionId(data.sessionId);
                const session = this._storageService.getSession(data.sessionId);
                if (session?.modelId) {
                    await this._storageService.setLastSelectedModelId(session.modelId);
                }
                this._postMessage({
                    type: 'sessionsUpdated',
                    sessions: this._storageService.getSessions(),
                    activeSessionId: data.sessionId,
                });
                break;
            }

            case 'openMessageBlackbox': {
                try {
                    const { sessionId, messageId } = data;
                    const session = this._storageService.getSession(sessionId);
                    const msg = session?.messages.find(m => m.id === messageId);
                    if (session && msg) {
                        const blackboxMd = this._buildBlackboxMarkdown(session, msg);
                        const doc = await vscode.workspace.openTextDocument({
                            content: blackboxMd,
                            language: 'markdown',
                        });
                        await vscode.window.showTextDocument(doc, { preview: true });
                    }
                } catch (err: any) {
                    this._postMessage({ type: 'toast', message: `Kara kutu açılamadı: ${err.message}` });
                }
                break;
            }

            case 'openWebSources': {
                try {
                    const { sessionId, messageId } = data;
                    const session = this._storageService.getSession(sessionId);
                    const msg = session?.messages.find(m => m.id === messageId);
                    if (session && msg && msg.webSources && msg.webSources.length > 0) {
                        const settings = this._storageService.getSettings();
                        const sourcesMd = WebSearchService.generateSourcesMarkdown(session, msg, settings);
                        const doc = await vscode.workspace.openTextDocument({
                            content: sourcesMd,
                            language: 'markdown',
                        });
                        await vscode.window.showTextDocument(doc, { preview: true });
                    } else {
                        this._postMessage({ type: 'toast', message: 'Bu yanıta ait web kaynağı bulunamadı.' });
                    }
                } catch (err: any) {
                    this._postMessage({ type: 'toast', message: `Kaynaklar açılamadı: ${err.message}` });
                }
                break;
            }

            case 'deleteSession': {
                await this._storageService.deleteSession(data.sessionId);
                this._postMessage({
                    type: 'sessionsUpdated',
                    sessions: this._storageService.getSessions(),
                    activeSessionId: this._storageService.getActiveSessionId(),
                });
                this._postMessage({ type: 'toast', message: 'Oturum silindi.' });
                break;
            }

            case 'renameSession': {
                const session = this._storageService.getSession(data.sessionId);
                if (session) {
                    session.title = data.newTitle;
                    await this._storageService.saveSession(session);
                    this._postMessage({
                        type: 'sessionsUpdated',
                        sessions: this._storageService.getSessions(),
                        activeSessionId: session.id,
                    });
                }
                break;
            }

            case 'exportSession': {
                const settings = this._storageService.getSettings();
                const resolvedLang = resolveLanguage(settings.language, vscode.env.language);
                await this._exportSession(data.sessionId, data.format, resolvedLang);
                break;
            }

            case 'selectModel': {
                await this._storageService.setLastSelectedModelId(data.modelId);
                const session = this._storageService.getSession(data.sessionId);
                if (session) {
                    session.modelId = data.modelId;
                    await this._storageService.saveSession(session);
                }
                break;
            }

            case 'saveSettings': {
                const updated = await this._storageService.saveSettings(data.settings);
                const resolvedLang = resolveLanguage(updated.language, vscode.env.language);
                this._postMessage({
                    type: 'settingsUpdated',
                    settings: updated,
                    language: resolvedLang,
                });
                break;
            }

            case 'saveCustomModel': {
                await this._storageService.saveCustomModel(data.model);
                const installed = await this._getInstalledOllamaModels();
                this._postMessage({
                    type: 'modelsUpdated',
                    models: this._storageService.getCustomModels(),
                    installedOllamaModels: installed,
                });
                this._postMessage({ type: 'toast', message: `"${data.model.name}" modeli kaydedildi.` });
                break;
            }

            case 'deleteCustomModel': {
                await this._storageService.deleteCustomModel(data.modelId);
                const installed = await this._getInstalledOllamaModels();
                this._postMessage({
                    type: 'modelsUpdated',
                    models: this._storageService.getCustomModels(),
                    installedOllamaModels: installed,
                });
                this._postMessage({ type: 'toast', message: 'Model silindi.' });
                break;
            }
        }
    }

    private async _sendInitialData(): Promise<void> {
        const settings = this._storageService.getSettings();
        let customModels = this._storageService.getCustomModels();
        const installedOllamaModels = await this._getInstalledOllamaModels();

        // If customModels is empty on initial setup, auto-populate from installed Ollama models
        if (customModels.length === 0 && installedOllamaModels.length > 0) {
            for (const om of installedOllamaModels) {
                await this._storageService.saveCustomModel({
                    id: om.name,
                    name: om.name,
                    baseModel: om.name,
                    numCtx: 4096,
                    temperature: 0.7,
                    isCustom: false,
                });
            }
            customModels = this._storageService.getCustomModels();
        }

        const lastSelectedModelId = this._storageService.getLastSelectedModelId();

        let sessions = this._storageService.getSessions();
        let activeSessionId = this._storageService.getActiveSessionId();

        if (sessions.length === 0) {
            const draftSession = this._storageService.createDraftSession('Yeni Sohbet', lastSelectedModelId);
            sessions = [draftSession];
            activeSessionId = draftSession.id;
        } else if (!activeSessionId || !sessions.some(s => s.id === activeSessionId)) {
            activeSessionId = sessions[0].id;
        }

        // Default username from environment
        const username = process.env.USER || process.env.USERNAME || 'Geliştirici';

        const resolvedLanguage = resolveLanguage(settings.language, vscode.env.language);
        const lastSelectedMode = this._storageService.getLastSelectedMode();
        const workspaceFiles = await AgentService.listFiles(300);

        this._postMessage({
            type: 'initData',
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
            workspaceFiles,
        });
    }

    private async _getInstalledOllamaModels(): Promise<OllamaTagModel[]> {
        const settings = this._storageService.getSettings();
        try {
            return await OllamaService.getInstalledModels(settings.ollamaUrl);
        } catch (err) {
            console.warn('Ollama modelleri yüklenemedi:', err);
            return [];
        }
    }

    private async _handleSendMessage(
        sessionId: string,
        prompt: string,
        modelId: string,
        mode?: TaskMode,
        clientWebAccess?: boolean,
    ): Promise<void> {
        let session = this._storageService.getSession(sessionId);
        const lastWeb = this._storageService.getLastSelectedWebAccess();
        const effectiveWebAccess = clientWebAccess !== undefined
            ? !!clientWebAccess
            : (session?.webAccessEnabled !== undefined ? !!session.webAccessEnabled : lastWeb);

        if (!session) {
            const chosenModel = modelId || this._storageService.getLastSelectedModelId();
            const chosenMode = mode || this._storageService.getLastSelectedMode();
            session = {
                id: sessionId || ('session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)),
                title: 'Yeni Sohbet',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                messages: [],
                modelId: chosenModel,
                mode: chosenMode,
                webAccessEnabled: effectiveWebAccess,
            };
            sessionId = session.id;
        } else {
            session.webAccessEnabled = effectiveWebAccess;
        }
        await this._storageService.setLastSelectedWebAccess(effectiveWebAccess);

        const currentMode: TaskMode = mode || session.mode || this._storageService.getLastSelectedMode() || 'chat';
        session.mode = currentMode;
        await this._storageService.setLastSelectedMode(currentMode);

        // Extract file mentions (@path, #path, @"path with spaces", #[path with spaces])
        const mentionRegex = /(?:^|\s)(?:@|#)(?:\[([^\]]+)\]|"([^"]+)"|'([^']+)'|([a-zA-Z0-9_\-./]+))/g;
        const mentionedPaths: string[] = [];
        let mentionMatch: RegExpExecArray | null;
        while ((mentionMatch = mentionRegex.exec(prompt)) !== null) {
            const rawPath = (mentionMatch[1] || mentionMatch[2] || mentionMatch[3] || mentionMatch[4] || '').trim();
            if (rawPath && !mentionedPaths.includes(rawPath)) {
                mentionedPaths.push(rawPath);
            }
        }

        const loadedFiles: { path: string; content: string }[] = [];
        for (const p of mentionedPaths) {
            try {
                const content = await AgentService.readFile(p);
                loadedFiles.push({ path: p, content });
            } catch {
                // Not a valid file or outside workspace, ignore
            }
        }

        // Add user message
        const userMsg: ChatMessage = {
            id: 'user_' + Date.now(),
            role: 'user',
            content: prompt,
            createdAt: Date.now(),
        };

        // If it was the first message and title is default, set title based on prompt
        if (session.messages.length === 0 && session.title === 'Yeni Sohbet') {
            session.title = prompt.slice(0, 30).trim() + (prompt.length > 30 ? '...' : '');
        }

        session.messages.push(userMsg);
        session.updatedAt = Date.now();
        session.modelId = modelId;
        await this._storageService.setLastSelectedModelId(modelId);

        // Save session now that it has a message
        await this._storageService.saveSession(session);
        await this._storageService.setActiveSessionId(session.id);
        this._postMessage({
            type: 'sessionsUpdated',
            sessions: this._storageService.getSessions(),
            activeSessionId: session.id,
        });

        const settings = this._storageService.getSettings();
        const customModels = this._storageService.getCustomModels();
        const customConfig = customModels.find(m => m.id === modelId);

        // Target model name in Ollama
        const actualModelName = customConfig ? customConfig.baseModel : modelId;
        let systemPrompt = customConfig?.systemPrompt || (settings.enableSystemPrompt !== false ? settings.defaultSystemPrompt : undefined);
        const webAccessEnabled = !!session.webAccessEnabled;

        const now = new Date();
        const dateOptions: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        const dateStr = now.toLocaleDateString('tr-TR', dateOptions);
        const currentYear = now.getFullYear();
        const temporalDirective = `[ZAMAN BİLGİSİ: Bugünün gerçek dünya tarihi ${dateStr}, mevcut yıl ${currentYear}. Model eğitim veri sınırın (cutoff) geçmişte olsa dahi, kullanıcının yıl, tarih, gün ve güncellik içeren sorularında bu reel zamanı (${currentYear}) esas alacaksın.]\n[TEMPORAL CONTEXT: Today is ${dateStr}, current year is ${currentYear}.]`;

        if (currentMode === 'agent') {
            const files = await AgentService.listFiles(80);
            systemPrompt = AgentService.getAgentSystemPrompt(systemPrompt, files, webAccessEnabled);
        }

        if (systemPrompt && systemPrompt.trim()) {
            systemPrompt = `${temporalDirective}\n\n${systemPrompt}`;
        } else {
            systemPrompt = temporalDirective;
        }

        const temperature = customConfig?.temperature;
        const numCtx = customConfig?.numCtx;

        let numPredict: number | undefined;
        if (customConfig?.numPredict !== undefined) {
            numPredict = customConfig.numPredict;
        } else if (settings.enableMaxTokens) {
            numPredict = Math.max(4096, settings.defaultMaxTokens || 4096);
        } else {
            numPredict = undefined; // Unlimited
        }

        const installed = await this._getInstalledOllamaModels();
        const matchingOllama = installed.find(m => m.name === actualModelName);
        const quantLevel = matchingOllama?.details?.quantization_level || '';
        session.modelQuantization = quantLevel;
        await this._storageService.saveSession(session);

        let activeWebSources: WebSourceItem[] = [];
        if (webAccessEnabled) {
            this._postMessage({
                type: 'webSearching',
                sessionId,
                searching: true,
            });
            try {
                activeWebSources = await WebSearchService.search(prompt, settings);
            } catch (err: any) {
                console.warn('Web search failed:', err);
            } finally {
                this._postMessage({
                    type: 'webSearching',
                    sessionId,
                    searching: false,
                });
            }
        }

        const abortController = new AbortController();
        this._abortControllers.set(sessionId, abortController);

        let streamAccumulated = '';

        const messagesForOllama = session.messages.map((m, idx) => {
            if (idx === session!.messages.length - 1) {
                let enhancedPrompt = m.content;
                if (loadedFiles.length > 0) {
                    const fileBlocks = loadedFiles.map(f =>
                        `=== TARGET FILE CONTENT: "${f.path}" ===\n${f.content}\n=== END OF FILE: "${f.path}" ===`
                    ).join('\n\n');

                    const modeDirective = currentMode === 'agent'
                        ? `[AGENT DIRECTIVE: The user has targeted the file(s) above for editing. Review the code carefully and output exact file actions using <edit_file path="${loadedFiles[0].path}"> or <write_file path="${loadedFiles[0].path}"> tags.]`
                        : `[CHAT DIRECTIVE: The user has provided the file(s) above for reference in CHAT mode. Analyze and discuss this code in your conversational response. DO NOT output file modification actions.]`;

                    enhancedPrompt = `${fileBlocks}\n\n${modeDirective}\n\nUser Question/Request:\n${m.content}`;
                }
                if (webAccessEnabled) {
                    if (activeWebSources.length > 0) {
                        const webContext = WebSearchService.formatSourcesForPrompt(activeWebSources, settings.webSearchDepth);
                        enhancedPrompt = `${webContext}\n\n=== KULLANICI SORUSU ===\n${enhancedPrompt}`;
                    } else {
                        enhancedPrompt = `[İNTERNET ERİŞİMİ AKTİF - ZAMAN BİLGİSİ: Bugünün tarihi ${dateStr}, mevcut yıl ${currentYear}.]\n\n${enhancedPrompt}`;
                    }
                }
                return {
                    role: m.role,
                    content: enhancedPrompt,
                };
            }
            return {
                role: m.role,
                content: m.content,
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
            onChunk: (chunk: string) => {
                streamAccumulated += chunk;
                this._postMessage({
                    type: 'streamChunk',
                    sessionId,
                    chunk,
                    fullText: streamAccumulated,
                });
            },
            onDone: async (stats, fullText) => {
                this._abortControllers.delete(sessionId);

                // Parse agent actions if in agent mode
                const actions = currentMode === 'agent' ? AgentService.parseAgentActions(fullText) : [];

                // Security audit every action using GuardService (Savcı)
                if (actions.length > 0) {
                    for (const act of actions) {
                        try {
                            const audit = await GuardService.auditAction(act, settings, installed);
                            act.securityAudit = audit;
                        } catch (err: any) {
                            console.warn('Prosecutor audit failed:', err);
                        }
                    }
                }

                // Auto-apply safe actions in Agent mode with rollback tracking
                for (const act of actions) {
                    // If blocked by prosecutor or security rules, NEVER auto-apply
                    if (act.securityAudit?.blocked) {
                        continue;
                    }

                    try {
                        if (act.type === 'write' && act.content !== undefined) {
                            const res = await AgentService.writeFile(act.path, act.content);
                            act.originalContent = res.originalContent;
                            act.wasCreated = res.wasCreated;
                            act.status = 'applied';
                        } else if (act.type === 'edit' && act.search && act.replace) {
                            const res = await AgentService.applySearchReplace(act.path, act.search, act.replace);
                            act.originalContent = res.originalContent;
                            act.wasCreated = false;
                            act.status = 'applied';
                        } else if (act.type === 'create_dir') {
                            await AgentService.createDirectory(act.path);
                            act.status = 'applied';
                        } else if (act.type === 'move' && act.targetPath) {
                            await AgentService.movePath(act.path, act.targetPath);
                            act.status = 'applied';
                        } else if (act.type === 'read') {
                            act.output = await AgentService.readFile(act.path);
                            act.status = 'executed';
                        } else if (act.type === 'list_dir') {
                            const items = await AgentService.listDirectory(act.path === '.' ? '' : act.path);
                            act.output = items.map(i => `${i.isDirectory ? '📁' : '📄'} ${i.name}`).join('\n') || '(Boş dizin)';
                            act.status = 'executed';
                        } else if (act.type === 'find_files' && act.pattern) {
                            const files = await AgentService.findFiles(act.pattern);
                            act.output = files.map(f => `📄 ${f}`).join('\n') || '(Dosya bulunamadı)';
                            act.status = 'executed';
                        } else if (act.type === 'grep' && act.query) {
                            const matches = await AgentService.grepSearch(act.query, act.path === '.' ? '' : act.path, act.isRegex);
                            act.output = matches.map(m => `${m.file}:${m.line}: ${m.content}`).join('\n') || '(Eşleşme bulunamadı)';
                            act.status = 'executed';
                        } else if (act.type === 'command' && act.command) {
                            const res = await AgentService.executeCommand(act.command);
                            act.output = res.stdout + (res.stderr ? `\n[STDERR]\n${res.stderr}` : '');
                            act.status = res.exitCode === 0 ? 'executed' : 'failed';
                        } else if (act.type === 'web_search' && act.query) {
                            try {
                                const searchSources = await WebSearchService.search(act.query, settings);
                                if (searchSources.length > 0) {
                                    for (const s of searchSources) {
                                        if (!activeWebSources.some(existing => existing.url === s.url)) {
                                            activeWebSources.push(s);
                                        }
                                    }
                                    act.output = searchSources.map(s => `[${s.title}](${s.url})\n${s.snippet}`).join('\n\n');
                                    act.status = 'executed';
                                } else {
                                    act.output = 'Arama sonucu bulunamadı.';
                                    act.status = 'executed';
                                }
                            } catch (err: any) {
                                act.output = `Web araması başarısız: ${err.message}`;
                                act.status = 'failed';
                            }
                        }
                    } catch (err: any) {
                        console.warn('Auto apply failed for action:', act, err);
                        act.status = 'failed';
                        act.output = `Hata: ${err.message}`;
                    }
                }

                const assistantMsg: ChatMessage = {
                    id: 'asst_' + Date.now(),
                    role: 'assistant',
                    content: fullText,
                    createdAt: Date.now(),
                    stats,
                    modelName: actualModelName,
                    modelQuantization: quantLevel,
                    actions: actions.length > 0 ? actions : undefined,
                    webSources: activeWebSources.length > 0 ? activeWebSources : undefined,
                };
                session!.messages.push(assistantMsg);
                session!.updatedAt = Date.now();
                await this._storageService.saveSession(session!);

                this._postMessage({
                    type: 'streamDone',
                    sessionId,
                    stats,
                    message: assistantMsg,
                });
            },
            onError: (err) => {
                this._abortControllers.delete(sessionId);
                this._postMessage({
                    type: 'streamError',
                    sessionId,
                    error: err.message,
                });
            },
        });
    }

    private async _exportSession(sessionId: string, format: 'markdown' | 'json', lang?: string): Promise<void> {
        const session = this._storageService.getSession(sessionId);
        if (!session) {
            return;
        }

        const content = format === 'markdown'
            ? this._storageService.exportSessionAsMarkdown(sessionId, lang)
            : this._storageService.exportSessionAsJson(sessionId);

        const doc = await vscode.workspace.openTextDocument({
            content,
            language: format === 'markdown' ? 'markdown' : 'json',
        });
        await vscode.window.showTextDocument(doc);
        const t = getTranslation(lang);
        this._postMessage({ type: 'toast', message: `${session.title} (${format.toUpperCase()}) ${t.common.copied.toLowerCase()}` });
    }

    private _buildBlackboxMarkdown(session: ChatSession, msg: ChatMessage): string {
        const stats = msg.stats;
        const totalDurationSec = ((stats?.totalDurationMs || 0) / 1000).toFixed(2);
        const tps = (stats?.tokensPerSecond || 0).toFixed(1);
        const evalTokens = stats?.evalCount || 0;
        const promptTokens = stats?.promptEvalCount || 0;
        const loadDurationMs = stats?.loadDurationMs || 0;
        const promptEvalDurationMs = stats?.promptEvalDurationMs || 0;
        const evalDurationMs = stats?.evalDurationMs || 0;
        const createdAtStr = new Date(msg.createdAt).toLocaleString();

        let actionsTable = '_(Herhangi bir araç veya eylem yürütülmedi)_';
        if (msg.actions && msg.actions.length > 0) {
            actionsTable = msg.actions.map((act, idx) => {
                const auditText = act.securityAudit
                    ? `Risk: **${act.securityAudit.risk.toUpperCase()}** | Güvenli: **${act.securityAudit.isSafe ? 'Evet' : 'Hayır'}**${act.securityAudit.blocked ? ' 🚫 **(ENGELLENDİ)**' : ''}\n> Gerekçe: ${act.securityAudit.reason}`
                    : 'Denetim bilgisi yok';

                const outputBlock = act.output
                    ? `\n**Sonuç / Çıktı:**\n\`\`\`\n${act.output}\n\`\`\``
                    : '';

                let detail = '';
                if (act.type === 'command') {
                    detail = `Komut: \`${act.command}\``;
                } else if (act.type === 'move') {
                    detail = `Kaynak: \`${act.path}\` ➜ Hedef: \`${act.targetPath}\``;
                } else if (act.type === 'grep') {
                    detail = `Sorgu: "${act.query}" (Dizin: \`${act.path}\`)`;
                } else if (act.type === 'find_files') {
                    detail = `Desen: "${act.pattern}"`;
                } else {
                    detail = `Hedef Dosya/Klasör: \`${act.path}\``;
                }

                return `### ${idx + 1}. [${act.type.toUpperCase()}] Durum: \`${act.status}\`
- **Ayrıntı:** ${detail}
- **Savcı Denetimi:**
> ${auditText}
${outputBlock}`;
            }).join('\n\n---\n\n');
        }

        return `# 📦 Yanıt Kara Kutusu (Black Box Log)

## ℹ️ Genel Bilgiler
- **Mesaj ID:** \`${msg.id}\`
- **Tarih & Saat:** ${createdAtStr}
- **Oturum Başlığı:** ${session.title}
- **Kullanılan Model:** \`${msg.modelName || 'Varsayılan'}\`
- **Kuantizasyon Düzeyi:** \`${msg.modelQuantization || '-'}\`
- **Görev Modu:** \`${session.mode || 'chat'}\`

---

## ⚡ Token ve Performans Metrikleri
| Metrik | Değer |
| :--- | :--- |
| **Üretim Hızı (Tokens/sec)** | \`${tps} tok/s\` |
| **Toplam Yanıt Süresi** | \`${totalDurationSec}s\` (\`${stats?.totalDurationMs || 0} ms\`) |
| **Üretilen Token Sayısı (eval_count)** | \`${evalTokens}\` |
| **Prompt Token Sayısı (prompt_eval_count)** | \`${promptTokens}\` |
| **Model Yükleme Süresi (load_duration)** | \`${loadDurationMs} ms\` |
| **Prompt Değerlendirme Süresi** | \`${promptEvalDurationMs} ms\` |
| **Üretim Değerlendirme Süresi** | \`${evalDurationMs} ms\` |

---

## 🛠️ Yürütülen Sistem Araçları ve Eylemler (Agent Actions)
${actionsTable}

---

## 📜 Ham Yanıt İçeriği (Raw Response Content)
\`\`\`markdown
${msg.content}
\`\`\`
`;
    }

    private _postMessage(message: unknown): void {
        this._view?.webview.postMessage(message);
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview.js'));
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview.css'));

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
        <button class="session-selector-btn" id="sessionSelectorBtn" title="Oturumları Listele">
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
            <span class="drag-drop-icon">📂</span>
            <span class="drag-drop-text" id="dragDropText">Dosyayı buraya bırakın (@dosya olarak hedefler)</span>
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
                placeholder="Bir soru sorun veya kod isteyin... (Enter ile gönder, Shift+Enter alt satır)"
            ></textarea>

            <!-- Row 3: Options Toolbar -->
            <div class="chat-input-toolbar">
                <div class="toolbar-left">
                    <button class="model-badge-btn" id="modelBadgeBtn">
                        <span class="model-badge-name" id="modelBadgeName">Model Seç</span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>

                    <button class="mode-badge-btn" id="modeBadgeBtn" title="Görev / Mod Seç">
                        <span class="mode-badge-icon" id="modeBadgeIcon">💬</span>
                        <span class="mode-badge-name" id="modeBadgeName">Chat</span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>

                    <button class="web-access-btn" id="webAccessBtn" title="İnternet Erişimi (Açık/Kapalı)">
                        <span class="web-access-icon">🌐</span>
                        <span class="web-access-label" id="webAccessLabel">Web</span>
                    </button>
                </div>

                <div class="toolbar-right" style="position: relative;">
                    <button class="token-stat-badge" id="tokenStatBadge">
                        <span>⚡ KVCache</span>
                    </button>

                    <!-- KVCache Popover Tooltip -->
                    <div class="kvcache-popover" id="kvCachePopover">
                        <div class="kvcache-popover-title">Bağlam & KV-Cache</div>
                        <div class="kvcache-detail-row">
                            <span>Model:</span>
                            <strong id="kvModelName">-</strong>
                        </div>
                        <div class="kvcache-detail-row">
                            <span>Context (num_ctx):</span>
                            <strong id="kvCtxSize">-</strong>
                        </div>
                        <div class="kvcache-detail-row">
                            <span>Sıcaklık:</span>
                            <strong id="kvTemperature">-</strong>
                        </div>
                        <div class="kvcache-detail-row">
                            <span>Son Yanıt Hızı:</span>
                            <strong id="kvSpeed">-</strong>
                        </div>
                    </div>

                    <button class="send-btn" id="sendBtn" title="Gönder (Enter)">
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
                <button class="icon-btn" id="closeSettingsBtn">✕</button>
            </div>
            <div class="modal-tabs">
                <button class="tab-btn active" data-tab="tabSessions">Oturumlar</button>
                <button class="tab-btn" data-tab="tabModels">Modeller</button>
                <button class="tab-btn" data-tab="tabSettings">Eklenti Ayarları</button>
            </div>
            <div class="modal-body">
                <!-- Tab 1: Oturumlar -->
                <div class="tab-pane active" id="tabSessions">
                    <p class="form-hint">Kayıtlı oturumları dışa aktarabilir veya silebilirsiniz.</p>
                    <div id="settingsSessionList" style="display: flex; flex-direction: column; gap: 6px;"></div>
                </div>

                <!-- Tab 2: Modeller -->
                <div class="tab-pane" id="tabModels">
                    <div style="display: flex; justify-content: space-between; align-items: center; position: relative;">
                        <span class="form-label">Tüm Modeller (Ollama & Özel)</span>
                        <div style="position: relative;">
                            <button class="btn-primary" id="addModelBtn">+ Ekle ▾</button>
                            <div class="dropdown-menu" id="addModelMenu" style="top: 32px; right: 0; left: auto; width: 170px;">
                                <div class="dropdown-item" id="importFromOllamaBtn">Ollama'dan aktar</div>
                                <div class="dropdown-item" id="createNewModelBtn">Kopya model oluştur</div>
                            </div>
                        </div>
                    </div>

                    <div id="settingsModelList" style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px;"></div>
                </div>

                <!-- Tab 3: Eklenti Ayarları -->
                <div class="tab-pane" id="tabSettings">
                    <div class="form-group">
                        <label class="form-label" id="settingLanguageLabel">Dil Seçimi / Language</label>
                        <select class="form-select" id="settingLanguage">
                            <option value="auto">Otomatik (VS Code Dili) / Auto</option>
                            <option value="en">English</option>
                            <option value="tr">Türkçe</option>
                        </select>
                        <span class="form-hint" id="settingLanguageHint">Arayüz dilini belirleyin veya VS Code diline otomatik eşitleyin.</span>
                    </div>

                    <div class="form-group">
                        <label class="form-label" id="settingOllamaUrlLabel">Ollama API URL</label>
                        <input class="form-input" id="settingOllamaUrl" placeholder="http://127.0.0.1:11434">
                        <span class="form-hint" id="settingOllamaUrlHint">Ollama yerel sunucu bağlantı noktası.</span>
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
                            <textarea class="form-textarea" id="settingDefaultPrompt" placeholder="Varsayılan asistan sistem promptu..."></textarea>
                            <span class="form-hint" id="settingPromptHint">Özel promptu bulunmayan tüm modeller için geçerli temel rol talimatları.</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="toggle-row">
                            <label class="form-label" id="settingTokensLabel" style="margin-bottom: 0;">Maksimum Token Sınırı (num_predict)</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="settingEnableTokensToggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div id="settingTokensContainer" class="setting-collapsible">
                            <input type="number" class="form-input" id="settingMaxTokens" value="4096" min="4096" step="512">
                            <span class="form-hint" id="settingTokensHint">Kapalıyken üretim sınırsızdır. Açıkken sınır minimum 4096 tokendir.</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="toggle-row">
                            <label class="form-label" id="settingAutoApplyLabel" style="margin-bottom: 0;">Agent Dosya Güncellemelerini Otomatik Uygula</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="settingAutoApplyToggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <span class="form-hint" id="settingAutoApplyHint">Etkinleştirildiğinde, Agent modunda dosya değişiklikleri onay beklemeden doğrudan kaydedilir.</span>
                    </div>

                    <!-- Granular Permissions -->
                    <div class="form-group" style="border-top: 1px solid var(--vscode-widget-border, #333); padding-top: 12px; margin-top: 12px;">
                        <label class="form-label" id="settingPermissionsTitle" style="font-weight: 600;">Otomatik İzinler (Agent Modu)</label>
                        
                        <div class="toggle-row" style="margin-top: 8px;">
                            <label class="form-label" id="settingAutoFileEditsLabel" style="margin-bottom: 0;">Mevcut Dosya Düzenlemelerine Otomatik İzin Ver</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="settingAutoFileEditsToggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <span class="form-hint" id="settingAutoFileEditsHint">Varolan dosyalardaki search/replace veya write işlemlerine izin verir.</span>

                        <div class="toggle-row" style="margin-top: 8px;">
                            <label class="form-label" id="settingAutoFileCreateLabel" style="margin-bottom: 0;">Yeni Dosya Oluşturmaya Otomatik İzin Ver</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="settingAutoFileCreateToggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <span class="form-hint" id="settingAutoFileCreateHint">Projeye yeni dosya eklenmesine otomatik onay verir.</span>

                        <div class="toggle-row" style="margin-top: 8px;">
                            <label class="form-label" id="settingAutoFolderCreateLabel" style="margin-bottom: 0;">Yeni Klasör Oluşturmaya Otomatik İzin Ver</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="settingAutoFolderCreateToggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <span class="form-hint" id="settingAutoFolderCreateHint">Yeni alt klasörler oluşturulmasına izin verir.</span>
                    </div>

                    <!-- Prosecutor (Savcı) Security Guard -->
                    <div class="form-group" style="border-top: 1px solid var(--vscode-widget-border, #333); padding-top: 12px; margin-top: 12px;">
                        <label class="form-label" id="settingProsecutorTitle" style="font-weight: 600;">Savcı Güvenlik Denetçisi (Guard Model)</label>
                        
                        <div class="toggle-row" style="margin-top: 8px;">
                            <label class="form-label" id="settingEnableProsecutorLabel" style="margin-bottom: 0;">Savcı Denetçisini Etkinleştir</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="settingEnableProsecutorToggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <span class="form-hint" id="settingEnableProsecutorHint">Yıkıcı komutları (rm -rf, sudo vb.) ve hassas dosya erişimlerini otomatik engeller.</span>

                        <div id="settingProsecutorContainer" class="setting-collapsible" style="margin-top: 8px;">
                            <label class="form-label" id="settingProsecutorModelLabel">Savcı Modeli (Hafif LLM / 1.5B)</label>
                            <select class="form-select" id="settingProsecutorModel">
                                <option value="auto">Otomatik (1.5B / En Hafif Model)</option>
                            </select>
                            <span class="form-hint" id="settingProsecutorModelHint">Her eylemi anında sorgulayıp onaylayan hafif Ollama modeli.</span>
                        </div>
                    </div>

                    <!-- Web Search Settings -->
                    <div class="form-group" style="border-top: 1px solid var(--vscode-widget-border, #333); padding-top: 12px; margin-top: 12px;">
                        <label class="form-label" id="settingWebSearchTitle" style="font-weight: 600;">Web Arama ve İnternet Erişimi Ayarları</label>

                        <div class="form-group" style="margin-top: 8px;">
                            <label class="form-label" id="settingWebEngineLabel">Arama Motoru</label>
                            <select class="form-select" id="settingWebEngine">
                                <option value="duckduckgo">DuckDuckGo</option>
                                <option value="searxng">SearXNG (Yerel/Açık)</option>
                            </select>
                        </div>

                        <div class="form-group" style="margin-top: 8px;">
                            <label class="form-label" id="settingWebDepthLabel">Arama ve Analiz Derinliği</label>
                            <select class="form-select" id="settingWebDepth">
                                <option value="fast">Hızlı (Yalnızca Arama Sonuç Başlıkları ve Özetleri)</option>
                                <option value="standard">Standart (Sayfa İçerikleri Analiz Edilir)</option>
                                <option value="deep">Derin (Her Sayfa Detaylı İncelenir ve Özetlenir)</option>
                            </select>
                        </div>

                        <div class="form-group" style="margin-top: 8px;">
                            <label class="form-label" id="settingWebMaxResultsLabel">Maksimum Kaynak Sayısı (1-10)</label>
                            <input type="number" class="form-input" id="settingWebMaxResults" min="1" max="10" value="5">
                        </div>

                        <div class="form-group" style="margin-top: 8px;">
                            <label class="form-label" id="settingWebBlacklistLabel">Kara Liste (Blacklist - Virgülle Ayrılmış Alan Adları)</label>
                            <input class="form-input" id="settingWebBlacklist" placeholder="ornek.com, spam-site.net">
                            <span class="form-hint" id="settingWebBlacklistHint">Bu alan adları arama sonuçlarından filtrelenir ve sayfalarına girilmez.</span>
                        </div>

                        <div class="form-group" style="margin-top: 8px;">
                            <label class="form-label" id="settingWebWhitelistLabel">Beyaz Liste (Whitelist - İsteğe Bağlı Alan Adları)</label>
                            <input class="form-input" id="settingWebWhitelist" placeholder="github.com, stackoverflow.com">
                            <span class="form-hint" id="settingWebWhitelistHint">Doldurulursa, sadece bu alan adlarındaki sonuçlar kullanılır.</span>
                        </div>
                    </div>

                    <div style="margin-top: 14px;">
                        <button class="btn-primary" id="saveSettingsBtn">Ayarları Kaydet</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Model Edit / Create Pop-up Modal -->
    <div class="modal-overlay" id="modelEditorModal">
        <div class="modal-card" style="max-height: 520px; max-width: 460px;">
            <div class="modal-header">
                <span class="modal-title" id="modelEditorTitle">Model Profili Düzenle</span>
                <button class="icon-btn" id="closeModelEditorBtn">✕</button>
            </div>
            <div class="modal-body" style="display: flex; flex-direction: column; gap: 12px;">
                <div class="form-group">
                    <label class="form-label" id="editorModelNameLabel">Görünen Ad</label>
                    <input class="form-input" id="editorModelName" placeholder="Örn: Qwen Kod Asistanı">
                </div>
                <div class="form-group">
                    <label class="form-label" id="editorBaseModelLabel">Taban Ollama Modeli</label>
                    <select class="form-select" id="editorBaseModel"></select>
                </div>
                <div class="form-group">
                    <label class="form-label" id="editorSystemPromptLabel">Özel Sistem Promptu</label>
                    <textarea class="form-textarea" id="editorSystemPrompt" placeholder="Bu modele özgü rol ve talimatlar..."></textarea>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div class="form-group">
                        <label class="form-label" id="editorNumCtxLabel">KV-Cache / Context (num_ctx)</label>
                        <input type="number" class="form-input" id="editorNumCtx" value="4096" step="1024">
                    </div>
                    <div class="form-group">
                        <label class="form-label" id="editorTemperatureLabel">Sıcaklık (Temperature)</label>
                        <input type="number" class="form-input" id="editorTemperature" value="0.7" step="0.1" min="0" max="2">
                    </div>
                </div>
                <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px;">
                    <button class="btn-secondary" id="cancelModelEditorBtn">İptal</button>
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
                <button class="icon-btn" id="closeOllamaImportBtn">✕</button>
            </div>
            <div class="modal-body">
                <p class="form-hint" id="ollamaImportModalHint" style="margin-bottom: 10px;">Cihazınızda kurulu Ollama modelleri listeleniyor. Direkt aktarabilir veya parametrelerini düzenleyebilirsiniz:</p>
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
}
