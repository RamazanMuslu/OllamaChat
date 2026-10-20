export interface ChatStats {
    totalDurationMs?: number;
    loadDurationMs?: number;
    promptEvalCount?: number;
    promptEvalDurationMs?: number;
    evalCount?: number;
    evalDurationMs?: number;
    tokensPerSecond?: number;
}

export type TaskMode = 'chat' | 'agent';

export interface SecurityAuditResult {
    isSafe: boolean;
    risk: 'low' | 'medium' | 'high';
    reason: string;
    prosecutorName?: string;
    blocked?: boolean;
}

export type AgentActionType =
    | 'write'
    | 'edit'
    | 'read'
    | 'create_dir'
    | 'delete'
    | 'move'
    | 'list_dir'
    | 'grep'
    | 'find_files'
    | 'command'
    | 'web_search';

export type AgentActionStatus =
    | 'pending'
    | 'applied'
    | 'rejected'
    | 'reverted'
    | 'accepted'
    | 'executed'
    | 'failed';

export interface AgentFileAction {
    id: string;
    type: AgentActionType;
    path: string;
    targetPath?: string;
    content?: string;
    search?: string;
    replace?: string;
    command?: string;
    query?: string;
    pattern?: string;
    isRegex?: boolean;
    output?: string;
    status: AgentActionStatus;
    originalContent?: string;
    wasCreated?: boolean;
    newContent?: string;
    securityAudit?: SecurityAuditResult;
}

export type WebSearchDepth = 'fast' | 'standard' | 'deep';
export type WebSearchEngine = 'duckduckgo' | 'searxng';

export interface WebSourceItem {
    title: string;
    url: string;
    snippet: string;
    domain?: string;
    content?: string;
    summary?: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt: number;
    stats?: ChatStats;
    error?: boolean;
    modelName?: string;
    modelQuantization?: string;
    actions?: AgentFileAction[];
    webSources?: WebSourceItem[];
}

export interface ChatSession {
    id: string;
    title: string;
    createdAt: number;
    updatedAt: number;
    messages: ChatMessage[];
    modelId?: string;
    modelQuantization?: string;
    mode?: TaskMode;
    webAccessEnabled?: boolean;
}

export interface CustomModelConfig {
    id: string;
    name: string;
    baseModel: string;
    systemPrompt?: string;
    temperature?: number;
    numCtx?: number; // KV-cache / Context window
    numPredict?: number; // Max tokens
    isCustom?: boolean;
}

export interface ExtensionSettings {
    ollamaUrl: string;
    defaultSystemPrompt: string;
    enableSystemPrompt?: boolean;
    defaultMaxTokens?: number;
    enableMaxTokens?: boolean;
    language?: 'auto' | 'en' | 'tr';
    defaultModelId?: string;
    lastSelectedMode?: TaskMode;
    autoApplyAgentEdits?: boolean;
    autoAllowFileEdits?: boolean;
    autoAllowFileCreate?: boolean;
    autoAllowFolderCreate?: boolean;
    enableProsecutor?: boolean;
    prosecutorModelId?: string;
    webSearchEngine?: WebSearchEngine;
    webSearchDepth?: WebSearchDepth;
    webSearchMaxResults?: number;
    webSearchBlacklist?: string;
    webSearchWhitelist?: string;
}

export interface OllamaTagModel {
    name: string;
    model: string;
    modified_at: string;
    size: number;
    digest: string;
    details?: {
        format?: string;
        family?: string;
        families?: string[];
        parameter_size?: string;
        quantization_level?: string;
    };
}

export interface OllamaTagsResponse {
    models: OllamaTagModel[];
}

export interface OllamaChatChunkResponse {
    model: string;
    created_at: string;
    message?: {
        role: string;
        content: string;
    };
    done: boolean;
    total_duration?: number;
    load_duration?: number;
    prompt_eval_count?: number;
    prompt_eval_duration?: number;
    eval_count?: number;
    eval_duration?: number;
}
