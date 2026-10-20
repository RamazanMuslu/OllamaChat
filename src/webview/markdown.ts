// Lightweight, dependency-free Markdown & Code Highlighter tailored for VS Code Webview

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Basic syntax highlighter for code snippets
function highlightCode(code: string, lang: string): string {
    const escaped = escapeHtml(code);
    const l = (lang || '').toLowerCase().trim();

    // Regex tokens
    const commentRegex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)/g;
    const stringRegex = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g;
    const numberRegex = /\b(\d+(?:\.\d+)?(?:e[+-]?\d+)?)\b/g;

    let keywordsRegex = /\b(const|let|var|function|return|if|else|for|while|import|export|from|class|extends|new|this|async|await|try|catch|finally|throw|typeof|interface|type|public|private|protected|def|elif|print|self|None|True|False|package|func|struct|impl|mut|match|fn)\b/g;

    if (l === 'python' || l === 'py') {
        keywordsRegex = /\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|raise|with|lambda|yield|pass|break|continue|async|await|None|True|False|in|is|not|and|or|global|nonlocal)\b/g;
    } else if (l === 'bash' || l === 'sh' || l === 'zsh') {
        keywordsRegex = /\b(if|then|else|elif|fi|case|esac|for|select|while|until|do|done|in|function|time|echo|export|source|alias|cd|mkdir|rm|cp|mv|chmod|chown|grep|cat)\b/g;
    } else if (l === 'json') {
        // for json, keys vs values
        return escaped
            .replace(/("(\\[^]|[^\\"])*")\s*:/g, '<span class="tok-key">$1</span>:')
            .replace(/:\s*("(\\[^]|[^\\"])*")/g, ': <span class="tok-string">$1</span>')
            .replace(numberRegex, '<span class="tok-number">$1</span>')
            .replace(/\b(true|false|null)\b/g, '<span class="tok-keyword">$1</span>');
    }

    // Replace strings & comments with placeholders to avoid nested matching
    const tokens: string[] = [];
    let processed = escaped;

    // Comments
    processed = processed.replace(commentRegex, (m) => {
        const id = `__COMM_${tokens.length}__`;
        tokens.push(`<span class="tok-comment">${m}</span>`);
        return id;
    });

    // Strings
    processed = processed.replace(stringRegex, (m) => {
        const id = `__STR_${tokens.length}__`;
        tokens.push(`<span class="tok-string">${m}</span>`);
        return id;
    });

    // Numbers
    processed = processed.replace(numberRegex, '<span class="tok-number">$1</span>');

    // Keywords
    processed = processed.replace(keywordsRegex, '<span class="tok-keyword">$1</span>');

    // Restore placeholders
    tokens.forEach((val, idx) => {
        processed = processed.replace(`__COMM_${idx}__`, val);
        processed = processed.replace(`__STR_${idx}__`, val);
    });

    return processed;
}

