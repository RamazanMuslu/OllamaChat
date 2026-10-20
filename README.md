# OllamaChat 🦙💻

[![Visual Studio Marketplace](https://img.shields.io/badge/VS%20Code%20Marketplace-OllamaChat-blue?logo=visualstudiocode)](https://marketplace.visualstudio.com/)
[![Ollama](https://img.shields.io/badge/Powered%20By-Ollama-black?logo=ollama)](https://ollama.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)]()

> **OllamaChat**, Visual Studio Code içerisinde tamamen yerel, gizli ve sınırsız bir yapay zeka kodlama ve otonom yazılım mühendisliği asistanıdır. Kodlarınız bilgisayarınızdan asla dışarı çıkmaz, API anahtarı veya abonelik gerektirmez.

---

[English](#english) | [Türkçe](#türkçe)

---

<a name="english"></a>
## 🌐 English

**OllamaChat** turns local open-source LLMs (such as DeepSeek-Coder, Qwen2.5-Coder, Llama 3, CodeLlama, Mistral, Phind, etc.) into an integrated pair programmer and autonomous software engineer directly inside your VS Code sidebar.

### ✨ Key Features

#### 1. 100% Local & Private
- Connects directly to your local **Ollama** server (`http://127.0.0.1:11434` or custom endpoint).
- Zero cloud transmission. Your proprietary codebase, tokens, and data stay strictly on your local machine.
- No rate limits, no paywalls, no monthly subscription fees.

#### 2. Dual Intelligence Modes: Chat & Agent
- **💬 Chat Mode**: Clean conversational coding assistant. Read-only mode designed for explanations, algorithm discussions, code reviews, and refactoring tips without making any modifications to workspace files.
- **⚡ Agent Mode**: Autonomous coding agent equipped with workspace tools. It can inspect project files, search codebases, create/modify files, organize folders, and run terminal commands to solve tasks end-to-end.

#### 3. Full-Spectrum Agent Toolset
In Agent Mode, models can execute structured workspace operations:
| Tool / Action | Description |
| :--- | :--- |
| **Read File** (`<read_file>`) | Inspects file contents for debugging and implementation context. |
| **Search & Replace** (`<edit_file>`) | Performs surgical, atomic diff replacements in existing files. |
| **Write File** (`<write_file>`) | Generates or rewrites entire source files. |
| **Directory Listing** (`<list_dir>`) | Explores folders and directory structure. |
| **File Search** (`<find_files>`) | Locates files using glob patterns (e.g., `*.ts`, `**/*.py`). |
| **Code Grep** (`<grep>`) | Regex and plaintext line-by-line workspace search. |
| **Folder Management** (`<create_folder>`) | Recursively creates project directories. |
| **Delete & Move** (`<delete_path>`, `<move_path>`) | Safely removes or moves/renames workspace files and directories. |
| **Terminal Execution** (`<run_command>`) | Runs diagnostic shell commands (e.g., `npm test`, `git status`) at the workspace root. |

#### 4. Auto-Apply with Revert & Keep
- File edits are applied immediately for maximum developer velocity.
- Every action card includes:
  - **Revert (Geri Al)**: Undoes file changes back to their original state or removes created files.
  - **Keep (Kalıcı Yap)**: Permanently accepts the changes.
  - **View Diff (Farkı Gör)**: Opens VS Code's side-by-side diff editor.

#### 5. Security Prosecutor (Savcı Modeli)
- Employs a dedicated, ultra-fast lightweight model (e.g., `1.5B` or user-defined) to audit every command and file operation in real-time.
- Automatically flags or blocks destructive instructions (such as `rm -rf`, system-level wipes, unauthorized file overrides).
- Includes an interactive Security Badge & Hover Popover explaining the audit reasoning.

#### 6. Context Mentions (@ & #) and Drag & Drop
- Reference workspace files using `@filename` or `#filename` autocomplete.
- Drag and drop files directly from the VS Code Explorer into the chat input to inject them into the context window.

#### 7. Black Box (Kara Kutu) Diagnostic Export
- Click the **Black Box** button beside any assistant message to instantly generate a comprehensive technical Markdown report:
  - Token metrics: Prompt eval speed, generation speed (`tokens/s`), duration, and load times.
  - Executed tools, statuses, Prosecutor audit decisions, and output payloads.
  - Complete prompt and thinking trace logs.

#### 8. Model Profiler & KV-Cache Management
- Import locally installed Ollama models with a single click.
- Create custom model profiles with dedicated system prompts, temperature (`0.0 - 2.0`), KV-cache context windows (`num_ctx`), and token limits (`num_predict`).
- Real-time token generation metrics displayed per message.

#### 9. Live Web Search & Internet Access (🌐)
- Toggle live internet access directly from the input toolbar with a single click.
- Models can query the web in real-time to answer questions about modern libraries, updated APIs, and documentation.
- **Configurable Analysis Depth**:
  - `Fast`: Title and snippet extraction for lightning-fast responses.
  - `Standard`: Full page text analysis with HTML stripping and boilerplate cleanup.
  - `Deep`: Detailed per-page examination and sentence-level synthesis.
- **Domain Filtering**: Granular domain blacklist (to filter out spam or unwanted sites) and whitelist (to restrict searches strictly to trusted developer docs like MDN, GitHub, StackOverflow).
- **Interactive Sources Button (🌐 Sources)**: Click the Sources button at the bottom of any response that used web information to open a clean Markdown document listing all consulted pages, direct URLs, snippets, and synthesized summaries.
- **Autonomous Agent Tool**: In Agent Mode, the model can execute `<web_search query="..."/>` to look up runtime errors and API specifications on the fly.

---

### 📦 Installation & Setup

1. **Prerequisite**: Ensure [Ollama](https://ollama.com/) is installed and running on your machine:
   ```bash
   ollama serve
   ```
2. **Pull your preferred coding models**:
   ```bash
   # Powerful coding models
   ollama pull qwen2.5-coder:7b
   ollama pull deepseek-coder-v2

   # Lightweight model for the Security Prosecutor (optional but recommended)
   ollama pull qwen2.5-coder:1.5b
   ```
3. **Install OllamaChat** from the VS Code Extension Marketplace.
4. Click the **OllamaChat** icon in the Activity Bar to begin coding!

### ⚙️ Configuration & Settings

Configure these options inside the **⚙️ Settings** modal:
- **Language**: `Auto (match VS Code language)`, `English`, `Türkçe`.
- **Ollama API URL**: Local server endpoint (Default: `http://127.0.0.1:11434`).
- **Default System Prompt**: Global persona and coding guidelines.
- **Max Tokens (`num_predict`)**: Unlimited or capped at custom thresholds (minimum 4096).
- **Agent Permissions**: Automatic approvals for file edits, new file creation, and new folder creation.
- **Security Prosecutor**: Real-time safety auditor toggle and model selection (`auto` / 1.5B).
- **Web Search Settings**: Engine selection (DuckDuckGo, SearXNG), analysis depth (`fast`, `standard`, `deep`), max sources count (1-10), blacklist and whitelist domain rules.

---

<a name="türkçe"></a>
## 🇹🇷 Türkçe

**OllamaChat**, DeepSeek, Qwen2.5-Coder, Llama 3, CodeLlama gibi açık kaynaklı büyük dil modellerini (LLM) doğrudan Visual Studio Code yan panelinizde özel bir yazılım mühendisi ve kodlama asistanına dönüştürür.

### 🌟 Öne Çıkan Özellikler

#### 1. %100 Yerel ve Gizli
- Yerel **Ollama** sunucunuza (`http://127.0.0.1:11434` veya özel adres) doğrudan bağlanır.
- Kodlarınız ve sohbet verileriniz asla bilgisayarınızdan dışarı çıkmaz; buluta hiçbir veri gönderilmez.
- API anahtarı, kredi kartı veya aylık abonelik ücreti yoktur.

#### 2. Çift Çalışma Modu: Sohbet (Chat) & Ajan (Agent)
- **💬 Chat Modu**: Salt okunur sohbet ve kod danışmanı. Kod analizi, mimari tavsiyeler ve sorular için idealdir; dosyalara dokunmaz.
- **⚡ Agent Modu**: Otonom kodlama ajanı. Projedeki dosyaları okur, arar, satır bazlı düzenlemeler (search/replace) yapar, yeni dosyalar/klasörler açar ve terminal komutlarını çalıştırarak görevleri kendi başına çözer.

#### 3. Kapsamlı Sistem & Hata Ayıklama Araçları
Agent modunda yapay zeka şu araçları kullanabilir:
| Araç / Eylem | Açıklama |
| :--- | :--- |
| **Dosya Okuma** (`<read_file>`) | Proje dosyalarını inceleme ve bağlam toplama amaçlı okur. |
| **Ara & Değiştir** (`<edit_file>`) | Dosyalarda cerrahi ve atomik search/replace diff uygular. |
| **Dosya Yazma** (`<write_file>`) | Yeni dosya oluşturur veya içeriği tamamen günceller. |
| **Dizin Listeleme** (`<list_dir>`) | Klasör ve dosya hiyerarşisini listeler. |
| **Dosya Bulma** (`<find_files>`) | Glob deseniyle dosya arar (örn: `*.ts`, `**/*.vue`). |
| **Kod Araması** (`<grep>`) | Regex veya düz metinle proje genelinde satır bazlı arama yapar. |
| **Klasör Yönetimi** (`<create_folder>`) | Proje içinde yeni dizinler oluşturur. |
| **Silme & Taşıma** (`<delete_path>`, `<move_path>`) | Dosya/klasör siler veya yeniden adlandırıp taşır. |
| **Terminal Komutları** (`<run_command>`) | Çalışma alanı kökünde güvenli komutları yürütür (`npm test`, `cargo check` vb.). |

#### 4. Otomatik Uygulama (Geri Al & Kalıcı Yap)
- Agent modunda dosya değişiklikleri onay beklemeden hızlıca uygulanabilir.
- Yapılan her değişiklik geri alınabilir:
  - **Geri Al (Revert)**: Değiştirilen dosyayı anında eski haline döndürür veya yeni oluşturulan dosyayı siler.
  - **Kalıcı Yap (Keep)**: Değişikliği kalıcı olarak onaylar.
  - **Farkı Gör (Diff)**: VS Code'un dahili diff editöründe öncesi/sonrası farkını açar.

#### 5. Savcı Modeli (Security Guard)
- Her komutu ve dosya değişikliğini çalıştırmadan önce denetleyen hafif bir güvenlik modeli (örn: `1.5B`).
- `rm -rf`, sistem dosyalarını ezme veya kritik veri kaybına yol açabilecek işlemleri otomatik olarak engeller.
- Yanıtın altındaki Savcı butonunun üzerine gelerek denetim gerekçesini ve kararını inceleyebilirsiniz.

#### 6. Dosya Etiketleme (@, #) ve Sürükle-Bırak
- `@` veya `#` tuşlarıyla projedeki dosyaları anında arayıp bağlama dahil edin.
- Dosyaları VS Code gezgininden doğrudan sohbet alanına sürükleyip bırakarak bağlam ekleyin.

#### 7. Kara Kutu (Black Box) Markdown Günlüğü
- Asistan yanıtlarının yanında yer alan **Kara Kutu** butonuyla;
  - Üretim hızı (token/sn), yanıt süresi, model kuantizasyon seviyesi,
  - Çalıştırılan tüm eylemler, araç çıktıları ve Savcı denetim raporunu içeren detaylı bir Markdown dökümünü tek tıkla açın.

#### 8. Model Yöneticisi & KV-Cache
- Ollama'da kurulu modelleri tek tıkla aktarın.
- Özel sistem promptları, sıcaklık (temperature), KV-Cache penceresi (`num_ctx`) ve maksimum token (`num_predict`) sınırları ile özel model profilleri tanımlayın.
- Her mesajda saniye başına token (t/s) hızını ve KV-cache durumunu izleyin.

#### 9. Canlı İnternet Erişimi & Web Arama (🌐)
- Giriş araç çubuğundaki **🌐 Web** düğmesiyle internet erişimini tek tıkla açıp kapatın.
- Güncel kütüphaneler, dokümantasyonlar, API değişiklikleri ve güncel hata çözümleri için model internetten canlı bilgi çeker.
- **Ayarlanabilir Arama ve Analiz Derinliği**:
  - `Hızlı (Fast)`: Hızlı yanıtlar için arama başlıkları ve snippet'ları derlenir.
  - `Standart (Standard)`: Sayfa metinleri HTML etiketlerinden arındırılarak okunur ve özetlenir.
  - `Derin (Deep)`: Her kaynak sayfa ayrıntılı olarak taranır, anahtar bilgiler ve özetler çıkarılarak modele en zengin bağlam sunulur.
- **Alan Adı Filtreleme**: Kara liste (blacklist) ile spam veya istenmeyen siteler engellenir; beyaz liste (whitelist) ile aramalar yalnızca güvenilir geliştirici sitelerine (MDN, GitHub, StackOverflow vb.) sınırlandırılabilir.
- **🌐 Kaynaklar Butonu**: İnternet kullanılan yanıtların altındaki **Kaynaklar** butonuna tıklandığında, başvurulan tüm sitelerin bağlantılarını, arama özetlerini ve derin analiz notlarını içeren özel bir Markdown rapor dosyası açılır.
- **Agent Web Arama Aracı**: Agent modunda model, ihtiyaç duyduğunda `<web_search query="..."/>` eylemiyle bağımsız olarak internette arama yapabilir.

---

### 🚀 Başlangıç ve Kurulum

1. Bilgisayarınızda [Ollama](https://ollama.com/)'nın kurulu ve çalışır durumda olduğundan emin olun:
   ```bash
   ollama serve
   ```
2. Kullanmak istediğiniz modelleri indirin:
   ```bash
   # Ana kodlama modeli
   ollama pull qwen2.5-coder:7b

   # Savcı güvenlik denetçisi için hafif model (önerilen)
   ollama pull qwen2.5-coder:1.5b
   ```
3. Visual Studio Code Eklenti Mağazası'ndan **OllamaChat** eklentisini kurun.
4. Sol taraftaki Activity Bar'da bulunan **OllamaChat** simgesine tıklayarak hemen kodlamaya başlayın!

---

## ⚙️ Yapılandırma & Ayarlar (Settings)

Arayüzdeki **⚙️ Ayarlar** penceresinden aşağıdaki seçenekleri yapılandırabilirsiniz:
- **Dil Seçimi (Language)**: `Otomatik (VS Code Dili)`, `English`, `Türkçe`.
- **Ollama API URL**: Yerel sunucu bağlantı adresi (Varsayılan: `http://127.0.0.1:11434`).
- **Genel Sistem Promptu**: Modeller için temel davranış ve rol talimatları.
- **Maksimum Token Sınırı (`num_predict`)**: Token üretim sınırını açma/kapama ve alt limit belirleme.
- **Agent İzinleri**: Dosya düzenleme, dosya oluşturma ve klasör oluşturma için otomatik onay seçenekleri.
- **Savcı Modeli Denetimi**: Güvenlik denetçisini açma/kapama ve denetçi model seçimi (`auto` / 1.5B).
- **Web Arama Ayarları (Web Search)**: Arama motoru seçimi (DuckDuckGo, SearXNG), arama derinliği (`fast`, `standard`, `deep`), maksimum sonuç sayısı (1-10), kara liste ve beyaz liste alan adları.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında açık kaynak olarak sunulmaktadır.

