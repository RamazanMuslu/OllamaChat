import { AgentFileAction, ChatMessage, ChatSession, CustomModelConfig, ExtensionSettings, OllamaTagModel, TaskMode } from '../services/types';
import { getTranslation, resolveLanguage, SupportedLanguage, TranslationSchema } from '../locales';
import { renderMarkdown } from './markdown';

declare function acquireVsCodeApi(): {
    postMessage(message: unknown): void;
    getState(): unknown;
    setState(state: unknown): void;
};

const vscode = acquireVsCodeApi();

// Application State
let sessions: ChatSession[] = [];
let activeSessionId = '';
let models: CustomModelConfig[] = [];
let installedOllamaModels: OllamaTagModel[] = [];
let settings: ExtensionSettings = {
    ollamaUrl: 'http://127.0.0.1:11434',
    defaultSystemPrompt: '',
    defaultMaxTokens: 4096,
};
let username = 'Geliştirici';
let activeModelId = '';
let currentMode: TaskMode = 'chat';
let currentLang: SupportedLanguage = 'en';
let t: TranslationSchema = getTranslation('en');
let vscodeLanguage = '';
let isStreaming = false;
let lastPrompt = '';
let currentStreamingText = '';
let thinkingInterval: any = null;
let thinkingStartTime = 0;
let lastSpeedRecorded = 0;
let workspaceFiles: string[] = [];
let mentionSelectedIndex = 0;
let mentionCurrentMatches: string[] = [];
let mentionCurrentTrigger = '@';
let mentionMatchStart = 0;
let lastSelectedWebAccess = false;

// DOM Elements
const sessionTitleEl = document.getElementById('sessionTitle') as HTMLElement;
const sessionSelectorBtn = document.getElementById('sessionSelectorBtn') as HTMLButtonElement;
const newSessionBtn = document.getElementById('newSessionBtn') as HTMLButtonElement;
const sessionDropdown = document.getElementById('sessionDropdown') as HTMLElement;
const sessionSearchInput = document.getElementById('sessionSearchInput') as HTMLInputElement;
const sessionListEl = document.getElementById('sessionList') as HTMLElement;

const chatContainer = document.getElementById('chatContainer') as HTMLElement;
const chatTextarea = document.getElementById('chatTextarea') as HTMLTextAreaElement;
const sendBtn = document.getElementById('sendBtn') as HTMLButtonElement;
const settingsBtn = document.getElementById('settingsBtn') as HTMLButtonElement;
const modelBadgeBtn = document.getElementById('modelBadgeBtn') as HTMLButtonElement;
const modelBadgeName = document.getElementById('modelBadgeName') as HTMLElement;
const modeBadgeBtn = document.getElementById('modeBadgeBtn') as HTMLButtonElement;
const modeBadgeIcon = document.getElementById('modeBadgeIcon') as HTMLElement;
const modeBadgeName = document.getElementById('modeBadgeName') as HTMLElement;
const webAccessBtn = document.getElementById('webAccessBtn') as HTMLButtonElement | null;
const tokenStatBadge = document.getElementById('tokenStatBadge') as HTMLElement;
const kvCachePopover = document.getElementById('kvCachePopover') as HTMLElement;

const modelDropdown = document.getElementById('modelDropdown') as HTMLElement;
const modelSearchInput = document.getElementById('modelSearchInput') as HTMLInputElement;
const modelListEl = document.getElementById('modelList') as HTMLElement;

const modeDropdown = document.getElementById('modeDropdown') as HTMLElement;
 const modeListEl = document.getElementById('modeList') as HTMLElement;

const settingsModal = document.getElementById('settingsModal') as HTMLElement;
const closeSettingsBtn = document.getElementById('closeSettingsBtn') as HTMLButtonElement;
const toastEl = document.getElementById('toast') as HTMLElement;

const mentionAutocomplete = document.getElementById('mentionAutocomplete') as HTMLElement;
const dragDropOverlay = document.getElementById('dragDropOverlay') as HTMLElement;

// Model Editor Modal & Ollama Import Modal
const modelEditorModal = document.getElementById('modelEditorModal') as HTMLElement;
const closeModelEditorBtn = document.getElementById('closeModelEditorBtn') as HTMLButtonElement;
const cancelModelEditorBtn = document.getElementById('cancelModelEditorBtn') as HTMLButtonElement;
const saveModelEditorBtn = document.getElementById('saveModelEditorBtn') as HTMLButtonElement;

const ollamaImportModal = document.getElementById('ollamaImportModal') as HTMLElement;
const closeOllamaImportBtn = document.getElementById('closeOllamaImportBtn') as HTMLButtonElement;
const ollamaImportList = document.getElementById('ollamaImportList') as HTMLElement;

// Initialize
window.addEventListener('load', () => {
    vscode.postMessage({ type: 'ready' });
    setupEventListeners();
});

// Message Listener from Extension
window.addEventListener('message', (event) => {
    const data = event.data;
    switch (data.type) {
        case 'initData':
            sessions = data.sessions || [];
            activeSessionId = data.activeSessionId || (sessions[0]?.id || '');
            models = data.models || [];
            installedOllamaModels = data.installedOllamaModels || [];
            settings = data.settings || settings;
            username = data.username || username;
            workspaceFiles = data.workspaceFiles || [];
            if (data.vscodeLanguage) {
                vscodeLanguage = data.vscodeLanguage;
            }
            if (data.language) {
                currentLang = data.language;
                t = getTranslation(currentLang);
            }
            if (data.lastSelectedModelId && models.some(m => m.id === data.lastSelectedModelId)) {
                activeModelId = data.lastSelectedModelId;
            } else if (models[0]?.id) {
                activeModelId = models[0].id;
            } else if (installedOllamaModels[0]?.name) {
                activeModelId = installedOllamaModels[0].name;
            }

            // If active session is a draft (no messages yet) or has an invalid/removed model, sync it with activeModelId
            if (data.lastSelectedWebAccess !== undefined) {
                lastSelectedWebAccess = !!data.lastSelectedWebAccess;
            }
            const initActiveSession = getActiveSession();
            if (initActiveSession) {
                if (initActiveSession.messages.length === 0 || !models.some(m => m.id === initActiveSession.modelId)) {
                    initActiveSession.modelId = activeModelId;
                }
                if (initActiveSession.mode) {
                    currentMode = initActiveSession.mode;
                }
                if (initActiveSession.webAccessEnabled === undefined) {
                    initActiveSession.webAccessEnabled = lastSelectedWebAccess;
                }
            }
            if (data.lastSelectedMode && (!initActiveSession || !initActiveSession.mode)) {
                currentMode = data.lastSelectedMode;
            }

            applyStaticTranslations();
            renderAll();
            break;

        case 'workspaceFiles':
            workspaceFiles = data.files || [];
            break;

        case 'modeUpdated':
            if (data.sessionId === activeSessionId) {
                currentMode = data.mode;
                renderModeBadge();
                renderModeDropdown();
            }
            break;

        case 'webAccessUpdated':
            {
                lastSelectedWebAccess = !!data.enabled;
                const sess = sessions.find(s => s.id === data.sessionId);
                if (sess) {
                    sess.webAccessEnabled = data.enabled;
                }
                if (data.sessionId === activeSessionId) {
                    renderWebAccessBtn();
                }
            }
            break;

        case 'webSearching':
            {
                const thinkingTextEl = document.querySelector('#streamingMessageRow .thinking-text');
                if (thinkingTextEl) {
                    if (data.searching) {
                        thinkingTextEl.textContent = `🌐 ${t.chat.webSearching || 'İnternette araştırılıyor...'}`;
                    } else {
                        thinkingTextEl.textContent = t.chat.thinking;
                    }
                }
            }
            break;

        case 'agentActionUpdated': {
            const { sessionId, messageId, actionId, status, securityAudit, output } = data;
            const sess = sessions.find(s => s.id === sessionId);
            const msg = sess?.messages.find(m => m.id === messageId);
            const act = msg?.actions?.find(a => a.id === actionId);
            if (act) {
                act.status = status;
                if (securityAudit) {
                    act.securityAudit = securityAudit;
                }
                if (output !== undefined) {
                    act.output = output;
                }
                renderChat();
            }
            break;
        }

        case 'newSessionDraft':
            if (data.session) {
                activeSessionId = data.session.id;
                if (data.session.webAccessEnabled === undefined) {
                    data.session.webAccessEnabled = lastSelectedWebAccess;
                }
                sessions = sessions.filter(s => s.messages && s.messages.length > 0);
                sessions.unshift(data.session);
                if (data.session.mode) {
                    currentMode = data.session.mode;
                }
                renderHeader();
                renderChat();
                renderModelBadge();
                renderModeBadge();
                renderModeDropdown();
                renderWebAccessBtn();
                renderSessionsTab();
            }
            break;

        case 'sessionsUpdated':
            {
                const currentDraft = sessions.find(s => s.id === activeSessionId && (!s.messages || s.messages.length === 0));
                sessions = data.sessions || [];
                if (currentDraft && !sessions.some(s => s.id === currentDraft.id)) {
                    sessions.unshift(currentDraft);
                }
                if (data.activeSessionId) {
                    activeSessionId = data.activeSessionId;
                }
                const activeS = getActiveSession();
                if (activeS?.mode) {
                    currentMode = activeS.mode;
                }
                if (activeS && activeS.webAccessEnabled === undefined) {
                    activeS.webAccessEnabled = lastSelectedWebAccess;
                }
                renderHeader();
                renderChat();
                renderModeBadge();
                renderModeDropdown();
                renderWebAccessBtn();
                renderSessionsTab();
            }
            break;

        case 'modelsUpdated':
            models = data.models || [];
            installedOllamaModels = data.installedOllamaModels || [];
            renderModelBadge();
            renderModelDropdown();
            renderModelsTab();
            break;

        case 'settingsUpdated':
            settings = data.settings || settings;
            if (data.language) {
                currentLang = data.language;
                t = getTranslation(currentLang);
                applyStaticTranslations();
            }
            renderSettingsTab();
            showToast(t.settings.savedToast);
            break;

        case 'streamStart':
            if (data.sessionId) {
                activeSessionId = data.sessionId;
            }
            break;

        case 'streamChunk':
            if (data.sessionId) {
                activeSessionId = data.sessionId;
            }
            stopThinkingTimer();
            isStreaming = true;
            currentStreamingText = data.fullText;
            updateStreamingMessage(data.fullText);
            updateSendButtonState();
            break;

        case 'streamDone':
            if (data.sessionId) {
                activeSessionId = data.sessionId;
            }
            stopThinkingTimer();
            isStreaming = false;
            currentStreamingText = '';
            if (data.stats?.tokensPerSecond) {
                lastSpeedRecorded = data.stats.tokensPerSecond;
            }
            let activeSession = getActiveSession();
            if (!activeSession) {
                activeSession = sessions.find(s => s.id === activeSessionId);
            }
            if (activeSession && data.message) {
                const exists = activeSession.messages.some(m => m.id === data.message.id);
                if (!exists) {
                    activeSession.messages.push(data.message);
                }
            }
            renderChat();
            updateSendButtonState();
            updateKvCachePopover();
            break;

        case 'streamError':
            stopThinkingTimer();
            isStreaming = false;
            currentStreamingText = '';
            let currentSess = getActiveSession();
            if (currentSess) {
                currentSess.messages.push({
                    id: 'err_' + Date.now(),
                    role: 'assistant',
                    content: `❌ Hata: ${data.error}`,
                    createdAt: Date.now(),
                    error: true,
                });
            }
            renderChat();
            updateSendButtonState();
            break;

        case 'toast':
            showToast(data.message);
            break;
    }
});

function getActiveSession(): ChatSession | undefined {
    return sessions.find(s => s.id === activeSessionId);
}

function getActiveModelId(): string {
    const activeSession = getActiveSession();
    if (activeSession?.modelId && (models.length === 0 || models.some(m => m.id === activeSession.modelId))) {
        return activeSession.modelId;
    }
    if (activeModelId && (models.length === 0 || models.some(m => m.id === activeModelId))) {
        return activeModelId;
    }
    if (settings.defaultModelId && (models.length === 0 || models.some(m => m.id === settings.defaultModelId))) {
        return settings.defaultModelId;
    }
    if (models[0]?.id) {
        return models[0].id;
    }
    if (installedOllamaModels[0]?.name) {
        return installedOllamaModels[0].name;
    }
    return 'default';
}

