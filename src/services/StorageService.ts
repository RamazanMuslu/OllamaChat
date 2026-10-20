import * as vscode from 'vscode';
import { ChatMessage, ChatSession, CustomModelConfig, ExtensionSettings, TaskMode } from './types';
import { getTranslation } from '../locales';

const SESSIONS_KEY = 'ollamachat.sessions';
const ACTIVE_SESSION_ID_KEY = 'ollamachat.activeSessionId';
const LAST_SELECTED_MODEL_ID_KEY = 'ollamachat.lastSelectedModelId';
const LAST_SELECTED_MODE_KEY = 'ollamachat.lastSelectedMode';
const CUSTOM_MODELS_KEY = 'ollamachat.customModels';
const SETTINGS_KEY = 'ollamachat.settings';
const LAST_SELECTED_WEB_ACCESS_KEY = 'ollamachat.lastSelectedWebAccess';

const DEFAULT_SETTINGS: ExtensionSettings = {
    ollamaUrl: 'http://127.0.0.1:11434',
    defaultSystemPrompt: 'You are a helpful, accurate, and concise AI coding assistant in Visual Studio Code.',
    enableSystemPrompt: true,
    defaultMaxTokens: 4096,
    enableMaxTokens: false,
    language: 'auto',
    autoApplyAgentEdits: false,
    autoAllowFileEdits: false,
    autoAllowFileCreate: false,
    autoAllowFolderCreate: false,
    enableProsecutor: true,
    prosecutorModelId: 'auto',
    webSearchEngine: 'duckduckgo',
    webSearchDepth: 'standard',
    webSearchMaxResults: 5,
    webSearchBlacklist: '',
    webSearchWhitelist: '',
};

export class StorageService {
    constructor(private readonly context: vscode.ExtensionContext) {}

    // --- Settings ---
    public getSettings(): ExtensionSettings {
        const stored = this.context.globalState.get<Partial<ExtensionSettings>>(SETTINGS_KEY);
        return {
            ...DEFAULT_SETTINGS,
            ...(stored || {}),
        };
    }

    public async saveSettings(newSettings: Partial<ExtensionSettings>): Promise<ExtensionSettings> {
        const current = this.getSettings();
        const updated: ExtensionSettings = { ...current, ...newSettings };
        await this.context.globalState.update(SETTINGS_KEY, updated);
        return updated;
    }

    public getLastSelectedModelId(): string | undefined {
        const id = this.context.globalState.get<string>(LAST_SELECTED_MODEL_ID_KEY);
        const models = this.getCustomModels();
        if (models.length > 0) {
            if (id && models.some(m => m.id === id)) {
                return id;
            }
            return models[0].id;
        }
        return id;
    }

    public async setLastSelectedModelId(modelId: string): Promise<void> {
        if (modelId) {
            await this.context.globalState.update(LAST_SELECTED_MODEL_ID_KEY, modelId);
        }
    }

    public getLastSelectedMode(): TaskMode {
        return this.context.globalState.get<TaskMode>(LAST_SELECTED_MODE_KEY, 'chat');
    }

    public async setLastSelectedMode(mode: TaskMode): Promise<void> {
        if (mode) {
            await this.context.globalState.update(LAST_SELECTED_MODE_KEY, mode);
        }
    }

    public getLastSelectedWebAccess(): boolean {
        return this.context.globalState.get<boolean>(LAST_SELECTED_WEB_ACCESS_KEY, false);
    }

    public async setLastSelectedWebAccess(enabled: boolean): Promise<void> {
        await this.context.globalState.update(LAST_SELECTED_WEB_ACCESS_KEY, !!enabled);
    }

    // --- Sessions ---
    public getSessions(): ChatSession[] {
        const list = this.context.globalState.get<ChatSession[]>(SESSIONS_KEY, []);
        const nonEmpty = list.filter(s => s.messages && s.messages.length > 0);
        return nonEmpty.sort((a, b) => b.updatedAt - a.updatedAt);
    }

    public getSession(id: string): ChatSession | undefined {
        const sessions = this.getSessions();
        return sessions.find(s => s.id === id);
    }

