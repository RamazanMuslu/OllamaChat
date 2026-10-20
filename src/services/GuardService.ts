import { AgentFileAction, ExtensionSettings, OllamaTagModel, SecurityAuditResult } from './types';
import { OllamaService } from './OllamaService';

export class GuardService {
    // Dangerous shell command patterns
    private static readonly DANGEROUS_COMMAND_PATTERNS = [
        /\brm\s+(-[rfRF]{1,4}\s+|--recursive\s+|--force\s+)*(\/|~|\$HOME|\.\.|\*)/i,
        /\bsudo\b/i,
        /\bmkfs\b/i,
        /\bdd\s+if=/i,
        /:[(][{]\s*:[|]:[&]\s*[}];:/, // Fork bomb
        /\bchmod\s+(-R\s+)?(777|000)\s+(\/|~)/i,
        /\b(curl|wget)\s+[^|]+\|\s*(ba)?sh\b/i,
        />\s*\/dev\/(sd[a-z]|nvme|null|zero)/i,
    ];

    // Sensitive file names or paths
    private static readonly SENSITIVE_FILE_PATTERNS = [
        /(^|\/)\.env(\.[a-z0-9_-]+)?$/i,
        /(^|\/)(id_rsa|id_ed25519|id_dsa)(\.pub)?$/i,
        /(^|\/)[a-z0-9_-]+\.(pem|key|pfx|p12)$/i,
        /(^|\/)\.npmrc$/i,
        /(^|\/)\.bashrc|\.zshrc|\.profile$/i,
        /^\/etc\/|^\/usr\/|^\/bin\/|^\/sbin\/|^\/var\/|^\/System\//i,
        /^\.\.\/|^\.\.\\/i, // Path traversal outside workspace
    ];

    /**
     * Finds the best candidate prosecutor model (prefers 1.5b, 1b, 2b, 3b, or installed models).
     */
    public static resolveProsecutorModel(
        settings: ExtensionSettings,
        installedModels: OllamaTagModel[]
    ): string | undefined {
        if (settings.prosecutorModelId && settings.prosecutorModelId !== 'auto') {
            return settings.prosecutorModelId;
        }

        // Auto-detect: look for lightweight models (1.5b, 1b, 2b, 3b)
        const candidates = installedModels.map(m => m.name);
        const preferred = candidates.find(name =>
            /1\.5b|1b|2b|3b|0\.5b|tiny/i.test(name)
        );

        if (preferred) {
            return preferred;
        }

        return candidates[0] || undefined;
    }

    /**
     * Performs rule-based check on a file action or command.
     */
    public static evaluateRules(action: AgentFileAction): SecurityAuditResult {
        const path = (action.path || '').trim();

        // Check command actions
        if (action.type === 'command') {
            const cmd = (action.command || '').trim();
            if (!cmd) {
                return {
                    isSafe: false,
                    risk: 'high',
                    reason: 'Boş terminal komutu.',
                    blocked: true,
                };
            }

            for (const pattern of this.DANGEROUS_COMMAND_PATTERNS) {
                if (pattern.test(cmd)) {
                    return {
                        isSafe: false,
                        risk: 'high',
                        reason: `Yıkıcı veya zararlı olabilecek terminal komutu engellendi: "${cmd}"`,
                        blocked: true,
                    };
                }
            }

            return {
                isSafe: true,
                risk: 'low',
                reason: 'Komut güvenlik filtresinden başarıyla geçti.',
                blocked: false,
            };
        }

        // Check delete actions
        if (action.type === 'delete') {
            if (!path || path === '.' || path === '/' || path === '*' || path === '~' || path.startsWith('..')) {
                return {
                    isSafe: false,
                    risk: 'high',
                    reason: `Kritik veya geçersiz dizin silme girişimi engellendi: "${path}"`,
                    blocked: true,
                };
            }
        }

        // Check targetPath for move actions
        if (action.type === 'move' && action.targetPath) {
            for (const pattern of this.SENSITIVE_FILE_PATTERNS) {
                if (pattern.test(action.targetPath.trim())) {
                    return {
                        isSafe: false,
                        risk: 'high',
                        reason: `Hassas hedef dosya yolu tespit edildi: "${action.targetPath}"`,
                        blocked: true,
                    };
                }
            }
        }

        // Check path traversal or sensitive file access
        if (path && path !== 'terminal') {
            for (const pattern of this.SENSITIVE_FILE_PATTERNS) {
                if (pattern.test(path)) {
                    return {
                        isSafe: false,
                        risk: 'high',
                        reason: `Hassas veya sistem düzeyinde dosya yolu tespit edildi: "${path}"`,
                        blocked: true,
                    };
                }
            }
        }

        const content = action.type === 'write'
            ? (action.content || '')
            : (action.type === 'edit' ? (action.replace || '') : '');

        // Check dangerous commands inside code/content
        if (content) {
            for (const pattern of this.DANGEROUS_COMMAND_PATTERNS) {
                if (pattern.test(content)) {
                    return {
                        isSafe: false,
                        risk: 'high',
                        reason: `Yıkıcı veya zararlı olabilecek komut/kod tespit edildi (rm -rf / sudo vb.)`,
                        blocked: true,
                    };
                }
            }
        }

        return {
            isSafe: true,
            risk: 'low',
            reason: 'Kural tabanlı denetimden başarıyla geçti.',
            blocked: false,
        };
    }

    /**
     * Audits an action using the designated Prosecutor model (e.g. 1.5B) + deterministic rules.
     */
    public static async auditAction(
        action: AgentFileAction,
        settings: ExtensionSettings,
        installedModels: OllamaTagModel[]
    ): Promise<SecurityAuditResult> {
        // Step 1: Deterministic check
        const ruleResult = this.evaluateRules(action);
        if (ruleResult.blocked || ruleResult.risk === 'high') {
            return ruleResult;
        }

        // Read-only actions (read, list_dir, grep, find_files) are safe by default once rule passed
        if (['read', 'list_dir', 'grep', 'find_files'].includes(action.type)) {
            return ruleResult;
        }

        // If prosecutor is disabled, return rule result
        if (settings.enableProsecutor === false) {
            return ruleResult;
        }

        // Step 2: Prosecutor Model Check
        const prosecutorModel = this.resolveProsecutorModel(settings, installedModels);
        if (!prosecutorModel) {
            return ruleResult;
        }

        try {
            let actionSnippet = '';
            if (action.type === 'command') {
                actionSnippet = `COMMAND TO EXECUTE: ${action.command}`;
            } else if (action.type === 'delete') {
                actionSnippet = `DELETE PATH: ${action.path}`;
            } else if (action.type === 'move') {
                actionSnippet = `MOVE FROM: ${action.path} TO: ${action.targetPath}`;
            } else if (action.type === 'create_dir') {
                actionSnippet = `CREATE DIRECTORY: ${action.path}`;
            } else if (action.type === 'write') {
                actionSnippet = `WRITE FILE: ${action.path}\nCONTENT:\n${(action.content || '').slice(0, 500)}`;
            } else if (action.type === 'edit') {
                actionSnippet = `EDIT FILE: ${action.path}\nSEARCH:\n${(action.search || '').slice(0, 200)}\nREPLACE:\n${(action.replace || '').slice(0, 200)}`;
            }

            const prompt = `You are a strict Security Prosecutor (Savcı) auditing an AI coding agent inside VS Code.
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

            let responseText = '';
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000); // 4-sec max for 1.5b

            await OllamaService.streamChat({
                baseUrl: settings.ollamaUrl,
                model: prosecutorModel,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.0,
                numPredict: 150,
                signal: controller.signal,
                onChunk: (chunk: string) => {
                    responseText += chunk;
                },
                onDone: () => {},
                onError: (err) => {
                    console.warn('Prosecutor model audit error:', err.message);
                },
            });

            clearTimeout(timeoutId);

            // Parse response
            const jsonMatch = /\{[\s\S]*\}/.exec(responseText);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                const isSafe = Boolean(parsed.isSafe);
                const risk: 'low' | 'medium' | 'high' = ['low', 'medium', 'high'].includes(parsed.risk)
                    ? parsed.risk
                    : (isSafe ? 'low' : 'high');
                const reason = parsed.reason || (isSafe ? 'Savcı onayladı.' : 'Şüpheli işlem tespit edildi.');

                return {
                    isSafe,
                    risk,
                    reason,
                    prosecutorName: prosecutorModel,
                    blocked: !isSafe || risk === 'high',
                };
            }
        } catch (err: any) {
            console.warn('Prosecutor audit fallback to rules:', err.message);
        }

        return {
            ...ruleResult,
            prosecutorName: prosecutorModel,
        };
    }
}