function setLanguage(lang: SupportedLanguage): void {
    currentLang = lang;
    t = getTranslation(lang);
    applyStaticTranslations();
    renderAll();
    const langSelect = document.getElementById('settingLanguage') as HTMLSelectElement | null;
    if (langSelect) {
        langSelect.value = settings.language || 'auto';
    }
}

function applyStaticTranslations(): void {
    if (sessionSelectorBtn) {
        sessionSelectorBtn.title = t.header.listSessions;
    }
    if (newSessionBtn) {
        newSessionBtn.title = t.header.newSession;
    }
    if (sessionSearchInput) {
        sessionSearchInput.placeholder = t.dropdowns.searchSessions;
    }
    if (modelSearchInput) {
        modelSearchInput.placeholder = t.dropdowns.searchModels;
    }
    if (chatTextarea) {
        chatTextarea.placeholder = t.chat.inputPlaceholder;
    }
    if (settingsBtn) {
        settingsBtn.title = t.settings.title;
    }

    // Popover labels
    const popTitle = document.querySelector('#kvCachePopover .kvcache-popover-title');
    if (popTitle) {
        popTitle.textContent = t.kvCache.title;
    }
    const kvLabels = document.querySelectorAll('#kvCachePopover .kvcache-detail-row span');
    if (kvLabels[0]) {
        kvLabels[0].textContent = t.kvCache.model;
    }
    if (kvLabels[1]) {
        kvLabels[1].textContent = t.kvCache.context;
    }
    if (kvLabels[2]) {
        kvLabels[2].textContent = t.kvCache.temperature;
    }
    if (kvLabels[3]) {
        kvLabels[3].textContent = t.kvCache.lastSpeed;
    }

    // Settings modal
    const modalTitle = document.querySelector('#settingsModal .modal-title');
    if (modalTitle) {
        modalTitle.textContent = t.settings.title;
    }

    const tabs = document.querySelectorAll('#settingsModal .tab-btn');
    if (tabs[0]) {
        tabs[0].textContent = t.settings.tabSessions;
    }
    if (tabs[1]) {
        tabs[1].textContent = t.settings.tabModels;
    }
    if (tabs[2]) {
        tabs[2].textContent = t.settings.tabSettings;
    }

    const tabSessionsHint = document.querySelector('#tabSessions .form-hint');
    if (tabSessionsHint) {
        tabSessionsHint.textContent = t.sessions.hint;
    }

    const tabModelsLabel = document.querySelector('#tabModels .form-label');
    if (tabModelsLabel) {
        tabModelsLabel.textContent = t.models.title;
    }

    const addModelBtn = document.getElementById('addModelBtn');
    if (addModelBtn) {
        addModelBtn.textContent = t.models.addDropdown;
    }

    const importFromOllamaBtn = document.getElementById('importFromOllamaBtn');
    if (importFromOllamaBtn) {
        importFromOllamaBtn.textContent = t.models.importFromOllama;
    }

    const createNewModelBtn = document.getElementById('createNewModelBtn');
    if (createNewModelBtn) {
        createNewModelBtn.textContent = t.models.createCustom;
    }

    // Settings Tab Form
    const langLabel = document.getElementById('settingLanguageLabel');
    if (langLabel) {
        langLabel.textContent = t.settings.languageLabel;
    }
    const langHint = document.getElementById('settingLanguageHint');
    if (langHint) {
        langHint.textContent = t.settings.languageHint;
    }

    const langSelect = document.getElementById('settingLanguage') as HTMLSelectElement | null;
    if (langSelect && langSelect.options.length >= 3) {
        const currentVal = settings.language || langSelect.value || 'auto';
        langSelect.options[0].textContent = t.settings.langAuto;
        langSelect.options[1].textContent = t.settings.langEn;
        langSelect.options[2].textContent = t.settings.langTr;
        langSelect.value = currentVal;
    }

    const urlLabel = document.getElementById('settingOllamaUrlLabel');
    if (urlLabel) {
        urlLabel.textContent = t.settings.ollamaUrlLabel;
    }
    const urlHint = document.getElementById('settingOllamaUrlHint');
    if (urlHint) {
        urlHint.textContent = t.settings.ollamaUrlHint;
    }

    const promptLabel = document.getElementById('settingPromptLabel');
    if (promptLabel) {
        promptLabel.textContent = t.settings.systemPromptLabel;
    }
    const defaultPromptInput = document.getElementById('settingDefaultPrompt') as HTMLTextAreaElement | null;
    if (defaultPromptInput) {
        defaultPromptInput.placeholder = t.settings.systemPromptPlaceholder;
    }
    const promptHint = document.getElementById('settingPromptHint');
    if (promptHint) {
        promptHint.textContent = t.settings.systemPromptHint;
    }

    const tokensLabel = document.getElementById('settingTokensLabel');
    if (tokensLabel) {
        tokensLabel.textContent = t.settings.maxTokensLabel;
    }
    const tokensHint = document.getElementById('settingTokensHint');
    if (tokensHint) {
        tokensHint.textContent = t.settings.maxTokensHint;
    }

    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    if (saveSettingsBtn) {
        saveSettingsBtn.textContent = t.settings.saveSettings;
    }

    const autoApplyLabel = document.getElementById('settingAutoApplyLabel');
    if (autoApplyLabel) {
        autoApplyLabel.textContent = t.settings.autoApplyLabel;
    }
    const autoApplyHint = document.getElementById('settingAutoApplyHint');
    if (autoApplyHint) {
        autoApplyHint.textContent = t.settings.autoApplyHint;
    }

    // Granular Permissions
    const permTitle = document.getElementById('settingPermissionsTitle');
    if (permTitle) {
        permTitle.textContent = t.settings.autoPermissionsTitle;
    }
    const autoEditsLabel = document.getElementById('settingAutoFileEditsLabel');
    if (autoEditsLabel) {
        autoEditsLabel.textContent = t.settings.allowFileEdits;
    }
    const autoEditsHint = document.getElementById('settingAutoFileEditsHint');
    if (autoEditsHint) {
        autoEditsHint.textContent = t.settings.autoPermissionsHint;
    }
    const autoCreateLabel = document.getElementById('settingAutoFileCreateLabel');
    if (autoCreateLabel) {
        autoCreateLabel.textContent = t.settings.allowFileCreate;
    }
    const autoCreateHint = document.getElementById('settingAutoFileCreateHint');
    if (autoCreateHint) {
        autoCreateHint.textContent = t.settings.autoPermissionsHint;
    }
    const autoFolderLabel = document.getElementById('settingAutoFolderCreateLabel');
    if (autoFolderLabel) {
        autoFolderLabel.textContent = t.settings.allowFolderCreate;
    }
    const autoFolderHint = document.getElementById('settingAutoFolderCreateHint');
    if (autoFolderHint) {
        autoFolderHint.textContent = t.settings.autoPermissionsHint;
    }

    // Prosecutor
    const prosTitle = document.getElementById('settingProsecutorTitle');
    if (prosTitle) {
        prosTitle.textContent = t.settings.prosecutorTitle;
    }
    const prosEnableLabel = document.getElementById('settingEnableProsecutorLabel');
    if (prosEnableLabel) {
        prosEnableLabel.textContent = t.settings.prosecutorToggle;
    }
    const prosEnableHint = document.getElementById('settingEnableProsecutorHint');
    if (prosEnableHint) {
        prosEnableHint.textContent = t.settings.prosecutorHint;
    }
    const prosModelLabel = document.getElementById('settingProsecutorModelLabel');
    if (prosModelLabel) {
        prosModelLabel.textContent = t.settings.prosecutorModelLabel;
    }
    const prosModelHint = document.getElementById('settingProsecutorModelHint');
    if (prosModelHint) {
        prosModelHint.textContent = t.settings.prosecutorHint;
    }

    // Web Search Settings Translations
    const webSearchTitle = document.getElementById('settingWebSearchTitle');
    if (webSearchTitle) {
        webSearchTitle.textContent = t.settings.webSearchTitle;
    }
    const webEngineLabel = document.getElementById('settingWebEngineLabel');
    if (webEngineLabel) {
        webEngineLabel.textContent = t.settings.webEngineLabel;
    }
    const webDepthLabel = document.getElementById('settingWebDepthLabel');
    if (webDepthLabel) {
        webDepthLabel.textContent = t.settings.webDepthLabel;
    }
    const webDepthSelect = document.getElementById('settingWebDepth') as HTMLSelectElement | null;
    if (webDepthSelect && webDepthSelect.options.length >= 3) {
        webDepthSelect.options[0].textContent = t.settings.webDepthFast;
        webDepthSelect.options[1].textContent = t.settings.webDepthStandard;
        webDepthSelect.options[2].textContent = t.settings.webDepthDeep;
    }
    const webMaxResultsLabel = document.getElementById('settingWebMaxResultsLabel');
    if (webMaxResultsLabel) {
        webMaxResultsLabel.textContent = t.settings.webMaxResultsLabel;
    }
    const webBlacklistLabel = document.getElementById('settingWebBlacklistLabel');
    if (webBlacklistLabel) {
        webBlacklistLabel.textContent = t.settings.webBlacklistLabel;
    }
    const webBlacklistHint = document.getElementById('settingWebBlacklistHint');
    if (webBlacklistHint) {
        webBlacklistHint.textContent = t.settings.webBlacklistHint;
    }
    const webWhitelistLabel = document.getElementById('settingWebWhitelistLabel');
    if (webWhitelistLabel) {
        webWhitelistLabel.textContent = t.settings.webWhitelistLabel;
    }
    const webWhitelistHint = document.getElementById('settingWebWhitelistHint');
    if (webWhitelistHint) {
        webWhitelistHint.textContent = t.settings.webWhitelistHint;
    }
    const webAccessLabel = document.getElementById('webAccessLabel');
    if (webAccessLabel) {
        webAccessLabel.textContent = t.chat.webAccessBtn;
    }

    // Drag and Drop text
    const dragDropText = document.getElementById('dragDropText');
    if (dragDropText) {
        dragDropText.textContent = t.mode.dragDropHint;
    }

    // Model editor modal
    const editorNameLabel = document.getElementById('editorModelNameLabel');
    if (editorNameLabel) {
        editorNameLabel.textContent = t.models.nameLabel;
    }
    const editorNameInput = document.getElementById('editorModelName') as HTMLInputElement | null;
    if (editorNameInput) {
        editorNameInput.placeholder = t.models.namePlaceholder;
    }
    const editorBaseLabel = document.getElementById('editorBaseModelLabel');
    if (editorBaseLabel) {
        editorBaseLabel.textContent = t.models.baseModelLabel;
    }
    const editorPromptLabel = document.getElementById('editorSystemPromptLabel');
    if (editorPromptLabel) {
        editorPromptLabel.textContent = t.models.customPromptLabel;
    }
    const editorPromptInput = document.getElementById('editorSystemPrompt') as HTMLTextAreaElement | null;
    if (editorPromptInput) {
        editorPromptInput.placeholder = t.models.customPromptPlaceholder;
    }
    const editorCtxLabel = document.getElementById('editorNumCtxLabel');
    if (editorCtxLabel) {
        editorCtxLabel.textContent = t.models.numCtxLabel;
    }
    const editorTempLabel = document.getElementById('editorTemperatureLabel');
    if (editorTempLabel) {
        editorTempLabel.textContent = t.models.temperatureLabel;
    }
    const cancelModelEditorBtn = document.getElementById('cancelModelEditorBtn');
    if (cancelModelEditorBtn) {
        cancelModelEditorBtn.textContent = t.common.cancel;
    }
    const saveModelEditorBtn = document.getElementById('saveModelEditorBtn');
    if (saveModelEditorBtn) {
        saveModelEditorBtn.textContent = t.common.save;
    }
    const modelEditorTitle = document.getElementById('modelEditorTitle');
    if (modelEditorTitle) {
        const isEditing = modelEditorModal.hasAttribute('data-edit-id');
        modelEditorTitle.textContent = isEditing ? t.models.editorTitleEdit : t.models.editorTitleNew;
    }

    // Ollama import modal
    const importModalTitle = document.getElementById('ollamaImportModalTitle') || document.querySelector('#ollamaImportModal .modal-title');
    if (importModalTitle) {
        importModalTitle.textContent = t.models.importModalTitle;
    }
    const importModalHint = document.getElementById('ollamaImportModalHint') || document.querySelector('#ollamaImportModal .form-hint');
    if (importModalHint) {
        importModalHint.textContent = t.models.importModalHint;
    }

    renderModeBadge();
    renderModeDropdown();
    updateSendButtonState();
}

