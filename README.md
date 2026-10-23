
<p align="center">
  <a style="text-decoration: none; color: #000000; font-size: 40px; font-style: bold;" href="https://marketplace.visualstudio.com/items?itemName=ramazanmuslu.ramazanmuslu-ollamachat">
    <img src="media/marketplace-icon.png" alt="ollamachat" width="150"/>
    <br>
    Ollama Chat
  </a>
</p>

[![Visual Studio Marketplace](https://img.shields.io/badge/VS%20Code%20Marketplace-OllamaChat-blue?logo=visualstudiocode)](https://marketplace.visualstudio.com/)
[![Ollama](https://img.shields.io/badge/Powered%20By-Ollama-black?logo=ollama)](https://ollama.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)]()

> **OllamaChat**, is a fully native, private, and unlimited AI coding and autonomous software engineering assistant within Visual Studio Code. Your code never leaves your computer, and it requires no API key or subscription.

**OllamaChat** turns local open-source LLMs (such as DeepSeek-Coder, Qwen2.5-Coder, Llama 3, CodeLlama, Mistral, Phind, etc.) into an integrated pair programmer and autonomous software engineer directly inside your VS Code sidebar.

> Download from [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=ramazanmuslu.ramazanmuslu-ollamachat)

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

#### 5. Security Prosecutor
- Employs a dedicated, ultra-fast lightweight model (e.g., `1.5B` or user-defined) to audit every command and file operation in real-time.
- Automatically flags or blocks destructive instructions (such as `rm -rf`, system-level wipes, unauthorized file overrides).
- Includes an interactive Security Badge & Hover Popover explaining the audit reasoning.

#### 6. Context Mentions (@ & #) and Drag & Drop
- Reference workspace files using `@filename` or `#filename` autocomplete.
- Drag and drop files directly from the VS Code Explorer into the chat input to inject them into the context window.

#### 7. Black Box Diagnostic Export
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
