import { ChatMessage, ChatSession, ExtensionSettings, WebSearchDepth, WebSourceItem } from './types';

export class WebSearchService {
    private static readonly USER_AGENT =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

    /**
     * Executes a web search and gathers sources according to the configured depth and filters.
     */
    public static async search(query: string, settings: ExtensionSettings): Promise<WebSourceItem[]> {
        const cleanQuery = query.trim();
        if (!cleanQuery) {
            return [];
        }

        const maxResults = Math.min(10, Math.max(1, settings.webSearchMaxResults ?? 5));
        const depth: WebSearchDepth = settings.webSearchDepth || 'standard';
        const engine = settings.webSearchEngine || 'duckduckgo';

        // 1. Fetch raw search results (SearXNG or DuckDuckGo with fallback)
        let rawResults: WebSourceItem[] = [];
        if (engine === 'searxng') {
            rawResults = await this._searchSearXNG(cleanQuery, maxResults * 2);
        }
        if (rawResults.length === 0) {
            rawResults = await this._searchDuckDuckGo(cleanQuery, maxResults * 2);
        }

        // 2. Filter with Blacklist & Whitelist
        rawResults = this._applyDomainFilters(rawResults, settings.webSearchBlacklist, settings.webSearchWhitelist);

        // Slice to max results
        const topResults = rawResults.slice(0, maxResults);

        // 3. Process based on depth level
        if (depth === 'fast') {
            return topResults;
        }

        // Standard or Deep: fetch page contents concurrently with timeout
        const pagesToFetch = depth === 'deep' ? Math.min(topResults.length, 5) : Math.min(topResults.length, 3);
        const fetchPromises = topResults.slice(0, pagesToFetch).map(async (item) => {
            try {
                const pageText = await this.fetchPageContent(item.url, depth === 'deep' ? 3500 : 1800);
                if (pageText) {
                    item.content = pageText;
                    if (depth === 'deep') {
                        item.summary = this._extractKeySentences(pageText, cleanQuery, 400);
                    }
                }
            } catch {
                // If a page fails to fetch, keep snippet
            }
            return item;
        });

        await Promise.all(fetchPromises);
        return topResults;
    }

    /**
     * DuckDuckGo HTML Search
     */
    private static async _searchDuckDuckGo(query: string, limit: number): Promise<WebSourceItem[]> {
        const results: WebSourceItem[] = [];
        try {
            const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const res = await fetch(searchUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': this.USER_AGENT,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
                },
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (!res.ok) {
                return results;
            }

            const html = await res.text();
            // Split by result__body class which cleanly delimits each search result
            const blocks = html.split(/class="[^"]*result__body[^"]*"/);

            for (let i = 1; i < blocks.length && results.length < limit; i++) {
                const block = blocks[i];

                // Extract link and title
                const linkMatch = /<a [^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i.exec(block);
                if (!linkMatch) {
                    continue;
                }

                let rawUrl = linkMatch[1];
                const title = this._stripHtml(linkMatch[2]);

                // Decode DuckDuckGo redirect link (//duckduckgo.com/l/?uddg=URL)
                if (rawUrl.includes('uddg=')) {
                    const uddgMatch = /uddg=([^&]+)/.exec(rawUrl);
                    if (uddgMatch) {
                        try {
                            rawUrl = decodeURIComponent(uddgMatch[1]);
                        } catch {
                            // keep raw
                        }
                    }
                }

                if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
                    continue;
                }

                // Extract snippet
                const snippetMatch = /<a [^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i.exec(block);
                const snippet = snippetMatch ? this._stripHtml(snippetMatch[1]) : '';

                let domain = '';
                try {
                    domain = new URL(rawUrl).hostname.replace(/^www\./, '');
                } catch {
                    // ignore
                }

                results.push({
                    title: title || domain || rawUrl,
                    url: rawUrl,
                    snippet,
                    domain,
                });
            }
        } catch (err) {
            console.warn('DuckDuckGo search failed:', err);
        }

        return results;
    }

    /**
     * SearXNG Search (local instance or public API)
     */
    private static async _searchSearXNG(query: string, limit: number): Promise<WebSourceItem[]> {
        const results: WebSourceItem[] = [];
        const endpoints = [
            `http://127.0.0.1:8080/search?q=${encodeURIComponent(query)}&format=json`,
            `https://searx.be/search?q=${encodeURIComponent(query)}&format=json`,
        ];

        for (const ep of endpoints) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                const res = await fetch(ep, {
                    headers: {
                        'User-Agent': this.USER_AGENT,
                        'Accept': 'application/json',
                    },
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);

                if (!res.ok) {
                    continue;
                }

                const data: any = await res.json();
                if (Array.isArray(data.results)) {
                    for (const item of data.results) {
                        if (results.length >= limit) {
                            break;
                        }
                        if (item.url && (item.url.startsWith('http://') || item.url.startsWith('https://'))) {
                            let domain = '';
                            try {
                                domain = new URL(item.url).hostname.replace(/^www\./, '');
                            } catch {
                                // ignore
                            }
                            results.push({
                                title: item.title || domain || item.url,
                                url: item.url,
                                snippet: item.content || item.snippet || '',
                                domain,
                            });
                        }
                    }
                }
                if (results.length > 0) {
                    break;
                }
            } catch {
                // try next endpoint
            }
        }

        return results;
    }