function renderAll(): void {
    renderHeader();
    renderChat();
    renderModelBadge();
    renderModelDropdown();
    renderModeBadge();
    renderModeDropdown();
    renderWebAccessBtn();
    renderSessionsTab();
    renderModelsTab();
    renderSettingsTab();
    updateSendButtonState();
    updateKvCachePopover();
}

function renderWebAccessBtn(): void {
    if (!webAccessBtn) {
        return;
    }
    const session = getActiveSession();
    const isEnabled = session?.webAccessEnabled !== undefined
        ? !!session.webAccessEnabled
        : lastSelectedWebAccess;
    if (isEnabled) {
        webAccessBtn.classList.add('active');
        webAccessBtn.title = `${t.chat.webAccessBtn}: Açık`;
    } else {
        webAccessBtn.classList.remove('active');
        webAccessBtn.title = `${t.chat.webAccessBtn}: Kapalı`;
    }
}

function renderModeBadge(): void {
    if (!modeBadgeBtn || !modeBadgeName || !modeBadgeIcon) {
        return;
    }
    if (currentMode === 'agent') {
        modeBadgeIcon.textContent = '🤖';
        modeBadgeName.textContent = t.mode.agent;
        modeBadgeBtn.classList.add('mode-agent');
        modeBadgeBtn.title = t.mode.agentDesc;
    } else {
        modeBadgeIcon.textContent = '💬';
        modeBadgeName.textContent = t.mode.chat;
        modeBadgeBtn.classList.remove('mode-agent');
        modeBadgeBtn.title = t.mode.chatDesc;
    }
}

function renderModeDropdown(): void {
    if (!modeListEl) {
        return;
    }
    modeListEl.innerHTML = `
        <div class="dropdown-item ${currentMode === 'chat' ? 'active' : ''}" data-mode="chat">
            <span style="font-size: 16px;">💬</span>
            <div class="dropdown-item-content">
                <div class="dropdown-item-title">${escapeHtml(t.mode.chat)}</div>
                <div class="dropdown-item-subtitle">${escapeHtml(t.mode.chatDesc)}</div>
            </div>
            ${currentMode === 'chat' ? '<span class="dropdown-item-check">✓</span>' : ''}
        </div>
        <div class="dropdown-item ${currentMode === 'agent' ? 'active' : ''}" data-mode="agent">
            <span style="font-size: 16px;">🤖</span>
            <div class="dropdown-item-content">
                <div class="dropdown-item-title">${escapeHtml(t.mode.agent)}</div>
                <div class="dropdown-item-subtitle">${escapeHtml(t.mode.agentDesc)}</div>
            </div>
            ${currentMode === 'agent' ? '<span class="dropdown-item-check">✓</span>' : ''}
        </div>
    `;

    modeListEl.querySelectorAll('.dropdown-item').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const mode = el.getAttribute('data-mode') as TaskMode;
            if (mode && mode !== currentMode) {
                currentMode = mode;
                const activeSess = getActiveSession();
                if (activeSess) {
                    activeSess.mode = mode;
                }
                vscode.postMessage({
                    type: 'switchMode',
                    sessionId: activeSessionId,
                    mode,
                });
                renderModeBadge();
                renderModeDropdown();
                modeDropdown?.classList.remove('active');
            }
        });
    });
}