function extractAgentActionBlocks(text: string): { processedText: string; actionBlocks: string[] } {
    const actionBlocks: string[] = [];

    // Match <write_file path="...">...</write_file>
    let processed = text.replace(/<write_file\s+path=["']([^"']+)["']\s*>([\s\S]*?)(?:<\/write_file>|$)/gi, (_, path, content) => {
        const idx = actionBlocks.length;
        const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">✍️</span>
        <span class="agent-dropline-title">Dosya Yazma</span>
        <span class="agent-dropline-path">${escapeHtml(path)}</span>
    </summary>
    <div class="agent-dropline-body">
        <pre class="agent-dropline-code"><code>${highlightCode(content.trim(), 'typescript')}</code></pre>
    </div>
</details>`;
        actionBlocks.push(blockHtml);
        return `\n\n__AGENT_ACTION_PLACEHOLDER_${idx}__\n\n`;
    });

    // Match <edit_file path="...">...</edit_file>
    processed = processed.replace(/<edit_file\s+path=["']([^"']+)["']\s*>([\s\S]*?)(?:<\/edit_file>|$)/gi, (_, path, content) => {
        const idx = actionBlocks.length;
        const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">📝</span>
        <span class="agent-dropline-title">Dosya Düzenleme</span>
        <span class="agent-dropline-path">${escapeHtml(path)}</span>
    </summary>
    <div class="agent-dropline-body">
        <pre class="agent-dropline-code"><code>${highlightCode(content.trim(), 'typescript')}</code></pre>
    </div>
</details>`;
        actionBlocks.push(blockHtml);
        return `\n\n__AGENT_ACTION_PLACEHOLDER_${idx}__\n\n`;
    });

    // Match <read_file path="..."> or <cat path="...">
    processed = processed.replace(/<(?:read_file|cat)\s+path=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:read_file|cat)>|\s*>)/gi, (_, path) => {
        const idx = actionBlocks.length;
        const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">📖</span>
        <span class="agent-dropline-title">Dosya Okuma</span>
        <span class="agent-dropline-path">${escapeHtml(path)}</span>
    </summary>
</details>`;
        actionBlocks.push(blockHtml);
        return `\n\n__AGENT_ACTION_PLACEHOLDER_${idx}__\n\n`;
    });

    // Match <create_folder path="..."> or <create_dir path="...">
    processed = processed.replace(/<(?:create_folder|create_dir)\s+path=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:create_folder|create_dir)>|\s*>)/gi, (_, path) => {
        const idx = actionBlocks.length;
        const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">📁</span>
        <span class="agent-dropline-title">Klasör Oluşturma</span>
        <span class="agent-dropline-path">${escapeHtml(path)}</span>
    </summary>
</details>`;
        actionBlocks.push(blockHtml);
        return `\n\n__AGENT_ACTION_PLACEHOLDER_${idx}__\n\n`;
    });

    // Match <delete_path path="...">
    processed = processed.replace(/<(?:delete_path|delete_file|delete_folder)\s+path=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:delete_path|delete_file|delete_folder)>|\s*>)/gi, (_, path) => {
        const idx = actionBlocks.length;
        const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">🗑️</span>
        <span class="agent-dropline-title">Silme Eylemi</span>
        <span class="agent-dropline-path">${escapeHtml(path)}</span>
    </summary>
</details>`;
        actionBlocks.push(blockHtml);
        return `\n\n__AGENT_ACTION_PLACEHOLDER_${idx}__\n\n`;
    });

    // Match <move_path from="..." to="...">
    processed = processed.replace(/<(?:move_path|rename_path)\s+from=["']([^"']+)["']\s+to=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:move_path|rename_path)>|\s*>)/gi, (_, fromPath, toPath) => {
        const idx = actionBlocks.length;
        const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">📦</span>
        <span class="agent-dropline-title">Taşıma / Yeniden Adlandırma</span>
        <span class="agent-dropline-path">${escapeHtml(fromPath)} ➜ ${escapeHtml(toPath)}</span>
    </summary>
</details>`;
        actionBlocks.push(blockHtml);
        return `\n\n__AGENT_ACTION_PLACEHOLDER_${idx}__\n\n`;
    });

    // Match <list_dir path="...">
    processed = processed.replace(/<(?:list_dir|list_files)(?:\s+path=["']([^"']*)["'])?(?:\s*\/>|\s*>[\s\S]*?<\/(?:list_dir|list_files)>|\s*>)/gi, (_, path) => {
        const idx = actionBlocks.length;
        const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">📂</span>
        <span class="agent-dropline-title">Dizin Listeleme</span>
        <span class="agent-dropline-path">${escapeHtml(path || '.')}</span>
    </summary>
</details>`;
        actionBlocks.push(blockHtml);
        return `\n\n__AGENT_ACTION_PLACEHOLDER_${idx}__\n\n`;
    });

    // Match <find_files pattern="...">
    processed = processed.replace(/<find_files\s+pattern=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/find_files>|\s*>)/gi, (_, pattern) => {
        const idx = actionBlocks.length;
        const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">🔍</span>
        <span class="agent-dropline-title">Dosya Arama</span>
        <span class="agent-dropline-path">${escapeHtml(pattern)}</span>
    </summary>
</details>`;
        actionBlocks.push(blockHtml);
        return `\n\n__AGENT_ACTION_PLACEHOLDER_${idx}__\n\n`;
    });

    // Match <grep query="..." ...>
    processed = processed.replace(/<grep\s+query=["']([^"']+)["'](?:\s+path=["']([^"']*)["'])?(?:\s+is_regex=["'](?:true|false)["'])?(?:\s*\/>|\s*>[\s\S]*?<\/grep>|\s*>)/gi, (_, query, path) => {
        const idx = actionBlocks.length;
        const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">🔎</span>
        <span class="agent-dropline-title">Kod Araması (Grep)</span>
        <span class="agent-dropline-path">"${escapeHtml(query)}" ${path ? `in ${escapeHtml(path)}` : ''}</span>
    </summary>
</details>`;
        actionBlocks.push(blockHtml);
        return `\n\n__AGENT_ACTION_PLACEHOLDER_${idx}__\n\n`;
    });

    // Match <run_command>cmd</run_command>
    processed = processed.replace(/<(?:run_command|execute_command)>([\s\S]*?)<\/(?:run_command|execute_command)>/gi, (_, cmd) => {
        const idx = actionBlocks.length;
        const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">⚡</span>
        <span class="agent-dropline-title">Terminal Komutu</span>
        <span class="agent-dropline-path"><code>${escapeHtml(cmd.trim())}</code></span>
    </summary>
</details>`;
        actionBlocks.push(blockHtml);
        return `\n\n__AGENT_ACTION_PLACEHOLDER_${idx}__\n\n`;
    });

    // Match <web_search query="..." /> or <web_search>query</web_search>
    processed = processed.replace(/<web_search(?:\s+query=["']([^"']+)["'])?(?:\s*\/>|\s*>([\s\S]*?)<\/web_search>|\s*>)/gi, (_, q1, q2) => {
        const query = (q1 || q2 || '').trim();
        const idx = actionBlocks.length;
        const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">🌐</span>
        <span class="agent-dropline-title">Web Araması</span>
        <span class="agent-dropline-path">"${escapeHtml(query)}"</span>
    </summary>
</details>`;
        actionBlocks.push(blockHtml);
        return `\n\n__AGENT_ACTION_PLACEHOLDER_${idx}__\n\n`;
    });

    return { processedText: processed, actionBlocks };
}

export function renderMarkdown(markdown: string, isStreaming = false, copyLabel = 'Copy', copyTitle = 'Copy Code'): string {
    if (!markdown) {
        return '';
    }

    const { processedText: cleanMarkdown, actionBlocks } = extractAgentActionBlocks(markdown);

    // Split code blocks (including unclosed code blocks during streaming)
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)(?:```|$)/g;

    const parts: string[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = codeBlockRegex.exec(cleanMarkdown)) !== null) {
        // Push markdown before code block
        const before = cleanMarkdown.slice(lastIndex, match.index);
        if (before) {
            parts.push(renderTextMarkdown(before));
        }

        const lang = match[1] || 'plaintext';
        const code = match[2];
        const highlighted = highlightCode(code, lang);
        const encodedRawCode = encodeURIComponent(code);

        parts.push(`
            <div class="code-block-wrapper">
                <div class="code-block-header">
                    <span class="code-block-lang">${escapeHtml(lang)}</span>
                    <button class="code-copy-btn" data-code="${encodedRawCode}" title="${escapeHtml(copyTitle)}">
                        <svg class="icon-copy" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        <span>${escapeHtml(copyLabel)}</span>
                    </button>
                </div>
                <pre class="code-block-content"><code class="language-${escapeHtml(lang)}">${highlighted}</code></pre>
            </div>
        `);

        lastIndex = match.index + match[0].length;
    }

    // Push remaining text after last code block
    if (lastIndex < cleanMarkdown.length) {
        parts.push(renderTextMarkdown(cleanMarkdown.slice(lastIndex)));
    }

    let result = parts.join('');

    // Restore agent action droplines
    result = result.replace(/__AGENT_ACTION_PLACEHOLDER_(\d+)__/g, (_, idx) => {
        return actionBlocks[Number(idx)] || '';
    });

    if (isStreaming) {
        result += `<span class="streaming-cursor"></span>`;
    }

    return result;
}