    /**
     * Fetches and cleans textual content of a webpage
     */
    public static async fetchPageContent(url: string, maxChars = 2000): Promise<string> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000);

            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': this.USER_AGENT,
                    'Accept': 'text/html,text/plain',
                },
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (!res.ok) {
                return '';
            }

            const html = await res.text();
            return this._cleanHtmlToText(html, maxChars);
        } catch {
            return '';
        }
    }

    /**
     * Cleans raw HTML to readable text, removing scripts, styles, navigations
     */
    private static _cleanHtmlToText(html: string, maxChars: number): string {
        let text = html
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/<style[\s\S]*?<\/style>/gi, '')
            .replace(/<head[\s\S]*?<\/head>/gi, '')
            .replace(/<nav[\s\S]*?<\/nav>/gi, '')
            .replace(/<header[\s\S]*?<\/header>/gi, '')
            .replace(/<footer[\s\S]*?<\/footer>/gi, '')
            .replace(/<aside[\s\S]*?<\/aside>/gi, '')
            .replace(/<svg[\s\S]*?<\/svg>/gi, '')
            .replace(/<!--[\s\S]*?-->/g, '');

        // Convert common block elements to newlines
        text = text
            .replace(/<\/(p|div|h\d|li|tr)>/gi, '\n')
            .replace(/<br\s*\/?>/gi, '\n');

        // Strip remaining HTML tags
        text = this._stripHtml(text);

        // Normalize whitespaces
        text = text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 20) // filter out navigation crumbs & tiny artifacts
            .join('\n\n');

        if (text.length > maxChars) {
            text = text.substring(0, maxChars) + '...';
        }

        return text;
    }

    /**
     * Strips HTML tags and entities
     */
    private static _stripHtml(str: string): string {
        return str
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/\s+/g, ' ')
            .trim();
    }

    /**
     * Extracts sentences that contain search terms for deep analysis
     */
    private static _extractKeySentences(text: string, query: string, maxLen: number): string {
        const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
        const sentences = text.split(/[.!?\n]+/).map(s => s.trim()).filter(Boolean);

        const scored = sentences.map(s => {
            const lower = s.toLowerCase();
            let score = 0;
            terms.forEach(t => {
                if (lower.includes(t)) {
                    score += 1;
                }
            });
            return { s, score };
        });

        const relevant = scored
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(item => item.s);

        const result = relevant.join('. ');
        return result.length > maxLen ? result.substring(0, maxLen) + '...' : result;
    }

    /**
     * Domain filtering for Blacklist & Whitelist
     */
    private static _applyDomainFilters(
        results: WebSourceItem[],
        blacklistStr?: string,
        whitelistStr?: string,
    ): WebSourceItem[] {
        const blacklist = (blacklistStr || '')
            .split(/[,;\n]/)
            .map(d => d.trim().toLowerCase())
            .filter(Boolean);

        const whitelist = (whitelistStr || '')
            .split(/[,;\n]/)
            .map(d => d.trim().toLowerCase())
            .filter(Boolean);

        return results.filter(item => {
            if (!item.domain) {
                return true;
            }
            const dom = item.domain.toLowerCase();

            // Blacklist check
            if (blacklist.some(b => dom === b || dom.endsWith('.' + b))) {
                return false;
            }

            // Whitelist check
            if (whitelist.length > 0 && !whitelist.some(w => dom === w || dom.endsWith('.' + w))) {
                return false;
            }

            return true;
        });
    }

    /**
     * Formats gathered web sources into a clean markdown prompt block for the LLM
     */
    public static formatSourcesForPrompt(sources: WebSourceItem[], depth: WebSearchDepth = 'standard'): string {
        if (!sources || sources.length === 0) {
            return '';
        }

        const now = new Date();
        const dateOptions: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        const dateStr = now.toLocaleDateString('tr-TR', dateOptions);
        const currentYear = now.getFullYear();

        const lines: string[] = [
            '=== 🌐 GÜNCEL İNTERNET VE CANLI ARAŞTIRMA VERİLERİ ===',
            `[ZAMAN VE TARİH BİLGİSİ: Bugünün gerçek dünya tarihi: ${dateStr}. Mevcut yıl: ${currentYear}.]`,
            `[TEMPORAL CONTEXT: Today is ${dateStr}, and the current year is ${currentYear}.]`,
            'Aşağıdaki bilgiler kullanıcının sorusu doğrultusunda canlı internet aramasından derlenmiştir.',
            `ÖNEMLİ TALİMAT: Modelinin eğitim kesilme tarihi (training cutoff) geçmişte kalmış olabilir. Yanıtını verirken geçmiş eğitim veri sınırın yerine yukarıdaki bugünün yılını (${currentYear}) ve aşağıdaki canlı web arama sonuçlarını kesin olarak esas alacaksın. Kaynak numaralarıyla ([1], [2] vb.) bilgiye atıf yapabilirsin.`,
            '',
        ];

        sources.forEach((src, idx) => {
            lines.push(`### [${idx + 1}] ${src.title}`);
            lines.push(`- **URL**: ${src.url}`);
            if (src.domain) {
                lines.push(`- **Kaynak Site**: ${src.domain}`);
            }

            if (src.snippet) {
                lines.push(`- **Arama Özeti (Snippet)**: ${src.snippet}`);
            }

            if (src.summary && depth === 'deep') {
                lines.push(`- **Öne Çıkan Bulgular**: ${src.summary}`);
            }

            if (src.content && depth !== 'fast') {
                const maxLen = depth === 'deep' ? 1600 : 1000;
                lines.push(`- **Sayfa İçeriği/Alıntı**: ${src.content.substring(0, maxLen)}...`);
            }
            lines.push('');
        });

        lines.push('=== GÜNCEL WEB VERİLERİNİN SONU ===');
        return lines.join('\n');
    }

    /**
     * Formats gathered web sources into a readable standalone Markdown document for the user
     */
    public static generateSourcesMarkdown(
        sessionOrQuery: ChatSession | string,
        msgOrSources: ChatMessage | WebSourceItem[],
        settings?: ExtensionSettings,
    ): string {
        let query = '';
        let sources: WebSourceItem[] = [];
        let sessionTitle = '';
        if (typeof sessionOrQuery === 'object' && 'title' in sessionOrQuery) {
            const session = sessionOrQuery as ChatSession;
            sessionTitle = session.title;
            const msg = msgOrSources as ChatMessage;
            sources = msg.webSources || [];
            const msgIdx = session.messages.findIndex((m: ChatMessage) => m.id === msg.id);
            if (msgIdx > 0) {
                query = session.messages[msgIdx - 1]?.content || session.title;
            } else {
                query = session.title;
            }
        } else {
            query = sessionOrQuery as string;
            sources = msgOrSources as WebSourceItem[];
        }

        const depth = settings?.webSearchDepth || 'standard';
        const engine = settings?.webSearchEngine || 'duckduckgo';
        const dateStr = new Date().toLocaleString();

        const lines: string[] = [
            `# 🌐 Web Araştırma Kaynakları Raporu`,
            ``,
            `| Parametre | Değer |`,
            `| :--- | :--- |`,
            ...(sessionTitle ? [`| **Oturum** | \`${sessionTitle}\` |`] : []),
            `| **Arama Sorgusu / Bağlam** | \`${query.length > 80 ? query.slice(0, 80) + '...' : query}\` |`,
            `| **Arama Motoru** | ${engine === 'duckduckgo' ? 'DuckDuckGo' : engine} |`,
            `| **Analiz Derinliği** | ${depth === 'deep' ? '🔍 Derin Analiz' : depth === 'fast' ? '⚡ Hızlı (Snippet)' : '📄 Standart (Sayfa Özeti)'} |`,
            `| **Bulunan Kaynak Sayısı** | ${sources.length} adet |`,
            `| **Tarih** | ${dateStr} |`,
            ``,
            `---`,
            ``,
            `## 📑 Başvurulan Kaynaklar ve İnceleme Detayları`,
            ``,
        ];

        if (sources.length === 0) {
            lines.push(`*Bu arama için herhangi bir web kaynağı bulunamadı veya sonuçlar filtreye takıldı.*`);
            return lines.join('\n');
        }

        sources.forEach((src, idx) => {
            lines.push(`### ${idx + 1}. [${src.title}](${src.url})`);
            lines.push(`- **Kaynak Web Sitesi**: \`${src.domain || src.url}\``);
            lines.push(`- **Doğrudan Bağlantı**: [${src.url}](${src.url})`);
            lines.push(``);

            if (src.snippet) {
                lines.push(`> **Arama Snippet'ı:**  `);
                lines.push(`> ${src.snippet}`);
                lines.push(``);
            }

            if (src.summary) {
                lines.push(`**🔍 Derin Analiz Özeti:**  `);
                lines.push(`${src.summary}`);
                lines.push(``);
            }

            if (src.content) {
                lines.push(`<details>`);
                lines.push(`<summary><b>📄 Taranan Sayfa Metni (Genişlet)</b></summary>`);
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

        lines.push(`*Bu rapor OllamaChat İnternet & Web Araştırma motoru tarafından otomatik oluşturulmuştur.*`);
        return lines.join('\n');
    }
}