function renderAgentActionCards(messageId: string, actions: AgentFileAction[]): string {
    return `
        <div class="agent-actions-container">
            ${actions.map(act => {
                const isApplied = act.status === 'applied';
                const isExecuted = act.status === 'executed';
                const isFailed = act.status === 'failed';
                const isReverted = act.status === 'reverted';
                const isAccepted = act.status === 'accepted';
                const isRejected = act.status === 'rejected';
                const isPending = act.status === 'pending';

                let statusBadge = '';
                let buttonsHtml = '';

                const isBlocked = act.securityAudit?.blocked;

                if (isApplied) {
                    statusBadge = `<span class="agent-status-badge status-applied">✓ ${escapeHtml(t.mode.autoAppliedBadge)}</span>`;
                    const showDiffBtn = act.type === 'write' || act.type === 'edit';
                    buttonsHtml = `
                        <div class="agent-card-buttons">
                            ${showDiffBtn ? `
                            <button class="agent-btn diff-btn" data-act-id="${act.id}" data-msg-id="${messageId}" title="${escapeHtml(t.mode.viewDiff)}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                <span>${escapeHtml(t.mode.viewDiff)}</span>
                            </button>` : ''}
                            <button class="agent-btn accept-btn" data-act-id="${act.id}" data-msg-id="${messageId}" title="${escapeHtml(t.mode.acceptToast)}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>${escapeHtml(t.mode.accept)}</span>
                            </button>
                            <button class="agent-btn revert-btn" data-act-id="${act.id}" data-msg-id="${messageId}" title="${escapeHtml(t.mode.revertToast)}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
                                <span>${escapeHtml(t.mode.revert)}</span>
                            </button>
                        </div>
                    `;
                } else if (isExecuted) {
                    statusBadge = `<span class="agent-status-badge status-applied">✓ ${escapeHtml(t.mode.executedBadge)}</span>`;
                } else if (isFailed) {
                    statusBadge = `<span class="agent-status-badge status-rejected">✕ ${escapeHtml(t.mode.failedBadge)}</span>`;
                } else if (isReverted) {
                    statusBadge = `<span class="agent-status-badge status-rejected">↶ ${escapeHtml(t.mode.reverted)}</span>`;
                    buttonsHtml = `
                        <div class="agent-card-buttons">
                            <button class="agent-btn apply-btn" data-act-id="${act.id}" data-msg-id="${messageId}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>${escapeHtml(t.mode.reapply)}</span>
                            </button>
                        </div>
                    `;
                } else if (isAccepted) {
                    statusBadge = `<span class="agent-status-badge status-applied">✓ ${escapeHtml(t.mode.accepted)}</span>`;
                } else if (isRejected) {
                    statusBadge = `<span class="agent-status-badge status-rejected">✕ ${escapeHtml(t.mode.rejected)}</span>`;
                } else if (isPending) {
                    const isBlocked = act.securityAudit?.blocked;
                    const applyAttr = isBlocked ? 'disabled style="opacity:0.35;cursor:not-allowed;" title="Savcı tarafından engellendi"' : '';
                    const showDiffBtn = act.type === 'write' || act.type === 'edit';
                    const btnLabel = act.type === 'command' ? t.mode.runCommand : t.mode.apply;

                    buttonsHtml = `
                        <div class="agent-card-buttons">
                            ${showDiffBtn ? `
                            <button class="agent-btn diff-btn" data-act-id="${act.id}" data-msg-id="${messageId}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                <span>${escapeHtml(t.mode.viewDiff)}</span>
                            </button>` : ''}
                            <button class="agent-btn apply-btn" data-act-id="${act.id}" data-msg-id="${messageId}" ${applyAttr}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>${escapeHtml(btnLabel)}</span>
                            </button>
                            <button class="agent-btn reject-btn" data-act-id="${act.id}" data-msg-id="${messageId}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                <span>${escapeHtml(t.mode.reject)}</span>
                            </button>
                        </div>
                    `;
                }

                let previewHtml = '';
                if (act.type === 'edit' && act.search && act.replace) {
                    previewHtml = `
                        <div class="agent-diff-preview">
                            <div class="diff-line diff-del"><pre><code>- ${escapeHtml(act.search.trim())}</code></pre></div>
                            <div class="diff-line diff-add"><pre><code>+ ${escapeHtml(act.replace.trim())}</code></pre></div>
                        </div>
                    `;
                } else if (act.type === 'write' && act.content) {
                    const previewLines = act.content.trim().split('\n').slice(0, 6).join('\n');
                    previewHtml = `
                        <div class="agent-write-preview">
                            <pre><code>${escapeHtml(previewLines)}</code></pre>
                        </div>
                    `;
                } else if (act.type === 'command' && act.command && !act.output) {
                    previewHtml = `
                        <div class="agent-write-preview">
                            <pre><code>$ ${escapeHtml(act.command)}</code></pre>
                        </div>
                    `;
                }

                let outputHtml = '';
                if (act.output) {
                    const previewOutput = act.output.trim().slice(0, 1500);
                    outputHtml = `
                        <div class="agent-output-preview">
                            <div class="agent-output-header">
                                <span class="agent-output-title">📄 ${escapeHtml(t.mode.toolOutputTitle)}</span>
                            </div>
                            <pre class="agent-output-code"><code>${escapeHtml(previewOutput)}</code></pre>
                        </div>
                    `;
                }

                let typeLabel = 'FILE';
                let fileTitle = act.path;
                let typeBadgeClass = 'badge-file';

                switch (act.type) {
                    case 'write':
                        typeLabel = 'WRITE';
                        fileTitle = `📄 ${act.path}`;
                        typeBadgeClass = 'badge-write';
                        break;
                    case 'edit':
                        typeLabel = 'EDIT';
                        fileTitle = `📝 ${act.path}`;
                        typeBadgeClass = 'badge-edit';
                        break;
                    case 'read':
                        typeLabel = 'READ';
                        fileTitle = `📖 ${act.path}`;
                        typeBadgeClass = 'badge-read';
                        break;
                    case 'create_dir':
                        typeLabel = 'FOLDER';
                        fileTitle = `📁 ${act.path}`;
                        typeBadgeClass = 'badge-folder';
                        break;
                    case 'delete':
                        typeLabel = 'DELETE';
                        fileTitle = `🗑️ ${act.path}`;
                        typeBadgeClass = 'badge-delete';
                        break;
                    case 'move':
                        typeLabel = 'MOVE';
                        fileTitle = `📦 ${act.path} ➜ ${act.targetPath}`;
                        typeBadgeClass = 'badge-move';
                        break;
                    case 'list_dir':
                        typeLabel = 'LIST';
                        fileTitle = `📂 ${act.path || '.'}`;
                        typeBadgeClass = 'badge-list';
                        break;
                    case 'find_files':
                        typeLabel = 'FIND';
                        fileTitle = `🔍 ${act.pattern || act.path}`;
                        typeBadgeClass = 'badge-find';
                        break;
                    case 'grep':
                        typeLabel = 'GREP';
                        fileTitle = `🔎 "${act.query}" (${act.path || '.'})`;
                        typeBadgeClass = 'badge-grep';
                        break;
                    case 'command':
                        typeLabel = 'CMD';
                        fileTitle = `⚡ ${act.command}`;
                        typeBadgeClass = 'badge-cmd';
                        break;
                }

                return `
                    <div class="agent-action-card ${act.status}">
                        <div class="agent-card-header">
                            <div class="agent-card-file">
                                <span class="agent-type-badge ${typeBadgeClass}">${typeLabel}</span>
                                <span class="agent-file-path" title="${escapeHtml(fileTitle)}">${escapeHtml(fileTitle)}</span>
                            </div>
                            <div class="agent-card-header-right">
                                ${statusBadge}
                                ${buttonsHtml}
                            </div>
                        </div>
                        ${previewHtml}
                        ${outputHtml}
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderHeader(): void {
    const activeSession = getActiveSession();
    if (activeSession && activeSession.title && activeSession.title !== 'Yeni Sohbet' && activeSession.title !== 'New Chat') {
        sessionTitleEl.textContent = activeSession.title;
    } else {
        sessionTitleEl.textContent = t.header.untitledSession;
    }
    renderWebAccessBtn();
}

function renderChat(): void {
    const activeSession = getActiveSession();
    chatContainer.innerHTML = '';

    if (!activeSession || activeSession.messages.length === 0) {
        // Welcome Screen
        const welcome = document.createElement('div');
        welcome.className = 'welcome-container';
        const greeting = currentLang === 'tr' ? `Hoş geldin, ${escapeHtml(username)}` : `Welcome, ${escapeHtml(username)}`;
        const subtitle = t.chat.emptySubtitle;
        const suggestions = currentLang === 'tr' ? [
            { label: '⚡ Kod optimizasyonu ve analizi', prompt: 'Bu fonksiyondaki zaman karmaşıklığını optimize et ve açıkla.' },
            { label: '🛠️ TypeScript mimarisi tasarla', prompt: 'TypeScript ile esnek ve tip güvenli bir state manager nasıl yazarım?' },
            { label: '🔍 Regex deseni oluştur ve açıkla', prompt: 'Regex deseni oluştur: geçerli e-posta ve uluslararası telefon numaralarını doğrula.' }
        ] : [
            { label: '⚡ Code optimization and analysis', prompt: 'Optimize the time complexity of this function and explain.' },
            { label: '🛠️ Design TypeScript architecture', prompt: 'How do I build a flexible and type-safe state manager in TypeScript?' },
            { label: '🔍 Generate and explain Regex pattern', prompt: 'Create a regex pattern to validate email addresses and international phone numbers.' }
        ];

        let cardsHtml = '';
        suggestions.forEach(s => {
            cardsHtml += `
                <div class="suggestion-card" data-prompt="${escapeHtml(s.prompt)}">
                    <span>${escapeHtml(s.label)}</span>
                </div>
            `;
        });

        welcome.innerHTML = `
            <div class="welcome-logo">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
                    <rect x="4" y="8" width="16" height="12" rx="2"></rect>
                    <path d="M9 13v2"></path>
                    <path d="M15 13v2"></path>
                </svg>
            </div>
            <h1 class="welcome-title">${greeting}</h1>
            <p class="welcome-subtitle">${subtitle}</p>
            <div class="prompt-suggestions">
                ${cardsHtml}
            </div>
        `;
        chatContainer.appendChild(welcome);

        welcome.querySelectorAll('.suggestion-card').forEach(card => {
            card.addEventListener('click', () => {
                const prompt = card.getAttribute('data-prompt');
                if (prompt) {
                    chatTextarea.value = prompt;
                    adjustTextareaHeight();
                    sendMessage();
                }
            });
        });
        return;
    }

    // Render Messages
    activeSession.messages.forEach(msg => {
        const row = createMessageRow(msg);
        chatContainer.appendChild(row);
    });

    scrollToBottom();
}

function createMessageRow(msg: ChatMessage): HTMLElement {
    const row = document.createElement('div');
    row.className = `message-row ${msg.role === 'user' ? 'user-row' : 'assistant-row'}${msg.error ? ' error-msg' : ''}`;
    row.id = `msg_${msg.id}`;

    const timeStr = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const senderName = msg.role === 'user' ? (currentLang === 'tr' ? 'Sen' : 'You') : (msg.modelName || getActiveModelId() || (currentLang === 'tr' ? 'Asistan' : 'Assistant'));

    let actionsHtml = '';

    if (msg.role === 'assistant' && !msg.error) {
        let statsPopoverHtml = '';
        if (msg.stats && (msg.stats.tokensPerSecond || msg.stats.totalDurationMs)) {
            const tps = (msg.stats.tokensPerSecond || 0).toFixed(1);
            const totalSec = ((msg.stats.totalDurationMs || 0) / 1000).toFixed(2);
            const evalTokens = msg.stats.evalCount || 0;
            const promptTokens = msg.stats.promptEvalCount || 0;

            const infoTitle = currentLang === 'tr' ? 'Cevap Bilgileri' : 'Response Info';
            const evalLabel = currentLang === 'tr' ? 'Üretilen Token:' : 'Eval Tokens:';
            const promptLabel = currentLang === 'tr' ? 'Prompt Token:' : 'Prompt Tokens:';

            statsPopoverHtml = `
                <div class="stats-btn-container">
                    <button class="action-btn">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        <span>${infoTitle}</span>
                    </button>
                    <div class="stats-popover">
                        <div class="stat-item"><span class="stat-label">${t.chat.speed}:</span> <span class="stat-value">${tps} ${t.chat.tokenPerSec}</span></div>
                        <div class="stat-item"><span class="stat-label">${t.chat.duration}:</span> <span class="stat-value">${totalSec}s</span></div>
                        <div class="stat-item"><span class="stat-label">${evalLabel}</span> <span class="stat-value">${evalTokens}</span></div>
                        <div class="stat-item"><span class="stat-label">${promptLabel}</span> <span class="stat-value">${promptTokens}</span></div>
                        ${msg.modelQuantization ? `<div class="stat-item"><span class="stat-label">${t.export.quantization}:</span> <span class="stat-value">${escapeHtml(msg.modelQuantization)}</span></div>` : ''}
                    </div>
                </div>
            `;
        }

        let securityPopoverHtml = '';
        const auditedActions = (msg.actions || []).filter(a => a.securityAudit);
        if (auditedActions.length > 0) {
            const hasBlocked = auditedActions.some(a => a.securityAudit?.blocked || a.securityAudit?.risk === 'high');
            const hasWarning = auditedActions.some(a => a.securityAudit?.risk === 'medium');

            let secClass = 'sec-safe';
            let secIcon = '🛡️';
            let secLabel = t.mode.prosecutorSafe;

            if (hasBlocked) {
                secClass = 'sec-blocked';
                secIcon = '🚫';
                secLabel = t.mode.prosecutorBlocked;
            } else if (hasWarning) {
                secClass = 'sec-warning';
                secIcon = '⚠️';
                secLabel = t.mode.prosecutorWarning;
            }

            const prosecutorModel = auditedActions[0].securityAudit?.prosecutorName || (currentLang === 'tr' ? '1.5B Savcı Modeli' : '1.5B Prosecutor Model');
            const inspectorTitle = currentLang === 'tr' ? 'Savcı Güvenlik Raporu' : 'Security Audit Report';

            securityPopoverHtml = `
                <div class="security-btn-container">
                    <button class="action-btn security-btn ${secClass}">
                        <span class="security-btn-icon">${secIcon}</span>
                        <span>${escapeHtml(secLabel)}</span>
                    </button>
                    <div class="security-popover">
                        <div class="security-popover-header">
                            <span class="security-popover-icon">${secIcon}</span>
                            <span class="security-popover-title">${escapeHtml(inspectorTitle)}</span>
                        </div>
                        <div class="security-popover-meta">
                            <span>${currentLang === 'tr' ? 'Denetçi Model' : 'Auditor'}: <strong>${escapeHtml(prosecutorModel)}</strong></span>
                        </div>
                        <div class="security-popover-items">
                            ${auditedActions.map(a => {
                                const aBlocked = a.securityAudit?.blocked || a.securityAudit?.risk === 'high';
                                const aWarning = a.securityAudit?.risk === 'medium';
                                const aIcon = aBlocked ? '🚫' : (aWarning ? '⚠️' : '✓');
                                const aStatusClass = aBlocked ? 'item-blocked' : (aWarning ? 'item-warning' : 'item-safe');
                                const targetLabel = a.type === 'command' ? (a.command || 'terminal') : a.path;
                                return `
                                    <div class="security-audit-item ${aStatusClass}">
                                        <div class="security-item-target">
                                            <span>${aIcon}</span>
                                            <code>${escapeHtml(targetLabel)}</code>
                                        </div>
                                        <div class="security-item-reason">${escapeHtml(a.securityAudit?.reason || '')}</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        ${hasBlocked ? `
                            <div class="security-blocked-notice">
                                ⚠️ ${currentLang === 'tr'
                                    ? 'Yıkıcı işlem riski nedeniyle otomatik çalıştırılmadı. Onayınız bekleniyor.'
                                    : 'Blocked from automatic execution due to safety risks. Awaiting your manual confirmation.'}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        const hasWebSources = msg.webSources && msg.webSources.length > 0;
        const sourcesBtnHtml = hasWebSources ? `
            <button class="action-btn sources-btn" data-msg-id="${msg.id}" data-session-id="${activeSessionId}" title="${escapeHtml(t.chat.sourcesTitle || 'Web Kaynaklarını Görüntüle')}">
                <span style="font-size: 11px;">🌐</span>
                <span>${escapeHtml(t.chat.sourcesBtn || 'Kaynaklar')}</span>
            </button>
        ` : '';

        actionsHtml = `
            <div class="message-actions">
                <button class="action-btn copy-msg-btn" data-content="${encodeURIComponent(msg.content)}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    <span>${t.common.copy}</span>
                </button>
                ${statsPopoverHtml}
                <button class="action-btn blackbox-btn" data-msg-id="${msg.id}" data-session-id="${activeSessionId}" title="${escapeHtml(t.mode.blackboxTitle)}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    <span>${escapeHtml(t.mode.blackboxBtn)}</span>
                </button>
                ${sourcesBtnHtml}
                ${securityPopoverHtml}
            </div>
        `;
    }

    let agentCardsHtml = '';
    if (msg.actions && msg.actions.length > 0) {
        agentCardsHtml = renderAgentActionCards(msg.id, msg.actions);
    }

    row.innerHTML = `
        <div class="message-header">
            <span class="message-sender">${escapeHtml(senderName)}</span>
            <span class="message-time">${timeStr}</span>
        </div>
        <div class="message-content">
            ${renderMarkdown(msg.content, false, t.common.copy, t.common.copy)}
            ${agentCardsHtml}
        </div>
        ${actionsHtml}
    `;

    row.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const actId = btn.getAttribute('data-act-id');
            const action = msg.actions?.find(a => a.id === actId);
            if (action) {
                vscode.postMessage({
                    type: 'viewAgentDiff',
                    path: action.path,
                    newContent: action.content,
                    search: action.search,
                    replace: action.replace,
                });
            }
        });
    });

    row.querySelectorAll('.apply-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const actId = btn.getAttribute('data-act-id');
            if (actId) {
                vscode.postMessage({
                    type: 'applyAgentAction',
                    sessionId: activeSessionId,
                    messageId: msg.id,
                    actionId: actId,
                });
            }
        });
    });

    row.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const actId = btn.getAttribute('data-act-id');
            if (actId) {
                vscode.postMessage({
                    type: 'rejectAgentAction',
                    sessionId: activeSessionId,
                    messageId: msg.id,
                    actionId: actId,
                });
            }
        });
    });

    row.querySelectorAll('.revert-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const actId = btn.getAttribute('data-act-id');
            if (actId) {
                vscode.postMessage({
                    type: 'revertAgentAction',
                    sessionId: activeSessionId,
                    messageId: msg.id,
                    actionId: actId,
                });
            }
        });
    });

    row.querySelectorAll('.accept-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const actId = btn.getAttribute('data-act-id');
            if (actId) {
                vscode.postMessage({
                    type: 'acceptAgentAction',
                    sessionId: activeSessionId,
                    messageId: msg.id,
                    actionId: actId,
                });
            }
        });
    });

    return row;
}

function startThinkingIndicator(): void {
    stopThinkingTimer();
    let streamingRow = document.getElementById('streamingMessageRow');
    if (!streamingRow) {
        streamingRow = document.createElement('div');
        streamingRow.id = 'streamingMessageRow';
        streamingRow.className = 'message-row assistant-row';
        chatContainer.appendChild(streamingRow);
    }

    thinkingStartTime = Date.now();
    const nowStr = currentLang === 'tr' ? 'şimdi' : 'now';
    streamingRow.innerHTML = `
        <div class="message-header">
            <span class="message-sender">${escapeHtml(getActiveModelId())}</span>
            <span class="message-time">${nowStr}</span>
        </div>
        <div class="message-content">
            <div class="thinking-placeholder">
                <span class="thinking-spinner"></span>
                <span class="thinking-text">${escapeHtml(t.chat.thinking)}</span>
                <span class="thinking-timer" id="thinkingTimer">0.0s</span>
            </div>
        </div>
    `;

    thinkingInterval = setInterval(() => {
        const timerEl = document.getElementById('thinkingTimer');
        if (timerEl) {
            const elapsed = ((Date.now() - thinkingStartTime) / 1000).toFixed(1);
            timerEl.textContent = `${elapsed}s`;
        }
    }, 100);

    scrollToBottom();
}

function stopThinkingTimer(): void {
    if (thinkingInterval) {
        clearInterval(thinkingInterval);
        thinkingInterval = null;
    }
}

function updateStreamingMessage(fullText: string): void {
    let streamingRow = document.getElementById('streamingMessageRow');
    const nowStr = currentLang === 'tr' ? 'şimdi' : 'now';
    if (!streamingRow) {
        streamingRow = document.createElement('div');
        streamingRow.id = 'streamingMessageRow';
        streamingRow.className = 'message-row assistant-row';
        streamingRow.innerHTML = `
            <div class="message-header">
                <span class="message-sender">${escapeHtml(getActiveModelId())}</span>
                <span class="message-time">${nowStr}</span>
            </div>
            <div class="message-content"></div>
        `;
        chatContainer.appendChild(streamingRow);
    }

    const contentEl = streamingRow.querySelector('.message-content') as HTMLElement;
    if (contentEl) {
        contentEl.innerHTML = renderMarkdown(fullText, true, t.common.copy, t.common.copy);
    }
    scrollToBottom();
}

function updateSendButtonState(): void {
    if (isStreaming) {
        sendBtn.classList.add('stop-btn');
        sendBtn.title = t.chat.stop;
        sendBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2"></rect>
            </svg>
        `;
    } else {
        sendBtn.classList.remove('stop-btn');
        sendBtn.title = t.chat.send;
        sendBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
        `;
    }
}

function renderModelBadge(): void {
    const currentModelId = getActiveModelId();
    modelBadgeName.textContent = currentModelId;
    modelBadgeBtn.title = `Model: ${currentModelId}`;

    const custom = models.find(m => m.id === currentModelId);
    if (custom?.numCtx) {
        tokenStatBadge.querySelector('span')!.textContent = `⚡ ${(custom.numCtx / 1024).toFixed(0)}k ctx`;
    } else {
        tokenStatBadge.querySelector('span')!.textContent = '⚡ KVCache';
    }
    updateKvCachePopover();
}

function updateKvCachePopover(): void {
    const currentModelId = getActiveModelId();
    const custom = models.find(m => m.id === currentModelId);
    const ollama = installedOllamaModels.find(m => m.name === (custom ? custom.baseModel : currentModelId));

    const kvModelEl = document.getElementById('kvModelName');
    const kvCtxEl = document.getElementById('kvCtxSize');
    const kvTempEl = document.getElementById('kvTemperature');
    const kvSpeedEl = document.getElementById('kvSpeed');

    if (kvModelEl) {
        kvModelEl.textContent = currentModelId;
    }
    if (kvCtxEl) {
        const ctx = custom?.numCtx || (ollama?.details?.parameter_size ? `4096 (${t.common.default.toLowerCase()})` : '4096');
        kvCtxEl.textContent = typeof ctx === 'number' ? `${ctx} ${t.chat.tokens}` : ctx;
    }
    if (kvTempEl) {
        kvTempEl.textContent = custom?.temperature !== undefined ? String(custom.temperature) : '0.7';
    }
    if (kvSpeedEl) {
        kvSpeedEl.textContent = lastSpeedRecorded > 0 ? `${lastSpeedRecorded.toFixed(1)} ${t.chat.tokenPerSec}` : '-';
    }
}

function renderModelDropdown(searchFilter = ''): void {
    modelListEl.innerHTML = '';
    const currentModelId = getActiveModelId();

    const allModels: Array<{ id: string; name: string; isCustom: boolean; quant?: string; param?: string }> = [];

    // Only show models configured in settings (or fallback if none configured yet)
    const sourceList = models.length > 0 ? models : installedOllamaModels.map(om => ({
        id: om.name,
        name: om.name,
        baseModel: om.name,
        isCustom: false,
    }));

    sourceList.forEach(m => {
        const baseName = m.baseModel || m.id;
        const matchingOllama = installedOllamaModels.find(om => om.name === baseName || om.name === m.id);
        allModels.push({
            id: m.id,
            name: m.name,
            isCustom: m.isCustom ?? false,
            quant: matchingOllama?.details?.quantization_level,
            param: matchingOllama?.details?.parameter_size,
        });
    });

    const filtered = allModels.filter(m => m.name.toLowerCase().includes(searchFilter.toLowerCase()));

    if (filtered.length === 0) {
        modelListEl.innerHTML = `<div style="padding: 8px; opacity: 0.6; font-size: 11px;">${escapeHtml(t.dropdowns.noModels)}</div>`;
        return;
    }

    filtered.forEach(m => {
        const item = document.createElement('div');
        item.className = `dropdown-item ${m.id === currentModelId ? 'selected' : ''}`;
        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 5px;">
                <span>${escapeHtml(m.name)}</span>
                ${m.param ? `<span class="model-tag-badge param">${escapeHtml(m.param)}</span>` : ''}
                ${m.quant ? `<span class="model-tag-badge quant">${escapeHtml(m.quant)}</span>` : ''}
                ${m.isCustom ? `<span class="model-tag-badge custom">${escapeHtml(t.dropdowns.customTag)}</span>` : ''}
            </div>
            ${m.id === currentModelId ? '<span>✓</span>' : ''}
        `;
        item.addEventListener('click', () => {
            selectModel(m.id);
            modelDropdown.classList.remove('active');
        });
        modelListEl.appendChild(item);
    });
}

function selectModel(modelId: string): void {
    activeModelId = modelId;
    const activeSession = getActiveSession();
    if (activeSession) {
        activeSession.modelId = modelId;
    }
    renderModelBadge();
    vscode.postMessage({
        type: 'selectModel',
        modelId,
        sessionId: activeSessionId,
    });
}

function renderSessionDropdown(searchFilter = ''): void {
    sessionListEl.innerHTML = '';
    const filtered = sessions.filter(s => s.messages && s.messages.length > 0 && s.title.toLowerCase().includes(searchFilter.toLowerCase()));

    if (filtered.length === 0) {
        sessionListEl.innerHTML = '<div style="padding: 8px; opacity: 0.6; font-size: 11px;">Oturum bulunamadı</div>';
        return;
    }

    filtered.forEach(s => {
        const item = document.createElement('div');
        item.className = `dropdown-item ${s.id === activeSessionId ? 'selected' : ''}`;
        const timeStr = new Date(s.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' });
        item.innerHTML = `
            <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 170px;">
                <span>${escapeHtml(s.title)}</span>
            </div>
            <span class="dropdown-item-meta">${timeStr} (${s.messages.length})</span>
        `;
        item.addEventListener('click', () => {
            switchSession(s.id);
            sessionDropdown.classList.remove('active');
        });
        sessionListEl.appendChild(item);
    });
}

function switchSession(sessionId: string): void {
    if (activeSessionId === sessionId) {
        return;
    }
    activeSessionId = sessionId;
    const session = getActiveSession();
    if (session?.modelId && (models.length === 0 || models.some(m => m.id === session.modelId))) {
        activeModelId = session.modelId;
    }
    renderHeader();
    renderChat();
    renderModelBadge();
    vscode.postMessage({ type: 'switchSession', sessionId });
}

function createNewSession(): void {
    // Retain current active model
    vscode.postMessage({
        type: 'createSession',
        modelId: getActiveModelId(),
        mode: currentMode,
    });
}

function sendMessage(): void {
    const text = chatTextarea.value.trim();
    if (!text || isStreaming) {
        return;
    }

    lastPrompt = text;
    chatTextarea.value = '';
    adjustTextareaHeight();

    const activeSession = getActiveSession();
    if (activeSession) {
        activeSession.messages.push({
            id: 'user_' + Date.now(),
            role: 'user',
            content: text,
            createdAt: Date.now(),
        });
    }

    isStreaming = true;
    renderChat();
    updateSendButtonState();
    startThinkingIndicator();

    const isWeb = activeSession?.webAccessEnabled !== undefined
        ? !!activeSession.webAccessEnabled
        : lastSelectedWebAccess;

    vscode.postMessage({
        type: 'sendMessage',
        sessionId: activeSessionId,
        prompt: text,
        modelId: getActiveModelId(),
        mode: currentMode,
        webAccessEnabled: isWeb,
    });
}

function stopGeneration(): void {
    if (!isStreaming) {
        return;
    }

    stopThinkingTimer();
    vscode.postMessage({
        type: 'stopGeneration',
        sessionId: activeSessionId,
    });

    isStreaming = false;
    // Restore prompt to textarea
    if (lastPrompt) {
        chatTextarea.value = lastPrompt;
        adjustTextareaHeight();
        chatTextarea.focus();
    }

    const streamingRow = document.getElementById('streamingMessageRow');
    if (streamingRow) {
        streamingRow.remove();
    }

    renderChat();
    updateSendButtonState();
    showToast('Üretim durduruldu, mesaj geri yüklendi.');
}

function adjustTextareaHeight(): void {
    chatTextarea.style.height = 'auto';
    const newHeight = Math.min(chatTextarea.scrollHeight, 115);
    chatTextarea.style.height = `${newHeight}px`;
}

function checkMentionAutocomplete(): void {
    if (!mentionAutocomplete) {
        return;
    }

    const val = chatTextarea.value;
    const cursorPos = chatTextarea.selectionStart;
    const beforeCursor = val.slice(0, cursorPos);

    // Look for @path or #path being typed at the cursor
    const match = /(?:^|\s)([@#])([a-zA-Z0-9_\-./]*)$/.exec(beforeCursor);
    if (!match) {
        hideMentionAutocomplete();
        return;
    }

    const trigger = match[1];
    const query = match[2].toLowerCase();
    mentionCurrentTrigger = trigger;
    mentionMatchStart = match.index + (match[0].startsWith(' ') ? 1 : 0);

    // Filter workspace files
    mentionCurrentMatches = workspaceFiles
        .filter(f => f.toLowerCase().includes(query))
        .slice(0, 15);

    if (mentionCurrentMatches.length === 0) {
        hideMentionAutocomplete();
        return;
    }

    mentionSelectedIndex = 0;
    renderMentionAutocomplete();
}

function renderMentionAutocomplete(): void {
    if (!mentionAutocomplete) {
        return;
    }

    mentionAutocomplete.innerHTML = mentionCurrentMatches.map((filePath, idx) => {
        const isSelected = idx === mentionSelectedIndex ? 'selected' : '';
        const icon = filePath.includes('/') ? '📄' : '📝';
        return `
            <div class="mention-item ${isSelected}" data-index="${idx}">
                <span class="mention-icon">${icon}</span>
                <span class="mention-path">${escapeHtml(filePath)}</span>
            </div>
        `;
    }).join('');

    mentionAutocomplete.classList.add('active');

    mentionAutocomplete.querySelectorAll('.mention-item').forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.getAttribute('data-index') || '0', 10);
            selectMention(idx);
        });
    });
}

