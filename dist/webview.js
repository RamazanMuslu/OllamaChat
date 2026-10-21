"use strict";(()=>{var At={common:{save:"Save",cancel:"Cancel",delete:"Delete",edit:"Edit",copy:"Copy",copied:"Copied!",close:"Close",add:"+ Add",search:"Search",loading:"Loading...",error:"Error",default:"Default",unlimited:"Unlimited"},header:{listSessions:"List Sessions",newSession:"New Chat",untitledSession:"New Chat"},chat:{inputPlaceholder:"Ask a question or request code... (Enter to send, Shift+Enter for new line)",send:"Send (Enter)",stop:"Stop (Esc)",thinking:"Thinking...",tokenPerSec:"t/s",duration:"Duration",speed:"Speed",tokens:"tokens",emptyTitle:"Welcome to OllamaChat",emptySubtitle:"Your local and private AI coding assistant. Select a model below and ask a question to begin.",retry:"Retry",sourcesBtn:"Sources",sourcesTitle:"Inspect web sources and references",webAccessBtn:"Web",webSearching:"Searching the web..."},dropdowns:{searchSessions:"Search sessions...",noSessions:"No sessions found",searchModels:"Search models...",noModels:"No models found (You can add from Settings > Models)",selectModel:"Select Model",customTag:"Custom"},kvCache:{title:"Context & KV-Cache",model:"Model:",context:"Context (num_ctx):",temperature:"Temperature:",lastSpeed:"Last Speed:",badge:"\u26A1 KVCache"},settings:{title:"Settings",tabSessions:"Sessions",tabModels:"Models",tabSettings:"Extension Settings",saveSettings:"Save Settings",savedToast:"Settings saved.",languageLabel:"Language",languageHint:"Select interface language or match VS Code automatically.",langAuto:"Automatic (VS Code Language)",langEn:"English",langTr:"T\xFCrk\xE7e",ollamaUrlLabel:"Ollama API URL",ollamaUrlHint:"Local Ollama server connection endpoint.",systemPromptLabel:"Global System Prompt",systemPromptToggle:"Enable global system prompt",systemPromptPlaceholder:"Default assistant system prompt...",systemPromptHint:"Sets base behavior instructions for models without custom prompt.",maxTokensLabel:"Max Tokens Limit (num_predict)",maxTokensToggle:"Enable max token limit",maxTokensHint:"When off, tokens are unlimited. When on, minimum is 4096 tokens.",autoApplyLabel:"Auto-apply Agent File Edits",autoApplyHint:"When enabled, Agent mode writes file changes immediately without confirmation.",autoPermissionsTitle:"Autonomous Agent Permissions",autoPermissionsHint:"Control what actions the Agent can execute automatically:",allowFileEdits:"Always allow file edits (Search & Replace)",allowFileCreate:"Always allow new file creation",allowFolderCreate:"Always allow directory creation",prosecutorTitle:"Security Prosecutor (Guard Model)",prosecutorHint:"Uses a lightweight model (e.g. 1.5B) to audit agent commands and file edits for dangerous operations (e.g. rm -rf, file wipes).",prosecutorToggle:"Enable Security Prosecutor Audit",prosecutorModelLabel:"Prosecutor Model",prosecutorAuto:"Auto-detect small model (1.5B)",webSearchTitle:"Web Search & Internet Access",webEngineLabel:"Search Engine",webDepthLabel:"Search & Analysis Depth",webDepthFast:"Fast (Snippets only)",webDepthStandard:"Standard (Page summaries)",webDepthDeep:"Deep Analysis (Full page inspection & synthesis)",webMaxResultsLabel:"Max Web Sources",webBlacklistLabel:"Domain Blacklist (Blocked sites)",webBlacklistHint:"Comma-separated domains to ignore (e.g. pinterest.com, spam.com)",webWhitelistLabel:"Domain Whitelist (Allowed sites)",webWhitelistHint:"Comma-separated domains to restrict/prioritize"},mode:{chat:"Chat",agent:"Agent",chatDesc:"Conversation & coding assistant (Read-only, no workspace edits)",agentDesc:"Autonomous coding agent (Can read and edit project files)",apply:"Apply Changes",reject:"Reject",viewDiff:"View Diff",applied:"Changes applied successfully.",rejected:"Changes rejected.",readingFile:"Reading file...",editingFile:"Editing file...",creatingFile:"Creating file...",fileNotFound:"File not found in workspace.",prosecutorSafe:"Audited & Safe",prosecutorWarning:"Suspicious / Potential Risk",prosecutorBlocked:"Blocked by Security Prosecutor",prosecutorAuditing:"Prosecutor auditing action...",revert:"Revert",accept:"Keep",reverted:"Changes reverted.",accepted:"Changes kept permanently.",autoAppliedBadge:"Applied (Reversible)",actionDetailsTitle:"Action & Code Details",revertToast:"Change reverted.",acceptToast:"Change kept permanently.",reapply:"Re-apply",dragDropHint:"Drop files here to add as context",searchFilesPlaceholder:"Search files with @ or #...",contextFilesCount:t=>`${t} context files`,blackboxBtn:"Black Box",blackboxTitle:"Inspect all tokens, commands and response details in markdown",runCommand:"Run",toolOutputTitle:"Tool Output",executedBadge:"Executed",failedBadge:"Failed"},sessions:{hint:"You can export or delete your saved conversation sessions.",export:"Export",exportMarkdown:"Markdown (.md)",exportJson:"JSON (.json)",deleteConfirm:"Are you sure you want to delete this session?",deletedToast:"Session deleted.",messagesCount:t=>`${t} msg`},models:{title:"All Models (Ollama & Custom)",addDropdown:"+ Add \u25BE",importFromOllama:"Import from Ollama",createCustom:"Create custom model profile",deletedToast:"Model deleted.",editorTitleEdit:"Edit Model Profile",editorTitleNew:"New Model Profile",nameLabel:"Display Name",namePlaceholder:"e.g. Qwen Code Assistant",baseModelLabel:"Base Ollama Model",customPromptLabel:"Custom System Prompt",customPromptPlaceholder:"Role and instructions specific to this model...",numCtxLabel:"KV-Cache / Context (num_ctx)",temperatureLabel:"Temperature",nameRequired:"Please enter a model name.",savedToast:"Model saved.",importModalTitle:"Import Model from Ollama",importModalHint:"Locally installed Ollama models are listed below. Click import or customize:",importBtn:"Import",importedToast:"Model imported.",noOllamaModels:"No new Ollama models found to import."},export:{createdDate:"Created Date:",model:"Model:",quantization:"Quantization:",user:"\u{1F464} User",assistant:"\u{1F916} Assistant"}};var $t={common:{save:"Kaydet",cancel:"\u0130ptal",delete:"Sil",edit:"D\xFCzenle",copy:"Kopyala",copied:"Kopyaland\u0131!",close:"Kapat",add:"+ Ekle",search:"Ara",loading:"Y\xFCkleniyor...",error:"Hata",default:"Varsay\u0131lan",unlimited:"S\u0131n\u0131rs\u0131z"},header:{listSessions:"Oturumlar\u0131 Listele",newSession:"Yeni Sohbet",untitledSession:"Yeni Sohbet"},chat:{inputPlaceholder:"Bir soru sorun veya kod isteyin... (Enter ile g\xF6nder, Shift+Enter alt sat\u0131r)",send:"G\xF6nder (Enter)",stop:"Durdur (Esc)",thinking:"D\xFC\u015F\xFCn\xFCyor...",tokenPerSec:"token/sn",duration:"S\xFCre",speed:"H\u0131z",tokens:"tokens",emptyTitle:"OllamaChat'e Ho\u015F Geldiniz",emptySubtitle:"Yerel ve gizli yapay zeka kodlama asistan\u0131n\u0131z. Ba\u015Flamak i\xE7in a\u015Fa\u011F\u0131dan bir model se\xE7ip sorunuzu yaz\u0131n.",retry:"Yeniden Dene",sourcesBtn:"Kaynaklar",sourcesTitle:"Web arama kaynaklar\u0131n\u0131 ve referanslar\u0131 incele",webAccessBtn:"Web",webSearching:"\u0130nternette ara\u015Ft\u0131r\u0131l\u0131yor..."},dropdowns:{searchSessions:"Oturumlarda ara...",noSessions:"Oturum bulunamad\u0131",searchModels:"Model ara...",noModels:"Model bulunamad\u0131 (Ayarlar > Modeller sekmesinden ekleyebilirsiniz)",selectModel:"Model Se\xE7",customTag:"\xD6zel"},kvCache:{title:"Ba\u011Flam & KV-Cache",model:"Model:",context:"Context (num_ctx):",temperature:"S\u0131cakl\u0131k:",lastSpeed:"Son Yan\u0131t H\u0131z\u0131:",badge:"\u26A1 KVCache"},settings:{title:"Ayarlar",tabSessions:"Oturumlar",tabModels:"Modeller",tabSettings:"Eklenti Ayarlar\u0131",saveSettings:"Ayarlar\u0131 Kaydet",savedToast:"Ayarlar kaydedildi.",languageLabel:"Dil Se\xE7imi",languageHint:"Aray\xFCz dilini belirleyin veya VS Code diline otomatik e\u015Fitleyin.",langAuto:"Otomatik (VS Code Dili)",langEn:"English",langTr:"T\xFCrk\xE7e",ollamaUrlLabel:"Ollama API URL",ollamaUrlHint:"Ollama yerel sunucu ba\u011Flant\u0131 noktas\u0131.",systemPromptLabel:"Genel Sistem Promptu",systemPromptToggle:"Genel sistem promptunu etkinle\u015Ftir",systemPromptPlaceholder:"Varsay\u0131lan asistan sistem promptu...",systemPromptHint:"\xD6zel promptu bulunmayan t\xFCm modeller i\xE7in ge\xE7erli temel rol talimatlar\u0131.",maxTokensLabel:"Maksimum Token S\u0131n\u0131r\u0131 (num_predict)",maxTokensToggle:"Maksimum token s\u0131n\u0131r\u0131n\u0131 etkinle\u015Ftir",maxTokensHint:"Kapal\u0131yken \xFCretim s\u0131n\u0131rs\u0131zd\u0131r. A\xE7\u0131kken s\u0131n\u0131r minimum 4096 tokendir.",autoApplyLabel:"Agent Dosya G\xFCncellemelerini Otomatik Uygula",autoApplyHint:"Etkinle\u015Ftirildi\u011Finde, Agent modunda dosya de\u011Fi\u015Fiklikleri onay beklemeden do\u011Frudan kaydedilir.",autoPermissionsTitle:"Agent Otomatik \u0130zinleri",autoPermissionsHint:"Agent modunun onay istemeden do\u011Frudan yapabilece\u011Fi i\u015Flemleri belirleyin:",allowFileEdits:"Dosya d\xFCzenlemelerine her zaman izin ver (Search & Replace)",allowFileCreate:"Yeni dosya olu\u015Fturmaya her zaman izin ver",allowFolderCreate:"Klas\xF6r olu\u015Fturmaya her zaman izin ver",prosecutorTitle:"Savc\u0131 Modeli (G\xFCvenlik Denet\xE7isi)",prosecutorHint:"K\xFC\xE7\xFCk ve h\u0131zl\u0131 bir modeli (\xF6rn: 1.5B) savc\u0131 olarak konumland\u0131r\u0131p, komut ve dosya de\u011Fi\u015Fikliklerini zararl\u0131 m\u0131 (rm -rf, veri kayb\u0131 vb.) diye denetletir.",prosecutorToggle:"Savc\u0131 G\xFCvenlik Denetimini Etkinle\u015Ftir",prosecutorModelLabel:"Savc\u0131 Modeli",prosecutorAuto:"Otomatik K\xFC\xE7\xFCk Model Se\xE7 (1.5B)",webSearchTitle:"\u0130nternet & Web Arama Ayarlar\u0131",webEngineLabel:"Arama Motoru",webDepthLabel:"Arama ve Analiz Derinli\u011Fi",webDepthFast:"H\u0131zl\u0131 (Yaln\u0131zca arama snippet'lar\u0131)",webDepthStandard:"Standart (Sayfa \xF6zetleri ve ilk sayfalar)",webDepthDeep:"Derin Analiz (Sayfa metinleri ve sentezleme)",webMaxResultsLabel:"Maksimum Kaynak Say\u0131s\u0131",webBlacklistLabel:"Alan Ad\u0131 Kara Listesi (Yasakl\u0131 Siteler)",webBlacklistHint:"Virg\xFClle ayr\u0131lm\u0131\u015F engellenecek siteler (\xF6rn: pinterest.com, spam.com)",webWhitelistLabel:"Alan Ad\u0131 Beyaz Listesi (\xD6ncelikli Siteler)",webWhitelistHint:"Virg\xFClle ayr\u0131lm\u0131\u015F odaklan\u0131lacak veya k\u0131s\u0131tlanacak siteler"},mode:{chat:"Chat",agent:"Agent",chatDesc:"Sohbet ve kod dan\u0131\u015Fman\u0131 (Salt okunur, dosyalara dokunmaz)",agentDesc:"Otonom kod yaz\u0131c\u0131 (Proje dosyalar\u0131n\u0131 okuyabilir ve g\xFCncelleyebilir)",apply:"De\u011Fi\u015Fiklikleri Uygula",reject:"Reddet",viewDiff:"Fark\u0131 G\xF6r (Diff)",applied:"De\u011Fi\u015Fiklikler ba\u015Far\u0131yla uyguland\u0131.",rejected:"De\u011Fi\u015Fiklik reddedildi.",readingFile:"Dosya okunuyor...",editingFile:"Dosya g\xFCncelleniyor...",creatingFile:"Yeni dosya olu\u015Fturuluyor...",fileNotFound:"Dosya proje \xE7al\u0131\u015Fma alan\u0131nda bulunamad\u0131.",prosecutorSafe:"Savc\u0131 Onaylad\u0131 (G\xFCvenli)",prosecutorWarning:"\u015E\xFCpheli / Dikkat Gerektiren Eylem",prosecutorBlocked:"Savc\u0131 Taraf\u0131ndan Engellendi!",prosecutorAuditing:"Savc\u0131 eylemi denetliyor...",revert:"Geri D\xF6nd\xFCr",accept:"Kal\u0131c\u0131 Yap",reverted:"De\u011Fi\u015Fiklik geri al\u0131nd\u0131.",accepted:"De\u011Fi\u015Fiklik kal\u0131c\u0131 yap\u0131ld\u0131.",autoAppliedBadge:"Uyguland\u0131 (Geri D\xF6nd\xFCr\xFClebilir)",actionDetailsTitle:"Eylem ve Kod Detaylar\u0131",revertToast:"De\u011Fi\u015Fiklik geri al\u0131nd\u0131.",acceptToast:"De\u011Fi\u015Fiklik kal\u0131c\u0131 olarak onayland\u0131.",reapply:"Yeniden Uygula",dragDropHint:"Dosyalar\u0131 ba\u011Flam olarak eklemek i\xE7in buraya b\u0131rak\u0131n",searchFilesPlaceholder:"@ veya # ile dosya aray\u0131n...",contextFilesCount:t=>`${t} hedef dosya ba\u011Flamda`,blackboxBtn:"Kara Kutu",blackboxTitle:"Yan\u0131t\u0131n t\xFCm tokenlar\u0131n\u0131, komutlar\u0131n\u0131 ve ayr\u0131nt\u0131lar\u0131n\u0131 markdown olarak incele",runCommand:"\xC7al\u0131\u015Ft\u0131r",toolOutputTitle:"Ara\xE7 \xC7\u0131kt\u0131s\u0131",executedBadge:"Y\xFCr\xFCt\xFCld\xFC",failedBadge:"Ba\u015Far\u0131s\u0131z"},sessions:{hint:"Kay\u0131tl\u0131 oturumlar\u0131 d\u0131\u015Fa aktarabilir veya silebilirsiniz.",export:"D\u0131\u015Fa Aktar",exportMarkdown:"Markdown (.md)",exportJson:"JSON (.json)",deleteConfirm:"Bu oturumu silmek istedi\u011Finize emin misiniz?",deletedToast:"Oturum silindi.",messagesCount:t=>`${t} mesaj`},models:{title:"T\xFCm Modeller (Ollama & \xD6zel)",addDropdown:"+ Ekle \u25BE",importFromOllama:"Ollama'dan aktar",createCustom:"Kopya model olu\u015Ftur",deletedToast:"Model silindi.",editorTitleEdit:"Model Profili D\xFCzenle",editorTitleNew:"Yeni Model Profili",nameLabel:"G\xF6r\xFCnen Ad",namePlaceholder:"\xD6rn: Qwen Kod Asistan\u0131",baseModelLabel:"Taban Ollama Modeli",customPromptLabel:"\xD6zel Sistem Promptu",customPromptPlaceholder:"Bu modele \xF6zg\xFC rol ve talimatlar...",numCtxLabel:"KV-Cache / Context (num_ctx)",temperatureLabel:"S\u0131cakl\u0131k (Temperature)",nameRequired:"L\xFCtfen model ad\u0131n\u0131 girin.",savedToast:"Model kaydedildi.",importModalTitle:"Ollama'dan Model Aktar",importModalHint:"Cihaz\u0131n\u0131zda kurulu Ollama modelleri listeleniyor. Direkt aktarabilir veya parametrelerini d\xFCzenleyebilirsiniz:",importBtn:"Aktar",importedToast:"Model aktar\u0131ld\u0131.",noOllamaModels:"Aktar\u0131lacak yeni Ollama modeli bulunamad\u0131."},export:{createdDate:"Olu\u015Fturulma Tarihi:",model:"Model:",quantization:"Kuantizasyon:",user:"\u{1F464} Kullan\u0131c\u0131",assistant:"\u{1F916} Asistan"}};var ce={en:At,tr:$t},Ht="en";function _t(t,e){if(t&&t!=="auto"&&t in ce)return t;if(e){let n=e.split("-")[0].toLowerCase();if(n in ce)return n}return Ht}function me(t){return t&&t in ce?ce[t]:ce[Ht]}function C(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ze(t,e){let n=C(t),i=(e||"").toLowerCase().trim(),l=/(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)/g,s=/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g,o=/\b(\d+(?:\.\d+)?(?:e[+-]?\d+)?)\b/g,r=/\b(const|let|var|function|return|if|else|for|while|import|export|from|class|extends|new|this|async|await|try|catch|finally|throw|typeof|interface|type|public|private|protected|def|elif|print|self|None|True|False|package|func|struct|impl|mut|match|fn)\b/g;if(i==="python"||i==="py")r=/\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|raise|with|lambda|yield|pass|break|continue|async|await|None|True|False|in|is|not|and|or|global|nonlocal)\b/g;else if(i==="bash"||i==="sh"||i==="zsh")r=/\b(if|then|else|elif|fi|case|esac|for|select|while|until|do|done|in|function|time|echo|export|source|alias|cd|mkdir|rm|cp|mv|chmod|chown|grep|cat)\b/g;else if(i==="json")return n.replace(/("(\\[^]|[^\\"])*")\s*:/g,'<span class="tok-key">$1</span>:').replace(/:\s*("(\\[^]|[^\\"])*")/g,': <span class="tok-string">$1</span>').replace(o,'<span class="tok-number">$1</span>').replace(/\b(true|false|null)\b/g,'<span class="tok-keyword">$1</span>');let u=[],f=n;return f=f.replace(l,h=>{let d=`__COMM_${u.length}__`;return u.push(`<span class="tok-comment">${h}</span>`),d}),f=f.replace(s,h=>{let d=`__STR_${u.length}__`;return u.push(`<span class="tok-string">${h}</span>`),d}),f=f.replace(o,'<span class="tok-number">$1</span>'),f=f.replace(r,'<span class="tok-keyword">$1</span>'),u.forEach((h,d)=>{f=f.replace(`__COMM_${d}__`,h),f=f.replace(`__STR_${d}__`,h)}),f}function jt(t){let e=[],n=t.replace(/<write_file\s+path=["']([^"']+)["']\s*>([\s\S]*?)(?:<\/write_file>|$)/gi,(i,l,s)=>{let o=e.length,r=`
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u270D\uFE0F</span>
        <span class="agent-dropline-title">Dosya Yazma</span>
        <span class="agent-dropline-path">${C(l)}</span>
    </summary>
    <div class="agent-dropline-body">
        <pre class="agent-dropline-code"><code>${ze(s.trim(),"typescript")}</code></pre>
    </div>
</details>`;return e.push(r),`

__AGENT_ACTION_PLACEHOLDER_${o}__

`});return n=n.replace(/<edit_file\s+path=["']([^"']+)["']\s*>([\s\S]*?)(?:<\/edit_file>|$)/gi,(i,l,s)=>{let o=e.length,r=`
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u{1F4DD}</span>
        <span class="agent-dropline-title">Dosya D\xFCzenleme</span>
        <span class="agent-dropline-path">${C(l)}</span>
    </summary>
    <div class="agent-dropline-body">
        <pre class="agent-dropline-code"><code>${ze(s.trim(),"typescript")}</code></pre>
    </div>
</details>`;return e.push(r),`

__AGENT_ACTION_PLACEHOLDER_${o}__

`}),n=n.replace(/<(?:read_file|cat)\s+path=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:read_file|cat)>|\s*>)/gi,(i,l)=>{let s=e.length,o=`
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u{1F4D6}</span>
        <span class="agent-dropline-title">Dosya Okuma</span>
        <span class="agent-dropline-path">${C(l)}</span>
    </summary>
</details>`;return e.push(o),`

__AGENT_ACTION_PLACEHOLDER_${s}__

`}),n=n.replace(/<(?:create_folder|create_dir)\s+path=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:create_folder|create_dir)>|\s*>)/gi,(i,l)=>{let s=e.length,o=`
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u{1F4C1}</span>
        <span class="agent-dropline-title">Klas\xF6r Olu\u015Fturma</span>
        <span class="agent-dropline-path">${C(l)}</span>
    </summary>
</details>`;return e.push(o),`

__AGENT_ACTION_PLACEHOLDER_${s}__

`}),n=n.replace(/<(?:delete_path|delete_file|delete_folder)\s+path=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:delete_path|delete_file|delete_folder)>|\s*>)/gi,(i,l)=>{let s=e.length,o=`
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u{1F5D1}\uFE0F</span>
        <span class="agent-dropline-title">Silme Eylemi</span>
        <span class="agent-dropline-path">${C(l)}</span>
    </summary>
</details>`;return e.push(o),`

__AGENT_ACTION_PLACEHOLDER_${s}__

`}),n=n.replace(/<(?:move_path|rename_path)\s+from=["']([^"']+)["']\s+to=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:move_path|rename_path)>|\s*>)/gi,(i,l,s)=>{let o=e.length,r=`
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u{1F4E6}</span>
        <span class="agent-dropline-title">Ta\u015F\u0131ma / Yeniden Adland\u0131rma</span>
        <span class="agent-dropline-path">${C(l)} \u279C ${C(s)}</span>
    </summary>
</details>`;return e.push(r),`

__AGENT_ACTION_PLACEHOLDER_${o}__

`}),n=n.replace(/<(?:list_dir|list_files)(?:\s+path=["']([^"']*)["'])?(?:\s*\/>|\s*>[\s\S]*?<\/(?:list_dir|list_files)>|\s*>)/gi,(i,l)=>{let s=e.length,o=`
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u{1F4C2}</span>
        <span class="agent-dropline-title">Dizin Listeleme</span>
        <span class="agent-dropline-path">${C(l||".")}</span>
    </summary>
</details>`;return e.push(o),`

__AGENT_ACTION_PLACEHOLDER_${s}__

`}),n=n.replace(/<find_files\s+pattern=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/find_files>|\s*>)/gi,(i,l)=>{let s=e.length,o=`
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u{1F50D}</span>
        <span class="agent-dropline-title">Dosya Arama</span>
        <span class="agent-dropline-path">${C(l)}</span>
    </summary>
</details>`;return e.push(o),`

__AGENT_ACTION_PLACEHOLDER_${s}__

`}),n=n.replace(/<grep\s+query=["']([^"']+)["'](?:\s+path=["']([^"']*)["'])?(?:\s+is_regex=["'](?:true|false)["'])?(?:\s*\/>|\s*>[\s\S]*?<\/grep>|\s*>)/gi,(i,l,s)=>{let o=e.length,r=`
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u{1F50E}</span>
        <span class="agent-dropline-title">Kod Aramas\u0131 (Grep)</span>
        <span class="agent-dropline-path">"${C(l)}" ${s?`in ${C(s)}`:""}</span>
    </summary>
</details>`;return e.push(r),`

__AGENT_ACTION_PLACEHOLDER_${o}__

`}),n=n.replace(/<(?:run_command|execute_command)>([\s\S]*?)<\/(?:run_command|execute_command)>/gi,(i,l)=>{let s=e.length,o=`
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u26A1</span>
        <span class="agent-dropline-title">Terminal Komutu</span>
        <span class="agent-dropline-path"><code>${C(l.trim())}</code></span>
    </summary>
</details>`;return e.push(o),`

__AGENT_ACTION_PLACEHOLDER_${s}__

`}),n=n.replace(/<web_search(?:\s+query=["']([^"']+)["'])?(?:\s*\/>|\s*>([\s\S]*?)<\/web_search>|\s*>)/gi,(i,l,s)=>{let o=(l||s||"").trim(),r=e.length,u=`
<details class="agent-dropline">
    <summary class="agent-dropline-summary">
        <span class="agent-dropline-icon">\u{1F310}</span>
        <span class="agent-dropline-title">Web Aramas\u0131</span>
        <span class="agent-dropline-path">"${C(o)}"</span>
    </summary>
</details>`;return e.push(u),`

__AGENT_ACTION_PLACEHOLDER_${r}__

`}),{processedText:n,actionBlocks:e}}function Ne(t,e=!1,n="Copy",i="Copy Code"){if(!t)return"";let{processedText:l,actionBlocks:s}=jt(t),o=/```([a-zA-Z0-9_-]*)\n([\s\S]*?)(?:```|$)/g,r=[],u=0,f;for(;(f=o.exec(l))!==null;){let d=l.slice(u,f.index);d&&r.push(Dt(d));let m=f[1]||"plaintext",p=f[2],g=ze(p,m),y=encodeURIComponent(p);r.push(`
            <div class="code-block-wrapper">
                <div class="code-block-header">
                    <span class="code-block-lang">${C(m)}</span>
                    <button class="code-copy-btn" data-code="${y}" title="${C(i)}">
                        <svg class="icon-copy" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        <span>${C(n)}</span>
                    </button>
                </div>
                <pre class="code-block-content"><code class="language-${C(m)}">${g}</code></pre>
            </div>
        `),u=f.index+f[0].length}u<l.length&&r.push(Dt(l.slice(u)));let h=r.join("");return h=h.replace(/__AGENT_ACTION_PLACEHOLDER_(\d+)__/g,(d,m)=>s[Number(m)]||""),e&&(h+='<span class="streaming-cursor"></span>'),h}function Ce(t){let e=t.trim();return e=e.replace(/\\\|/g,"__ESCAPED_PIPE__"),e=e.replace(/`([^`]+)`/g,(n,i)=>"`"+i.replace(/\|/g,"__INLINE_PIPE__")+"`"),e.startsWith("|")&&(e=e.slice(1)),e.endsWith("|")&&(e=e.slice(0,-1)),e.split("|").map(n=>n.trim().replace(/__ESCAPED_PIPE__/g,"|").replace(/__INLINE_PIPE__/g,"|"))}function Vt(t){if(!t.includes("|")&&!/^:?-+:?$/.test(t.trim()))return!1;let e=Ce(t);return e.length===0?!1:e.every(n=>/^:?-+:?$/.test(n.trim()))}function Yt(t){return Ce(t).map(n=>{let i=n.trim(),l=i.startsWith(":"),s=i.endsWith(":");return l&&s?"center":s?"right":l?"left":""})}function Re(t){let e=t;return e=e.replace(/\*\*\*(.*?)\*\*\*/g,"<strong><em>$1</em></strong>"),e=e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),e=e.replace(/\*(.*?)\*/g,"<em>$1</em>"),e=e.replace(/~~(.*?)~~/g,"<del>$1</del>"),e=e.replace(/`([^`]+)`/g,'<code class="inline-code">$1</code>'),e=e.replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:|#)[^\s)]+)\)/g,'<a href="$2" class="chat-link" target="_blank" rel="noopener noreferrer">$1</a>'),e}function Jt(t){if(t.length<2)return"";let e=Ce(t[0]),n=Yt(t[1]),i=Math.max(e.length,n.length),l=`<div class="table-container">
<table>
<thead>
<tr>
`;for(let o=0;o<i;o++){let r=e[o]||"",u=n[o],f=u?` style="text-align: ${u};"`:"";l+=`  <th${f}>${Re(C(r))}</th>
`}l+=`</tr>
</thead>
`;let s=t.slice(2);if(s.length>0){l+=`<tbody>
`;for(let o of s){let r=Ce(o);if(!(r.length===1&&r[0]==="")){l+=`<tr>
`;for(let u=0;u<i;u++){let f=r[u]||"",h=n[u],d=h?` style="text-align: ${h};"`:"";l+=`  <td${d}>${Re(C(f))}</td>
`}l+=`</tr>
`}}l+=`</tbody>
`}return l+=`</table>
</div>`,l}function Qt(t){let e=t.split(`
`),n=[],i=[],l=0;for(;l<e.length;){let s=e[l],o=l+1<e.length?e[l+1]:null;if(s.includes("|")&&o!==null&&Vt(o)){let r=[s,o];for(l+=2;l<e.length&&e[l].includes("|");)r.push(e[l]),l++;let u=`__TABLE_PLACEHOLDER_${n.length}__`;n.push(Jt(r)),i.push("",u,"")}else i.push(s),l++}return{processedText:i.join(`
`),tables:n}}function Dt(t){let{processedText:e,tables:n}=Qt(t),i=C(e);return i=i.replace(/^### (.*$)/gim,"<h3>$1</h3>"),i=i.replace(/^## (.*$)/gim,"<h2>$1</h2>"),i=i.replace(/^# (.*$)/gim,"<h1>$1</h1>"),i=Re(i),i=i.replace(/^> (.*$)/gim,"<blockquote>$1</blockquote>"),i=i.replace(/^\s*[-*]\s+(.*$)/gim,"<li>$1</li>"),i=i.replace(/^\s*\d+\.\s+(.*$)/gim,"<li>$1</li>"),i=i.replace(/((?:<li>.*?<\/li>\s*)+)/g,"<ul>$1</ul>"),i=i.split(/\n\n+/).map(s=>{let o=s.trim();return o?o.startsWith("<h")||o.startsWith("<ul>")||o.startsWith("<blockquote>")||/^__TABLE_PLACEHOLDER_\d+__$/.test(o)||/^__AGENT_ACTION_PLACEHOLDER_\d+__$/.test(o)?o:`<p>${o.replace(/\n/g,"<br/>")}</p>`:""}).join(""),i=i.replace(/__TABLE_PLACEHOLDER_(\d+)__/g,(s,o)=>n[Number(o)]||""),i}var x=acquireVsCodeApi(),A=[],k="",w=[],B=[],L={ollamaUrl:"http://127.0.0.1:11434",defaultSystemPrompt:"",defaultMaxTokens:4096},Be="Geli\u015Ftirici",W="",$="chat",M="en",a=me("en"),Wt="",O=!1,Ye="",Fe="",Ie=null,Pt=0,Je=0,fe=[],V=0,G=[],qt="@",Gt=0,N=!1,Ot=document.getElementById("sessionTitle"),Ae=document.getElementById("sessionSelectorBtn"),Qe=document.getElementById("newSessionBtn"),z=document.getElementById("sessionDropdown"),ne=document.getElementById("sessionSearchInput"),We=document.getElementById("sessionList"),K=document.getElementById("chatContainer"),T=document.getElementById("chatTextarea"),j=document.getElementById("sendBtn"),Ze=document.getElementById("settingsBtn"),Xe=document.getElementById("modelBadgeBtn"),Zt=document.getElementById("modelBadgeName"),Y=document.getElementById("modeBadgeBtn"),qe=document.getElementById("modeBadgeIcon"),Ge=document.getElementById("modeBadgeName"),te=document.getElementById("webAccessBtn"),$e=document.getElementById("tokenStatBadge"),ue=document.getElementById("kvCachePopover"),R=document.getElementById("modelDropdown"),se=document.getElementById("modelSearchInput"),Ke=document.getElementById("modelList"),q=document.getElementById("modeDropdown"),Ue=document.getElementById("modeList"),st=document.getElementById("settingsModal"),Xt=document.getElementById("closeSettingsBtn"),je=document.getElementById("toast"),_=document.getElementById("mentionAutocomplete"),ee=document.getElementById("dragDropOverlay"),J=document.getElementById("modelEditorModal"),en=document.getElementById("closeModelEditorBtn"),tn=document.getElementById("cancelModelEditorBtn"),nn=document.getElementById("saveModelEditorBtn"),ae=document.getElementById("ollamaImportModal"),sn=document.getElementById("closeOllamaImportBtn"),pe=document.getElementById("ollamaImportList");window.addEventListener("load",()=>{x.postMessage({type:"ready"}),vn()});window.addEventListener("message",t=>{let e=t.data;switch(e.type){case"initData":A=e.sessions||[],k=e.activeSessionId||A[0]?.id||"",w=e.models||[],B=e.installedOllamaModels||[],L=e.settings||L,Be=e.username||Be,fe=e.workspaceFiles||[],e.vscodeLanguage&&(Wt=e.vscodeLanguage),e.language&&(M=e.language,a=me(M)),e.lastSelectedModelId&&w.some(s=>s.id===e.lastSelectedModelId)?W=e.lastSelectedModelId:w[0]?.id?W=w[0].id:B[0]?.name&&(W=B[0].name),e.lastSelectedWebAccess!==void 0&&(N=!!e.lastSelectedWebAccess);let n=H();n&&((n.messages.length===0||!w.some(s=>s.id===n.modelId))&&(n.modelId=W),n.mode&&($=n.mode),n.webAccessEnabled===void 0&&(n.webAccessEnabled=N)),e.lastSelectedMode&&(!n||!n.mode)&&($=e.lastSelectedMode),et(),Kt();break;case"workspaceFiles":fe=e.files||[];break;case"modeUpdated":e.sessionId===k&&($=e.mode,ie(),Q());break;case"webAccessUpdated":{N=!!e.enabled;let s=A.find(o=>o.id===e.sessionId);s&&(s.webAccessEnabled=e.enabled),e.sessionId===k&&oe()}break;case"webSearching":{let s=document.querySelector("#streamingMessageRow .thinking-text");s&&(e.searching?s.textContent=`\u{1F310} ${a.chat.webSearching||"\u0130nternette ara\u015Ft\u0131r\u0131l\u0131yor..."}`:s.textContent=a.chat.thinking)}break;case"agentActionUpdated":{let{sessionId:s,messageId:o,actionId:r,status:u,securityAudit:f,output:h}=e,p=A.find(g=>g.id===s)?.messages.find(g=>g.id===o)?.actions?.find(g=>g.id===r);p&&(p.status=u,f&&(p.securityAudit=f),h!==void 0&&(p.output=h),F());break}case"newSessionDraft":e.session&&(k=e.session.id,e.session.webAccessEnabled===void 0&&(e.session.webAccessEnabled=N),A=A.filter(s=>s.messages&&s.messages.length>0),A.unshift(e.session),e.session.mode&&($=e.session.mode),He(),F(),ve(),ie(),Q(),oe(),De());break;case"sessionsUpdated":{let s=A.find(r=>r.id===k&&(!r.messages||r.messages.length===0));A=e.sessions||[],s&&!A.some(r=>r.id===s.id)&&A.unshift(s),e.activeSessionId&&(k=e.activeSessionId);let o=H();o?.mode&&($=o.mode),o&&o.webAccessEnabled===void 0&&(o.webAccessEnabled=N),He(),F(),ie(),Q(),oe(),De()}break;case"modelsUpdated":w=e.models||[],B=e.installedOllamaModels||[],ve(),_e(),it();break;case"settingsUpdated":L=e.settings||L,e.language&&(M=e.language,a=me(M),et()),lt(),he(a.settings.savedToast);break;case"streamStart":e.sessionId&&(k=e.sessionId);break;case"streamChunk":e.sessionId&&(k=e.sessionId),ge(),O=!0,Fe=e.fullText,rn(e.fullText),Z();break;case"streamDone":e.sessionId&&(k=e.sessionId),ge(),O=!1,Fe="",e.stats?.tokensPerSecond&&(Je=e.stats.tokensPerSecond);let i=H();i||(i=A.find(s=>s.id===k)),i&&e.message&&(i.messages.some(o=>o.id===e.message.id)||i.messages.push(e.message)),F(),Z(),at();break;case"streamError":ge(),O=!1,Fe="";let l=H();l&&l.messages.push({id:"err_"+Date.now(),role:"assistant",content:`\u274C Hata: ${e.error}`,createdAt:Date.now(),error:!0}),F(),Z();break;case"toast":he(e.message);break}});function H(){return A.find(t=>t.id===k)}function U(){let t=H();return t?.modelId&&(w.length===0||w.some(e=>e.id===t.modelId))?t.modelId:W&&(w.length===0||w.some(e=>e.id===W))?W:L.defaultModelId&&(w.length===0||w.some(e=>e.id===L.defaultModelId))?L.defaultModelId:w[0]?.id?w[0].id:B[0]?.name?B[0].name:"default"}function an(t){M=t,a=me(t),et(),Kt();let e=document.getElementById("settingLanguage");e&&(e.value=L.language||"auto")}function et(){Ae&&(Ae.title=a.header.listSessions),Qe&&(Qe.title=a.header.newSession),ne&&(ne.placeholder=a.dropdowns.searchSessions),se&&(se.placeholder=a.dropdowns.searchModels),T&&(T.placeholder=a.chat.inputPlaceholder),Ze&&(Ze.title=a.settings.title);let t=document.querySelector("#kvCachePopover .kvcache-popover-title");t&&(t.textContent=a.kvCache.title);let e=document.querySelectorAll("#kvCachePopover .kvcache-detail-row span");e[0]&&(e[0].textContent=a.kvCache.model),e[1]&&(e[1].textContent=a.kvCache.context),e[2]&&(e[2].textContent=a.kvCache.temperature),e[3]&&(e[3].textContent=a.kvCache.lastSpeed);let n=document.querySelector("#settingsModal .modal-title");n&&(n.textContent=a.settings.title);let i=document.querySelectorAll("#settingsModal .tab-btn");i[0]&&(i[0].textContent=a.settings.tabSessions),i[1]&&(i[1].textContent=a.settings.tabModels),i[2]&&(i[2].textContent=a.settings.tabSettings);let l=document.querySelector("#tabSessions .form-hint");l&&(l.textContent=a.sessions.hint);let s=document.querySelector("#tabModels .form-label");s&&(s.textContent=a.models.title);let o=document.getElementById("addModelBtn");o&&(o.textContent=a.models.addDropdown);let r=document.getElementById("importFromOllamaBtn");r&&(r.textContent=a.models.importFromOllama);let u=document.getElementById("createNewModelBtn");u&&(u.textContent=a.models.createCustom);let f=document.getElementById("settingLanguageLabel");f&&(f.textContent=a.settings.languageLabel);let h=document.getElementById("settingLanguageHint");h&&(h.textContent=a.settings.languageHint);let d=document.getElementById("settingLanguage");if(d&&d.options.length>=3){let Oe=L.language||d.value||"auto";d.options[0].textContent=a.settings.langAuto,d.options[1].textContent=a.settings.langEn,d.options[2].textContent=a.settings.langTr,d.value=Oe}let m=document.getElementById("settingOllamaUrlLabel");m&&(m.textContent=a.settings.ollamaUrlLabel);let p=document.getElementById("settingOllamaUrlHint");p&&(p.textContent=a.settings.ollamaUrlHint);let g=document.getElementById("settingPromptLabel");g&&(g.textContent=a.settings.systemPromptLabel);let y=document.getElementById("settingDefaultPrompt");y&&(y.placeholder=a.settings.systemPromptPlaceholder);let E=document.getElementById("settingPromptHint");E&&(E.textContent=a.settings.systemPromptHint);let v=document.getElementById("settingTokensLabel");v&&(v.textContent=a.settings.maxTokensLabel);let b=document.getElementById("settingTokensHint");b&&(b.textContent=a.settings.maxTokensHint);let S=document.getElementById("saveSettingsBtn");S&&(S.textContent=a.settings.saveSettings);let I=document.getElementById("settingAutoApplyLabel");I&&(I.textContent=a.settings.autoApplyLabel);let D=document.getElementById("settingAutoApplyHint");D&&(D.textContent=a.settings.autoApplyHint);let P=document.getElementById("settingPermissionsTitle");P&&(P.textContent=a.settings.autoPermissionsTitle);let X=document.getElementById("settingAutoFileEditsLabel");X&&(X.textContent=a.settings.allowFileEdits);let be=document.getElementById("settingAutoFileEditsHint");be&&(be.textContent=a.settings.autoPermissionsHint);let ye=document.getElementById("settingAutoFileCreateLabel");ye&&(ye.textContent=a.settings.allowFileCreate);let Ee=document.getElementById("settingAutoFileCreateHint");Ee&&(Ee.textContent=a.settings.autoPermissionsHint);let Le=document.getElementById("settingAutoFolderCreateLabel");Le&&(Le.textContent=a.settings.allowFolderCreate);let ke=document.getElementById("settingAutoFolderCreateHint");ke&&(ke.textContent=a.settings.autoPermissionsHint);let Me=document.getElementById("settingProsecutorTitle");Me&&(Me.textContent=a.settings.prosecutorTitle);let Te=document.getElementById("settingEnableProsecutorLabel");Te&&(Te.textContent=a.settings.prosecutorToggle);let we=document.getElementById("settingEnableProsecutorHint");we&&(we.textContent=a.settings.prosecutorHint);let xe=document.getElementById("settingProsecutorModelLabel");xe&&(xe.textContent=a.settings.prosecutorModelLabel);let dt=document.getElementById("settingProsecutorModelHint");dt&&(dt.textContent=a.settings.prosecutorHint);let rt=document.getElementById("settingWebSearchTitle");rt&&(rt.textContent=a.settings.webSearchTitle);let ct=document.getElementById("settingWebEngineLabel");ct&&(ct.textContent=a.settings.webEngineLabel);let mt=document.getElementById("settingWebDepthLabel");mt&&(mt.textContent=a.settings.webDepthLabel);let re=document.getElementById("settingWebDepth");re&&re.options.length>=3&&(re.options[0].textContent=a.settings.webDepthFast,re.options[1].textContent=a.settings.webDepthStandard,re.options[2].textContent=a.settings.webDepthDeep);let ut=document.getElementById("settingWebMaxResultsLabel");ut&&(ut.textContent=a.settings.webMaxResultsLabel);let pt=document.getElementById("settingWebBlacklistLabel");pt&&(pt.textContent=a.settings.webBlacklistLabel);let gt=document.getElementById("settingWebBlacklistHint");gt&&(gt.textContent=a.settings.webBlacklistHint);let ft=document.getElementById("settingWebWhitelistLabel");ft&&(ft.textContent=a.settings.webWhitelistLabel);let vt=document.getElementById("settingWebWhitelistHint");vt&&(vt.textContent=a.settings.webWhitelistHint);let ht=document.getElementById("webAccessLabel");ht&&(ht.textContent=a.chat.webAccessBtn);let bt=document.getElementById("dragDropText");bt&&(bt.textContent=a.mode.dragDropHint);let yt=document.getElementById("editorModelNameLabel");yt&&(yt.textContent=a.models.nameLabel);let Et=document.getElementById("editorModelName");Et&&(Et.placeholder=a.models.namePlaceholder);let Lt=document.getElementById("editorBaseModelLabel");Lt&&(Lt.textContent=a.models.baseModelLabel);let kt=document.getElementById("editorSystemPromptLabel");kt&&(kt.textContent=a.models.customPromptLabel);let Mt=document.getElementById("editorSystemPrompt");Mt&&(Mt.placeholder=a.models.customPromptPlaceholder);let Tt=document.getElementById("editorNumCtxLabel");Tt&&(Tt.textContent=a.models.numCtxLabel);let wt=document.getElementById("editorTemperatureLabel");wt&&(wt.textContent=a.models.temperatureLabel);let xt=document.getElementById("cancelModelEditorBtn");xt&&(xt.textContent=a.common.cancel);let Ct=document.getElementById("saveModelEditorBtn");Ct&&(Ct.textContent=a.common.save);let St=document.getElementById("modelEditorTitle");if(St){let Oe=J.hasAttribute("data-edit-id");St.textContent=Oe?a.models.editorTitleEdit:a.models.editorTitleNew}let It=document.getElementById("ollamaImportModalTitle")||document.querySelector("#ollamaImportModal .modal-title");It&&(It.textContent=a.models.importModalTitle);let Bt=document.getElementById("ollamaImportModalHint")||document.querySelector("#ollamaImportModal .form-hint");Bt&&(Bt.textContent=a.models.importModalHint),ie(),Q(),Z()}function Kt(){He(),F(),ve(),_e(),ie(),Q(),oe(),De(),it(),lt(),Z(),at()}function oe(){if(!te)return;let t=H();(t?.webAccessEnabled!==void 0?!!t.webAccessEnabled:N)?(te.classList.add("active"),te.title=`${a.chat.webAccessBtn}: A\xE7\u0131k`):(te.classList.remove("active"),te.title=`${a.chat.webAccessBtn}: Kapal\u0131`)}function ie(){!Y||!Ge||!qe||($==="agent"?(qe.textContent="\u{1F916}",Ge.textContent=a.mode.agent,Y.classList.add("mode-agent"),Y.title=a.mode.agentDesc):(qe.textContent="\u{1F4AC}",Ge.textContent=a.mode.chat,Y.classList.remove("mode-agent"),Y.title=a.mode.chatDesc))}function Q(){Ue&&(Ue.innerHTML=`
        <div class="dropdown-item ${$==="chat"?"active":""}" data-mode="chat">
            <span style="font-size: 16px;">\u{1F4AC}</span>
            <div class="dropdown-item-content">
                <div class="dropdown-item-title">${c(a.mode.chat)}</div>
                <div class="dropdown-item-subtitle">${c(a.mode.chatDesc)}</div>
            </div>
            ${$==="chat"?'<span class="dropdown-item-check">\u2713</span>':""}
        </div>
        <div class="dropdown-item ${$==="agent"?"active":""}" data-mode="agent">
            <span style="font-size: 16px;">\u{1F916}</span>
            <div class="dropdown-item-content">
                <div class="dropdown-item-title">${c(a.mode.agent)}</div>
                <div class="dropdown-item-subtitle">${c(a.mode.agentDesc)}</div>
            </div>
            ${$==="agent"?'<span class="dropdown-item-check">\u2713</span>':""}
        </div>
    `,Ue.querySelectorAll(".dropdown-item").forEach(t=>{t.addEventListener("click",e=>{e.stopPropagation();let n=t.getAttribute("data-mode");if(n&&n!==$){$=n;let i=H();i&&(i.mode=n),x.postMessage({type:"switchMode",sessionId:k,mode:n}),ie(),Q(),q?.classList.remove("active")}})}))}function on(t,e){return`
        <div class="agent-actions-container">
            ${e.map(n=>{let i=n.status==="applied",l=n.status==="executed",s=n.status==="failed",o=n.status==="reverted",r=n.status==="accepted",u=n.status==="rejected",f=n.status==="pending",h="",d="",m=n.securityAudit?.blocked;if(i)h=`<span class="agent-status-badge status-applied">\u2713 ${c(a.mode.autoAppliedBadge)}</span>`,d=`
                        <div class="agent-card-buttons">
                            ${n.type==="write"||n.type==="edit"?`
                            <button class="agent-btn diff-btn" data-act-id="${n.id}" data-msg-id="${t}" title="${c(a.mode.viewDiff)}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                <span>${c(a.mode.viewDiff)}</span>
                            </button>`:""}
                            <button class="agent-btn accept-btn" data-act-id="${n.id}" data-msg-id="${t}" title="${c(a.mode.acceptToast)}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>${c(a.mode.accept)}</span>
                            </button>
                            <button class="agent-btn revert-btn" data-act-id="${n.id}" data-msg-id="${t}" title="${c(a.mode.revertToast)}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
                                <span>${c(a.mode.revert)}</span>
                            </button>
                        </div>
                    `;else if(l)h=`<span class="agent-status-badge status-applied">\u2713 ${c(a.mode.executedBadge)}</span>`;else if(s)h=`<span class="agent-status-badge status-rejected">\u2715 ${c(a.mode.failedBadge)}</span>`;else if(o)h=`<span class="agent-status-badge status-rejected">\u21B6 ${c(a.mode.reverted)}</span>`,d=`
                        <div class="agent-card-buttons">
                            <button class="agent-btn apply-btn" data-act-id="${n.id}" data-msg-id="${t}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>${c(a.mode.reapply)}</span>
                            </button>
                        </div>
                    `;else if(r)h=`<span class="agent-status-badge status-applied">\u2713 ${c(a.mode.accepted)}</span>`;else if(u)h=`<span class="agent-status-badge status-rejected">\u2715 ${c(a.mode.rejected)}</span>`;else if(f){let S=n.securityAudit?.blocked?'disabled style="opacity:0.35;cursor:not-allowed;" title="Savc\u0131 taraf\u0131ndan engellendi"':"",I=n.type==="write"||n.type==="edit",D=n.type==="command"?a.mode.runCommand:a.mode.apply;d=`
                        <div class="agent-card-buttons">
                            ${I?`
                            <button class="agent-btn diff-btn" data-act-id="${n.id}" data-msg-id="${t}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                <span>${c(a.mode.viewDiff)}</span>
                            </button>`:""}
                            <button class="agent-btn apply-btn" data-act-id="${n.id}" data-msg-id="${t}" ${S}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>${c(D)}</span>
                            </button>
                            <button class="agent-btn reject-btn" data-act-id="${n.id}" data-msg-id="${t}">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                <span>${c(a.mode.reject)}</span>
                            </button>
                        </div>
                    `}let p="";if(n.type==="edit"&&n.search&&n.replace)p=`
                        <div class="agent-diff-preview">
                            <div class="diff-line diff-del"><pre><code>- ${c(n.search.trim())}</code></pre></div>
                            <div class="diff-line diff-add"><pre><code>+ ${c(n.replace.trim())}</code></pre></div>
                        </div>
                    `;else if(n.type==="write"&&n.content){let b=n.content.trim().split(`
`).slice(0,6).join(`
`);p=`
                        <div class="agent-write-preview">
                            <pre><code>${c(b)}</code></pre>
                        </div>
                    `}else n.type==="command"&&n.command&&!n.output&&(p=`
                        <div class="agent-write-preview">
                            <pre><code>$ ${c(n.command)}</code></pre>
                        </div>
                    `);let g="";if(n.output){let b=n.output.trim().slice(0,1500);g=`
                        <div class="agent-output-preview">
                            <div class="agent-output-header">
                                <span class="agent-output-title">\u{1F4C4} ${c(a.mode.toolOutputTitle)}</span>
                            </div>
                            <pre class="agent-output-code"><code>${c(b)}</code></pre>
                        </div>
                    `}let y="FILE",E=n.path,v="badge-file";switch(n.type){case"write":y="WRITE",E=`\u{1F4C4} ${n.path}`,v="badge-write";break;case"edit":y="EDIT",E=`\u{1F4DD} ${n.path}`,v="badge-edit";break;case"read":y="READ",E=`\u{1F4D6} ${n.path}`,v="badge-read";break;case"create_dir":y="FOLDER",E=`\u{1F4C1} ${n.path}`,v="badge-folder";break;case"delete":y="DELETE",E=`\u{1F5D1}\uFE0F ${n.path}`,v="badge-delete";break;case"move":y="MOVE",E=`\u{1F4E6} ${n.path} \u279C ${n.targetPath}`,v="badge-move";break;case"list_dir":y="LIST",E=`\u{1F4C2} ${n.path||"."}`,v="badge-list";break;case"find_files":y="FIND",E=`\u{1F50D} ${n.pattern||n.path}`,v="badge-find";break;case"grep":y="GREP",E=`\u{1F50E} "${n.query}" (${n.path||"."})`,v="badge-grep";break;case"command":y="CMD",E=`\u26A1 ${n.command}`,v="badge-cmd";break}return`
                    <div class="agent-action-card ${n.status}">
                        <div class="agent-card-header">
                            <div class="agent-card-file">
                                <span class="agent-type-badge ${v}">${y}</span>
                                <span class="agent-file-path" title="${c(E)}">${c(E)}</span>
                            </div>
                            <div class="agent-card-header-right">
                                ${h}
                                ${d}
                            </div>
                        </div>
                        ${p}
                        ${g}
                    </div>
                `}).join("")}
        </div>
    `}function He(){let t=H();t&&t.title&&t.title!=="Yeni Sohbet"&&t.title!=="New Chat"?Ot.textContent=t.title:Ot.textContent=a.header.untitledSession,oe()}function F(){let t=H();if(K.innerHTML="",!t||t.messages.length===0){let e=document.createElement("div");e.className="welcome-container";let n=M==="tr"?`Ho\u015F geldin, ${c(Be)}`:`Welcome, ${c(Be)}`,i=a.chat.emptySubtitle,l=M==="tr"?[{label:"\u26A1 Kod optimizasyonu ve analizi",prompt:"Bu fonksiyondaki zaman karma\u015F\u0131kl\u0131\u011F\u0131n\u0131 optimize et ve a\xE7\u0131kla."},{label:"\u{1F6E0}\uFE0F TypeScript mimarisi tasarla",prompt:"TypeScript ile esnek ve tip g\xFCvenli bir state manager nas\u0131l yazar\u0131m?"},{label:"\u{1F50D} Regex deseni olu\u015Ftur ve a\xE7\u0131kla",prompt:"Regex deseni olu\u015Ftur: ge\xE7erli e-posta ve uluslararas\u0131 telefon numaralar\u0131n\u0131 do\u011Frula."}]:[{label:"\u26A1 Code optimization and analysis",prompt:"Optimize the time complexity of this function and explain."},{label:"\u{1F6E0}\uFE0F Design TypeScript architecture",prompt:"How do I build a flexible and type-safe state manager in TypeScript?"},{label:"\u{1F50D} Generate and explain Regex pattern",prompt:"Create a regex pattern to validate email addresses and international phone numbers."}],s="";l.forEach(o=>{s+=`
                <div class="suggestion-card" data-prompt="${c(o.prompt)}">
                    <span>${c(o.label)}</span>
                </div>
            `}),e.innerHTML=`
            <div class="welcome-logo">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
                    <rect x="4" y="8" width="16" height="12" rx="2"></rect>
                    <path d="M9 13v2"></path>
                    <path d="M15 13v2"></path>
                </svg>
            </div>
            <h1 class="welcome-title">${n}</h1>
            <p class="welcome-subtitle">${i}</p>
            <div class="prompt-suggestions">
                ${s}
            </div>
        `,K.appendChild(e),e.querySelectorAll(".suggestion-card").forEach(o=>{o.addEventListener("click",()=>{let r=o.getAttribute("data-prompt");r&&(T.value=r,de(),tt())})});return}t.messages.forEach(e=>{let n=ln(e);K.appendChild(n)}),ot()}function ln(t){let e=document.createElement("div");e.className=`message-row ${t.role==="user"?"user-row":"assistant-row"}${t.error?" error-msg":""}`,e.id=`msg_${t.id}`;let n=new Date(t.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),i=t.role==="user"?M==="tr"?"Sen":"You":t.modelName||U()||(M==="tr"?"Asistan":"Assistant"),l="";if(t.role==="assistant"&&!t.error){let o="";if(t.stats&&(t.stats.tokensPerSecond||t.stats.totalDurationMs)){let d=(t.stats.tokensPerSecond||0).toFixed(1),m=((t.stats.totalDurationMs||0)/1e3).toFixed(2),p=t.stats.evalCount||0,g=t.stats.promptEvalCount||0,y=M==="tr"?"Cevap Bilgileri":"Response Info",E=M==="tr"?"\xDCretilen Token:":"Eval Tokens:",v=M==="tr"?"Prompt Token:":"Prompt Tokens:";o=`
                <div class="stats-btn-container">
                    <button class="action-btn">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        <span>${y}</span>
                    </button>
                    <div class="stats-popover">
                        <div class="stat-item"><span class="stat-label">${a.chat.speed}:</span> <span class="stat-value">${d} ${a.chat.tokenPerSec}</span></div>
                        <div class="stat-item"><span class="stat-label">${a.chat.duration}:</span> <span class="stat-value">${m}s</span></div>
                        <div class="stat-item"><span class="stat-label">${E}</span> <span class="stat-value">${p}</span></div>
                        <div class="stat-item"><span class="stat-label">${v}</span> <span class="stat-value">${g}</span></div>
                        ${t.modelQuantization?`<div class="stat-item"><span class="stat-label">${a.export.quantization}:</span> <span class="stat-value">${c(t.modelQuantization)}</span></div>`:""}
                    </div>
                </div>
            `}let r="",u=(t.actions||[]).filter(d=>d.securityAudit);if(u.length>0){let d=u.some(b=>b.securityAudit?.blocked||b.securityAudit?.risk==="high"),m=u.some(b=>b.securityAudit?.risk==="medium"),p="sec-safe",g="\u{1F6E1}\uFE0F",y=a.mode.prosecutorSafe;d?(p="sec-blocked",g="\u{1F6AB}",y=a.mode.prosecutorBlocked):m&&(p="sec-warning",g="\u26A0\uFE0F",y=a.mode.prosecutorWarning);let E=u[0].securityAudit?.prosecutorName||(M==="tr"?"1.5B Savc\u0131 Modeli":"1.5B Prosecutor Model"),v=M==="tr"?"Savc\u0131 G\xFCvenlik Raporu":"Security Audit Report";r=`
                <div class="security-btn-container">
                    <button class="action-btn security-btn ${p}">
                        <span class="security-btn-icon">${g}</span>
                        <span>${c(y)}</span>
                    </button>
                    <div class="security-popover">
                        <div class="security-popover-header">
                            <span class="security-popover-icon">${g}</span>
                            <span class="security-popover-title">${c(v)}</span>
                        </div>
                        <div class="security-popover-meta">
                            <span>${M==="tr"?"Denet\xE7i Model":"Auditor"}: <strong>${c(E)}</strong></span>
                        </div>
                        <div class="security-popover-items">
                            ${u.map(b=>{let S=b.securityAudit?.blocked||b.securityAudit?.risk==="high",I=b.securityAudit?.risk==="medium",D=S?"\u{1F6AB}":I?"\u26A0\uFE0F":"\u2713",P=S?"item-blocked":I?"item-warning":"item-safe",X=b.type==="command"?b.command||"terminal":b.path;return`
                                    <div class="security-audit-item ${P}">
                                        <div class="security-item-target">
                                            <span>${D}</span>
                                            <code>${c(X)}</code>
                                        </div>
                                        <div class="security-item-reason">${c(b.securityAudit?.reason||"")}</div>
                                    </div>
                                `}).join("")}
                        </div>
                        ${d?`
                            <div class="security-blocked-notice">
                                \u26A0\uFE0F ${M==="tr"?"Y\u0131k\u0131c\u0131 i\u015Flem riski nedeniyle otomatik \xE7al\u0131\u015Ft\u0131r\u0131lmad\u0131. Onay\u0131n\u0131z bekleniyor.":"Blocked from automatic execution due to safety risks. Awaiting your manual confirmation."}
                            </div>
                        `:""}
                    </div>
                </div>
            `}let h=t.webSources&&t.webSources.length>0?`
            <button class="action-btn sources-btn" data-msg-id="${t.id}" data-session-id="${k}" title="${c(a.chat.sourcesTitle||"Web Kaynaklar\u0131n\u0131 G\xF6r\xFCnt\xFCle")}">
                <span style="font-size: 11px;">\u{1F310}</span>
                <span>${c(a.chat.sourcesBtn||"Kaynaklar")}</span>
            </button>
        `:"";l=`
            <div class="message-actions">
                <button class="action-btn copy-msg-btn" data-content="${encodeURIComponent(t.content)}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    <span>${a.common.copy}</span>
                </button>
                ${o}
                <button class="action-btn blackbox-btn" data-msg-id="${t.id}" data-session-id="${k}" title="${c(a.mode.blackboxTitle)}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    <span>${c(a.mode.blackboxBtn)}</span>
                </button>
                ${h}
                ${r}
            </div>
        `}let s="";return t.actions&&t.actions.length>0&&(s=on(t.id,t.actions)),e.innerHTML=`
        <div class="message-header">
            <span class="message-sender">${c(i)}</span>
            <span class="message-time">${n}</span>
        </div>
        <div class="message-content">
            ${Ne(t.content,!1,a.common.copy,a.common.copy)}
            ${s}
        </div>
        ${l}
    `,e.querySelectorAll(".diff-btn").forEach(o=>{o.addEventListener("click",()=>{let r=o.getAttribute("data-act-id"),u=t.actions?.find(f=>f.id===r);u&&x.postMessage({type:"viewAgentDiff",path:u.path,newContent:u.content,search:u.search,replace:u.replace})})}),e.querySelectorAll(".apply-btn").forEach(o=>{o.addEventListener("click",()=>{let r=o.getAttribute("data-act-id");r&&x.postMessage({type:"applyAgentAction",sessionId:k,messageId:t.id,actionId:r})})}),e.querySelectorAll(".reject-btn").forEach(o=>{o.addEventListener("click",()=>{let r=o.getAttribute("data-act-id");r&&x.postMessage({type:"rejectAgentAction",sessionId:k,messageId:t.id,actionId:r})})}),e.querySelectorAll(".revert-btn").forEach(o=>{o.addEventListener("click",()=>{let r=o.getAttribute("data-act-id");r&&x.postMessage({type:"revertAgentAction",sessionId:k,messageId:t.id,actionId:r})})}),e.querySelectorAll(".accept-btn").forEach(o=>{o.addEventListener("click",()=>{let r=o.getAttribute("data-act-id");r&&x.postMessage({type:"acceptAgentAction",sessionId:k,messageId:t.id,actionId:r})})}),e}function dn(){ge();let t=document.getElementById("streamingMessageRow");t||(t=document.createElement("div"),t.id="streamingMessageRow",t.className="message-row assistant-row",K.appendChild(t)),Pt=Date.now();let e=M==="tr"?"\u015Fimdi":"now";t.innerHTML=`
        <div class="message-header">
            <span class="message-sender">${c(U())}</span>
            <span class="message-time">${e}</span>
        </div>
        <div class="message-content">
            <div class="thinking-placeholder">
                <span class="thinking-spinner"></span>
                <span class="thinking-text">${c(a.chat.thinking)}</span>
                <span class="thinking-timer" id="thinkingTimer">0.0s</span>
            </div>
        </div>
    `,Ie=setInterval(()=>{let n=document.getElementById("thinkingTimer");if(n){let i=((Date.now()-Pt)/1e3).toFixed(1);n.textContent=`${i}s`}},100),ot()}function ge(){Ie&&(clearInterval(Ie),Ie=null)}function rn(t){let e=document.getElementById("streamingMessageRow"),n=M==="tr"?"\u015Fimdi":"now";e||(e=document.createElement("div"),e.id="streamingMessageRow",e.className="message-row assistant-row",e.innerHTML=`
            <div class="message-header">
                <span class="message-sender">${c(U())}</span>
                <span class="message-time">${n}</span>
            </div>
            <div class="message-content"></div>
        `,K.appendChild(e));let i=e.querySelector(".message-content");i&&(i.innerHTML=Ne(t,!0,a.common.copy,a.common.copy)),ot()}function Z(){O?(j.classList.add("stop-btn"),j.title=a.chat.stop,j.innerHTML=`
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2"></rect>
            </svg>
        `):(j.classList.remove("stop-btn"),j.title=a.chat.send,j.innerHTML=`
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
        `)}function ve(){let t=U();Zt.textContent=t,Xe.title=`Model: ${t}`;let e=w.find(n=>n.id===t);e?.numCtx?$e.querySelector("span").textContent=`\u26A1 ${(e.numCtx/1024).toFixed(0)}k ctx`:$e.querySelector("span").textContent="\u26A1 KVCache",at()}function at(){let t=U(),e=w.find(r=>r.id===t),n=B.find(r=>r.name===(e?e.baseModel:t)),i=document.getElementById("kvModelName"),l=document.getElementById("kvCtxSize"),s=document.getElementById("kvTemperature"),o=document.getElementById("kvSpeed");if(i&&(i.textContent=t),l){let r=e?.numCtx||(n?.details?.parameter_size?`4096 (${a.common.default.toLowerCase()})`:"4096");l.textContent=typeof r=="number"?`${r} ${a.chat.tokens}`:r}s&&(s.textContent=e?.temperature!==void 0?String(e.temperature):"0.7"),o&&(o.textContent=Je>0?`${Je.toFixed(1)} ${a.chat.tokenPerSec}`:"-")}function _e(t=""){Ke.innerHTML="";let e=U(),n=[];(w.length>0?w:B.map(s=>({id:s.name,name:s.name,baseModel:s.name,isCustom:!1}))).forEach(s=>{let o=s.baseModel||s.id,r=B.find(u=>u.name===o||u.name===s.id);n.push({id:s.id,name:s.name,isCustom:s.isCustom??!1,quant:r?.details?.quantization_level,param:r?.details?.parameter_size})});let l=n.filter(s=>s.name.toLowerCase().includes(t.toLowerCase()));if(l.length===0){Ke.innerHTML=`<div style="padding: 8px; opacity: 0.6; font-size: 11px;">${c(a.dropdowns.noModels)}</div>`;return}l.forEach(s=>{let o=document.createElement("div");o.className=`dropdown-item ${s.id===e?"selected":""}`,o.innerHTML=`
            <div style="display: flex; align-items: center; gap: 5px;">
                <span>${c(s.name)}</span>
                ${s.param?`<span class="model-tag-badge param">${c(s.param)}</span>`:""}
                ${s.quant?`<span class="model-tag-badge quant">${c(s.quant)}</span>`:""}
                ${s.isCustom?`<span class="model-tag-badge custom">${c(a.dropdowns.customTag)}</span>`:""}
            </div>
            ${s.id===e?"<span>\u2713</span>":""}
        `,o.addEventListener("click",()=>{cn(s.id),R.classList.remove("active")}),Ke.appendChild(o)})}function cn(t){W=t;let e=H();e&&(e.modelId=t),ve(),x.postMessage({type:"selectModel",modelId:t,sessionId:k})}function zt(t=""){We.innerHTML="";let e=A.filter(n=>n.messages&&n.messages.length>0&&n.title.toLowerCase().includes(t.toLowerCase()));if(e.length===0){We.innerHTML='<div style="padding: 8px; opacity: 0.6; font-size: 11px;">Oturum bulunamad\u0131</div>';return}e.forEach(n=>{let i=document.createElement("div");i.className=`dropdown-item ${n.id===k?"selected":""}`;let l=new Date(n.updatedAt).toLocaleDateString([],{month:"short",day:"numeric"});i.innerHTML=`
            <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 170px;">
                <span>${c(n.title)}</span>
            </div>
            <span class="dropdown-item-meta">${l} (${n.messages.length})</span>
        `,i.addEventListener("click",()=>{mn(n.id),z.classList.remove("active")}),We.appendChild(i)})}function mn(t){if(k===t)return;k=t;let e=H();e?.modelId&&(w.length===0||w.some(n=>n.id===e.modelId))&&(W=e.modelId),He(),F(),ve(),x.postMessage({type:"switchSession",sessionId:t})}function un(){x.postMessage({type:"createSession",modelId:U(),mode:$})}function tt(){let t=T.value.trim();if(!t||O)return;Ye=t,T.value="",de();let e=H();e&&e.messages.push({id:"user_"+Date.now(),role:"user",content:t,createdAt:Date.now()}),O=!0,F(),Z(),dn();let n=e?.webAccessEnabled!==void 0?!!e.webAccessEnabled:N;x.postMessage({type:"sendMessage",sessionId:k,prompt:t,modelId:U(),mode:$,webAccessEnabled:n})}function Rt(){if(!O)return;ge(),x.postMessage({type:"stopGeneration",sessionId:k}),O=!1,Ye&&(T.value=Ye,de(),T.focus());let t=document.getElementById("streamingMessageRow");t&&t.remove(),F(),Z(),he("\xDCretim durduruldu, mesaj geri y\xFCklendi.")}function de(){T.style.height="auto";let t=Math.min(T.scrollHeight,115);T.style.height=`${t}px`}function pn(){if(!_)return;let t=T.value,e=T.selectionStart,n=t.slice(0,e),i=/(?:^|\s)([@#])([a-zA-Z0-9_\-./]*)$/.exec(n);if(!i){le();return}let l=i[1],s=i[2].toLowerCase();if(qt=l,Gt=i.index+(i[0].startsWith(" ")?1:0),G=fe.filter(o=>o.toLowerCase().includes(s)).slice(0,15),G.length===0){le();return}V=0,nt()}function nt(){_&&(_.innerHTML=G.map((t,e)=>{let n=e===V?"selected":"",i=t.includes("/")?"\u{1F4C4}":"\u{1F4DD}";return`
            <div class="mention-item ${n}" data-index="${e}">
                <span class="mention-icon">${i}</span>
                <span class="mention-path">${c(t)}</span>
            </div>
        `}).join(""),_.classList.add("active"),_.querySelectorAll(".mention-item").forEach(t=>{t.addEventListener("click",()=>{let e=parseInt(t.getAttribute("data-index")||"0",10);Ut(e)})}))}function le(){_&&(_.classList.remove("active"),_.innerHTML="")}function Ut(t){if(t<0||t>=G.length)return;let e=G[t],n=T.value,i=T.selectionStart,l=n.slice(0,Gt),s=n.slice(i),o=`${qt}${e} `;T.value=l+o+s;let r=l.length+o.length;T.setSelectionRange(r,r),le(),de(),T.focus()}function Ve(t,e){let n=t.selectionStart,i=t.selectionEnd,l=t.value;t.value=l.slice(0,n)+e+l.slice(i);let s=n+e.length;t.setSelectionRange(s,s),de()}function ot(){setTimeout(()=>{K.scrollTop=K.scrollHeight},20)}function gn(){st.classList.add("active"),De(),it(),lt()}function Nt(){st.classList.remove("active")}function De(t=""){let e=document.getElementById("settingsSessionList");if(!e)return;e.innerHTML="";let n=A.filter(i=>i.messages&&i.messages.length>0&&i.title.toLowerCase().includes(t.toLowerCase()));if(n.length===0){e.innerHTML=`<div style="opacity: 0.6; font-size: 11px; padding: 8px;">${c(a.dropdowns.noSessions)}</div>`;return}n.forEach(i=>{let l=document.createElement("div");l.className="settings-list-item",l.innerHTML=`
            <div>
                <strong>${c(i.title)}</strong>
                <div style="font-size: 10px; opacity: 0.65;">
                    ${new Date(i.createdAt).toLocaleDateString()} \u2022 ${a.sessions.messagesCount(i.messages.length)} \u2022 ${c(a.models.baseModelLabel)}: ${c(i.modelId||a.common.default)}
                </div>
            </div>
            <div class="item-actions">
                <div class="export-btn-container">
                    <button class="action-btn export-toggle-btn" data-id="${i.id}">${c(a.sessions.export)} \u25BE</button>
                    <div class="export-menu" id="exportMenu_${i.id}">
                        <div class="export-menu-item" data-action="export-md" data-id="${i.id}">\u{1F4C4} ${c(a.sessions.exportMarkdown)}</div>
                        <div class="export-menu-item" data-action="export-json" data-id="${i.id}">\u{1F4E6} ${c(a.sessions.exportJson)}</div>
                    </div>
                </div>
                <button class="btn-danger del-session-btn" data-id="${i.id}" title="${c(a.common.delete)}">${c(a.common.delete)}</button>
            </div>
        `,e.appendChild(l)}),e.querySelectorAll(".export-toggle-btn").forEach(i=>{i.addEventListener("click",l=>{l.stopPropagation();let s=i.getAttribute("data-id"),o=document.getElementById(`exportMenu_${s}`);document.querySelectorAll(".export-menu").forEach(r=>{r!==o&&r.classList.remove("active")}),o?.classList.toggle("active")})}),e.querySelectorAll(".export-menu-item").forEach(i=>{i.addEventListener("click",l=>{l.stopPropagation();let s=i.getAttribute("data-action"),o=i.getAttribute("data-id");if(o){let r=s==="export-md"?"markdown":"json";x.postMessage({type:"exportSession",sessionId:o,format:r})}document.querySelectorAll(".export-menu").forEach(r=>r.classList.remove("active"))})}),e.querySelectorAll(".del-session-btn").forEach(i=>{i.addEventListener("click",()=>{let l=i.getAttribute("data-id");l&&x.postMessage({type:"deleteSession",sessionId:l})})})}function it(){let t=document.getElementById("settingsModelList");if(!t)return;t.innerHTML="";let e=document.createElement("div");e.style.cssText="font-size: 11px; opacity: 0.8; font-weight: 600; margin-top: 6px; display: flex; justify-content: space-between; align-items: center;";let n=M==="tr"?"SOHBETTE G\xD6R\xDCNEN MODELLER\u0130N\u0130Z":"YOUR ACTIVE CHAT MODELS";if(e.innerHTML=`<span>${n} (${w.length})</span>`,t.appendChild(e),w.length===0){let s=document.createElement("div");s.style.cssText="padding: 8px; font-size: 11px; opacity: 0.6;",s.textContent=M==="tr"?"Hen\xFCz model eklenmedi. A\u015Fa\u011F\u0131daki Ollama modellerinden ekleyebilirsiniz.":"No models added yet. You can add from the Ollama models below.",t.appendChild(s)}else w.forEach(s=>{let o=document.createElement("div");o.className="settings-list-item";let r=s.baseModel||s.id,u=B.find(p=>p.name===r||p.name===s.id),f=u?.details?.quantization_level||"",h=u?.details?.parameter_size||"",d=M==="tr"?"Taban":"Base",m=M==="tr"?"S\u0131cakl\u0131k":"Temp";o.innerHTML=`
                <div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <strong>${c(s.name)}</strong>
                        ${h?`<span class="model-tag-badge param">${c(h)}</span>`:""}
                        ${f?`<span class="model-tag-badge quant">${c(f)}</span>`:""}
                        ${s.isCustom?`<span class="model-tag-badge custom">${c(a.dropdowns.customTag)}</span>`:""}
                    </div>
                    <div style="font-size: 10px; opacity: 0.65; margin-top: 2px;">
                        ${d}: ${c(s.baseModel||s.id)} | KV: ${s.numCtx||4096} | ${m}: ${s.temperature??.7}
                    </div>
                </div>
                <div class="item-actions">
                    <button class="action-btn edit-model-btn" data-id="${s.id}">${c(a.common.edit)}</button>
                    <button class="btn-danger del-model-btn" data-id="${s.id}" title="${c(a.common.delete)}">${c(a.common.delete)}</button>
                </div>
            `,t.appendChild(o)});let i=document.createElement("div");i.style.cssText="font-size: 11px; opacity: 0.8; font-weight: 600; margin-top: 14px;",i.textContent=M==="tr"?"OLLAMA'DA KURULU D\u0130\u011EER MODELLER":"OTHER INSTALLED OLLAMA MODELS",t.appendChild(i);let l=B.filter(s=>!w.some(o=>o.id===s.name));if(l.length===0){let s=document.createElement("div");s.style.cssText="padding: 8px; font-size: 11px; opacity: 0.6;",s.textContent=B.length>0?M==="tr"?"T\xFCm yerel Ollama modelleriniz sohbet listenize ekli.":"All local Ollama models are added to your chat list.":M==="tr"?"Ollama servisi \xE7al\u0131\u015Fm\u0131yor veya model bulunamad\u0131.":"Ollama service is not running or no models found.",t.appendChild(s)}else l.forEach(s=>{let o=document.createElement("div");o.className="settings-list-item";let r=s.details?.quantization_level||"",u=(s.size/(1024*1024*1024)).toFixed(1),f=s.details?.parameter_size||"",h=M==="tr"?"\xD6zelle\u015Ftir":"Customize";o.innerHTML=`
                <div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <strong>${c(s.name)}</strong>
                        ${f?`<span class="model-tag-badge param">${c(f)}</span>`:""}
                        ${r?`<span class="model-tag-badge quant">${c(r)}</span>`:""}
                    </div>
                    <div style="font-size: 10px; opacity: 0.65; margin-top: 2px;">
                        ${u} GB
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn-primary add-ollama-btn" data-name="${s.name}">${c(a.common.add)}</button>
                    <button class="action-btn clone-ollama-btn" data-name="${s.name}">${c(h)}</button>
                </div>
            `,t.appendChild(o)});t.querySelectorAll(".edit-model-btn").forEach(s=>{s.addEventListener("click",()=>{let o=s.getAttribute("data-id"),r=w.find(u=>u.id===o);r&&Pe(r)})}),t.querySelectorAll(".add-ollama-btn").forEach(s=>{s.addEventListener("click",()=>{let o=s.getAttribute("data-name");o&&x.postMessage({type:"saveCustomModel",model:{id:o,name:o,baseModel:o,numCtx:4096,temperature:.7,isCustom:!1}})})}),t.querySelectorAll(".clone-ollama-btn").forEach(s=>{s.addEventListener("click",()=>{let o=s.getAttribute("data-name");o&&Pe({id:o+"-custom",name:`${o} (${a.dropdowns.customTag})`,baseModel:o,numCtx:4096,temperature:.7,isCustom:!0})})}),t.querySelectorAll(".del-model-btn").forEach(s=>{s.addEventListener("click",()=>{let o=s.getAttribute("data-id");o&&x.postMessage({type:"deleteCustomModel",modelId:o})})})}function lt(){let t=document.getElementById("settingLanguage"),e=document.getElementById("settingOllamaUrl"),n=document.getElementById("settingEnablePromptToggle"),i=document.getElementById("settingPromptContainer"),l=document.getElementById("settingDefaultPrompt"),s=document.getElementById("settingEnableTokensToggle"),o=document.getElementById("settingTokensContainer"),r=document.getElementById("settingMaxTokens");t&&(t.value=L.language||"auto"),e&&(e.value=L.ollamaUrl||"http://127.0.0.1:11434"),n&&(n.checked=L.enableSystemPrompt!==!1,i&&i.classList.toggle("hidden",!n.checked)),l&&(l.value=L.defaultSystemPrompt||""),s&&(s.checked=!!L.enableMaxTokens,o&&o.classList.toggle("hidden",!s.checked)),r&&(r.value=String(L.defaultMaxTokens&&L.defaultMaxTokens>=4096?L.defaultMaxTokens:4096));let u=document.getElementById("settingAutoApplyToggle");u&&(u.checked=!!L.autoApplyAgentEdits);let f=document.getElementById("settingAutoFileEditsToggle");f&&(f.checked=!!L.autoAllowFileEdits);let h=document.getElementById("settingAutoFileCreateToggle");h&&(h.checked=!!L.autoAllowFileCreate);let d=document.getElementById("settingAutoFolderCreateToggle");d&&(d.checked=!!L.autoAllowFolderCreate);let m=document.getElementById("settingEnableProsecutorToggle"),p=document.getElementById("settingProsecutorContainer"),g=document.getElementById("settingProsecutorModel");if(m&&(m.checked=L.enableProsecutor!==!1,p&&p.classList.toggle("hidden",!m.checked)),g){let I=a.settings.prosecutorAuto;g.innerHTML=`<option value="auto">${c(I)}</option>`,B.forEach(D=>{let P=document.createElement("option");P.value=D.name,P.textContent=D.name,g.appendChild(P)}),g.value=L.prosecutorModelId||"auto"}let y=document.getElementById("settingWebEngine"),E=document.getElementById("settingWebDepth"),v=document.getElementById("settingWebMaxResults"),b=document.getElementById("settingWebBlacklist"),S=document.getElementById("settingWebWhitelist");y&&(y.value=L.webSearchEngine||"duckduckgo"),E&&(E.value=L.webSearchDepth||"standard"),v&&(v.value=String(L.webSearchMaxResults||5)),b&&(b.value=L.webSearchBlacklist||""),S&&(S.value=L.webSearchWhitelist||"")}function Pe(t){let e=document.getElementById("modelEditorTitle"),n=document.getElementById("editorModelName"),i=document.getElementById("editorBaseModel"),l=document.getElementById("editorSystemPrompt"),s=document.getElementById("editorNumCtx"),o=document.getElementById("editorTemperature"),r=document.getElementById("editorModelNameLabel");r&&(r.textContent=a.models.nameLabel),n&&(n.placeholder=a.models.namePlaceholder);let u=document.getElementById("editorBaseModelLabel");u&&(u.textContent=a.models.baseModelLabel);let f=document.getElementById("editorSystemPromptLabel");f&&(f.textContent=a.models.customPromptLabel),l&&(l.placeholder=a.models.customPromptPlaceholder);let h=document.getElementById("editorNumCtxLabel");h&&(h.textContent=a.models.numCtxLabel);let d=document.getElementById("editorTemperatureLabel");d&&(d.textContent=a.models.temperatureLabel);let m=document.getElementById("cancelModelEditorBtn");m&&(m.textContent=a.common.cancel);let p=document.getElementById("saveModelEditorBtn");p&&(p.textContent=a.common.save),i.innerHTML="",B.forEach(g=>{let y=document.createElement("option");y.value=g.name,y.textContent=g.name,i.appendChild(y)}),t?(e.textContent=a.models.editorTitleEdit,J.setAttribute("data-edit-id",t.id),n.value=t.name,i.value=t.baseModel||t.id,l.value=t.systemPrompt||"",s.value=String(t.numCtx||4096),o.value=String(t.temperature??.7)):(e.textContent=a.models.editorTitleNew,J.removeAttribute("data-edit-id"),n.value="",l.value="",s.value="4096",o.value="0.7"),J.classList.add("active"),n.focus()}function Se(){J.classList.remove("active")}function fn(){if(pe.innerHTML="",B.length===0){pe.innerHTML=`<div style="padding: 12px; opacity: 0.6; font-size: 12px;">${c(a.models.noOllamaModels)}</div>`,ae.classList.add("active");return}B.forEach(t=>{let e=document.createElement("div");e.className="settings-list-item";let n=t.details?.quantization_level||"",i=(t.size/(1024*1024*1024)).toFixed(1),l=t.details?.parameter_size||"",s=M==="tr"?"D\xFCzenleyip Aktar":"Customize & Import";e.innerHTML=`
            <div>
                <div style="display: flex; align-items: center; gap: 5px;">
                    <strong>${c(t.name)}</strong>
                    ${l?`<span class="model-tag-badge param">${c(l)}</span>`:""}
                    ${n?`<span class="model-tag-badge quant">${c(n)}</span>`:""}
                </div>
                <div style="font-size: 10px; opacity: 0.65; margin-top: 2px;">
                    ${i} GB
                </div>
            </div>
            <div class="item-actions">
                <button class="btn-primary import-direct-btn" data-name="${t.name}">${c(a.models.importBtn)}</button>
                <button class="action-btn import-edit-btn" data-name="${t.name}">${c(s)}</button>
            </div>
        `,pe.appendChild(e)}),pe.querySelectorAll(".import-direct-btn").forEach(t=>{t.addEventListener("click",()=>{let e=t.getAttribute("data-name");e&&(x.postMessage({type:"saveCustomModel",model:{id:e,name:e,baseModel:e,numCtx:4096,temperature:.7,isCustom:!1}}),ae.classList.remove("active"))})}),pe.querySelectorAll(".import-edit-btn").forEach(t=>{t.addEventListener("click",()=>{let e=t.getAttribute("data-name");e&&(ae.classList.remove("active"),Pe({id:e+"-custom",name:e,baseModel:e,numCtx:4096,temperature:.7,isCustom:!0}))})}),ae.classList.add("active")}function Ft(){ae.classList.remove("active")}function he(t){je.textContent=t,je.classList.add("show"),setTimeout(()=>{je.classList.remove("show")},2500)}function c(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function vn(){Ae.addEventListener("click",d=>{d.stopPropagation(),R.classList.remove("active"),z.classList.toggle("active"),z.classList.contains("active")&&(ne.value="",zt(),ne.focus())}),ne.addEventListener("input",()=>{zt(ne.value)}),Qe.addEventListener("click",()=>{un()}),Xe.addEventListener("click",d=>{d.stopPropagation(),z.classList.remove("active"),q.classList.remove("active"),R.classList.toggle("active"),R.classList.contains("active")&&(se.value="",_e(),se.focus())}),se.addEventListener("input",()=>{_e(se.value)}),Y?.addEventListener("click",d=>{d.stopPropagation(),z.classList.remove("active"),R.classList.remove("active"),q.classList.toggle("active"),q.classList.contains("active")&&Q()}),te?.addEventListener("click",d=>{d.stopPropagation();let m=H(),g=!(m?.webAccessEnabled!==void 0?!!m.webAccessEnabled:N);N=g,m&&(m.webAccessEnabled=g),oe(),x.postMessage({type:"toggleWebAccess",sessionId:k,enabled:g})}),$e.addEventListener("click",d=>{d.stopPropagation(),ue.classList.toggle("active")}),document.addEventListener("click",d=>{let m=d.target;!z.contains(m)&&!Ae.contains(m)&&z.classList.remove("active"),!R.contains(m)&&!Xe.contains(m)&&R.classList.remove("active"),!q.contains(m)&&!Y.contains(m)&&q.classList.remove("active"),!ue.contains(m)&&!$e.contains(m)&&ue.classList.remove("active"),document.querySelectorAll(".export-menu").forEach(g=>{g.contains(m)||g.classList.remove("active")});let p=document.getElementById("addModelMenu");p&&!p.contains(m)&&m.id!=="addModelBtn"&&p.classList.remove("active"),_&&!_.contains(m)&&m!==T&&le()}),T.addEventListener("input",()=>{de(),pn()}),T.addEventListener("keydown",d=>{if(_?.classList.contains("active")){if(d.key==="ArrowDown"){d.preventDefault(),V=(V+1)%G.length,nt();return}else if(d.key==="ArrowUp"){d.preventDefault(),V=(V-1+G.length)%G.length,nt();return}else if(d.key==="Enter"||d.key==="Tab"){d.preventDefault(),Ut(V);return}else if(d.key==="Escape"){d.preventDefault(),le();return}}d.key==="Enter"&&!d.shiftKey&&(d.preventDefault(),tt())});let t=0;window.addEventListener("dragenter",d=>{d.preventDefault(),t++,ee&&ee.classList.add("active")}),window.addEventListener("dragleave",d=>{d.preventDefault(),t--,t<=0&&(t=0,ee&&ee.classList.remove("active"))}),window.addEventListener("dragover",d=>{d.preventDefault()}),window.addEventListener("drop",d=>{d.preventDefault(),t=0,ee&&ee.classList.remove("active");let m=d.dataTransfer;if(m){if(m.files&&m.files.length>0){let y=[];for(let E=0;E<m.files.length;E++){let v=m.files[E],b=v.path||v.name,S=fe.find(I=>I===b||I.endsWith("/"+b));y.push(S||b)}if(y.length>0){Ve(T,y.map(E=>`@${E}`).join(" ")+" "),T.focus();return}}let p=m.getData("text/uri-list");if(p){let E=p.split(`
`).filter(v=>v.trim()&&!v.startsWith("#")).map(v=>{try{let b=decodeURIComponent(new URL(v).pathname);return fe.find(I=>b.endsWith(I))||b.split("/").pop()||b}catch{return v}});Ve(T,E.map(v=>`@${v}`).join(" ")+" "),T.focus();return}let g=m.getData("text/plain");g&&(Ve(T,g.trim()+" "),T.focus())}}),j.addEventListener("click",()=>{O?Rt():tt()}),window.addEventListener("keydown",d=>{if(d.key==="Escape"){if(_?.classList.contains("active")){d.preventDefault(),le();return}if(ae.classList.contains("active")){d.preventDefault(),Ft();return}if(J.classList.contains("active")){d.preventDefault(),Se();return}if(st.classList.contains("active")){d.preventDefault(),Nt();return}if(z.classList.contains("active")){d.preventDefault(),z.classList.remove("active");return}if(R.classList.contains("active")){d.preventDefault(),R.classList.remove("active");return}if(q.classList.contains("active")){d.preventDefault(),q.classList.remove("active");return}if(ue.classList.contains("active")){d.preventDefault(),ue.classList.remove("active");return}if(O){d.preventDefault(),Rt();return}}}),Ze.addEventListener("click",()=>{gn()}),Xt.addEventListener("click",()=>{Nt()}),document.querySelectorAll(".tab-btn").forEach(d=>{d.addEventListener("click",()=>{document.querySelectorAll(".tab-btn").forEach(g=>g.classList.remove("active")),document.querySelectorAll(".tab-pane").forEach(g=>g.classList.remove("active")),d.classList.add("active");let m=d.getAttribute("data-tab"),p=document.getElementById(m||"");p&&p.classList.add("active")})});let e=document.getElementById("settingEnablePromptToggle"),n=document.getElementById("settingPromptContainer");e?.addEventListener("change",()=>{n?.classList.toggle("hidden",!e.checked)});let i=document.getElementById("settingEnableTokensToggle"),l=document.getElementById("settingTokensContainer");i?.addEventListener("change",()=>{l?.classList.toggle("hidden",!i.checked)});let s=document.getElementById("settingLanguage");s?.addEventListener("change",()=>{let d=s.value||"auto";L.language=d;let m=_t(d,Wt);an(m),s&&(s.value=d)}),document.getElementById("saveSettingsBtn")?.addEventListener("click",()=>{let d=document.getElementById("settingOllamaUrl").value.trim(),m=document.getElementById("settingDefaultPrompt").value.trim(),p=document.getElementById("settingEnablePromptToggle"),g=document.getElementById("settingEnableTokensToggle"),y=document.getElementById("settingMaxTokens"),E=document.getElementById("settingLanguage"),v=Math.max(4096,parseInt(y?.value||"4096",10)||4096),b=p?p.checked:!0,S=g?g.checked:!1,I=document.getElementById("settingAutoApplyToggle"),D=I?I.checked:!1,P=E?.value||"auto",X=document.getElementById("settingAutoFileEditsToggle")?.checked??!1,be=document.getElementById("settingAutoFileCreateToggle")?.checked??!1,ye=document.getElementById("settingAutoFolderCreateToggle")?.checked??!1,Ee=document.getElementById("settingEnableProsecutorToggle")?.checked??!0,Le=document.getElementById("settingProsecutorModel")?.value||"auto",ke=document.getElementById("settingWebEngine")?.value||"duckduckgo",Me=document.getElementById("settingWebDepth")?.value||"standard",Te=parseInt(document.getElementById("settingWebMaxResults")?.value||"5",10)||5,we=document.getElementById("settingWebBlacklist")?.value.trim()||"",xe=document.getElementById("settingWebWhitelist")?.value.trim()||"";x.postMessage({type:"saveSettings",settings:{ollamaUrl:d,defaultSystemPrompt:m,enableSystemPrompt:b,defaultMaxTokens:v,enableMaxTokens:S,language:P,autoApplyAgentEdits:D,autoAllowFileEdits:X,autoAllowFileCreate:be,autoAllowFolderCreate:ye,enableProsecutor:Ee,prosecutorModelId:Le,webSearchEngine:ke,webSearchDepth:Me,webSearchMaxResults:Math.min(10,Math.max(1,Te)),webSearchBlacklist:we,webSearchWhitelist:xe}})});let r=document.getElementById("settingEnableProsecutorToggle"),u=document.getElementById("settingProsecutorContainer");r?.addEventListener("change",()=>{u?.classList.toggle("hidden",!r.checked)});let f=document.getElementById("addModelBtn"),h=document.getElementById("addModelMenu");f?.addEventListener("click",d=>{d.stopPropagation(),h?.classList.toggle("active")}),document.getElementById("importFromOllamaBtn")?.addEventListener("click",()=>{h?.classList.remove("active"),fn()}),document.getElementById("createNewModelBtn")?.addEventListener("click",()=>{h?.classList.remove("active"),Pe()}),en.addEventListener("click",()=>Se()),tn.addEventListener("click",()=>Se()),nn.addEventListener("click",()=>{let d=document.getElementById("editorModelName").value.trim(),m=document.getElementById("editorBaseModel").value,p=document.getElementById("editorSystemPrompt").value.trim(),g=parseInt(document.getElementById("editorNumCtx").value,10)||4096,y=parseFloat(document.getElementById("editorTemperature").value)||.7;if(!d){he(a.models.nameRequired);return}let v=J.getAttribute("data-edit-id")||"custom_"+Date.now()+"_"+Math.random().toString(36).substring(2,6);x.postMessage({type:"saveCustomModel",model:{id:v,name:d,baseModel:m,systemPrompt:p,numCtx:g,temperature:y,isCustom:!0}}),Se()}),sn.addEventListener("click",()=>Ft()),K.addEventListener("click",d=>{let m=d.target,p=m.closest(".code-copy-btn");if(p){let v=decodeURIComponent(p.getAttribute("data-code")||"");navigator.clipboard.writeText(v).then(()=>{let b=p.querySelector("span");if(b){let S=b.textContent;b.textContent=`\u2713 ${a.common.copied}`,setTimeout(()=>{b.textContent=S},1500)}});return}let g=m.closest(".copy-msg-btn");if(g){let v=decodeURIComponent(g.getAttribute("data-content")||"");navigator.clipboard.writeText(v).then(()=>{he(a.common.copied)});return}let y=m.closest(".blackbox-btn");if(y){let v=y.getAttribute("data-msg-id"),b=y.getAttribute("data-session-id")||k;v&&b&&x.postMessage({type:"openMessageBlackbox",sessionId:b,messageId:v});return}let E=m.closest(".sources-btn");if(E){let v=E.getAttribute("data-msg-id"),b=E.getAttribute("data-session-id")||k;v&&b&&x.postMessage({type:"openWebSources",sessionId:b,messageId:v});return}})}})();
