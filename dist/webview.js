"use strict";
(() => {
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

  // src/webview/markdown.ts
  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function highlightCode(code, lang) {
    const escaped = escapeHtml(code);
    const l = (lang || "").toLowerCase().trim();
    const commentRegex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)/g;
    const stringRegex = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g;
    const numberRegex = /\b(\d+(?:\.\d+)?(?:e[+-]?\d+)?)\b/g;
    let keywordsRegex = /\b(const|let|var|function|return|if|else|for|while|import|export|from|class|extends|new|this|async|await|try|catch|finally|throw|typeof|interface|type|public|private|protected|def|elif|print|self|None|True|False|package|func|struct|impl|mut|match|fn)\b/g;
    if (l === "python" || l === "py") {
      keywordsRegex = /\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|raise|with|lambda|yield|pass|break|continue|async|await|None|True|False|in|is|not|and|or|global|nonlocal)\b/g;
    } else if (l === "bash" || l === "sh" || l === "zsh") {
      keywordsRegex = /\b(if|then|else|elif|fi|case|esac|for|select|while|until|do|done|in|function|time|echo|export|source|alias|cd|mkdir|rm|cp|mv|chmod|chown|grep|cat)\b/g;
    } else if (l === "json") {
      return escaped.replace(/("(\\[^]|[^\\"])*")\s*:/g, '<span class="tok-key">$1</span>:').replace(/:\s*("(\\[^]|[^\\"])*")/g, ': <span class="tok-string">$1</span>').replace(numberRegex, '<span class="tok-number">$1</span>').replace(/\b(true|false|null)\b/g, '<span class="tok-keyword">$1</span>');
    }
    const tokens = [];
    let processed = escaped;
    processed = processed.replace(commentRegex, (m) => {
      const id = `__COMM_${tokens.length}__`;
      tokens.push(`<span class="tok-comment">${m}</span>`);
      return id;
    });
    processed = processed.replace(stringRegex, (m) => {
      const id = `__STR_${tokens.length}__`;
      tokens.push(`<span class="tok-string">${m}</span>`);
      return id;
    });
    processed = processed.replace(numberRegex, '<span class="tok-number">$1</span>');
    processed = processed.replace(keywordsRegex, '<span class="tok-keyword">$1</span>');
    tokens.forEach((val, idx) => {
      processed = processed.replace(`__COMM_${idx}__`, val);
      processed = processed.replace(`__STR_${idx}__`, val);
    });
    return processed;
  }
  function extractAgentActionBlocks(text) {
    const actionBlocks = [];
    let processed = text.replace(/<write_file\s+path=["']([^"']+)["']\s*>([\s\S]*?)(?:<\/write_file>|$)/gi, (_, path, content) => {
      const idx = actionBlocks.length;
      const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u270D\uFE0F</span>
        <span class="agent-dropline-title">Dosya Yazma</span>
        <span class="agent-dropline-path">${escapeHtml(path)}</span>
    </summary>
    <div class="agent-dropline-body">
        <pre class="agent-dropline-code"><code>${highlightCode(content.trim(), "typescript")}</code></pre>
    </div>
</details>`;
      actionBlocks.push(blockHtml);
      return `

__AGENT_ACTION_PLACEHOLDER_${idx}__

`;
    });
    processed = processed.replace(/<edit_file\s+path=["']([^"']+)["']\s*>([\s\S]*?)(?:<\/edit_file>|$)/gi, (_, path, content) => {
      const idx = actionBlocks.length;
      const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u{1F4DD}</span>
        <span class="agent-dropline-title">Dosya D\xFCzenleme</span>
        <span class="agent-dropline-path">${escapeHtml(path)}</span>
    </summary>
    <div class="agent-dropline-body">
        <pre class="agent-dropline-code"><code>${highlightCode(content.trim(), "typescript")}</code></pre>
    </div>
</details>`;
      actionBlocks.push(blockHtml);
      return `

__AGENT_ACTION_PLACEHOLDER_${idx}__

`;
    });
    processed = processed.replace(/<(?:read_file|cat)\s+path=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:read_file|cat)>|\s*>)/gi, (_, path) => {
      const idx = actionBlocks.length;
      const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u{1F4D6}</span>
        <span class="agent-dropline-title">Dosya Okuma</span>
        <span class="agent-dropline-path">${escapeHtml(path)}</span>
    </summary>
</details>`;
      actionBlocks.push(blockHtml);
      return `

__AGENT_ACTION_PLACEHOLDER_${idx}__

`;
    });
    processed = processed.replace(/<(?:create_folder|create_dir)\s+path=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:create_folder|create_dir)>|\s*>)/gi, (_, path) => {
      const idx = actionBlocks.length;
      const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u{1F4C1}</span>
        <span class="agent-dropline-title">Klas\xF6r Olu\u015Fturma</span>
        <span class="agent-dropline-path">${escapeHtml(path)}</span>
    </summary>
</details>`;
      actionBlocks.push(blockHtml);
      return `

__AGENT_ACTION_PLACEHOLDER_${idx}__

`;
    });
    processed = processed.replace(/<(?:delete_path|delete_file|delete_folder)\s+path=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:delete_path|delete_file|delete_folder)>|\s*>)/gi, (_, path) => {
      const idx = actionBlocks.length;
      const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u{1F5D1}\uFE0F</span>
        <span class="agent-dropline-title">Silme Eylemi</span>
        <span class="agent-dropline-path">${escapeHtml(path)}</span>
    </summary>
</details>`;
      actionBlocks.push(blockHtml);
      return `

__AGENT_ACTION_PLACEHOLDER_${idx}__

`;
    });
    processed = processed.replace(/<(?:move_path|rename_path)\s+from=["']([^"']+)["']\s+to=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:move_path|rename_path)>|\s*>)/gi, (_, fromPath, toPath) => {
      const idx = actionBlocks.length;
      const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u{1F4E6}</span>
        <span class="agent-dropline-title">Ta\u015F\u0131ma / Yeniden Adland\u0131rma</span>
        <span class="agent-dropline-path">${escapeHtml(fromPath)} \u279C ${escapeHtml(toPath)}</span>
    </summary>
</details>`;
      actionBlocks.push(blockHtml);
      return `

__AGENT_ACTION_PLACEHOLDER_${idx}__

`;
    });
    processed = processed.replace(/<(?:list_dir|list_files)(?:\s+path=["']([^"']*)["'])?(?:\s*\/>|\s*>[\s\S]*?<\/(?:list_dir|list_files)>|\s*>)/gi, (_, path) => {
      const idx = actionBlocks.length;
      const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u{1F4C2}</span>
        <span class="agent-dropline-title">Dizin Listeleme</span>
        <span class="agent-dropline-path">${escapeHtml(path || ".")}</span>
    </summary>
</details>`;
      actionBlocks.push(blockHtml);
      return `

__AGENT_ACTION_PLACEHOLDER_${idx}__

`;
    });
    processed = processed.replace(/<find_files\s+pattern=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/find_files>|\s*>)/gi, (_, pattern) => {
      const idx = actionBlocks.length;
      const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u{1F50D}</span>
        <span class="agent-dropline-title">Dosya Arama</span>
        <span class="agent-dropline-path">${escapeHtml(pattern)}</span>
    </summary>
</details>`;
      actionBlocks.push(blockHtml);
      return `

__AGENT_ACTION_PLACEHOLDER_${idx}__

`;
    });
    processed = processed.replace(/<grep\s+query=["']([^"']+)["'](?:\s+path=["']([^"']*)["'])?(?:\s+is_regex=["'](?:true|false)["'])?(?:\s*\/>|\s*>[\s\S]*?<\/grep>|\s*>)/gi, (_, query, path) => {
      const idx = actionBlocks.length;
      const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u{1F50E}</span>
        <span class="agent-dropline-title">Kod Aramas\u0131 (Grep)</span>
        <span class="agent-dropline-path">"${escapeHtml(query)}" ${path ? `in ${escapeHtml(path)}` : ""}</span>
    </summary>
</details>`;
      actionBlocks.push(blockHtml);
      return `

__AGENT_ACTION_PLACEHOLDER_${idx}__

`;
    });
    processed = processed.replace(/<(?:run_command|execute_command)>([\s\S]*?)<\/(?:run_command|execute_command)>/gi, (_, cmd) => {
      const idx = actionBlocks.length;
      const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u26A1</span>
        <span class="agent-dropline-title">Terminal Komutu</span>
        <span class="agent-dropline-path"><code>${escapeHtml(cmd.trim())}</code></span>
    </summary>
</details>`;
      actionBlocks.push(blockHtml);
      return `

__AGENT_ACTION_PLACEHOLDER_${idx}__

`;
    });
    processed = processed.replace(/<web_search(?:\s+query=["']([^"']+)["'])?(?:\s*\/>|\s*>([\s\S]*?)<\/web_search>|\s*>)/gi, (_, q1, q2) => {
      const query = (q1 || q2 || "").trim();
      const idx = actionBlocks.length;
      const blockHtml = `
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u{1F310}</span>
        <span class="agent-dropline-title">Web Aramas\u0131</span>
        <span class="agent-dropline-path">"${escapeHtml(query)}"</span>
    </summary>
</details>`;
      actionBlocks.push(blockHtml);
      return `

__AGENT_ACTION_PLACEHOLDER_${idx}__

`;
    });
    return { processedText: processed, actionBlocks };
  }
  function renderMarkdown(markdown, isStreaming2 = false, copyLabel = "Copy", copyTitle = "Copy Code") {
    if (!markdown) {
      return "";
    }
    const { processedText: cleanMarkdown, actionBlocks } = extractAgentActionBlocks(markdown);
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)(?:```|$)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = codeBlockRegex.exec(cleanMarkdown)) !== null) {
      const before = cleanMarkdown.slice(lastIndex, match.index);
      if (before) {
        parts.push(renderTextMarkdown(before));
      }
      const lang = match[1] || "plaintext";
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
    if (lastIndex < cleanMarkdown.length) {
      parts.push(renderTextMarkdown(cleanMarkdown.slice(lastIndex)));
    }
    let result = parts.join("");
    result = result.replace(/__AGENT_ACTION_PLACEHOLDER_(\d+)__/g, (_, idx) => {
      return actionBlocks[Number(idx)] || "";
    });
    if (isStreaming2) {
      result += `<span class="streaming-cursor"></span>`;
    }
    return result;
  }
  function splitRow(line) {
    let text = line.trim();
    text = text.replace(/\\\|/g, "__ESCAPED_PIPE__");
    text = text.replace(/`([^`]+)`/g, (_, code) => "`" + code.replace(/\|/g, "__INLINE_PIPE__") + "`");
    if (text.startsWith("|")) {
      text = text.slice(1);
    }
    if (text.endsWith("|")) {
      text = text.slice(0, -1);
    }
    return text.split("|").map(
      (cell) => cell.trim().replace(/__ESCAPED_PIPE__/g, "|").replace(/__INLINE_PIPE__/g, "|")
    );
  }
  function isDelimiterRow(line) {
    if (!line.includes("|") && !/^:?-+:?$/.test(line.trim())) {
      return false;
    }
    const cells = splitRow(line);
    if (cells.length === 0) {
      return false;
    }
    return cells.every((c) => /^:?-+:?$/.test(c.trim()));
  }
  function parseAlignments(delimLine) {
    const cells = splitRow(delimLine);
    return cells.map((c) => {
      const trimmed = c.trim();
      const left = trimmed.startsWith(":");
      const right = trimmed.endsWith(":");
      if (left && right) {
        return "center";
      }
      if (right) {
        return "right";
      }
      if (left) {
        return "left";
      }
      return "";
    });
  }
  function renderInlineMarkdown(text) {
    let out = text;
    out = out.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
    out = out.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/\*(.*?)\*/g, "<em>$1</em>");
    out = out.replace(/~~(.*?)~~/g, "<del>$1</del>");
    out = out.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    out = out.replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:|#)[^\s)]+)\)/g, '<a href="$2" class="chat-link" target="_blank" rel="noopener noreferrer">$1</a>');
    return out;
  }
  function renderTable(tableLines) {
    if (tableLines.length < 2) {
      return "";
    }
    const headerCells = splitRow(tableLines[0]);
    const alignments = parseAlignments(tableLines[1]);
    const colCount = Math.max(headerCells.length, alignments.length);
    let html = '<div class="table-container">\n<table>\n<thead>\n<tr>\n';
    for (let i = 0; i < colCount; i++) {
      const cellText = headerCells[i] || "";
      const align = alignments[i];
      const alignAttr = align ? ` style="text-align: ${align};"` : "";
      html += `  <th${alignAttr}>${renderInlineMarkdown(escapeHtml(cellText))}</th>
`;
    }
    html += "</tr>\n</thead>\n";
    const dataLines = tableLines.slice(2);
    if (dataLines.length > 0) {
      html += "<tbody>\n";
      for (const line of dataLines) {
        const cells = splitRow(line);
        if (cells.length === 1 && cells[0] === "") {
          continue;
        }
        html += "<tr>\n";
        for (let i = 0; i < colCount; i++) {
          const cellText = cells[i] || "";
          const align = alignments[i];
          const alignAttr = align ? ` style="text-align: ${align};"` : "";
          html += `  <td${alignAttr}>${renderInlineMarkdown(escapeHtml(cellText))}</td>
`;
        }
        html += "</tr>\n";
      }
      html += "</tbody>\n";
    }
    html += "</table>\n</div>";
    return html;
  }
  function extractTables(text) {
    const lines = text.split("\n");
    const tables = [];
    const newLines = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const nextLine = i + 1 < lines.length ? lines[i + 1] : null;
      if (line.includes("|") && nextLine !== null && isDelimiterRow(nextLine)) {
        const tableLines = [line, nextLine];
        i += 2;
        while (i < lines.length && lines[i].includes("|")) {
          tableLines.push(lines[i]);
          i++;
        }
        const placeholder = `__TABLE_PLACEHOLDER_${tables.length}__`;
        tables.push(renderTable(tableLines));
        newLines.push("", placeholder, "");
      } else {
        newLines.push(line);
        i++;
      }
    }
    return {
      processedText: newLines.join("\n"),
      tables
    };
  }
  function renderTextMarkdown(text) {
    const { processedText, tables } = extractTables(text);
    let out = escapeHtml(processedText);
    out = out.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    out = out.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    out = out.replace(/^# (.*$)/gim, "<h1>$1</h1>");
    out = renderInlineMarkdown(out);
    out = out.replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>");
    out = out.replace(/^\s*[-*]\s+(.*$)/gim, "<li>$1</li>");
    out = out.replace(/^\s*\d+\.\s+(.*$)/gim, "<li>$1</li>");
    out = out.replace(/((?:<li>.*?<\/li>\s*)+)/g, "<ul>$1</ul>");
    const paragraphs = out.split(/\n\n+/);
    out = paragraphs.map((p) => {
      const trimmed = p.trim();
      if (!trimmed) {
        return "";
      }
      if (trimmed.startsWith("<h") || trimmed.startsWith("<ul>") || trimmed.startsWith("<blockquote>")) {
        return trimmed;
      }
      if (/^__TABLE_PLACEHOLDER_\d+__$/.test(trimmed) || /^__AGENT_ACTION_PLACEHOLDER_\d+__$/.test(trimmed)) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, "<br/>")}</p>`;
    }).join("");
    out = out.replace(/__TABLE_PLACEHOLDER_(\d+)__/g, (_, idx) => {
      return tables[Number(idx)] || "";
    });
    return out;
  }

  // src/webview/main.ts
  var vscode = acquireVsCodeApi();
  var sessions = [];
  var activeSessionId = "";
  var models = [];
  var installedOllamaModels = [];
  var settings = {
    ollamaUrl: "http://127.0.0.1:11434",
    defaultSystemPrompt: "",
    defaultMaxTokens: 4096
  };
  var username = "Geli\u015Ftirici";
  var activeModelId = "";
  var currentMode = "chat";
  var currentLang = "en";
  var t = getTranslation("en");
  var vscodeLanguage = "";
  var isStreaming = false;
  var lastPrompt = "";
  var currentStreamingText = "";
  var thinkingInterval = null;
  var thinkingStartTime = 0;
  var lastSpeedRecorded = 0;
  var workspaceFiles = [];
  var mentionSelectedIndex = 0;
  var mentionCurrentMatches = [];
  var mentionCurrentTrigger = "@";
  var mentionMatchStart = 0;
  var lastSelectedWebAccess = false;
  var sessionTitleEl = document.getElementById("sessionTitle");
  var sessionSelectorBtn = document.getElementById("sessionSelectorBtn");
  var newSessionBtn = document.getElementById("newSessionBtn");
  var sessionDropdown = document.getElementById("sessionDropdown");
  var sessionSearchInput = document.getElementById("sessionSearchInput");
  var sessionListEl = document.getElementById("sessionList");
  var chatContainer = document.getElementById("chatContainer");
  var chatTextarea = document.getElementById("chatTextarea");
  var sendBtn = document.getElementById("sendBtn");
  var settingsBtn = document.getElementById("settingsBtn");
  var modelBadgeBtn = document.getElementById("modelBadgeBtn");
  var modelBadgeName = document.getElementById("modelBadgeName");
  var modeBadgeBtn = document.getElementById("modeBadgeBtn");
  var modeBadgeIcon = document.getElementById("modeBadgeIcon");
  var modeBadgeName = document.getElementById("modeBadgeName");
  var webAccessBtn = document.getElementById("webAccessBtn");
  var tokenStatBadge = document.getElementById("tokenStatBadge");
  var kvCachePopover = document.getElementById("kvCachePopover");
  var modelDropdown = document.getElementById("modelDropdown");
  var modelSearchInput = document.getElementById("modelSearchInput");
  var modelListEl = document.getElementById("modelList");
  var modeDropdown = document.getElementById("modeDropdown");
  var modeListEl = document.getElementById("modeList");
  var settingsModal = document.getElementById("settingsModal");
  var closeSettingsBtn = document.getElementById("closeSettingsBtn");
  var toastEl = document.getElementById("toast");
  var mentionAutocomplete = document.getElementById("mentionAutocomplete");
  var dragDropOverlay = document.getElementById("dragDropOverlay");
  var modelEditorModal = document.getElementById("modelEditorModal");
  var closeModelEditorBtn = document.getElementById("closeModelEditorBtn");
  var cancelModelEditorBtn = document.getElementById("cancelModelEditorBtn");
  var saveModelEditorBtn = document.getElementById("saveModelEditorBtn");
  var ollamaImportModal = document.getElementById("ollamaImportModal");
  var closeOllamaImportBtn = document.getElementById("closeOllamaImportBtn");
  var ollamaImportList = document.getElementById("ollamaImportList");
  window.addEventListener("load", () => {
    vscode.postMessage({ type: "ready" });
    setupEventListeners();
  });
  window.addEventListener("message", (event) => {
    const data = event.data;
    switch (data.type) {
      case "initData":
        sessions = data.sessions || [];
        activeSessionId = data.activeSessionId || (sessions[0]?.id || "");
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
        if (data.lastSelectedModelId && models.some((m) => m.id === data.lastSelectedModelId)) {
          activeModelId = data.lastSelectedModelId;
        } else if (models[0]?.id) {
          activeModelId = models[0].id;
        } else if (installedOllamaModels[0]?.name) {
          activeModelId = installedOllamaModels[0].name;
        }
        if (data.lastSelectedWebAccess !== void 0) {
          lastSelectedWebAccess = !!data.lastSelectedWebAccess;
        }
        const initActiveSession = getActiveSession();
        if (initActiveSession) {
          if (initActiveSession.messages.length === 0 || !models.some((m) => m.id === initActiveSession.modelId)) {
            initActiveSession.modelId = activeModelId;
          }
          if (initActiveSession.mode) {
            currentMode = initActiveSession.mode;
          }
          if (initActiveSession.webAccessEnabled === void 0) {
            initActiveSession.webAccessEnabled = lastSelectedWebAccess;
          }
        }
        if (data.lastSelectedMode && (!initActiveSession || !initActiveSession.mode)) {
          currentMode = data.lastSelectedMode;
        }
        applyStaticTranslations();
        renderAll();
        break;
      case "workspaceFiles":
        workspaceFiles = data.files || [];
        break;
      case "modeUpdated":
        if (data.sessionId === activeSessionId) {
          currentMode = data.mode;
          renderModeBadge();
          renderModeDropdown();
        }
        break;
      case "webAccessUpdated":
        {
          lastSelectedWebAccess = !!data.enabled;
          const sess = sessions.find((s) => s.id === data.sessionId);
          if (sess) {
            sess.webAccessEnabled = data.enabled;
          }
          if (data.sessionId === activeSessionId) {
            renderWebAccessBtn();
          }
        }
        break;
      case "webSearching":
        {
          const thinkingTextEl = document.querySelector("#streamingMessageRow .thinking-text");
          if (thinkingTextEl) {
            if (data.searching) {
              thinkingTextEl.textContent = `\u{1F310} ${t.chat.webSearching || "\u0130nternette ara\u015Ft\u0131r\u0131l\u0131yor..."}`;
            } else {
              thinkingTextEl.textContent = t.chat.thinking;
            }
          }
        }
        break;
      case "agentActionUpdated": {
        const { sessionId, messageId, actionId, status, securityAudit, output } = data;
        const sess = sessions.find((s) => s.id === sessionId);
        const msg = sess?.messages.find((m) => m.id === messageId);
        const act = msg?.actions?.find((a) => a.id === actionId);
        if (act) {
          act.status = status;
          if (securityAudit) {
            act.securityAudit = securityAudit;
          }
          if (output !== void 0) {
            act.output = output;
          }
          renderChat();
        }
        break;
      }
      case "newSessionDraft":
        if (data.session) {
          activeSessionId = data.session.id;
          if (data.session.webAccessEnabled === void 0) {
            data.session.webAccessEnabled = lastSelectedWebAccess;
          }
          sessions = sessions.filter((s) => s.messages && s.messages.length > 0);
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
      case "sessionsUpdated":
        {
          const currentDraft = sessions.find((s) => s.id === activeSessionId && (!s.messages || s.messages.length === 0));
          sessions = data.sessions || [];
          if (currentDraft && !sessions.some((s) => s.id === currentDraft.id)) {
            sessions.unshift(currentDraft);
          }
          if (data.activeSessionId) {
            activeSessionId = data.activeSessionId;
          }
          const activeS = getActiveSession();
          if (activeS?.mode) {
            currentMode = activeS.mode;
          }
          if (activeS && activeS.webAccessEnabled === void 0) {
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
      case "modelsUpdated":
        models = data.models || [];
        installedOllamaModels = data.installedOllamaModels || [];
        renderModelBadge();
        renderModelDropdown();
        renderModelsTab();
        break;
      case "settingsUpdated":
        settings = data.settings || settings;
        if (data.language) {
          currentLang = data.language;
          t = getTranslation(currentLang);
          applyStaticTranslations();
        }
        renderSettingsTab();
        showToast(t.settings.savedToast);
        break;
      case "streamStart":
        if (data.sessionId) {
          activeSessionId = data.sessionId;
        }
        break;
      case "streamChunk":
        if (data.sessionId) {
          activeSessionId = data.sessionId;
        }
        stopThinkingTimer();
        isStreaming = true;
        currentStreamingText = data.fullText;
        updateStreamingMessage(data.fullText);
        updateSendButtonState();
        break;
      case "streamDone":
        if (data.sessionId) {
          activeSessionId = data.sessionId;
        }
        stopThinkingTimer();
        isStreaming = false;
        currentStreamingText = "";
        if (data.stats?.tokensPerSecond) {
          lastSpeedRecorded = data.stats.tokensPerSecond;
        }
        let activeSession = getActiveSession();
        if (!activeSession) {
          activeSession = sessions.find((s) => s.id === activeSessionId);
        }
        if (activeSession && data.message) {
          const exists = activeSession.messages.some((m) => m.id === data.message.id);
          if (!exists) {
            activeSession.messages.push(data.message);
          }
        }
        renderChat();
        updateSendButtonState();
        updateKvCachePopover();
        break;
      case "streamError":
        stopThinkingTimer();
        isStreaming = false;
        currentStreamingText = "";
        let currentSess = getActiveSession();
        if (currentSess) {
          currentSess.messages.push({
            id: "err_" + Date.now(),
            role: "assistant",
            content: `\u274C Hata: ${data.error}`,
            createdAt: Date.now(),
            error: true
          });
        }
        renderChat();
        updateSendButtonState();
        break;
      case "toast":
        showToast(data.message);
        break;
    }
  });
  function getActiveSession() {
    return sessions.find((s) => s.id === activeSessionId);
  }
  function getActiveModelId() {
    const activeSession = getActiveSession();
    if (activeSession?.modelId && (models.length === 0 || models.some((m) => m.id === activeSession.modelId))) {
      return activeSession.modelId;
    }
    if (activeModelId && (models.length === 0 || models.some((m) => m.id === activeModelId))) {
      return activeModelId;
    }
    if (settings.defaultModelId && (models.length === 0 || models.some((m) => m.id === settings.defaultModelId))) {
      return settings.defaultModelId;
    }
    if (models[0]?.id) {
      return models[0].id;
    }
    if (installedOllamaModels[0]?.name) {
      return installedOllamaModels[0].name;
    }
    return "default";
  }
  function setLanguage(lang) {
    currentLang = lang;
    t = getTranslation(lang);
    applyStaticTranslations();
    renderAll();
    const langSelect = document.getElementById("settingLanguage");
    if (langSelect) {
      langSelect.value = settings.language || "auto";
    }
  }
  function applyStaticTranslations() {
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
    const popTitle = document.querySelector("#kvCachePopover .kvcache-popover-title");
    if (popTitle) {
      popTitle.textContent = t.kvCache.title;
    }
    const kvLabels = document.querySelectorAll("#kvCachePopover .kvcache-detail-row span");
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
    const modalTitle = document.querySelector("#settingsModal .modal-title");
    if (modalTitle) {
      modalTitle.textContent = t.settings.title;
    }
    const tabs = document.querySelectorAll("#settingsModal .tab-btn");
    if (tabs[0]) {
      tabs[0].textContent = t.settings.tabSessions;
    }
    if (tabs[1]) {
      tabs[1].textContent = t.settings.tabModels;
    }
    if (tabs[2]) {
      tabs[2].textContent = t.settings.tabSettings;
    }
    const tabSessionsHint = document.querySelector("#tabSessions .form-hint");
    if (tabSessionsHint) {
      tabSessionsHint.textContent = t.sessions.hint;
    }
    const tabModelsLabel = document.querySelector("#tabModels .form-label");
    if (tabModelsLabel) {
      tabModelsLabel.textContent = t.models.title;
    }
    const addModelBtn = document.getElementById("addModelBtn");
    if (addModelBtn) {
      addModelBtn.textContent = t.models.addDropdown;
    }
    const importFromOllamaBtn = document.getElementById("importFromOllamaBtn");
    if (importFromOllamaBtn) {
      importFromOllamaBtn.textContent = t.models.importFromOllama;
    }
    const createNewModelBtn = document.getElementById("createNewModelBtn");
    if (createNewModelBtn) {
      createNewModelBtn.textContent = t.models.createCustom;
    }
    const langLabel = document.getElementById("settingLanguageLabel");
    if (langLabel) {
      langLabel.textContent = t.settings.languageLabel;
    }
    const langHint = document.getElementById("settingLanguageHint");
    if (langHint) {
      langHint.textContent = t.settings.languageHint;
    }
    const langSelect = document.getElementById("settingLanguage");
    if (langSelect && langSelect.options.length >= 3) {
      const currentVal = settings.language || langSelect.value || "auto";
      langSelect.options[0].textContent = t.settings.langAuto;
      langSelect.options[1].textContent = t.settings.langEn;
      langSelect.options[2].textContent = t.settings.langTr;
      langSelect.value = currentVal;
    }
    const urlLabel = document.getElementById("settingOllamaUrlLabel");
    if (urlLabel) {
      urlLabel.textContent = t.settings.ollamaUrlLabel;
    }
    const urlHint = document.getElementById("settingOllamaUrlHint");
    if (urlHint) {
      urlHint.textContent = t.settings.ollamaUrlHint;
    }
    const promptLabel = document.getElementById("settingPromptLabel");
    if (promptLabel) {
      promptLabel.textContent = t.settings.systemPromptLabel;
    }
    const defaultPromptInput = document.getElementById("settingDefaultPrompt");
    if (defaultPromptInput) {
      defaultPromptInput.placeholder = t.settings.systemPromptPlaceholder;
    }
    const promptHint = document.getElementById("settingPromptHint");
    if (promptHint) {
      promptHint.textContent = t.settings.systemPromptHint;
    }
    const tokensLabel = document.getElementById("settingTokensLabel");
    if (tokensLabel) {
      tokensLabel.textContent = t.settings.maxTokensLabel;
    }
    const tokensHint = document.getElementById("settingTokensHint");
    if (tokensHint) {
      tokensHint.textContent = t.settings.maxTokensHint;
    }
    const saveSettingsBtn = document.getElementById("saveSettingsBtn");
    if (saveSettingsBtn) {
      saveSettingsBtn.textContent = t.settings.saveSettings;
    }
    const autoApplyLabel = document.getElementById("settingAutoApplyLabel");
    if (autoApplyLabel) {
      autoApplyLabel.textContent = t.settings.autoApplyLabel;
    }
    const autoApplyHint = document.getElementById("settingAutoApplyHint");
    if (autoApplyHint) {
      autoApplyHint.textContent = t.settings.autoApplyHint;
    }
    const permTitle = document.getElementById("settingPermissionsTitle");
    if (permTitle) {
      permTitle.textContent = t.settings.autoPermissionsTitle;
    }
    const autoEditsLabel = document.getElementById("settingAutoFileEditsLabel");
    if (autoEditsLabel) {
      autoEditsLabel.textContent = t.settings.allowFileEdits;
    }
    const autoEditsHint = document.getElementById("settingAutoFileEditsHint");
    if (autoEditsHint) {
      autoEditsHint.textContent = t.settings.autoPermissionsHint;
    }
    const autoCreateLabel = document.getElementById("settingAutoFileCreateLabel");
    if (autoCreateLabel) {
      autoCreateLabel.textContent = t.settings.allowFileCreate;
    }
    const autoCreateHint = document.getElementById("settingAutoFileCreateHint");
    if (autoCreateHint) {
      autoCreateHint.textContent = t.settings.autoPermissionsHint;
    }
    const autoFolderLabel = document.getElementById("settingAutoFolderCreateLabel");
    if (autoFolderLabel) {
      autoFolderLabel.textContent = t.settings.allowFolderCreate;
    }
    const autoFolderHint = document.getElementById("settingAutoFolderCreateHint");
    if (autoFolderHint) {
      autoFolderHint.textContent = t.settings.autoPermissionsHint;
    }
    const prosTitle = document.getElementById("settingProsecutorTitle");
    if (prosTitle) {
      prosTitle.textContent = t.settings.prosecutorTitle;
    }
    const prosEnableLabel = document.getElementById("settingEnableProsecutorLabel");
    if (prosEnableLabel) {
      prosEnableLabel.textContent = t.settings.prosecutorToggle;
    }
    const prosEnableHint = document.getElementById("settingEnableProsecutorHint");
    if (prosEnableHint) {
      prosEnableHint.textContent = t.settings.prosecutorHint;
    }
    const prosModelLabel = document.getElementById("settingProsecutorModelLabel");
    if (prosModelLabel) {
      prosModelLabel.textContent = t.settings.prosecutorModelLabel;
    }
    const prosModelHint = document.getElementById("settingProsecutorModelHint");
    if (prosModelHint) {
      prosModelHint.textContent = t.settings.prosecutorHint;
    }
    const webSearchTitle = document.getElementById("settingWebSearchTitle");
    if (webSearchTitle) {
      webSearchTitle.textContent = t.settings.webSearchTitle;
    }
    const webEngineLabel = document.getElementById("settingWebEngineLabel");
    if (webEngineLabel) {
      webEngineLabel.textContent = t.settings.webEngineLabel;
    }
    const webDepthLabel = document.getElementById("settingWebDepthLabel");
    if (webDepthLabel) {
      webDepthLabel.textContent = t.settings.webDepthLabel;
    }
    const webDepthSelect = document.getElementById("settingWebDepth");
    if (webDepthSelect && webDepthSelect.options.length >= 3) {
      webDepthSelect.options[0].textContent = t.settings.webDepthFast;
      webDepthSelect.options[1].textContent = t.settings.webDepthStandard;
      webDepthSelect.options[2].textContent = t.settings.webDepthDeep;
    }
    const webMaxResultsLabel = document.getElementById("settingWebMaxResultsLabel");
    if (webMaxResultsLabel) {
      webMaxResultsLabel.textContent = t.settings.webMaxResultsLabel;
    }
    const webBlacklistLabel = document.getElementById("settingWebBlacklistLabel");
    if (webBlacklistLabel) {
      webBlacklistLabel.textContent = t.settings.webBlacklistLabel;
    }
    const webBlacklistHint = document.getElementById("settingWebBlacklistHint");
    if (webBlacklistHint) {
      webBlacklistHint.textContent = t.settings.webBlacklistHint;
    }
    const webWhitelistLabel = document.getElementById("settingWebWhitelistLabel");
    if (webWhitelistLabel) {
      webWhitelistLabel.textContent = t.settings.webWhitelistLabel;
    }
    const webWhitelistHint = document.getElementById("settingWebWhitelistHint");
    if (webWhitelistHint) {
      webWhitelistHint.textContent = t.settings.webWhitelistHint;
    }
    const webAccessLabel = document.getElementById("webAccessLabel");
    if (webAccessLabel) {
      webAccessLabel.textContent = t.chat.webAccessBtn;
    }
    const dragDropText = document.getElementById("dragDropText");
    if (dragDropText) {
      dragDropText.textContent = t.mode.dragDropHint;
    }
    const editorNameLabel = document.getElementById("editorModelNameLabel");
    if (editorNameLabel) {
      editorNameLabel.textContent = t.models.nameLabel;
    }
    const editorNameInput = document.getElementById("editorModelName");
    if (editorNameInput) {
      editorNameInput.placeholder = t.models.namePlaceholder;
    }
    const editorBaseLabel = document.getElementById("editorBaseModelLabel");
    if (editorBaseLabel) {
      editorBaseLabel.textContent = t.models.baseModelLabel;
    }
    const editorPromptLabel = document.getElementById("editorSystemPromptLabel");
    if (editorPromptLabel) {
      editorPromptLabel.textContent = t.models.customPromptLabel;
    }
    const editorPromptInput = document.getElementById("editorSystemPrompt");
    if (editorPromptInput) {
      editorPromptInput.placeholder = t.models.customPromptPlaceholder;
    }
    const editorCtxLabel = document.getElementById("editorNumCtxLabel");
    if (editorCtxLabel) {
      editorCtxLabel.textContent = t.models.numCtxLabel;
    }
    const editorTempLabel = document.getElementById("editorTemperatureLabel");
    if (editorTempLabel) {
      editorTempLabel.textContent = t.models.temperatureLabel;
    }
    const cancelModelEditorBtn2 = document.getElementById("cancelModelEditorBtn");
    if (cancelModelEditorBtn2) {
      cancelModelEditorBtn2.textContent = t.common.cancel;
    }
    const saveModelEditorBtn2 = document.getElementById("saveModelEditorBtn");
    if (saveModelEditorBtn2) {
      saveModelEditorBtn2.textContent = t.common.save;
    }
    const modelEditorTitle = document.getElementById("modelEditorTitle");
    if (modelEditorTitle) {
      const isEditing = modelEditorModal.hasAttribute("data-edit-id");
      modelEditorTitle.textContent = isEditing ? t.models.editorTitleEdit : t.models.editorTitleNew;
    }
    const importModalTitle = document.getElementById("ollamaImportModalTitle") || document.querySelector("#ollamaImportModal .modal-title");
    if (importModalTitle) {
      importModalTitle.textContent = t.models.importModalTitle;
    }
    const importModalHint = document.getElementById("ollamaImportModalHint") || document.querySelector("#ollamaImportModal .form-hint");
    if (importModalHint) {
      importModalHint.textContent = t.models.importModalHint;
    }
    renderModeBadge();
    renderModeDropdown();
    updateSendButtonState();
  }
  function renderAll() {
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
  function renderWebAccessBtn() {
    if (!webAccessBtn) {
      return;
    }
    const session = getActiveSession();
    const isEnabled = session?.webAccessEnabled !== void 0 ? !!session.webAccessEnabled : lastSelectedWebAccess;
    if (isEnabled) {
      webAccessBtn.classList.add("active");
      webAccessBtn.title = `${t.chat.webAccessBtn}: A\xE7\u0131k`;
    } else {
      webAccessBtn.classList.remove("active");
      webAccessBtn.title = `${t.chat.webAccessBtn}: Kapal\u0131`;
    }
  }
  function renderModeBadge() {
    if (!modeBadgeBtn || !modeBadgeName || !modeBadgeIcon) {
      return;
    }
    if (currentMode === "agent") {
      modeBadgeIcon.textContent = "\u{1F916}";
      modeBadgeName.textContent = t.mode.agent;
      modeBadgeBtn.classList.add("mode-agent");
      modeBadgeBtn.title = t.mode.agentDesc;
    } else {
      modeBadgeIcon.textContent = "\u{1F4AC}";
      modeBadgeName.textContent = t.mode.chat;
      modeBadgeBtn.classList.remove("mode-agent");
      modeBadgeBtn.title = t.mode.chatDesc;
    }
  }
  function renderModeDropdown() {
    if (!modeListEl) {
      return;
    }
    modeListEl.innerHTML = `
        <div class="dropdown-item ${currentMode === "chat" ? "active" : ""}" data-mode="chat">
            <span style="font-size: 16px;">\u{1F4AC}</span>
            <div class="dropdown-item-content">
                <div class="dropdown-item-title">${escapeHtml2(t.mode.chat)}</div>
                <div class="dropdown-item-subtitle">${escapeHtml2(t.mode.chatDesc)}</div>
            </div>
            ${currentMode === "chat" ? '<span class="dropdown-item-check">\u2713</span>' : ""}
        </div>
        <div class="dropdown-item ${currentMode === "agent" ? "active" : ""}" data-mode="agent">
            <span style="font-size: 16px;">\u{1F916}</span>
            <div class="dropdown-item-content">
                <div class="dropdown-item-title">${escapeHtml2(t.mode.agent)}</div>
                <div class="dropdown-item-subtitle">${escapeHtml2(t.mode.agentDesc)}</div>
            </div>
            ${currentMode === "agent" ? '<span class="dropdown-item-check">\u2713</span>' : ""}
        </div>
    `;
    modeListEl.querySelectorAll(".dropdown-item").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const mode = el.getAttribute("data-mode");
        if (mode && mode !== currentMode) {
          currentMode = mode;
          const activeSess = getActiveSession();
          if (activeSess) {
            activeSess.mode = mode;
          }
          vscode.postMessage({
            type: "switchMode",
            sessionId: activeSessionId,
            mode
          });
          renderModeBadge();
          renderModeDropdown();
          modeDropdown?.classList.remove("active");
        }
      });
    });
  }
  function renderAgentActionCards(messageId, actions) {
    return `
        <div class="agent-actions-container">
            ${actions.map((act) => {
      const isApplied = act.status === "applied";
      const isExecuted = act.status === "executed";
      const isFailed = act.status === "failed";
      const isReverted = act.status === "reverted";
      const isAccepted = act.status === "accepted";
      const isRejected = act.status === "rejected";
      const isPending = act.status === "pending";
      let statusBadge = "";
      let buttonsHtml = "";
      const isBlocked = act.securityAudit?.blocked;
      if (isApplied) {
        statusBadge = `<span class="agent-status-badge status-applied">\u2713 ${escapeHtml2(t.mode.autoAppliedBadge)}</span>`;
        const showDiffBtn = act.type === "write" || act.type === "edit";
        buttonsHtml = `
                        <div class="agent-card-buttons">
                            ${showDiffBtn ? `
                            <button class="agent-btn diff-btn" data-act-id="${act.id}" data-msg-id="${messageId}" title="${escapeHtml2(t.mode.viewDiff)}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                <span>${escapeHtml2(t.mode.viewDiff)}</span>
                            </button>` : ""}
                            <button class="agent-btn accept-btn" data-act-id="${act.id}" data-msg-id="${messageId}" title="${escapeHtml2(t.mode.acceptToast)}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>${escapeHtml2(t.mode.accept)}</span>
                            </button>
                            <button class="agent-btn revert-btn" data-act-id="${act.id}" data-msg-id="${messageId}" title="${escapeHtml2(t.mode.revertToast)}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
                                <span>${escapeHtml2(t.mode.revert)}</span>
                            </button>
                        </div>
                    `;
      } else if (isExecuted) {
        statusBadge = `<span class="agent-status-badge status-applied">\u2713 ${escapeHtml2(t.mode.executedBadge)}</span>`;
      } else if (isFailed) {
        statusBadge = `<span class="agent-status-badge status-rejected">\u2715 ${escapeHtml2(t.mode.failedBadge)}</span>`;
      } else if (isReverted) {
        statusBadge = `<span class="agent-status-badge status-rejected">\u21B6 ${escapeHtml2(t.mode.reverted)}</span>`;
        buttonsHtml = `
                        <div class="agent-card-buttons">
                            <button class="agent-btn apply-btn" data-act-id="${act.id}" data-msg-id="${messageId}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>${escapeHtml2(t.mode.reapply)}</span>
                            </button>
                        </div>
                    `;
      } else if (isAccepted) {
        statusBadge = `<span class="agent-status-badge status-applied">\u2713 ${escapeHtml2(t.mode.accepted)}</span>`;
      } else if (isRejected) {
        statusBadge = `<span class="agent-status-badge status-rejected">\u2715 ${escapeHtml2(t.mode.rejected)}</span>`;
      } else if (isPending) {
        const isBlocked2 = act.securityAudit?.blocked;
        const applyAttr = isBlocked2 ? 'disabled style="opacity:0.35;cursor:not-allowed;" title="Savc\u0131 taraf\u0131ndan engellendi"' : "";
        const showDiffBtn = act.type === "write" || act.type === "edit";
        const btnLabel = act.type === "command" ? t.mode.runCommand : t.mode.apply;
        buttonsHtml = `
                        <div class="agent-card-buttons">
                            ${showDiffBtn ? `
                            <button class="agent-btn diff-btn" data-act-id="${act.id}" data-msg-id="${messageId}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                <span>${escapeHtml2(t.mode.viewDiff)}</span>
                            </button>` : ""}
                            <button class="agent-btn apply-btn" data-act-id="${act.id}" data-msg-id="${messageId}" ${applyAttr}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>${escapeHtml2(btnLabel)}</span>
                            </button>
                            <button class="agent-btn reject-btn" data-act-id="${act.id}" data-msg-id="${messageId}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                <span>${escapeHtml2(t.mode.reject)}</span>
                            </button>
                        </div>
                    `;
      }
      let previewHtml = "";
      if (act.type === "edit" && act.search && act.replace) {
        previewHtml = `
                        <div class="agent-diff-preview">
                            <div class="diff-line diff-del"><pre><code>- ${escapeHtml2(act.search.trim())}</code></pre></div>
                            <div class="diff-line diff-add"><pre><code>+ ${escapeHtml2(act.replace.trim())}</code></pre></div>
                        </div>
                    `;
      } else if (act.type === "write" && act.content) {
        const previewLines = act.content.trim().split("\n").slice(0, 6).join("\n");
        previewHtml = `
                        <div class="agent-write-preview">
                            <pre><code>${escapeHtml2(previewLines)}</code></pre>
                        </div>
                    `;
      } else if (act.type === "command" && act.command && !act.output) {
        previewHtml = `
                        <div class="agent-write-preview">
                            <pre><code>$ ${escapeHtml2(act.command)}</code></pre>
                        </div>
                    `;
      }
      let outputHtml = "";
      if (act.output) {
        const previewOutput = act.output.trim().slice(0, 1500);
        outputHtml = `
                        <div class="agent-output-preview">
                            <div class="agent-output-header">
                                <span class="agent-output-title">\u{1F4C4} ${escapeHtml2(t.mode.toolOutputTitle)}</span>
                            </div>
                            <pre class="agent-output-code"><code>${escapeHtml2(previewOutput)}</code></pre>
                        </div>
                    `;
      }
      let typeLabel = "FILE";
      let fileTitle = act.path;
      let typeBadgeClass = "badge-file";
      switch (act.type) {
        case "write":
          typeLabel = "WRITE";
          fileTitle = `\u{1F4C4} ${act.path}`;
          typeBadgeClass = "badge-write";
          break;
        case "edit":
          typeLabel = "EDIT";
          fileTitle = `\u{1F4DD} ${act.path}`;
          typeBadgeClass = "badge-edit";
          break;
        case "read":
          typeLabel = "READ";
          fileTitle = `\u{1F4D6} ${act.path}`;
          typeBadgeClass = "badge-read";
          break;
        case "create_dir":
          typeLabel = "FOLDER";
          fileTitle = `\u{1F4C1} ${act.path}`;
          typeBadgeClass = "badge-folder";
          break;
        case "delete":
          typeLabel = "DELETE";
          fileTitle = `\u{1F5D1}\uFE0F ${act.path}`;
          typeBadgeClass = "badge-delete";
          break;
        case "move":
          typeLabel = "MOVE";
          fileTitle = `\u{1F4E6} ${act.path} \u279C ${act.targetPath}`;
          typeBadgeClass = "badge-move";
          break;
        case "list_dir":
          typeLabel = "LIST";
          fileTitle = `\u{1F4C2} ${act.path || "."}`;
          typeBadgeClass = "badge-list";
          break;
        case "find_files":
          typeLabel = "FIND";
          fileTitle = `\u{1F50D} ${act.pattern || act.path}`;
          typeBadgeClass = "badge-find";
          break;
        case "grep":
          typeLabel = "GREP";
          fileTitle = `\u{1F50E} "${act.query}" (${act.path || "."})`;
          typeBadgeClass = "badge-grep";
          break;
        case "command":
          typeLabel = "CMD";
          fileTitle = `\u26A1 ${act.command}`;
          typeBadgeClass = "badge-cmd";
          break;
      }
      return `
                    <div class="agent-action-card ${act.status}">
                        <div class="agent-card-header">
                            <div class="agent-card-file">
                                <span class="agent-type-badge ${typeBadgeClass}">${typeLabel}</span>
                                <span class="agent-file-path" title="${escapeHtml2(fileTitle)}">${escapeHtml2(fileTitle)}</span>
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
    }).join("")}
        </div>
    `;
  }
  function renderHeader() {
    const activeSession = getActiveSession();
    if (activeSession && activeSession.title && activeSession.title !== "Yeni Sohbet" && activeSession.title !== "New Chat") {
      sessionTitleEl.textContent = activeSession.title;
    } else {
      sessionTitleEl.textContent = t.header.untitledSession;
    }
    renderWebAccessBtn();
  }
  function renderChat() {
    const activeSession = getActiveSession();
    chatContainer.innerHTML = "";
    if (!activeSession || activeSession.messages.length === 0) {
      const welcome = document.createElement("div");
      welcome.className = "welcome-container";
      const greeting = currentLang === "tr" ? `Ho\u015F geldin, ${escapeHtml2(username)}` : `Welcome, ${escapeHtml2(username)}`;
      const subtitle = t.chat.emptySubtitle;
      const suggestions = currentLang === "tr" ? [
        { label: "\u26A1 Kod optimizasyonu ve analizi", prompt: "Bu fonksiyondaki zaman karma\u015F\u0131kl\u0131\u011F\u0131n\u0131 optimize et ve a\xE7\u0131kla." },
        { label: "\u{1F6E0}\uFE0F TypeScript mimarisi tasarla", prompt: "TypeScript ile esnek ve tip g\xFCvenli bir state manager nas\u0131l yazar\u0131m?" },
        { label: "\u{1F50D} Regex deseni olu\u015Ftur ve a\xE7\u0131kla", prompt: "Regex deseni olu\u015Ftur: ge\xE7erli e-posta ve uluslararas\u0131 telefon numaralar\u0131n\u0131 do\u011Frula." }
      ] : [
        { label: "\u26A1 Code optimization and analysis", prompt: "Optimize the time complexity of this function and explain." },
        { label: "\u{1F6E0}\uFE0F Design TypeScript architecture", prompt: "How do I build a flexible and type-safe state manager in TypeScript?" },
        { label: "\u{1F50D} Generate and explain Regex pattern", prompt: "Create a regex pattern to validate email addresses and international phone numbers." }
      ];
      let cardsHtml = "";
      suggestions.forEach((s) => {
        cardsHtml += `
                <div class="suggestion-card" data-prompt="${escapeHtml2(s.prompt)}">
                    <span>${escapeHtml2(s.label)}</span>
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
      welcome.querySelectorAll(".suggestion-card").forEach((card) => {
        card.addEventListener("click", () => {
          const prompt = card.getAttribute("data-prompt");
          if (prompt) {
            chatTextarea.value = prompt;
            adjustTextareaHeight();
            sendMessage();
          }
        });
      });
      return;
    }
    activeSession.messages.forEach((msg) => {
      const row = createMessageRow(msg);
      chatContainer.appendChild(row);
    });
    scrollToBottom();
  }
  function createMessageRow(msg) {
    const row = document.createElement("div");
    row.className = `message-row ${msg.role === "user" ? "user-row" : "assistant-row"}${msg.error ? " error-msg" : ""}`;
    row.id = `msg_${msg.id}`;
    const timeStr = new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const senderName = msg.role === "user" ? currentLang === "tr" ? "Sen" : "You" : msg.modelName || getActiveModelId() || (currentLang === "tr" ? "Asistan" : "Assistant");
    let actionsHtml = "";
    if (msg.role === "assistant" && !msg.error) {
      let statsPopoverHtml = "";
      if (msg.stats && (msg.stats.tokensPerSecond || msg.stats.totalDurationMs)) {
        const tps = (msg.stats.tokensPerSecond || 0).toFixed(1);
        const totalSec = ((msg.stats.totalDurationMs || 0) / 1e3).toFixed(2);
        const evalTokens = msg.stats.evalCount || 0;
        const promptTokens = msg.stats.promptEvalCount || 0;
        const infoTitle = currentLang === "tr" ? "Cevap Bilgileri" : "Response Info";
        const evalLabel = currentLang === "tr" ? "\xDCretilen Token:" : "Eval Tokens:";
        const promptLabel = currentLang === "tr" ? "Prompt Token:" : "Prompt Tokens:";
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
                        ${msg.modelQuantization ? `<div class="stat-item"><span class="stat-label">${t.export.quantization}:</span> <span class="stat-value">${escapeHtml2(msg.modelQuantization)}</span></div>` : ""}
                    </div>
                </div>
            `;
      }
      let securityPopoverHtml = "";
      const auditedActions = (msg.actions || []).filter((a) => a.securityAudit);
      if (auditedActions.length > 0) {
        const hasBlocked = auditedActions.some((a) => a.securityAudit?.blocked || a.securityAudit?.risk === "high");
        const hasWarning = auditedActions.some((a) => a.securityAudit?.risk === "medium");
        let secClass = "sec-safe";
        let secIcon = "\u{1F6E1}\uFE0F";
        let secLabel = t.mode.prosecutorSafe;
        if (hasBlocked) {
          secClass = "sec-blocked";
          secIcon = "\u{1F6AB}";
          secLabel = t.mode.prosecutorBlocked;
        } else if (hasWarning) {
          secClass = "sec-warning";
          secIcon = "\u26A0\uFE0F";
          secLabel = t.mode.prosecutorWarning;
        }
        const prosecutorModel = auditedActions[0].securityAudit?.prosecutorName || (currentLang === "tr" ? "1.5B Savc\u0131 Modeli" : "1.5B Prosecutor Model");
        const inspectorTitle = currentLang === "tr" ? "Savc\u0131 G\xFCvenlik Raporu" : "Security Audit Report";
        securityPopoverHtml = `
                <div class="security-btn-container">
                    <button class="action-btn security-btn ${secClass}">
                        <span class="security-btn-icon">${secIcon}</span>
                        <span>${escapeHtml2(secLabel)}</span>
                    </button>
                    <div class="security-popover">
                        <div class="security-popover-header">
                            <span class="security-popover-icon">${secIcon}</span>
                            <span class="security-popover-title">${escapeHtml2(inspectorTitle)}</span>
                        </div>
                        <div class="security-popover-meta">
                            <span>${currentLang === "tr" ? "Denet\xE7i Model" : "Auditor"}: <strong>${escapeHtml2(prosecutorModel)}</strong></span>
                        </div>
                        <div class="security-popover-items">
                            ${auditedActions.map((a) => {
          const aBlocked = a.securityAudit?.blocked || a.securityAudit?.risk === "high";
          const aWarning = a.securityAudit?.risk === "medium";
          const aIcon = aBlocked ? "\u{1F6AB}" : aWarning ? "\u26A0\uFE0F" : "\u2713";
          const aStatusClass = aBlocked ? "item-blocked" : aWarning ? "item-warning" : "item-safe";
          const targetLabel = a.type === "command" ? a.command || "terminal" : a.path;
          return `
                                    <div class="security-audit-item ${aStatusClass}">
                                        <div class="security-item-target">
                                            <span>${aIcon}</span>
                                            <code>${escapeHtml2(targetLabel)}</code>
                                        </div>
                                        <div class="security-item-reason">${escapeHtml2(a.securityAudit?.reason || "")}</div>
                                    </div>
                                `;
        }).join("")}
                        </div>
                        ${hasBlocked ? `
                            <div class="security-blocked-notice">
                                \u26A0\uFE0F ${currentLang === "tr" ? "Y\u0131k\u0131c\u0131 i\u015Flem riski nedeniyle otomatik \xE7al\u0131\u015Ft\u0131r\u0131lmad\u0131. Onay\u0131n\u0131z bekleniyor." : "Blocked from automatic execution due to safety risks. Awaiting your manual confirmation."}
                            </div>
                        ` : ""}
                    </div>
                </div>
            `;
      }
      const hasWebSources = msg.webSources && msg.webSources.length > 0;
      const sourcesBtnHtml = hasWebSources ? `
            <button class="action-btn sources-btn" data-msg-id="${msg.id}" data-session-id="${activeSessionId}" title="${escapeHtml2(t.chat.sourcesTitle || "Web Kaynaklar\u0131n\u0131 G\xF6r\xFCnt\xFCle")}">
                <span style="font-size: 11px;">\u{1F310}</span>
                <span>${escapeHtml2(t.chat.sourcesBtn || "Kaynaklar")}</span>
            </button>
        ` : "";
      actionsHtml = `
            <div class="message-actions">
                <button class="action-btn copy-msg-btn" data-content="${encodeURIComponent(msg.content)}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    <span>${t.common.copy}</span>
                </button>
                ${statsPopoverHtml}
                <button class="action-btn blackbox-btn" data-msg-id="${msg.id}" data-session-id="${activeSessionId}" title="${escapeHtml2(t.mode.blackboxTitle)}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    <span>${escapeHtml2(t.mode.blackboxBtn)}</span>
                </button>
                ${sourcesBtnHtml}
                ${securityPopoverHtml}
            </div>
        `;
    }
    let agentCardsHtml = "";
    if (msg.actions && msg.actions.length > 0) {
      agentCardsHtml = renderAgentActionCards(msg.id, msg.actions);
    }
    row.innerHTML = `
        <div class="message-header">
            <span class="message-sender">${escapeHtml2(senderName)}</span>
            <span class="message-time">${timeStr}</span>
        </div>
        <div class="message-content">
            ${renderMarkdown(msg.content, false, t.common.copy, t.common.copy)}
            ${agentCardsHtml}
        </div>
        ${actionsHtml}
    `;
    row.querySelectorAll(".diff-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const actId = btn.getAttribute("data-act-id");
        const action = msg.actions?.find((a) => a.id === actId);
        if (action) {
          vscode.postMessage({
            type: "viewAgentDiff",
            path: action.path,
            newContent: action.content,
            search: action.search,
            replace: action.replace
          });
        }
      });
    });
    row.querySelectorAll(".apply-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const actId = btn.getAttribute("data-act-id");
        if (actId) {
          vscode.postMessage({
            type: "applyAgentAction",
            sessionId: activeSessionId,
            messageId: msg.id,
            actionId: actId
          });
        }
      });
    });
    row.querySelectorAll(".reject-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const actId = btn.getAttribute("data-act-id");
        if (actId) {
          vscode.postMessage({
            type: "rejectAgentAction",
            sessionId: activeSessionId,
            messageId: msg.id,
            actionId: actId
          });
        }
      });
    });
    row.querySelectorAll(".revert-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const actId = btn.getAttribute("data-act-id");
        if (actId) {
          vscode.postMessage({
            type: "revertAgentAction",
            sessionId: activeSessionId,
            messageId: msg.id,
            actionId: actId
          });
        }
      });
    });
    row.querySelectorAll(".accept-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const actId = btn.getAttribute("data-act-id");
        if (actId) {
          vscode.postMessage({
            type: "acceptAgentAction",
            sessionId: activeSessionId,
            messageId: msg.id,
            actionId: actId
          });
        }
      });
    });
    return row;
  }
  function startThinkingIndicator() {
    stopThinkingTimer();
    let streamingRow = document.getElementById("streamingMessageRow");
    if (!streamingRow) {
      streamingRow = document.createElement("div");
      streamingRow.id = "streamingMessageRow";
      streamingRow.className = "message-row assistant-row";
      chatContainer.appendChild(streamingRow);
    }
    thinkingStartTime = Date.now();
    const nowStr = currentLang === "tr" ? "\u015Fimdi" : "now";
    streamingRow.innerHTML = `
        <div class="message-header">
            <span class="message-sender">${escapeHtml2(getActiveModelId())}</span>
            <span class="message-time">${nowStr}</span>
        </div>
        <div class="message-content">
            <div class="thinking-placeholder">
                <span class="thinking-spinner"></span>
                <span class="thinking-text">${escapeHtml2(t.chat.thinking)}</span>
                <span class="thinking-timer" id="thinkingTimer">0.0s</span>
            </div>
        </div>
    `;
    thinkingInterval = setInterval(() => {
      const timerEl = document.getElementById("thinkingTimer");
      if (timerEl) {
        const elapsed = ((Date.now() - thinkingStartTime) / 1e3).toFixed(1);
        timerEl.textContent = `${elapsed}s`;
      }
    }, 100);
    scrollToBottom();
  }
  function stopThinkingTimer() {
    if (thinkingInterval) {
      clearInterval(thinkingInterval);
      thinkingInterval = null;
    }
  }
  function updateStreamingMessage(fullText) {
    let streamingRow = document.getElementById("streamingMessageRow");
    const nowStr = currentLang === "tr" ? "\u015Fimdi" : "now";
    if (!streamingRow) {
      streamingRow = document.createElement("div");
      streamingRow.id = "streamingMessageRow";
      streamingRow.className = "message-row assistant-row";
      streamingRow.innerHTML = `
            <div class="message-header">
                <span class="message-sender">${escapeHtml2(getActiveModelId())}</span>
                <span class="message-time">${nowStr}</span>
            </div>
            <div class="message-content"></div>
        `;
      chatContainer.appendChild(streamingRow);
    }
    const contentEl = streamingRow.querySelector(".message-content");
    if (contentEl) {
      contentEl.innerHTML = renderMarkdown(fullText, true, t.common.copy, t.common.copy);
    }
    scrollToBottom();
  }
  function updateSendButtonState() {
    if (isStreaming) {
      sendBtn.classList.add("stop-btn");
      sendBtn.title = t.chat.stop;
      sendBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2"></rect>
            </svg>
        `;
    } else {
      sendBtn.classList.remove("stop-btn");
      sendBtn.title = t.chat.send;
      sendBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
        `;
    }
  }
  function renderModelBadge() {
    const currentModelId = getActiveModelId();
    modelBadgeName.textContent = currentModelId;
    modelBadgeBtn.title = `Model: ${currentModelId}`;
    const custom = models.find((m) => m.id === currentModelId);
    if (custom?.numCtx) {
      tokenStatBadge.querySelector("span").textContent = `\u26A1 ${(custom.numCtx / 1024).toFixed(0)}k ctx`;
    } else {
      tokenStatBadge.querySelector("span").textContent = "\u26A1 KVCache";
    }
    updateKvCachePopover();
  }
  function updateKvCachePopover() {
    const currentModelId = getActiveModelId();
    const custom = models.find((m) => m.id === currentModelId);
    const ollama = installedOllamaModels.find((m) => m.name === (custom ? custom.baseModel : currentModelId));
    const kvModelEl = document.getElementById("kvModelName");
    const kvCtxEl = document.getElementById("kvCtxSize");
    const kvTempEl = document.getElementById("kvTemperature");
    const kvSpeedEl = document.getElementById("kvSpeed");
    if (kvModelEl) {
      kvModelEl.textContent = currentModelId;
    }
    if (kvCtxEl) {
      const ctx = custom?.numCtx || (ollama?.details?.parameter_size ? `4096 (${t.common.default.toLowerCase()})` : "4096");
      kvCtxEl.textContent = typeof ctx === "number" ? `${ctx} ${t.chat.tokens}` : ctx;
    }
    if (kvTempEl) {
      kvTempEl.textContent = custom?.temperature !== void 0 ? String(custom.temperature) : "0.7";
    }
    if (kvSpeedEl) {
      kvSpeedEl.textContent = lastSpeedRecorded > 0 ? `${lastSpeedRecorded.toFixed(1)} ${t.chat.tokenPerSec}` : "-";
    }
  }
  function renderModelDropdown(searchFilter = "") {
    modelListEl.innerHTML = "";
    const currentModelId = getActiveModelId();
    const allModels = [];
    const sourceList = models.length > 0 ? models : installedOllamaModels.map((om) => ({
      id: om.name,
      name: om.name,
      baseModel: om.name,
      isCustom: false
    }));
    sourceList.forEach((m) => {
      const baseName = m.baseModel || m.id;
      const matchingOllama = installedOllamaModels.find((om) => om.name === baseName || om.name === m.id);
      allModels.push({
        id: m.id,
        name: m.name,
        isCustom: m.isCustom ?? false,
        quant: matchingOllama?.details?.quantization_level,
        param: matchingOllama?.details?.parameter_size
      });
    });
    const filtered = allModels.filter((m) => m.name.toLowerCase().includes(searchFilter.toLowerCase()));
    if (filtered.length === 0) {
      modelListEl.innerHTML = `<div style="padding: 8px; opacity: 0.6; font-size: 11px;">${escapeHtml2(t.dropdowns.noModels)}</div>`;
      return;
    }
    filtered.forEach((m) => {
      const item = document.createElement("div");
      item.className = `dropdown-item ${m.id === currentModelId ? "selected" : ""}`;
      item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 5px;">
                <span>${escapeHtml2(m.name)}</span>
                ${m.param ? `<span class="model-tag-badge param">${escapeHtml2(m.param)}</span>` : ""}
                ${m.quant ? `<span class="model-tag-badge quant">${escapeHtml2(m.quant)}</span>` : ""}
                ${m.isCustom ? `<span class="model-tag-badge custom">${escapeHtml2(t.dropdowns.customTag)}</span>` : ""}
            </div>
            ${m.id === currentModelId ? "<span>\u2713</span>" : ""}
        `;
      item.addEventListener("click", () => {
        selectModel(m.id);
        modelDropdown.classList.remove("active");
      });
      modelListEl.appendChild(item);
    });
  }
  function selectModel(modelId) {
    activeModelId = modelId;
    const activeSession = getActiveSession();
    if (activeSession) {
      activeSession.modelId = modelId;
    }
    renderModelBadge();
    vscode.postMessage({
      type: "selectModel",
      modelId,
      sessionId: activeSessionId
    });
  }
  function renderSessionDropdown(searchFilter = "") {
    sessionListEl.innerHTML = "";
    const filtered = sessions.filter((s) => s.messages && s.messages.length > 0 && s.title.toLowerCase().includes(searchFilter.toLowerCase()));
    if (filtered.length === 0) {
      sessionListEl.innerHTML = '<div style="padding: 8px; opacity: 0.6; font-size: 11px;">Oturum bulunamad\u0131</div>';
      return;
    }
    filtered.forEach((s) => {
      const item = document.createElement("div");
      item.className = `dropdown-item ${s.id === activeSessionId ? "selected" : ""}`;
      const timeStr = new Date(s.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" });
      item.innerHTML = `
            <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 170px;">
                <span>${escapeHtml2(s.title)}</span>
            </div>
            <span class="dropdown-item-meta">${timeStr} (${s.messages.length})</span>
        `;
      item.addEventListener("click", () => {
        switchSession(s.id);
        sessionDropdown.classList.remove("active");
      });
      sessionListEl.appendChild(item);
    });
  }
  function switchSession(sessionId) {
    if (activeSessionId === sessionId) {
      return;
    }
    activeSessionId = sessionId;
    const session = getActiveSession();
    if (session?.modelId && (models.length === 0 || models.some((m) => m.id === session.modelId))) {
      activeModelId = session.modelId;
    }
    renderHeader();
    renderChat();
    renderModelBadge();
    vscode.postMessage({ type: "switchSession", sessionId });
  }
  function createNewSession() {
    vscode.postMessage({
      type: "createSession",
      modelId: getActiveModelId(),
      mode: currentMode
    });
  }
  function sendMessage() {
    const text = chatTextarea.value.trim();
    if (!text || isStreaming) {
      return;
    }
    lastPrompt = text;
    chatTextarea.value = "";
    adjustTextareaHeight();
    const activeSession = getActiveSession();
    if (activeSession) {
      activeSession.messages.push({
        id: "user_" + Date.now(),
        role: "user",
        content: text,
        createdAt: Date.now()
      });
    }
    isStreaming = true;
    renderChat();
    updateSendButtonState();
    startThinkingIndicator();
    const isWeb = activeSession?.webAccessEnabled !== void 0 ? !!activeSession.webAccessEnabled : lastSelectedWebAccess;
    vscode.postMessage({
      type: "sendMessage",
      sessionId: activeSessionId,
      prompt: text,
      modelId: getActiveModelId(),
      mode: currentMode,
      webAccessEnabled: isWeb
    });
  }
  function stopGeneration() {
    if (!isStreaming) {
      return;
    }
    stopThinkingTimer();
    vscode.postMessage({
      type: "stopGeneration",
      sessionId: activeSessionId
    });
    isStreaming = false;
    if (lastPrompt) {
      chatTextarea.value = lastPrompt;
      adjustTextareaHeight();
      chatTextarea.focus();
    }
    const streamingRow = document.getElementById("streamingMessageRow");
    if (streamingRow) {
      streamingRow.remove();
    }
    renderChat();
    updateSendButtonState();
    showToast("\xDCretim durduruldu, mesaj geri y\xFCklendi.");
  }
  function adjustTextareaHeight() {
    chatTextarea.style.height = "auto";
    const newHeight = Math.min(chatTextarea.scrollHeight, 115);
    chatTextarea.style.height = `${newHeight}px`;
  }
  function checkMentionAutocomplete() {
    if (!mentionAutocomplete) {
      return;
    }
    const val = chatTextarea.value;
    const cursorPos = chatTextarea.selectionStart;
    const beforeCursor = val.slice(0, cursorPos);
    const match = /(?:^|\s)([@#])([a-zA-Z0-9_\-./]*)$/.exec(beforeCursor);
    if (!match) {
      hideMentionAutocomplete();
      return;
    }
    const trigger = match[1];
    const query = match[2].toLowerCase();
    mentionCurrentTrigger = trigger;
    mentionMatchStart = match.index + (match[0].startsWith(" ") ? 1 : 0);
    mentionCurrentMatches = workspaceFiles.filter((f) => f.toLowerCase().includes(query)).slice(0, 15);
    if (mentionCurrentMatches.length === 0) {
      hideMentionAutocomplete();
      return;
    }
    mentionSelectedIndex = 0;
    renderMentionAutocomplete();
  }
  function renderMentionAutocomplete() {
    if (!mentionAutocomplete) {
      return;
    }
    mentionAutocomplete.innerHTML = mentionCurrentMatches.map((filePath, idx) => {
      const isSelected = idx === mentionSelectedIndex ? "selected" : "";
      const icon = filePath.includes("/") ? "\u{1F4C4}" : "\u{1F4DD}";
      return `
            <div class="mention-item ${isSelected}" data-index="${idx}">
                <span class="mention-icon">${icon}</span>
                <span class="mention-path">${escapeHtml2(filePath)}</span>
            </div>
        `;
    }).join("");
    mentionAutocomplete.classList.add("active");
    mentionAutocomplete.querySelectorAll(".mention-item").forEach((item) => {
      item.addEventListener("click", () => {
        const idx = parseInt(item.getAttribute("data-index") || "0", 10);
        selectMention(idx);
      });
    });
  }
  function hideMentionAutocomplete() {
    if (mentionAutocomplete) {
      mentionAutocomplete.classList.remove("active");
      mentionAutocomplete.innerHTML = "";
    }
  }
  function selectMention(index) {
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
  function insertTextAtCursor(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = textarea.value;
    textarea.value = val.slice(0, start) + text + val.slice(end);
    const nextPos = start + text.length;
    textarea.setSelectionRange(nextPos, nextPos);
    adjustTextareaHeight();
  }
  function scrollToBottom() {
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 20);
  }
  function openSettingsModal() {
    settingsModal.classList.add("active");
    renderSessionsTab();
    renderModelsTab();
    renderSettingsTab();
  }
  function closeSettingsModal() {
    settingsModal.classList.remove("active");
  }
  function renderSessionsTab(searchFilter = "") {
    const listEl = document.getElementById("settingsSessionList");
    if (!listEl) {
      return;
    }
    listEl.innerHTML = "";
    const filtered = sessions.filter((s) => s.messages && s.messages.length > 0 && s.title.toLowerCase().includes(searchFilter.toLowerCase()));
    if (filtered.length === 0) {
      listEl.innerHTML = `<div style="opacity: 0.6; font-size: 11px; padding: 8px;">${escapeHtml2(t.dropdowns.noSessions)}</div>`;
      return;
    }
    filtered.forEach((s) => {
      const item = document.createElement("div");
      item.className = "settings-list-item";
      item.innerHTML = `
            <div>
                <strong>${escapeHtml2(s.title)}</strong>
                <div style="font-size: 10px; opacity: 0.65;">
                    ${new Date(s.createdAt).toLocaleDateString()} \u2022 ${t.sessions.messagesCount(s.messages.length)} \u2022 ${escapeHtml2(t.models.baseModelLabel)}: ${escapeHtml2(s.modelId || t.common.default)}
                </div>
            </div>
            <div class="item-actions">
                <div class="export-btn-container">
                    <button class="action-btn export-toggle-btn" data-id="${s.id}">${escapeHtml2(t.sessions.export)} \u25BE</button>
                    <div class="export-menu" id="exportMenu_${s.id}">
                        <div class="export-menu-item" data-action="export-md" data-id="${s.id}">\u{1F4C4} ${escapeHtml2(t.sessions.exportMarkdown)}</div>
                        <div class="export-menu-item" data-action="export-json" data-id="${s.id}">\u{1F4E6} ${escapeHtml2(t.sessions.exportJson)}</div>
                    </div>
                </div>
                <button class="btn-danger del-session-btn" data-id="${s.id}" title="${escapeHtml2(t.common.delete)}">${escapeHtml2(t.common.delete)}</button>
            </div>
        `;
      listEl.appendChild(item);
    });
    listEl.querySelectorAll(".export-toggle-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        const menu = document.getElementById(`exportMenu_${id}`);
        document.querySelectorAll(".export-menu").forEach((m) => {
          if (m !== menu) {
            m.classList.remove("active");
          }
        });
        menu?.classList.toggle("active");
      });
    });
    listEl.querySelectorAll(".export-menu-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const action = item.getAttribute("data-action");
        const id = item.getAttribute("data-id");
        if (id) {
          const format = action === "export-md" ? "markdown" : "json";
          vscode.postMessage({ type: "exportSession", sessionId: id, format });
        }
        document.querySelectorAll(".export-menu").forEach((m) => m.classList.remove("active"));
      });
    });
    listEl.querySelectorAll(".del-session-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        if (id) {
          vscode.postMessage({ type: "deleteSession", sessionId: id });
        }
      });
    });
  }
  function renderModelsTab() {
    const listEl = document.getElementById("settingsModelList");
    if (!listEl) {
      return;
    }
    listEl.innerHTML = "";
    const activeTitle = document.createElement("div");
    activeTitle.style.cssText = "font-size: 11px; opacity: 0.8; font-weight: 600; margin-top: 6px; display: flex; justify-content: space-between; align-items: center;";
    const activeHeading = currentLang === "tr" ? "SOHBETTE G\xD6R\xDCNEN MODELLER\u0130N\u0130Z" : "YOUR ACTIVE CHAT MODELS";
    activeTitle.innerHTML = `<span>${activeHeading} (${models.length})</span>`;
    listEl.appendChild(activeTitle);
    if (models.length === 0) {
      const emptyEl = document.createElement("div");
      emptyEl.style.cssText = "padding: 8px; font-size: 11px; opacity: 0.6;";
      emptyEl.textContent = currentLang === "tr" ? "Hen\xFCz model eklenmedi. A\u015Fa\u011F\u0131daki Ollama modellerinden ekleyebilirsiniz." : "No models added yet. You can add from the Ollama models below.";
      listEl.appendChild(emptyEl);
    } else {
      models.forEach((m) => {
        const item = document.createElement("div");
        item.className = "settings-list-item";
        const baseName = m.baseModel || m.id;
        const matchingOllama = installedOllamaModels.find((om) => om.name === baseName || om.name === m.id);
        const quant = matchingOllama?.details?.quantization_level || "";
        const param = matchingOllama?.details?.parameter_size || "";
        const baseLabel = currentLang === "tr" ? "Taban" : "Base";
        const tempLabel = currentLang === "tr" ? "S\u0131cakl\u0131k" : "Temp";
        item.innerHTML = `
                <div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <strong>${escapeHtml2(m.name)}</strong>
                        ${param ? `<span class="model-tag-badge param">${escapeHtml2(param)}</span>` : ""}
                        ${quant ? `<span class="model-tag-badge quant">${escapeHtml2(quant)}</span>` : ""}
                        ${m.isCustom ? `<span class="model-tag-badge custom">${escapeHtml2(t.dropdowns.customTag)}</span>` : ""}
                    </div>
                    <div style="font-size: 10px; opacity: 0.65; margin-top: 2px;">
                        ${baseLabel}: ${escapeHtml2(m.baseModel || m.id)} | KV: ${m.numCtx || 4096} | ${tempLabel}: ${m.temperature ?? 0.7}
                    </div>
                </div>
                <div class="item-actions">
                    <button class="action-btn edit-model-btn" data-id="${m.id}">${escapeHtml2(t.common.edit)}</button>
                    <button class="btn-danger del-model-btn" data-id="${m.id}" title="${escapeHtml2(t.common.delete)}">${escapeHtml2(t.common.delete)}</button>
                </div>
            `;
        listEl.appendChild(item);
      });
    }
    const ollamaTitle = document.createElement("div");
    ollamaTitle.style.cssText = "font-size: 11px; opacity: 0.8; font-weight: 600; margin-top: 14px;";
    ollamaTitle.textContent = currentLang === "tr" ? "OLLAMA'DA KURULU D\u0130\u011EER MODELLER" : "OTHER INSTALLED OLLAMA MODELS";
    listEl.appendChild(ollamaTitle);
    const otherOllama = installedOllamaModels.filter((om) => !models.some((m) => m.id === om.name));
    if (otherOllama.length === 0) {
      const emptyEl = document.createElement("div");
      emptyEl.style.cssText = "padding: 8px; font-size: 11px; opacity: 0.6;";
      emptyEl.textContent = installedOllamaModels.length > 0 ? currentLang === "tr" ? "T\xFCm yerel Ollama modelleriniz sohbet listenize ekli." : "All local Ollama models are added to your chat list." : currentLang === "tr" ? "Ollama servisi \xE7al\u0131\u015Fm\u0131yor veya model bulunamad\u0131." : "Ollama service is not running or no models found.";
      listEl.appendChild(emptyEl);
    } else {
      otherOllama.forEach((m) => {
        const item = document.createElement("div");
        item.className = "settings-list-item";
        const quant = m.details?.quantization_level || "";
        const sizeGb = (m.size / (1024 * 1024 * 1024)).toFixed(1);
        const param = m.details?.parameter_size || "";
        const customizeLabel = currentLang === "tr" ? "\xD6zelle\u015Ftir" : "Customize";
        item.innerHTML = `
                <div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <strong>${escapeHtml2(m.name)}</strong>
                        ${param ? `<span class="model-tag-badge param">${escapeHtml2(param)}</span>` : ""}
                        ${quant ? `<span class="model-tag-badge quant">${escapeHtml2(quant)}</span>` : ""}
                    </div>
                    <div style="font-size: 10px; opacity: 0.65; margin-top: 2px;">
                        ${sizeGb} GB
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn-primary add-ollama-btn" data-name="${m.name}">${escapeHtml2(t.common.add)}</button>
                    <button class="action-btn clone-ollama-btn" data-name="${m.name}">${escapeHtml2(customizeLabel)}</button>
                </div>
            `;
        listEl.appendChild(item);
      });
    }
    listEl.querySelectorAll(".edit-model-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const model = models.find((m) => m.id === id);
        if (model) {
          openModelEditor(model);
        }
      });
    });
    listEl.querySelectorAll(".add-ollama-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-name");
        if (name) {
          vscode.postMessage({
            type: "saveCustomModel",
            model: {
              id: name,
              name,
              baseModel: name,
              numCtx: 4096,
              temperature: 0.7,
              isCustom: false
            }
          });
        }
      });
    });
    listEl.querySelectorAll(".clone-ollama-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-name");
        if (name) {
          openModelEditor({
            id: name + "-custom",
            name: `${name} (${t.dropdowns.customTag})`,
            baseModel: name,
            numCtx: 4096,
            temperature: 0.7,
            isCustom: true
          });
        }
      });
    });
    listEl.querySelectorAll(".del-model-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        if (id) {
          vscode.postMessage({ type: "deleteCustomModel", modelId: id });
        }
      });
    });
  }
  function renderSettingsTab() {
    const langSelect = document.getElementById("settingLanguage");
    const urlInput = document.getElementById("settingOllamaUrl");
    const promptToggle = document.getElementById("settingEnablePromptToggle");
    const promptContainer = document.getElementById("settingPromptContainer");
    const promptInput = document.getElementById("settingDefaultPrompt");
    const tokensToggle = document.getElementById("settingEnableTokensToggle");
    const tokensContainer = document.getElementById("settingTokensContainer");
    const maxTokensInput = document.getElementById("settingMaxTokens");
    if (langSelect) {
      langSelect.value = settings.language || "auto";
    }
    if (urlInput) {
      urlInput.value = settings.ollamaUrl || "http://127.0.0.1:11434";
    }
    if (promptToggle) {
      promptToggle.checked = settings.enableSystemPrompt !== false;
      if (promptContainer) {
        promptContainer.classList.toggle("hidden", !promptToggle.checked);
      }
    }
    if (promptInput) {
      promptInput.value = settings.defaultSystemPrompt || "";
    }
    if (tokensToggle) {
      tokensToggle.checked = !!settings.enableMaxTokens;
      if (tokensContainer) {
        tokensContainer.classList.toggle("hidden", !tokensToggle.checked);
      }
    }
    if (maxTokensInput) {
      maxTokensInput.value = String(settings.defaultMaxTokens && settings.defaultMaxTokens >= 4096 ? settings.defaultMaxTokens : 4096);
    }
    const autoApplyToggle = document.getElementById("settingAutoApplyToggle");
    if (autoApplyToggle) {
      autoApplyToggle.checked = !!settings.autoApplyAgentEdits;
    }
    const autoFileEditsToggle = document.getElementById("settingAutoFileEditsToggle");
    if (autoFileEditsToggle) {
      autoFileEditsToggle.checked = !!settings.autoAllowFileEdits;
    }
    const autoFileCreateToggle = document.getElementById("settingAutoFileCreateToggle");
    if (autoFileCreateToggle) {
      autoFileCreateToggle.checked = !!settings.autoAllowFileCreate;
    }
    const autoFolderCreateToggle = document.getElementById("settingAutoFolderCreateToggle");
    if (autoFolderCreateToggle) {
      autoFolderCreateToggle.checked = !!settings.autoAllowFolderCreate;
    }
    const enableProsecutorToggle = document.getElementById("settingEnableProsecutorToggle");
    const prosecutorContainer = document.getElementById("settingProsecutorContainer");
    const prosecutorSelect = document.getElementById("settingProsecutorModel");
    if (enableProsecutorToggle) {
      enableProsecutorToggle.checked = settings.enableProsecutor !== false;
      if (prosecutorContainer) {
        prosecutorContainer.classList.toggle("hidden", !enableProsecutorToggle.checked);
      }
    }
    if (prosecutorSelect) {
      const autoLabel = t.settings.prosecutorAuto;
      prosecutorSelect.innerHTML = `<option value="auto">${escapeHtml2(autoLabel)}</option>`;
      installedOllamaModels.forEach((m) => {
        const opt = document.createElement("option");
        opt.value = m.name;
        opt.textContent = m.name;
        prosecutorSelect.appendChild(opt);
      });
      prosecutorSelect.value = settings.prosecutorModelId || "auto";
    }
    const webEngineSelect = document.getElementById("settingWebEngine");
    const webDepthSelect = document.getElementById("settingWebDepth");
    const webMaxResultsInput = document.getElementById("settingWebMaxResults");
    const webBlacklistInput = document.getElementById("settingWebBlacklist");
    const webWhitelistInput = document.getElementById("settingWebWhitelist");
    if (webEngineSelect) {
      webEngineSelect.value = settings.webSearchEngine || "duckduckgo";
    }
    if (webDepthSelect) {
      webDepthSelect.value = settings.webSearchDepth || "standard";
    }
    if (webMaxResultsInput) {
      webMaxResultsInput.value = String(settings.webSearchMaxResults || 5);
    }
    if (webBlacklistInput) {
      webBlacklistInput.value = settings.webSearchBlacklist || "";
    }
    if (webWhitelistInput) {
      webWhitelistInput.value = settings.webSearchWhitelist || "";
    }
  }
  function openModelEditor(existing) {
    const titleEl = document.getElementById("modelEditorTitle");
    const nameInput = document.getElementById("editorModelName");
    const baseSelect = document.getElementById("editorBaseModel");
    const promptInput = document.getElementById("editorSystemPrompt");
    const ctxInput = document.getElementById("editorNumCtx");
    const tempInput = document.getElementById("editorTemperature");
    const nameLabel = document.getElementById("editorModelNameLabel");
    if (nameLabel) {
      nameLabel.textContent = t.models.nameLabel;
    }
    if (nameInput) {
      nameInput.placeholder = t.models.namePlaceholder;
    }
    const baseModelLabel = document.getElementById("editorBaseModelLabel");
    if (baseModelLabel) {
      baseModelLabel.textContent = t.models.baseModelLabel;
    }
    const promptLabel = document.getElementById("editorSystemPromptLabel");
    if (promptLabel) {
      promptLabel.textContent = t.models.customPromptLabel;
    }
    if (promptInput) {
      promptInput.placeholder = t.models.customPromptPlaceholder;
    }
    const numCtxLabel = document.getElementById("editorNumCtxLabel");
    if (numCtxLabel) {
      numCtxLabel.textContent = t.models.numCtxLabel;
    }
    const tempLabel = document.getElementById("editorTemperatureLabel");
    if (tempLabel) {
      tempLabel.textContent = t.models.temperatureLabel;
    }
    const cancelBtn = document.getElementById("cancelModelEditorBtn");
    if (cancelBtn) {
      cancelBtn.textContent = t.common.cancel;
    }
    const saveBtn = document.getElementById("saveModelEditorBtn");
    if (saveBtn) {
      saveBtn.textContent = t.common.save;
    }
    baseSelect.innerHTML = "";
    installedOllamaModels.forEach((m) => {
      const opt = document.createElement("option");
      opt.value = m.name;
      opt.textContent = m.name;
      baseSelect.appendChild(opt);
    });
    if (existing) {
      titleEl.textContent = t.models.editorTitleEdit;
      modelEditorModal.setAttribute("data-edit-id", existing.id);
      nameInput.value = existing.name;
      baseSelect.value = existing.baseModel || existing.id;
      promptInput.value = existing.systemPrompt || "";
      ctxInput.value = String(existing.numCtx || 4096);
      tempInput.value = String(existing.temperature ?? 0.7);
    } else {
      titleEl.textContent = t.models.editorTitleNew;
      modelEditorModal.removeAttribute("data-edit-id");
      nameInput.value = "";
      promptInput.value = "";
      ctxInput.value = "4096";
      tempInput.value = "0.7";
    }
    modelEditorModal.classList.add("active");
    nameInput.focus();
  }
  function closeModelEditor() {
    modelEditorModal.classList.remove("active");
  }
  function openOllamaImportModal() {
    ollamaImportList.innerHTML = "";
    if (installedOllamaModels.length === 0) {
      ollamaImportList.innerHTML = `<div style="padding: 12px; opacity: 0.6; font-size: 12px;">${escapeHtml2(t.models.noOllamaModels)}</div>`;
      ollamaImportModal.classList.add("active");
      return;
    }
    installedOllamaModels.forEach((m) => {
      const item = document.createElement("div");
      item.className = "settings-list-item";
      const quant = m.details?.quantization_level || "";
      const sizeGb = (m.size / (1024 * 1024 * 1024)).toFixed(1);
      const param = m.details?.parameter_size || "";
      const editImportLabel = currentLang === "tr" ? "D\xFCzenleyip Aktar" : "Customize & Import";
      item.innerHTML = `
            <div>
                <div style="display: flex; align-items: center; gap: 5px;">
                    <strong>${escapeHtml2(m.name)}</strong>
                    ${param ? `<span class="model-tag-badge param">${escapeHtml2(param)}</span>` : ""}
                    ${quant ? `<span class="model-tag-badge quant">${escapeHtml2(quant)}</span>` : ""}
                </div>
                <div style="font-size: 10px; opacity: 0.65; margin-top: 2px;">
                    ${sizeGb} GB
                </div>
            </div>
            <div class="item-actions">
                <button class="btn-primary import-direct-btn" data-name="${m.name}">${escapeHtml2(t.models.importBtn)}</button>
                <button class="action-btn import-edit-btn" data-name="${m.name}">${escapeHtml2(editImportLabel)}</button>
            </div>
        `;
      ollamaImportList.appendChild(item);
    });
    ollamaImportList.querySelectorAll(".import-direct-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-name");
        if (name) {
          vscode.postMessage({
            type: "saveCustomModel",
            model: {
              id: name,
              name,
              baseModel: name,
              numCtx: 4096,
              temperature: 0.7,
              isCustom: false
            }
          });
          ollamaImportModal.classList.remove("active");
        }
      });
    });
    ollamaImportList.querySelectorAll(".import-edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-name");
        if (name) {
          ollamaImportModal.classList.remove("active");
          openModelEditor({
            id: name + "-custom",
            name,
            baseModel: name,
            numCtx: 4096,
            temperature: 0.7,
            isCustom: true
          });
        }
      });
    });
    ollamaImportModal.classList.add("active");
  }
  function closeOllamaImport() {
    ollamaImportModal.classList.remove("active");
  }
  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    setTimeout(() => {
      toastEl.classList.remove("show");
    }, 2500);
  }
  function escapeHtml2(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function setupEventListeners() {
    sessionSelectorBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      modelDropdown.classList.remove("active");
      sessionDropdown.classList.toggle("active");
      if (sessionDropdown.classList.contains("active")) {
        sessionSearchInput.value = "";
        renderSessionDropdown();
        sessionSearchInput.focus();
      }
    });
    sessionSearchInput.addEventListener("input", () => {
      renderSessionDropdown(sessionSearchInput.value);
    });
    newSessionBtn.addEventListener("click", () => {
      createNewSession();
    });
    modelBadgeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      sessionDropdown.classList.remove("active");
      modeDropdown.classList.remove("active");
      modelDropdown.classList.toggle("active");
      if (modelDropdown.classList.contains("active")) {
        modelSearchInput.value = "";
        renderModelDropdown();
        modelSearchInput.focus();
      }
    });
    modelSearchInput.addEventListener("input", () => {
      renderModelDropdown(modelSearchInput.value);
    });
    modeBadgeBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      sessionDropdown.classList.remove("active");
      modelDropdown.classList.remove("active");
      modeDropdown.classList.toggle("active");
      if (modeDropdown.classList.contains("active")) {
        renderModeDropdown();
      }
    });
    webAccessBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      const sess = getActiveSession();
      const currentVal = sess?.webAccessEnabled !== void 0 ? !!sess.webAccessEnabled : lastSelectedWebAccess;
      const nextState = !currentVal;
      lastSelectedWebAccess = nextState;
      if (sess) {
        sess.webAccessEnabled = nextState;
      }
      renderWebAccessBtn();
      vscode.postMessage({
        type: "toggleWebAccess",
        sessionId: activeSessionId,
        enabled: nextState
      });
    });
    tokenStatBadge.addEventListener("click", (e) => {
      e.stopPropagation();
      kvCachePopover.classList.toggle("active");
    });
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!sessionDropdown.contains(target) && !sessionSelectorBtn.contains(target)) {
        sessionDropdown.classList.remove("active");
      }
      if (!modelDropdown.contains(target) && !modelBadgeBtn.contains(target)) {
        modelDropdown.classList.remove("active");
      }
      if (!modeDropdown.contains(target) && !modeBadgeBtn.contains(target)) {
        modeDropdown.classList.remove("active");
      }
      if (!kvCachePopover.contains(target) && !tokenStatBadge.contains(target)) {
        kvCachePopover.classList.remove("active");
      }
      document.querySelectorAll(".export-menu").forEach((m) => {
        if (!m.contains(target)) {
          m.classList.remove("active");
        }
      });
      const addModelMenu2 = document.getElementById("addModelMenu");
      if (addModelMenu2 && !addModelMenu2.contains(target) && target.id !== "addModelBtn") {
        addModelMenu2.classList.remove("active");
      }
      if (mentionAutocomplete && !mentionAutocomplete.contains(target) && target !== chatTextarea) {
        hideMentionAutocomplete();
      }
    });
    chatTextarea.addEventListener("input", () => {
      adjustTextareaHeight();
      checkMentionAutocomplete();
    });
    chatTextarea.addEventListener("keydown", (e) => {
      if (mentionAutocomplete?.classList.contains("active")) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          mentionSelectedIndex = (mentionSelectedIndex + 1) % mentionCurrentMatches.length;
          renderMentionAutocomplete();
          return;
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          mentionSelectedIndex = (mentionSelectedIndex - 1 + mentionCurrentMatches.length) % mentionCurrentMatches.length;
          renderMentionAutocomplete();
          return;
        } else if (e.key === "Enter" || e.key === "Tab") {
          e.preventDefault();
          selectMention(mentionSelectedIndex);
          return;
        } else if (e.key === "Escape") {
          e.preventDefault();
          hideMentionAutocomplete();
          return;
        }
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    let dragCounter = 0;
    window.addEventListener("dragenter", (e) => {
      e.preventDefault();
      dragCounter++;
      if (dragDropOverlay) {
        dragDropOverlay.classList.add("active");
      }
    });
    window.addEventListener("dragleave", (e) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter <= 0) {
        dragCounter = 0;
        if (dragDropOverlay) {
          dragDropOverlay.classList.remove("active");
        }
      }
    });
    window.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    window.addEventListener("drop", (e) => {
      e.preventDefault();
      dragCounter = 0;
      if (dragDropOverlay) {
        dragDropOverlay.classList.remove("active");
      }
      const dt = e.dataTransfer;
      if (dt) {
        if (dt.files && dt.files.length > 0) {
          const paths = [];
          for (let i = 0; i < dt.files.length; i++) {
            const f = dt.files[i];
            const name = f.path || f.name;
            const matched = workspaceFiles.find((wf) => wf === name || wf.endsWith("/" + name));
            paths.push(matched || name);
          }
          if (paths.length > 0) {
            insertTextAtCursor(chatTextarea, paths.map((p) => `@${p}`).join(" ") + " ");
            chatTextarea.focus();
            return;
          }
        }
        const uriList = dt.getData("text/uri-list");
        if (uriList) {
          const uris = uriList.split("\n").filter((u) => u.trim() && !u.startsWith("#"));
          const paths = uris.map((u) => {
            try {
              const pathName = decodeURIComponent(new URL(u).pathname);
              const matched = workspaceFiles.find((wf) => pathName.endsWith(wf));
              return matched || pathName.split("/").pop() || pathName;
            } catch {
              return u;
            }
          });
          insertTextAtCursor(chatTextarea, paths.map((p) => `@${p}`).join(" ") + " ");
          chatTextarea.focus();
          return;
        }
        const plainText = dt.getData("text/plain");
        if (plainText) {
          insertTextAtCursor(chatTextarea, plainText.trim() + " ");
          chatTextarea.focus();
        }
      }
    });
    sendBtn.addEventListener("click", () => {
      if (isStreaming) {
        stopGeneration();
      } else {
        sendMessage();
      }
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (mentionAutocomplete?.classList.contains("active")) {
          e.preventDefault();
          hideMentionAutocomplete();
          return;
        }
        if (ollamaImportModal.classList.contains("active")) {
          e.preventDefault();
          closeOllamaImport();
          return;
        }
        if (modelEditorModal.classList.contains("active")) {
          e.preventDefault();
          closeModelEditor();
          return;
        }
        if (settingsModal.classList.contains("active")) {
          e.preventDefault();
          closeSettingsModal();
          return;
        }
        if (sessionDropdown.classList.contains("active")) {
          e.preventDefault();
          sessionDropdown.classList.remove("active");
          return;
        }
        if (modelDropdown.classList.contains("active")) {
          e.preventDefault();
          modelDropdown.classList.remove("active");
          return;
        }
        if (modeDropdown.classList.contains("active")) {
          e.preventDefault();
          modeDropdown.classList.remove("active");
          return;
        }
        if (kvCachePopover.classList.contains("active")) {
          e.preventDefault();
          kvCachePopover.classList.remove("active");
          return;
        }
        if (isStreaming) {
          e.preventDefault();
          stopGeneration();
          return;
        }
      }
    });
    settingsBtn.addEventListener("click", () => {
      openSettingsModal();
    });
    closeSettingsBtn.addEventListener("click", () => {
      closeSettingsModal();
    });
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
        document.querySelectorAll(".tab-pane").forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        const target = btn.getAttribute("data-tab");
        const pane = document.getElementById(target || "");
        if (pane) {
          pane.classList.add("active");
        }
      });
    });
    const promptToggle = document.getElementById("settingEnablePromptToggle");
    const promptContainer = document.getElementById("settingPromptContainer");
    promptToggle?.addEventListener("change", () => {
      promptContainer?.classList.toggle("hidden", !promptToggle.checked);
    });
    const tokensToggle = document.getElementById("settingEnableTokensToggle");
    const tokensContainer = document.getElementById("settingTokensContainer");
    tokensToggle?.addEventListener("change", () => {
      tokensContainer?.classList.toggle("hidden", !tokensToggle.checked);
    });
    const langSelect = document.getElementById("settingLanguage");
    langSelect?.addEventListener("change", () => {
      const selected = langSelect.value || "auto";
      settings.language = selected;
      const newLang = resolveLanguage(selected, vscodeLanguage);
      setLanguage(newLang);
      if (langSelect) {
        langSelect.value = selected;
      }
    });
    const saveSettingsBtn = document.getElementById("saveSettingsBtn");
    saveSettingsBtn?.addEventListener("click", () => {
      const url = document.getElementById("settingOllamaUrl").value.trim();
      const prompt = document.getElementById("settingDefaultPrompt").value.trim();
      const pToggle = document.getElementById("settingEnablePromptToggle");
      const tToggle = document.getElementById("settingEnableTokensToggle");
      const mInput = document.getElementById("settingMaxTokens");
      const lSelect = document.getElementById("settingLanguage");
      const maxTokens = Math.max(4096, parseInt(mInput?.value || "4096", 10) || 4096);
      const enablePrompt = pToggle ? pToggle.checked : true;
      const enableTokens = tToggle ? tToggle.checked : false;
      const autoApplyToggle = document.getElementById("settingAutoApplyToggle");
      const autoApply = autoApplyToggle ? autoApplyToggle.checked : false;
      const chosenLang = lSelect?.value || "auto";
      const autoFileEdits = document.getElementById("settingAutoFileEditsToggle")?.checked ?? false;
      const autoFileCreate = document.getElementById("settingAutoFileCreateToggle")?.checked ?? false;
      const autoFolderCreate = document.getElementById("settingAutoFolderCreateToggle")?.checked ?? false;
      const enableProsecutor = document.getElementById("settingEnableProsecutorToggle")?.checked ?? true;
      const prosecutorModel = document.getElementById("settingProsecutorModel")?.value || "auto";
      const webEngine = document.getElementById("settingWebEngine")?.value || "duckduckgo";
      const webDepth = document.getElementById("settingWebDepth")?.value || "standard";
      const webMaxResults = parseInt(document.getElementById("settingWebMaxResults")?.value || "5", 10) || 5;
      const webBlacklist = document.getElementById("settingWebBlacklist")?.value.trim() || "";
      const webWhitelist = document.getElementById("settingWebWhitelist")?.value.trim() || "";
      vscode.postMessage({
        type: "saveSettings",
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
          webSearchEngine: webEngine,
          webSearchDepth: webDepth,
          webSearchMaxResults: Math.min(10, Math.max(1, webMaxResults)),
          webSearchBlacklist: webBlacklist,
          webSearchWhitelist: webWhitelist
        }
      });
    });
    const enableProsecutorToggle = document.getElementById("settingEnableProsecutorToggle");
    const prosecutorContainer = document.getElementById("settingProsecutorContainer");
    enableProsecutorToggle?.addEventListener("change", () => {
      prosecutorContainer?.classList.toggle("hidden", !enableProsecutorToggle.checked);
    });
    const addModelBtn = document.getElementById("addModelBtn");
    const addModelMenu = document.getElementById("addModelMenu");
    addModelBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      addModelMenu?.classList.toggle("active");
    });
    document.getElementById("importFromOllamaBtn")?.addEventListener("click", () => {
      addModelMenu?.classList.remove("active");
      openOllamaImportModal();
    });
    document.getElementById("createNewModelBtn")?.addEventListener("click", () => {
      addModelMenu?.classList.remove("active");
      openModelEditor();
    });
    closeModelEditorBtn.addEventListener("click", () => closeModelEditor());
    cancelModelEditorBtn.addEventListener("click", () => closeModelEditor());
    saveModelEditorBtn.addEventListener("click", () => {
      const name = document.getElementById("editorModelName").value.trim();
      const baseModel = document.getElementById("editorBaseModel").value;
      const systemPrompt = document.getElementById("editorSystemPrompt").value.trim();
      const numCtx = parseInt(document.getElementById("editorNumCtx").value, 10) || 4096;
      const temperature = parseFloat(document.getElementById("editorTemperature").value) || 0.7;
      if (!name) {
        showToast(t.models.nameRequired);
        return;
      }
      const editId = modelEditorModal.getAttribute("data-edit-id");
      const id = editId || "custom_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
      vscode.postMessage({
        type: "saveCustomModel",
        model: {
          id,
          name,
          baseModel,
          systemPrompt,
          numCtx,
          temperature,
          isCustom: true
        }
      });
      closeModelEditor();
    });
    closeOllamaImportBtn.addEventListener("click", () => closeOllamaImport());
    chatContainer.addEventListener("click", (e) => {
      const target = e.target;
      const codeCopyBtn = target.closest(".code-copy-btn");
      if (codeCopyBtn) {
        const rawCode = decodeURIComponent(codeCopyBtn.getAttribute("data-code") || "");
        navigator.clipboard.writeText(rawCode).then(() => {
          const label = codeCopyBtn.querySelector("span");
          if (label) {
            const oldText = label.textContent;
            label.textContent = `\u2713 ${t.common.copied}`;
            setTimeout(() => {
              label.textContent = oldText;
            }, 1500);
          }
        });
        return;
      }
      const msgCopyBtn = target.closest(".copy-msg-btn");
      if (msgCopyBtn) {
        const raw = decodeURIComponent(msgCopyBtn.getAttribute("data-content") || "");
        navigator.clipboard.writeText(raw).then(() => {
          showToast(t.common.copied);
        });
        return;
      }
      const blackboxBtn = target.closest(".blackbox-btn");
      if (blackboxBtn) {
        const msgId = blackboxBtn.getAttribute("data-msg-id");
        const sessId = blackboxBtn.getAttribute("data-session-id") || activeSessionId;
        if (msgId && sessId) {
          vscode.postMessage({
            type: "openMessageBlackbox",
            sessionId: sessId,
            messageId: msgId
          });
        }
        return;
      }
      const sourcesBtn = target.closest(".sources-btn");
      if (sourcesBtn) {
        const msgId = sourcesBtn.getAttribute("data-msg-id");
        const sessId = sourcesBtn.getAttribute("data-session-id") || activeSessionId;
        if (msgId && sessId) {
          vscode.postMessage({
            type: "openWebSources",
            sessionId: sessId,
            messageId: msgId
          });
        }
        return;
      }
    });
  }
})();
//# sourceMappingURL=webview.js.map