function hideMentionAutocomplete(): void {
    if (mentionAutocomplete) {
        mentionAutocomplete.classList.remove('active');
        mentionAutocomplete.innerHTML = '';
    }
}

function selectMention(index: number): void {
    if (index < 0 || index >= mentionCurrentMatches.length) {
        return;
    }
    const selectedPath = mentionCurrentMatches[index];

    const val = chatTextarea.value;
    const cursorPos = chatTextarea.selectionStart;

    const before = val.slice(0, mentionMatchStart);
    const after = val.slice(cursorPos);

    const insertion = `${mentionCurrentTrigger}${selectedPath} `;
    chatTextarea.value = before + insertion + after;

    const newCursor = before.length + insertion.length;
    chatTextarea.setSelectionRange(newCursor, newCursor);
    hideMentionAutocomplete();
    adjustTextareaHeight();
    chatTextarea.focus();
}

function insertTextAtCursor(textarea: HTMLTextAreaElement, text: string): void {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = textarea.value;
    textarea.value = val.slice(0, start) + text + val.slice(end);
    const nextPos = start + text.length;
    textarea.setSelectionRange(nextPos, nextPos);
    adjustTextareaHeight();
}

function scrollToBottom(): void {
    setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 20);
}

// Settings Modal Management
function openSettingsModal(): void {
    settingsModal.classList.add('active');
    renderSessionsTab();
    renderModelsTab();
    renderSettingsTab();
}

