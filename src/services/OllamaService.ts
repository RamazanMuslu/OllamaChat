import { ChatStats, OllamaChatChunkResponse, OllamaTagModel, OllamaTagsResponse } from './types';

export interface StreamChatParams {
    baseUrl: string;
    model: string;
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
    systemPrompt?: string;
    temperature?: number;
    numCtx?: number;
    numPredict?: number;
    signal?: AbortSignal;
    onChunk: (token: string) => void;
    onDone: (stats: ChatStats, fullText: string) => void;
    onError: (err: Error) => void;
}

export class OllamaService {
    public static async getInstalledModels(baseUrl: string): Promise<OllamaTagModel[]> {
        const url = `${baseUrl.replace(/\/+$/, '')}/api/tags`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`Ollama modelleri alınamadı: HTTP ${response.status} ${response.statusText}`);
        }

        const data = (await response.json()) as OllamaTagsResponse;
        return data.models || [];
    }

    public static async streamChat(params: StreamChatParams): Promise<void> {
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
            onError,
        } = params;

        const finalMessages = [...messages];
        if (systemPrompt && systemPrompt.trim()) {
            // If the first message is already system, replace or prepend
            if (finalMessages.length > 0 && finalMessages[0].role === 'system') {
                finalMessages[0] = { role: 'system', content: systemPrompt };
            } else {
                finalMessages.unshift({ role: 'system', content: systemPrompt });
            }
        }

        const options: Record<string, unknown> = {};
        if (typeof temperature === 'number') {
            options.temperature = temperature;
        }
        if (typeof numCtx === 'number' && numCtx > 0) {
            options.num_ctx = numCtx;
        }
        if (typeof numPredict === 'number' && numPredict > 0) {
            options.num_predict = numPredict;
        }

        const url = `${baseUrl.replace(/\/+$/, '')}/api/chat`;
        let response: Response;

        try {
            response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model,
                    messages: finalMessages,
                    stream: true,
                    options: Object.keys(options).length > 0 ? options : undefined,
                }),
                signal,
            });
        } catch (err: unknown) {
            if (signal?.aborted) {
                return;
            }
            const error = err instanceof Error ? err : new Error(String(err));
            onError(new Error(`Ollama servisine bağlanılamadı (${baseUrl}): ${error.message}`));
            return;
        }

        if (!response.ok) {
            let errorDetail = '';
            try {
                const errJson = await response.json() as { error?: string };
                errorDetail = errJson.error || '';
            } catch {
                // Ignore json parse error
            }
            onError(new Error(`Ollama hatası [${response.status}]: ${errorDetail || response.statusText}`));
            return;
        }

        if (!response.body) {
            onError(new Error('Ollama yanıt gövdesi (body) boş döndü.'));
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let fullText = '';
        let stats: ChatStats = {};
        let buffer = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed) {
                        continue;
                    }

                    try {
                        const parsed = JSON.parse(trimmed) as OllamaChatChunkResponse;
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
                                tokensPerSecond: tokensPerSec,
                            };
                        }
                    } catch {
                        // ignore malformed chunk
                    }
                }
            }

            // Flush remaining buffer if any
            if (buffer.trim()) {
                try {
                    const parsed = JSON.parse(buffer.trim()) as OllamaChatChunkResponse;
                    if (parsed.message?.content) {
                        fullText += parsed.message.content;
                        onChunk(parsed.message.content);
                    }
                } catch {
                    // ignore
                }
            }

            onDone(stats, fullText);
        } catch (err: unknown) {
            if (signal?.aborted) {
                // Aborted gracefully by user
                return;
            }
            const error = err instanceof Error ? err : new Error(String(err));
            onError(error);
        }
    }
}