function splitRow(line: string): string[] {
    let text = line.trim();
    // Protect escaped pipes
    text = text.replace(/\\\|/g, '__ESCAPED_PIPE__');
    // Protect pipes inside inline code backticks
    text = text.replace(/`([^`]+)`/g, (_, code) => '`' + code.replace(/\|/g, '__INLINE_PIPE__') + '`');

    if (text.startsWith('|')) {
        text = text.slice(1);
    }
    if (text.endsWith('|')) {
        text = text.slice(0, -1);
    }

    return text.split('|').map(cell =>
        cell.trim()
            .replace(/__ESCAPED_PIPE__/g, '|')
            .replace(/__INLINE_PIPE__/g, '|')
    );
}

function isDelimiterRow(line: string): boolean {
    if (!line.includes('|') && !/^:?-+:?$/.test(line.trim())) {
        return false;
    }
    const cells = splitRow(line);
    if (cells.length === 0) {
        return false;
    }
    return cells.every(c => /^:?-+:?$/.test(c.trim()));
}

function parseAlignments(delimLine: string): ('left' | 'center' | 'right' | '')[] {
    const cells = splitRow(delimLine);
    return cells.map(c => {
        const trimmed = c.trim();
        const left = trimmed.startsWith(':');
        const right = trimmed.endsWith(':');
        if (left && right) {
            return 'center';
        }
        if (right) {
            return 'right';
        }
        if (left) {
            return 'left';
        }
        return '';
    });
}

function renderInlineMarkdown(text: string): string {
    let out = text;
    // Bold & Italic
    out = out.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    out = out.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Strikethrough
    out = out.replace(/~~(.*?)~~/g, '<del>$1</del>');
    // Inline Code
    out = out.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    // Safe Links [text](url)
    out = out.replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:|#)[^\s)]+)\)/g, '<a href="$2" class="chat-link" target="_blank" rel="noopener noreferrer">$1</a>');
    return out;
}

function renderTable(tableLines: string[]): string {
    if (tableLines.length < 2) {
        return '';
    }

    const headerCells = splitRow(tableLines[0]);
    const alignments = parseAlignments(tableLines[1]);
    const colCount = Math.max(headerCells.length, alignments.length);

    let html = '<div class="table-container">\n<table>\n<thead>\n<tr>\n';

    for (let i = 0; i < colCount; i++) {
        const cellText = headerCells[i] || '';
        const align = alignments[i];
        const alignAttr = align ? ` style="text-align: ${align};"` : '';
        html += `  <th${alignAttr}>${renderInlineMarkdown(escapeHtml(cellText))}</th>\n`;
    }

    html += '</tr>\n</thead>\n';

    const dataLines = tableLines.slice(2);
    if (dataLines.length > 0) {
        html += '<tbody>\n';
        for (const line of dataLines) {
            const cells = splitRow(line);
            // Skip line if it's completely empty
            if (cells.length === 1 && cells[0] === '') {
                continue;
            }
            html += '<tr>\n';
            for (let i = 0; i < colCount; i++) {
                const cellText = cells[i] || '';
                const align = alignments[i];
                const alignAttr = align ? ` style="text-align: ${align};"` : '';
                html += `  <td${alignAttr}>${renderInlineMarkdown(escapeHtml(cellText))}</td>\n`;
            }
            html += '</tr>\n';
        }
        html += '</tbody>\n';
    }

    html += '</table>\n</div>';
    return html;
}

function extractTables(text: string): { processedText: string; tables: string[] } {
    const lines = text.split('\n');
    const tables: string[] = [];
    const newLines: string[] = [];

    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        const nextLine = i + 1 < lines.length ? lines[i + 1] : null;

        if (line.includes('|') && nextLine !== null && isDelimiterRow(nextLine)) {
            const tableLines: string[] = [line, nextLine];
            i += 2;

            while (i < lines.length && lines[i].includes('|')) {
                tableLines.push(lines[i]);
                i++;
            }

            const placeholder = `__TABLE_PLACEHOLDER_${tables.length}__`;
            tables.push(renderTable(tableLines));
            newLines.push('', placeholder, '');
        } else {
            newLines.push(line);
            i++;
        }
    }

    return {
        processedText: newLines.join('\n'),
        tables
    };
}

function renderTextMarkdown(text: string): string {
    const { processedText, tables } = extractTables(text);

    let out = escapeHtml(processedText);

    // Headers
    out = out.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    out = out.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    out = out.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Inline formatting: Bold, Italic, Strikethrough, Code, Links
    out = renderInlineMarkdown(out);

    // Blockquote
    out = out.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Lists (unordered and ordered)
    out = out.replace(/^\s*[-*]\s+(.*$)/gim, '<li>$1</li>');
    out = out.replace(/^\s*\d+\.\s+(.*$)/gim, '<li>$1</li>');
    out = out.replace(/((?:<li>.*?<\/li>\s*)+)/g, '<ul>$1</ul>');

    // Line breaks (convert double newline to paragraph, single newline to <br/>)
    const paragraphs = out.split(/\n\n+/);
    out = paragraphs
        .map(p => {
            const trimmed = p.trim();
            if (!trimmed) {
                return '';
            }
            if (trimmed.startsWith('<h') || trimmed.startsWith('<ul>') || trimmed.startsWith('<blockquote>')) {
                return trimmed;
            }
            if (/^__TABLE_PLACEHOLDER_\d+__$/.test(trimmed) || /^__AGENT_ACTION_PLACEHOLDER_\d+__$/.test(trimmed)) {
                return trimmed;
            }
            return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`;
        })
        .join('');

    // Restore tables
    out = out.replace(/__TABLE_PLACEHOLDER_(\d+)__/g, (_, idx) => {
        return tables[Number(idx)] || '';
    });

    return out;
}