function closeSettingsModal(): void {
    settingsModal.classList.remove('active');
}

function renderSessionsTab(searchFilter = ''): void {
    const listEl = document.getElementById('settingsSessionList') as HTMLElement;
    if (!listEl) {
        return;
    }

    listEl.innerHTML = '';
    const filtered = sessions.filter(s => s.messages && s.messages.length > 0 && s.title.toLowerCase().includes(searchFilter.toLowerCase()));

    if (filtered.length === 0) {
        listEl.innerHTML = `<div style="opacity: 0.6; font-size: 11px; padding: 8px;">${escapeHtml(t.dropdowns.noSessions)}</div>`;
        return;
    }

    filtered.forEach(s => {
        const item = document.createElement('div');
        item.className = 'settings-list-item';
        item.innerHTML = `
            <div>
                <strong>${escapeHtml(s.title)}</strong>
                <div style="font-size: 10px; opacity: 0.65;">
                    ${new Date(s.createdAt).toLocaleDateString()} • ${t.sessions.messagesCount(s.messages.length)} • ${escapeHtml(t.models.baseModelLabel)}: ${escapeHtml(s.modelId || t.common.default)}
                </div>
            </div>
            <div class="item-actions">
                <div class="export-btn-container">
                    <button class="action-btn export-toggle-btn" data-id="${s.id}">${escapeHtml(t.sessions.export)} ▾</button>
                    <div class="export-menu" id="exportMenu_${s.id}">
                        <div class="export-menu-item" data-action="export-md" data-id="${s.id}">📄 ${escapeHtml(t.sessions.exportMarkdown)}</div>
                        <div class="export-menu-item" data-action="export-json" data-id="${s.id}">📦 ${escapeHtml(t.sessions.exportJson)}</div>
                    </div>
                </div>
                <button class="btn-danger del-session-btn" data-id="${s.id}" title="${escapeHtml(t.common.delete)}">${escapeHtml(t.common.delete)}</button>
            </div>
        `;
        listEl.appendChild(item);
    });

    // Export dropdown toggles
    listEl.querySelectorAll('.export-toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            const menu = document.getElementById(`exportMenu_${id}`);
            document.querySelectorAll('.export-menu').forEach(m => {
                if (m !== menu) {
                    m.classList.remove('active');
                }
            });
            menu?.classList.toggle('active');
        });
    });

    // Export actions
    listEl.querySelectorAll('.export-menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = item.getAttribute('data-action');
            const id = item.getAttribute('data-id');
            if (id) {
                const format = action === 'export-md' ? 'markdown' : 'json';
                vscode.postMessage({ type: 'exportSession', sessionId: id, format });
            }
            document.querySelectorAll('.export-menu').forEach(m => m.classList.remove('active'));
        });
    });

    // Direct Delete Session without window.confirm
    listEl.querySelectorAll('.del-session-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            if (id) {
                vscode.postMessage({ type: 'deleteSession', sessionId: id });
            }
        });
    });
}

function renderModelsTab(): void {
    const listEl = document.getElementById('settingsModelList') as HTMLElement;
    if (!listEl) {
        return;
    }

    listEl.innerHTML = '';

    // 1. Configured / Active Models Section
    const activeTitle = document.createElement('div');
    activeTitle.style.cssText = 'font-size: 11px; opacity: 0.8; font-weight: 600; margin-top: 6px; display: flex; justify-content: space-between; align-items: center;';
    const activeHeading = currentLang === 'tr' ? 'SOHBETTE GÖRÜNEN MODELLERİNİZ' : 'YOUR ACTIVE CHAT MODELS';
    activeTitle.innerHTML = `<span>${activeHeading} (${models.length})</span>`;
    listEl.appendChild(activeTitle);

    if (models.length === 0) {
        const emptyEl = document.createElement('div');
        emptyEl.style.cssText = 'padding: 8px; font-size: 11px; opacity: 0.6;';
        emptyEl.textContent = currentLang === 'tr'
            ? 'Henüz model eklenmedi. Aşağıdaki Ollama modellerinden ekleyebilirsiniz.'
            : 'No models added yet. You can add from the Ollama models below.';
        listEl.appendChild(emptyEl);
    } else {
        models.forEach(m => {
            const item = document.createElement('div');
            item.className = 'settings-list-item';
            const baseName = m.baseModel || m.id;
            const matchingOllama = installedOllamaModels.find(om => om.name === baseName || om.name === m.id);
            const quant = matchingOllama?.details?.quantization_level || '';
            const param = matchingOllama?.details?.parameter_size || '';

            const baseLabel = currentLang === 'tr' ? 'Taban' : 'Base';
            const tempLabel = currentLang === 'tr' ? 'Sıcaklık' : 'Temp';

            item.innerHTML = `
                <div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <strong>${escapeHtml(m.name)}</strong>
                        ${param ? `<span class="model-tag-badge param">${escapeHtml(param)}</span>` : ''}
                        ${quant ? `<span class="model-tag-badge quant">${escapeHtml(quant)}</span>` : ''}
                        ${m.isCustom ? `<span class="model-tag-badge custom">${escapeHtml(t.dropdowns.customTag)}</span>` : ''}
                    </div>
                    <div style="font-size: 10px; opacity: 0.65; margin-top: 2px;">
                        ${baseLabel}: ${escapeHtml(m.baseModel || m.id)} | KV: ${m.numCtx || 4096} | ${tempLabel}: ${m.temperature ?? 0.7}
                    </div>
                </div>
                <div class="item-actions">
                    <button class="action-btn edit-model-btn" data-id="${m.id}">${escapeHtml(t.common.edit)}</button>
                    <button class="btn-danger del-model-btn" data-id="${m.id}" title="${escapeHtml(t.common.delete)}">${escapeHtml(t.common.delete)}</button>
                </div>
            `;
            listEl.appendChild(item);
        });
    }

    // 2. Installed Ollama Models Section
    const ollamaTitle = document.createElement('div');
    ollamaTitle.style.cssText = 'font-size: 11px; opacity: 0.8; font-weight: 600; margin-top: 14px;';
    ollamaTitle.textContent = currentLang === 'tr' ? "OLLAMA'DA KURULU DİĞER MODELLER" : 'OTHER INSTALLED OLLAMA MODELS';
    listEl.appendChild(ollamaTitle);

    const otherOllama = installedOllamaModels.filter(om => !models.some(m => m.id === om.name));

    if (otherOllama.length === 0) {
        const emptyEl = document.createElement('div');
        emptyEl.style.cssText = 'padding: 8px; font-size: 11px; opacity: 0.6;';
        emptyEl.textContent = installedOllamaModels.length > 0
            ? (currentLang === 'tr' ? 'Tüm yerel Ollama modelleriniz sohbet listenize ekli.' : 'All local Ollama models are added to your chat list.')
            : (currentLang === 'tr' ? 'Ollama servisi çalışmıyor veya model bulunamadı.' : 'Ollama service is not running or no models found.');
        listEl.appendChild(emptyEl);
    } else {
        otherOllama.forEach(m => {
            const item = document.createElement('div');
            item.className = 'settings-list-item';
            const quant = m.details?.quantization_level || '';
            const sizeGb = (m.size / (1024 * 1024 * 1024)).toFixed(1);
            const param = m.details?.parameter_size || '';

            const customizeLabel = currentLang === 'tr' ? 'Özelleştir' : 'Customize';

            item.innerHTML = `
                <div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <strong>${escapeHtml(m.name)}</strong>
                        ${param ? `<span class="model-tag-badge param">${escapeHtml(param)}</span>` : ''}
                        ${quant ? `<span class="model-tag-badge quant">${escapeHtml(quant)}</span>` : ''}
                    </div>
                    <div style="font-size: 10px; opacity: 0.65; margin-top: 2px;">
                        ${sizeGb} GB
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn-primary add-ollama-btn" data-name="${m.name}">${escapeHtml(t.common.add)}</button>
                    <button class="action-btn clone-ollama-btn" data-name="${m.name}">${escapeHtml(customizeLabel)}</button>
                </div>
            `;
            listEl.appendChild(item);
        });
    }

    // Event handlers for Model Tab
    listEl.querySelectorAll('.edit-model-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const model = models.find(m => m.id === id);
            if (model) {
                openModelEditor(model);
            }
        });
    });

    listEl.querySelectorAll('.add-ollama-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            if (name) {
                vscode.postMessage({
                    type: 'saveCustomModel',
                    model: {
                        id: name,
                        name: name,
                        baseModel: name,
                        numCtx: 4096,
                        temperature: 0.7,
                        isCustom: false,
                    },
                });
            }
        });
    });

    listEl.querySelectorAll('.clone-ollama-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            if (name) {
                openModelEditor({
                    id: name + '-custom',
                    name: `${name} (${t.dropdowns.customTag})`,
                    baseModel: name,
                    numCtx: 4096,
                    temperature: 0.7,
                    isCustom: true,
                });
            }
        });
    });

    listEl.querySelectorAll('.del-model-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            if (id) {
                vscode.postMessage({ type: 'deleteCustomModel', modelId: id });
            }
        });
    });
}

function renderSettingsTab(): void {
    const langSelect = document.getElementById('settingLanguage') as HTMLSelectElement | null;
    const urlInput = document.getElementById('settingOllamaUrl') as HTMLInputElement | null;
    const promptToggle = document.getElementById('settingEnablePromptToggle') as HTMLInputElement | null;
    const promptContainer = document.getElementById('settingPromptContainer') as HTMLElement | null;
    const promptInput = document.getElementById('settingDefaultPrompt') as HTMLTextAreaElement | null;
    const tokensToggle = document.getElementById('settingEnableTokensToggle') as HTMLInputElement | null;
    const tokensContainer = document.getElementById('settingTokensContainer') as HTMLElement | null;
    const maxTokensInput = document.getElementById('settingMaxTokens') as HTMLInputElement | null;

    if (langSelect) {
        langSelect.value = settings.language || 'auto';
    }
    if (urlInput) {
        urlInput.value = settings.ollamaUrl || 'http://127.0.0.1:11434';
    }
    if (promptToggle) {
        promptToggle.checked = settings.enableSystemPrompt !== false;
        if (promptContainer) {
            promptContainer.classList.toggle('hidden', !promptToggle.checked);
        }
    }
    if (promptInput) {
        promptInput.value = settings.defaultSystemPrompt || '';
    }
    if (tokensToggle) {
        tokensToggle.checked = !!settings.enableMaxTokens;
        if (tokensContainer) {
            tokensContainer.classList.toggle('hidden', !tokensToggle.checked);
        }
    }
    if (maxTokensInput) {
        maxTokensInput.value = String(settings.defaultMaxTokens && settings.defaultMaxTokens >= 4096 ? settings.defaultMaxTokens : 4096);
    }
    const autoApplyToggle = document.getElementById('settingAutoApplyToggle') as HTMLInputElement | null;
    if (autoApplyToggle) {
        autoApplyToggle.checked = !!settings.autoApplyAgentEdits;
    }

    const autoFileEditsToggle = document.getElementById('settingAutoFileEditsToggle') as HTMLInputElement | null;
    if (autoFileEditsToggle) {
        autoFileEditsToggle.checked = !!settings.autoAllowFileEdits;
    }
    const autoFileCreateToggle = document.getElementById('settingAutoFileCreateToggle') as HTMLInputElement | null;
    if (autoFileCreateToggle) {
        autoFileCreateToggle.checked = !!settings.autoAllowFileCreate;
    }
    const autoFolderCreateToggle = document.getElementById('settingAutoFolderCreateToggle') as HTMLInputElement | null;
    if (autoFolderCreateToggle) {
        autoFolderCreateToggle.checked = !!settings.autoAllowFolderCreate;
    }

    const enableProsecutorToggle = document.getElementById('settingEnableProsecutorToggle') as HTMLInputElement | null;
    const prosecutorContainer = document.getElementById('settingProsecutorContainer') as HTMLElement | null;
    const prosecutorSelect = document.getElementById('settingProsecutorModel') as HTMLSelectElement | null;

    if (enableProsecutorToggle) {
        enableProsecutorToggle.checked = settings.enableProsecutor !== false;
        if (prosecutorContainer) {
            prosecutorContainer.classList.toggle('hidden', !enableProsecutorToggle.checked);
        }
    }

    if (prosecutorSelect) {
        const autoLabel = t.settings.prosecutorAuto;
        prosecutorSelect.innerHTML = `<option value="auto">${escapeHtml(autoLabel)}</option>`;
        installedOllamaModels.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.name;
            opt.textContent = m.name;
            prosecutorSelect.appendChild(opt);
        });
        prosecutorSelect.value = settings.prosecutorModelId || 'auto';
    }

    const webEngineSelect = document.getElementById('settingWebEngine') as HTMLSelectElement | null;
    const webDepthSelect = document.getElementById('settingWebDepth') as HTMLSelectElement | null;
    const webMaxResultsInput = document.getElementById('settingWebMaxResults') as HTMLInputElement | null;
    const webBlacklistInput = document.getElementById('settingWebBlacklist') as HTMLInputElement | null;
    const webWhitelistInput = document.getElementById('settingWebWhitelist') as HTMLInputElement | null;

    if (webEngineSelect) {
        webEngineSelect.value = settings.webSearchEngine || 'duckduckgo';
    }
    if (webDepthSelect) {
        webDepthSelect.value = settings.webSearchDepth || 'standard';
    }
    if (webMaxResultsInput) {
        webMaxResultsInput.value = String(settings.webSearchMaxResults || 5);
    }
    if (webBlacklistInput) {
        webBlacklistInput.value = settings.webSearchBlacklist || '';
    }
    if (webWhitelistInput) {
        webWhitelistInput.value = settings.webSearchWhitelist || '';
    }
}