    public async saveSession(session: ChatSession): Promise<void> {
        const sessions = this.getSessions();
        const index = sessions.findIndex(s => s.id === session.id);
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
        if (session.webAccessEnabled !== undefined) {
            await this.setLastSelectedWebAccess(session.webAccessEnabled);
        }
    }

    public createDraftSession(title?: string, modelId?: string, mode?: TaskMode): ChatSession {
        const now = Date.now();
        const chosenModelId = modelId || this.getLastSelectedModelId() || this.getSettings().defaultModelId;
        const chosenMode = mode || this.getLastSelectedMode();
        const chosenWebAccess = this.getLastSelectedWebAccess();
        return {
            id: 'session_' + now + '_' + Math.random().toString(36).substring(2, 7),
            title: title || 'Yeni Sohbet',
            createdAt: now,
            updatedAt: now,
            messages: [],
            modelId: chosenModelId,
            mode: chosenMode,
            webAccessEnabled: chosenWebAccess,
        };
    }

    public async createSession(title?: string, modelId?: string, mode?: TaskMode): Promise<ChatSession> {
        const newSession = this.createDraftSession(title, modelId, mode);
        await this.setActiveSessionId(newSession.id);
        return newSession;
    }

    public async deleteSession(id: string): Promise<void> {
        const sessions = this.getSessions().filter(s => s.id !== id);
        await this.context.globalState.update(SESSIONS_KEY, sessions);

        if (this.getActiveSessionId() === id) {
            const next = sessions[0];
            await this.setActiveSessionId(next ? next.id : '');
        }
    }

    public getActiveSessionId(): string {
        return this.context.globalState.get<string>(ACTIVE_SESSION_ID_KEY, '');
    }

    public async setActiveSessionId(id: string): Promise<void> {
        await this.context.globalState.update(ACTIVE_SESSION_ID_KEY, id);
    }

    public exportSessionAsMarkdown(sessionId: string, lang?: string): string {
        const session = this.getSession(sessionId);
        if (!session) {
            return '';
        }

        const t = getTranslation(lang);
        const dateStr = new Date(session.createdAt).toLocaleString();
        const modelInfo = session.modelId || t.common.default;
        const quantInfo = session.modelQuantization ? ` (${session.modelQuantization})` : '';
        let md = `# ${session.title}\n\n*${t.export.createdDate} ${dateStr}*\n*${t.export.model} ${modelInfo}${quantInfo}*\n\n---\n\n`;

        for (const msg of session.messages) {
            const roleName = msg.role === 'user' ? `${t.export.user}` : `${t.export.assistant}`;
            const timeStr = new Date(msg.createdAt).toLocaleTimeString();
            md += `### ${roleName} (${timeStr})\n\n${msg.content}\n\n`;

            const details: string[] = [];
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
                details.push(`${t.chat.duration}: ${((msg.stats.totalDurationMs || 0) / 1000).toFixed(1)}s`);
            }

            if (details.length > 0) {
                md += `> ℹ️ *${details.join(' | ')}*\n\n`;
            }
            md += `---\n\n`;
        }

        return md;
    }

    public exportSessionAsJson(sessionId: string): string {
        const session = this.getSession(sessionId);
        if (!session) {
            return '{}';
        }
        return JSON.stringify(session, null, 2);
    }

    // --- Custom Models ---
    public getCustomModels(): CustomModelConfig[] {
        return this.context.globalState.get<CustomModelConfig[]>(CUSTOM_MODELS_KEY, []);
    }

    public async saveCustomModel(model: CustomModelConfig): Promise<void> {
        const models = this.getCustomModels();
        const index = models.findIndex(m => m.id === model.id);
        if (index >= 0) {
            models[index] = model;
        } else {
            models.push(model);
        }
        await this.context.globalState.update(CUSTOM_MODELS_KEY, models);
    }

    public async deleteCustomModel(id: string): Promise<void> {
        const models = this.getCustomModels().filter(m => m.id !== id);
        await this.context.globalState.update(CUSTOM_MODELS_KEY, models);

        const lastModelId = this.context.globalState.get<string>(LAST_SELECTED_MODEL_ID_KEY);
        if (lastModelId === id) {
            await this.context.globalState.update(LAST_SELECTED_MODEL_ID_KEY, models[0] ? models[0].id : '');
        }
    }
}