// Pop-up Model Editor
function openModelEditor(existing?: CustomModelConfig): void {
    const titleEl = document.getElementById('modelEditorTitle') as HTMLElement;
    const nameInput = document.getElementById('editorModelName') as HTMLInputElement;
    const baseSelect = document.getElementById('editorBaseModel') as HTMLSelectElement;
    const promptInput = document.getElementById('editorSystemPrompt') as HTMLTextAreaElement;
    const ctxInput = document.getElementById('editorNumCtx') as HTMLInputElement;
    const tempInput = document.getElementById('editorTemperature') as HTMLInputElement;

    // Refresh labels and placeholders in model editor modal
    const nameLabel = document.getElementById('editorModelNameLabel');
    if (nameLabel) {
        nameLabel.textContent = t.models.nameLabel;
    }
    if (nameInput) {
        nameInput.placeholder = t.models.namePlaceholder;
    }
    const baseModelLabel = document.getElementById('editorBaseModelLabel');
    if (baseModelLabel) {
        baseModelLabel.textContent = t.models.baseModelLabel;
    }
    const promptLabel = document.getElementById('editorSystemPromptLabel');
    if (promptLabel) {
        promptLabel.textContent = t.models.customPromptLabel;
    }
    if (promptInput) {
        promptInput.placeholder = t.models.customPromptPlaceholder;
    }
    const numCtxLabel = document.getElementById('editorNumCtxLabel');
    if (numCtxLabel) {
        numCtxLabel.textContent = t.models.numCtxLabel;
    }
    const tempLabel = document.getElementById('editorTemperatureLabel');
    if (tempLabel) {
        tempLabel.textContent = t.models.temperatureLabel;
    }
    const cancelBtn = document.getElementById('cancelModelEditorBtn');
    if (cancelBtn) {
        cancelBtn.textContent = t.common.cancel;
    }
    const saveBtn = document.getElementById('saveModelEditorBtn');
    if (saveBtn) {
        saveBtn.textContent = t.common.save;
    }

    // Populate base models
    baseSelect.innerHTML = '';
    installedOllamaModels.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.name;
        opt.textContent = m.name;
        baseSelect.appendChild(opt);
    });

    if (existing) {
        titleEl.textContent = t.models.editorTitleEdit;
        modelEditorModal.setAttribute('data-edit-id', existing.id);
        nameInput.value = existing.name;
        baseSelect.value = existing.baseModel || existing.id;
        promptInput.value = existing.systemPrompt || '';
        ctxInput.value = String(existing.numCtx || 4096);
        tempInput.value = String(existing.temperature ?? 0.7);
    } else {
        titleEl.textContent = t.models.editorTitleNew;
        modelEditorModal.removeAttribute('data-edit-id');
        nameInput.value = '';
        promptInput.value = '';
        ctxInput.value = '4096';
        tempInput.value = '0.7';
    }

    modelEditorModal.classList.add('active');
    nameInput.focus();
}

function closeModelEditor(): void {
    modelEditorModal.classList.remove('active');
}

// Pop-up Ollama Import Modal
function openOllamaImportModal(): void {
    ollamaImportList.innerHTML = '';

    if (installedOllamaModels.length === 0) {
        ollamaImportList.innerHTML = `<div style="padding: 12px; opacity: 0.6; font-size: 12px;">${escapeHtml(t.models.noOllamaModels)}</div>`;
        ollamaImportModal.classList.add('active');
        return;
    }

    installedOllamaModels.forEach(m => {
        const item = document.createElement('div');
        item.className = 'settings-list-item';
        const quant = m.details?.quantization_level || '';
        const sizeGb = (m.size / (1024 * 1024 * 1024)).toFixed(1);
        const param = m.details?.parameter_size || '';

        const editImportLabel = currentLang === 'tr' ? 'Düzenleyip Aktar' : 'Customize & Import';

        item.innerHTML = `
            <div>
                <div style="display: flex; align-items: center; gap: 5px;">
                    <strong>${escapeHtml(m.name)}</strong>
                    ${param ? `<span class="model-tag-badge param">${escapeHtml(param)}</span>` : ''}
                    ${quant ? `<span class="model-tag-badge quant">${escapeHtml(quant)}</span>` : ''}
                </div>
                <div style="font-size: 10px; opacity: 0.65; margin-top: 2px;">
                    ${sizeGb} GB
                </div>
            </div>
            <div class="item-actions">
                <button class="btn-primary import-direct-btn" data-name="${m.name}">${escapeHtml(t.models.importBtn)}</button>
                <button class="action-btn import-edit-btn" data-name="${m.name}">${escapeHtml(editImportLabel)}</button>
            </div>
        `;
        ollamaImportList.appendChild(item);
    });

    ollamaImportList.querySelectorAll('.import-direct-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            if (name) {
                vscode.postMessage({
                    type: 'saveCustomModel',
                    model: {
                        id: name,
                        name: name,
                        baseModel: name,
                        numCtx: 4096,
                        temperature: 0.7,
                        isCustom: false,
                    },
                });
                ollamaImportModal.classList.remove('active');
            }
        });
    });

    ollamaImportList.querySelectorAll('.import-edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            if (name) {
                ollamaImportModal.classList.remove('active');
                openModelEditor({
                    id: name + '-custom',
                    name: name,
                    baseModel: name,
                    numCtx: 4096,
                    temperature: 0.7,
                    isCustom: true,
                });
            }
        });
    });

    ollamaImportModal.classList.add('active');
}

function closeOllamaImport(): void {
    ollamaImportModal.classList.remove('active');
}

function showToast(message: string): void {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 2500);
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function setupEventListeners(): void {
    // Header & Dropdown Toggles
    sessionSelectorBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        modelDropdown.classList.remove('active');
        sessionDropdown.classList.toggle('active');
        if (sessionDropdown.classList.contains('active')) {
            sessionSearchInput.value = '';
            renderSessionDropdown();
            sessionSearchInput.focus();
        }
    });

    sessionSearchInput.addEventListener('input', () => {
        renderSessionDropdown(sessionSearchInput.value);
    });

    newSessionBtn.addEventListener('click', () => {
        createNewSession();
    });

    // Model Dropdown
    modelBadgeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sessionDropdown.classList.remove('active');
        modeDropdown.classList.remove('active');
        modelDropdown.classList.toggle('active');
        if (modelDropdown.classList.contains('active')) {
            modelSearchInput.value = '';
            renderModelDropdown();
            modelSearchInput.focus();
        }
    });

    modelSearchInput.addEventListener('input', () => {
        renderModelDropdown(modelSearchInput.value);
    });

    // Mode Dropdown
    modeBadgeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        sessionDropdown.classList.remove('active');
        modelDropdown.classList.remove('active');
        modeDropdown.classList.toggle('active');
        if (modeDropdown.classList.contains('active')) {
            renderModeDropdown();
        }
    });

    // Web Access Toggle Button
    webAccessBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        const sess = getActiveSession();
        const currentVal = sess?.webAccessEnabled !== undefined
            ? !!sess.webAccessEnabled
            : lastSelectedWebAccess;
        const nextState = !currentVal;
        lastSelectedWebAccess = nextState;
        if (sess) {
            sess.webAccessEnabled = nextState;
        }
        renderWebAccessBtn();
        vscode.postMessage({
            type: 'toggleWebAccess',
            sessionId: activeSessionId,
            enabled: nextState,
        });
    });

    // KVCache Button click toggles popover
    tokenStatBadge.addEventListener('click', (e) => {
        e.stopPropagation();
        kvCachePopover.classList.toggle('active');
    });

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!sessionDropdown.contains(target) && !sessionSelectorBtn.contains(target)) {
            sessionDropdown.classList.remove('active');
        }
        if (!modelDropdown.contains(target) && !modelBadgeBtn.contains(target)) {
            modelDropdown.classList.remove('active');
        }
        if (!modeDropdown.contains(target) && !modeBadgeBtn.contains(target)) {
            modeDropdown.classList.remove('active');
        }
        if (!kvCachePopover.contains(target) && !tokenStatBadge.contains(target)) {
            kvCachePopover.classList.remove('active');
        }
        document.querySelectorAll('.export-menu').forEach(m => {
            if (!m.contains(target)) {
                m.classList.remove('active');
            }
        });
        const addModelMenu = document.getElementById('addModelMenu');
        if (addModelMenu && !addModelMenu.contains(target) && target.id !== 'addModelBtn') {
            addModelMenu.classList.remove('active');
        }
        if (mentionAutocomplete && !mentionAutocomplete.contains(target) && target !== chatTextarea) {
            hideMentionAutocomplete();
        }
    });

    // Textarea & Send Button
    chatTextarea.addEventListener('input', () => {
        adjustTextareaHeight();
        checkMentionAutocomplete();
    });

    chatTextarea.addEventListener('keydown', (e) => {
        if (mentionAutocomplete?.classList.contains('active')) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                mentionSelectedIndex = (mentionSelectedIndex + 1) % mentionCurrentMatches.length;
                renderMentionAutocomplete();
                return;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                mentionSelectedIndex = (mentionSelectedIndex - 1 + mentionCurrentMatches.length) % mentionCurrentMatches.length;
                renderMentionAutocomplete();
                return;
            } else if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                selectMention(mentionSelectedIndex);
                return;
            } else if (e.key === 'Escape') {
                e.preventDefault();
                hideMentionAutocomplete();
                return;
            }
        }

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Drag & Drop handling for files
    let dragCounter = 0;
    window.addEventListener('dragenter', (e) => {
        e.preventDefault();
        dragCounter++;
        if (dragDropOverlay) {
            dragDropOverlay.classList.add('active');
        }
    });

    window.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dragCounter--;
        if (dragCounter <= 0) {
            dragCounter = 0;
            if (dragDropOverlay) {
                dragDropOverlay.classList.remove('active');
            }
        }
    });

    window.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    window.addEventListener('drop', (e) => {
        e.preventDefault();
        dragCounter = 0;
        if (dragDropOverlay) {
            dragDropOverlay.classList.remove('active');
        }

        const dt = e.dataTransfer;
        if (dt) {
            if (dt.files && dt.files.length > 0) {
                const paths: string[] = [];
                for (let i = 0; i < dt.files.length; i++) {
                    const f = dt.files[i];
                    const name = (f as any).path || f.name;
                    const matched = workspaceFiles.find(wf => wf === name || wf.endsWith('/' + name));
                    paths.push(matched || name);
                }
                if (paths.length > 0) {
                    insertTextAtCursor(chatTextarea, paths.map(p => `@${p}`).join(' ') + ' ');
                    chatTextarea.focus();
                    return;
                }
            }

            const uriList = dt.getData('text/uri-list');
            if (uriList) {
                const uris = uriList.split('\n').filter(u => u.trim() && !u.startsWith('#'));
                const paths = uris.map(u => {
                    try {
                        const pathName = decodeURIComponent(new URL(u).pathname);
                        const matched = workspaceFiles.find(wf => pathName.endsWith(wf));
                        return matched || pathName.split('/').pop() || pathName;
                    } catch {
                        return u;
                    }
                });
                insertTextAtCursor(chatTextarea, paths.map(p => `@${p}`).join(' ') + ' ');
                chatTextarea.focus();
                return;
            }

            const plainText = dt.getData('text/plain');
            if (plainText) {
                insertTextAtCursor(chatTextarea, plainText.trim() + ' ');
                chatTextarea.focus();
            }
        }
    });

    sendBtn.addEventListener('click', () => {
        if (isStreaming) {
            stopGeneration();
        } else {
            sendMessage();
        }
    });

    // Global Keydown for Escape Shortcut
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (mentionAutocomplete?.classList.contains('active')) {
                e.preventDefault();
                hideMentionAutocomplete();
                return;
            }
            // 1. Close Ollama import modal if open
            if (ollamaImportModal.classList.contains('active')) {
                e.preventDefault();
                closeOllamaImport();
                return;
            }
            // 2. Close Model editor modal if open
            if (modelEditorModal.classList.contains('active')) {
                e.preventDefault();
                closeModelEditor();
                return;
            }
            // 3. Close Settings modal if open
            if (settingsModal.classList.contains('active')) {
                e.preventDefault();
                closeSettingsModal();
                return;
            }
            // 4. Close Dropdowns if open
            if (sessionDropdown.classList.contains('active')) {
                e.preventDefault();
                sessionDropdown.classList.remove('active');
                return;
            }
            if (modelDropdown.classList.contains('active')) {
                e.preventDefault();
                modelDropdown.classList.remove('active');
                return;
            }
            if (modeDropdown.classList.contains('active')) {
                e.preventDefault();
                modeDropdown.classList.remove('active');
                return;
            }
            if (kvCachePopover.classList.contains('active')) {
                e.preventDefault();
                kvCachePopover.classList.remove('active');
                return;
            }
            // 5. If streaming, stop generation
            if (isStreaming) {
                e.preventDefault();
                stopGeneration();
                return;
            }
        }
    });

    // Settings Modal
    settingsBtn.addEventListener('click', () => {
        openSettingsModal();
    });

    closeSettingsBtn.addEventListener('click', () => {
        closeSettingsModal();
    });

    // Settings Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const target = btn.getAttribute('data-tab');
            const pane = document.getElementById(target || '');
            if (pane) {
                pane.classList.add('active');
            }
        });
    });

    // Settings Toggles & Language
    const promptToggle = document.getElementById('settingEnablePromptToggle') as HTMLInputElement | null;
    const promptContainer = document.getElementById('settingPromptContainer');
    promptToggle?.addEventListener('change', () => {
        promptContainer?.classList.toggle('hidden', !promptToggle.checked);
    });

    const tokensToggle = document.getElementById('settingEnableTokensToggle') as HTMLInputElement | null;
    const tokensContainer = document.getElementById('settingTokensContainer');
    tokensToggle?.addEventListener('change', () => {
        tokensContainer?.classList.toggle('hidden', !tokensToggle.checked);
    });

    const langSelect = document.getElementById('settingLanguage') as HTMLSelectElement | null;
    langSelect?.addEventListener('change', () => {
        const selected = (langSelect.value || 'auto') as 'auto' | 'en' | 'tr';
        settings.language = selected;
        const newLang = resolveLanguage(selected, vscodeLanguage);
        setLanguage(newLang);
        if (langSelect) {
            langSelect.value = selected;
        }
    });

    // Save Settings
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    saveSettingsBtn?.addEventListener('click', () => {
        const url = (document.getElementById('settingOllamaUrl') as HTMLInputElement).value.trim();
        const prompt = (document.getElementById('settingDefaultPrompt') as HTMLTextAreaElement).value.trim();
        const pToggle = document.getElementById('settingEnablePromptToggle') as HTMLInputElement | null;
        const tToggle = document.getElementById('settingEnableTokensToggle') as HTMLInputElement | null;
        const mInput = document.getElementById('settingMaxTokens') as HTMLInputElement | null;
        const lSelect = document.getElementById('settingLanguage') as HTMLSelectElement | null;

        const maxTokens = Math.max(4096, parseInt(mInput?.value || '4096', 10) || 4096);
        const enablePrompt = pToggle ? pToggle.checked : true;
        const enableTokens = tToggle ? tToggle.checked : false;
        const autoApplyToggle = document.getElementById('settingAutoApplyToggle') as HTMLInputElement | null;
        const autoApply = autoApplyToggle ? autoApplyToggle.checked : false;
        const chosenLang = (lSelect?.value || 'auto') as 'auto' | 'en' | 'tr';

        const autoFileEdits = (document.getElementById('settingAutoFileEditsToggle') as HTMLInputElement | null)?.checked ?? false;
        const autoFileCreate = (document.getElementById('settingAutoFileCreateToggle') as HTMLInputElement | null)?.checked ?? false;
        const autoFolderCreate = (document.getElementById('settingAutoFolderCreateToggle') as HTMLInputElement | null)?.checked ?? false;
        const enableProsecutor = (document.getElementById('settingEnableProsecutorToggle') as HTMLInputElement | null)?.checked ?? true;
        const prosecutorModel = (document.getElementById('settingProsecutorModel') as HTMLSelectElement | null)?.value || 'auto';

        const webEngine = (document.getElementById('settingWebEngine') as HTMLSelectElement | null)?.value || 'duckduckgo';
        const webDepth = (document.getElementById('settingWebDepth') as HTMLSelectElement | null)?.value || 'standard';
        const webMaxResults = parseInt((document.getElementById('settingWebMaxResults') as HTMLInputElement | null)?.value || '5', 10) || 5;
        const webBlacklist = (document.getElementById('settingWebBlacklist') as HTMLInputElement | null)?.value.trim() || '';
        const webWhitelist = (document.getElementById('settingWebWhitelist') as HTMLInputElement | null)?.value.trim() || '';

        vscode.postMessage({
            type: 'saveSettings',
            settings: {
                ollamaUrl: url,
                defaultSystemPrompt: prompt,
                enableSystemPrompt: enablePrompt,
                defaultMaxTokens: maxTokens,
                enableMaxTokens: enableTokens,
                language: chosenLang,
                autoApplyAgentEdits: autoApply,
                autoAllowFileEdits: autoFileEdits,
                autoAllowFileCreate: autoFileCreate,
                autoAllowFolderCreate: autoFolderCreate,
                enableProsecutor,
                prosecutorModelId: prosecutorModel,
                webSearchEngine: webEngine as any,
                webSearchDepth: webDepth as any,
                webSearchMaxResults: Math.min(10, Math.max(1, webMaxResults)),
                webSearchBlacklist: webBlacklist,
                webSearchWhitelist: webWhitelist,
            },
        });
    });

    const enableProsecutorToggle = document.getElementById('settingEnableProsecutorToggle') as HTMLInputElement | null;
    const prosecutorContainer = document.getElementById('settingProsecutorContainer');
    enableProsecutorToggle?.addEventListener('change', () => {
        prosecutorContainer?.classList.toggle('hidden', !enableProsecutorToggle.checked);
    });

    // Model Add Dropdown (Ollama'dan aktar vs Yeni Model)
    const addModelBtn = document.getElementById('addModelBtn');
    const addModelMenu = document.getElementById('addModelMenu');
    addModelBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        addModelMenu?.classList.toggle('active');
    });

    document.getElementById('importFromOllamaBtn')?.addEventListener('click', () => {
        addModelMenu?.classList.remove('active');
        openOllamaImportModal();
    });

    document.getElementById('createNewModelBtn')?.addEventListener('click', () => {
        addModelMenu?.classList.remove('active');
        openModelEditor();
    });

    // Close Model Editor Modal
    closeModelEditorBtn.addEventListener('click', () => closeModelEditor());
    cancelModelEditorBtn.addEventListener('click', () => closeModelEditor());

    // Save Custom Model Form
    saveModelEditorBtn.addEventListener('click', () => {
        const name = (document.getElementById('editorModelName') as HTMLInputElement).value.trim();
        const baseModel = (document.getElementById('editorBaseModel') as HTMLSelectElement).value;
        const systemPrompt = (document.getElementById('editorSystemPrompt') as HTMLTextAreaElement).value.trim();
        const numCtx = parseInt((document.getElementById('editorNumCtx') as HTMLInputElement).value, 10) || 4096;
        const temperature = parseFloat((document.getElementById('editorTemperature') as HTMLInputElement).value) || 0.7;

        if (!name) {
            showToast(t.models.nameRequired);
            return;
        }

        const editId = modelEditorModal.getAttribute('data-edit-id');
        const id = editId || ('custom_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6));

        vscode.postMessage({
            type: 'saveCustomModel',
            model: {
                id,
                name,
                baseModel,
                systemPrompt,
                numCtx,
                temperature,
                isCustom: true,
            },
        });

        closeModelEditor();
    });

    // Close Ollama Import Modal
    closeOllamaImportBtn.addEventListener('click', () => closeOllamaImport());

    // Global Event Delegation for Copy Buttons
    chatContainer.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;

        // Code block copy button
        const codeCopyBtn = target.closest('.code-copy-btn') as HTMLButtonElement | null;
        if (codeCopyBtn) {
            const rawCode = decodeURIComponent(codeCopyBtn.getAttribute('data-code') || '');
            navigator.clipboard.writeText(rawCode).then(() => {
                const label = codeCopyBtn.querySelector('span');
                if (label) {
                    const oldText = label.textContent;
                    label.textContent = `✓ ${t.common.copied}`;
                    setTimeout(() => {
                        label.textContent = oldText;
                    }, 1500);
                }
            });
            return;
        }

        // Full message copy button
        const msgCopyBtn = target.closest('.copy-msg-btn') as HTMLButtonElement | null;
        if (msgCopyBtn) {
            const raw = decodeURIComponent(msgCopyBtn.getAttribute('data-content') || '');
            navigator.clipboard.writeText(raw).then(() => {
                showToast(t.common.copied);
            });
            return;
        }

        // Black box markdown log button
        const blackboxBtn = target.closest('.blackbox-btn') as HTMLButtonElement | null;
        if (blackboxBtn) {
            const msgId = blackboxBtn.getAttribute('data-msg-id');
            const sessId = blackboxBtn.getAttribute('data-session-id') || activeSessionId;
            if (msgId && sessId) {
                vscode.postMessage({
                    type: 'openMessageBlackbox',
                    sessionId: sessId,
                    messageId: msgId,
                });
            }
            return;
        }

        // Web sources markdown log button
        const sourcesBtn = target.closest('.sources-btn') as HTMLButtonElement | null;
        if (sourcesBtn) {
            const msgId = sourcesBtn.getAttribute('data-msg-id');
            const sessId = sourcesBtn.getAttribute('data-session-id') || activeSessionId;
            if (msgId && sessId) {
                vscode.postMessage({
                    type: 'openWebSources',
                    sessionId: sessId,
                    messageId: msgId,
                });
            }
            return;
        }
    });
}
