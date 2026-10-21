"use strict";var be=Object.create;var V=Object.defineProperty;var ve=Object.getOwnPropertyDescriptor;var ye=Object.getOwnPropertyNames;var Se=Object.getPrototypeOf,we=Object.prototype.hasOwnProperty;var ke=(g,e)=>{for(var t in e)V(g,t,{get:e[t],enumerable:!0})},ne=(g,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of ye(e))!we.call(g,a)&&a!==t&&V(g,a,{get:()=>e[a],enumerable:!(s=ve(e,a))||s.enumerable});return g};var q=(g,e,t)=>(t=g!=null?be(Se(g)):{},ne(e||!g||!g.__esModule?V(t,"default",{value:g,enumerable:!0}):t,g)),xe=g=>ne(V({},"__esModule",{value:!0}),g);var Ce={};ke(Ce,{activate:()=>Me,deactivate:()=>_e});module.exports=xe(Ce);var z=q(require("vscode"));var C=q(require("vscode"));var O=class{static async getInstalledModels(e){let t=`${e.replace(/\/+$/,"")}/api/tags`,s=await fetch(t,{method:"GET",headers:{Accept:"application/json"}});if(!s.ok)throw new Error(`Ollama modelleri al\u0131namad\u0131: HTTP ${s.status} ${s.statusText}`);return(await s.json()).models||[]}static async streamChat(e){let{baseUrl:t,model:s,messages:a,systemPrompt:o,temperature:n,numCtx:i,numPredict:r,signal:p,onChunk:l,onDone:m,onError:u}=e,c=[...a];o&&o.trim()&&(c.length>0&&c[0].role==="system"?c[0]={role:"system",content:o}:c.unshift({role:"system",content:o}));let k={};typeof n=="number"&&(k.temperature=n),typeof i=="number"&&i>0&&(k.num_ctx=i),typeof r=="number"&&r>0&&(k.num_predict=r);let S=`${t.replace(/\/+$/,"")}/api/chat`,h;try{h=await fetch(S,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:s,messages:c,stream:!0,options:Object.keys(k).length>0?k:void 0}),signal:p})}catch(M){if(p?.aborted)return;let D=M instanceof Error?M:new Error(String(M));u(new Error(`Ollama servisine ba\u011Flan\u0131lamad\u0131 (${t}): ${D.message}`));return}if(!h.ok){let M="";try{M=(await h.json()).error||""}catch{}u(new Error(`Ollama hatas\u0131 [${h.status}]: ${M||h.statusText}`));return}if(!h.body){u(new Error("Ollama yan\u0131t g\xF6vdesi (body) bo\u015F d\xF6nd\xFC."));return}let f=h.body.getReader(),x=new TextDecoder("utf-8"),A="",F={},P="";try{for(;;){let{done:M,value:D}=await f.read();if(M)break;P+=x.decode(D,{stream:!0});let I=P.split(`
`);P=I.pop()||"";for(let j of I){let Y=j.trim();if(Y)try{let E=JSON.parse(Y);if(E.message?.content){let $=E.message.content;A+=$,l($)}if(E.done){let $=E.eval_count||0,B=(E.eval_duration||0)/1e9,se=B>0?$/B:0;F={totalDurationMs:(E.total_duration||0)/1e6,loadDurationMs:(E.load_duration||0)/1e6,promptEvalCount:E.prompt_eval_count,promptEvalDurationMs:(E.prompt_eval_duration||0)/1e6,evalCount:E.eval_count,evalDurationMs:(E.eval_duration||0)/1e6,tokensPerSecond:se}}}catch{}}}if(P.trim())try{let M=JSON.parse(P.trim());M.message?.content&&(A+=M.message.content,l(M.message.content))}catch{}m(F,A)}catch(M){if(p?.aborted)return;let D=M instanceof Error?M:new Error(String(M));u(D)}}};var b=q(require("vscode")),re=q(require("child_process")),N=class{static scheme="ollamachat-preview";_onDidChange=new b.EventEmitter;onDidChange=this._onDidChange.event;_documents=new Map;provideTextDocumentContent(e){return this._documents.get(e.toString())||""}setContent(e,t){this._documents.set(e.toString(),t),this._onDidChange.fire(e)}deleteContent(e){this._documents.delete(e.toString())}},v=class{static _diffProvider;static register(e){let t=new N;return this._diffProvider=t,e.subscriptions.push(b.workspace.registerTextDocumentContentProvider(N.scheme,t)),t}static getWorkspaceRoot(){let e=b.workspace.workspaceFolders;return e&&e.length>0?e[0]:void 0}static resolveUri(e){let t=this.getWorkspaceRoot();if(!t)return;let s=e.replace(/^(\.\/|\/)/,"");return b.Uri.joinPath(t.uri,s)}static async listFiles(e=80){if(!this.getWorkspaceRoot())return[];try{return(await b.workspace.findFiles("**/*","{**/node_modules/**,**/.git/**,**/dist/**,**/out/**,**/.next/**,**/build/**,**/.venv/**}",e)).map(a=>b.workspace.asRelativePath(a))}catch{return[]}}static async listDirectory(e=""){let t=e?this.resolveUri(e):this.getWorkspaceRoot()?.uri;if(!t)throw new Error("Workspace root not found");return(await b.workspace.fs.readDirectory(t)).map(([a,o])=>({name:a,isDirectory:(o&b.FileType.Directory)!==0})).sort((a,o)=>a.isDirectory&&!o.isDirectory?-1:!a.isDirectory&&o.isDirectory?1:a.name.localeCompare(o.name))}static async findFiles(e,t=60){if(!this.getWorkspaceRoot())return[];let a=e.includes("*")?e:`**/*${e}*`;try{return(await b.workspace.findFiles(a,"{**/node_modules/**,**/.git/**,**/dist/**,**/out/**,**/.next/**,**/build/**,**/.venv/**}",t)).map(n=>b.workspace.asRelativePath(n))}catch{return[]}}static async grepSearch(e,t,s=!1,a=50){let o=t?`${t.replace(/\/$/,"")}/**/*`:"**/*",n=await b.workspace.findFiles(o,"{**/node_modules/**,**/.git/**,**/dist/**,**/out/**,**/.next/**,**/build/**,**/.venv/**,**/*.png,**/*.jpg,**/*.jpeg,**/*.gif,**/*.lock,**/*.pdf,**/*.ico,**/*.mp4,**/*.zip,**/*.wasm}",120),i=[],r;try{r=s?new RegExp(e,"i"):new RegExp(e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i")}catch{r=new RegExp(e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i")}for(let p of n){if(i.length>=a)break;try{let l=await b.workspace.fs.readFile(p),m=Buffer.from(l);if(m.includes(0))continue;let c=m.toString("utf8").split(/\r?\n/),k=b.workspace.asRelativePath(p);for(let S=0;S<c.length&&!(r.test(c[S])&&(i.push({file:k,line:S+1,content:c[S].trim().slice(0,200)}),i.length>=a));S++);}catch{}}return i}static async createDirectory(e){let t=this.resolveUri(e);if(!t)throw new Error("Workspace root not found");await b.workspace.fs.createDirectory(t)}static async deletePath(e,t=!0){let s=this.resolveUri(e);if(!s)throw new Error("Workspace root not found");await b.workspace.fs.delete(s,{recursive:!0,useTrash:t})}static async movePath(e,t){let s=this.resolveUri(e),a=this.resolveUri(t);if(!s||!a)throw new Error("Workspace root not found");let o=b.Uri.joinPath(a,"..");try{await b.workspace.fs.createDirectory(o)}catch{}await b.workspace.fs.rename(s,a,{overwrite:!1})}static async executeCommand(e,t=25e3){let s=this.getWorkspaceRoot(),a=s?s.uri.fsPath:process.cwd();return new Promise(o=>{re.exec(e,{cwd:a,timeout:t,maxBuffer:1024*1024,env:{...process.env,CI:"true",LANG:"en_US.UTF-8"}},(n,i,r)=>{o({stdout:i?i.toString():"",stderr:r?r.toString():n?n.message:"",exitCode:n&&n.code!==void 0?n.code:0})})})}static async readFile(e){let t=this.resolveUri(e);if(!t)throw new Error("Workspace root not found");let s=await b.workspace.fs.readFile(t);return Buffer.from(s).toString("utf8")}static async writeFile(e,t){let s=this.resolveUri(e);if(!s)throw new Error("Workspace root not found");let a="",o=!1;try{a=await this.readFile(e)}catch{o=!0}try{let i=b.Uri.joinPath(s,"..");await b.workspace.fs.createDirectory(i)}catch{}let n=Buffer.from(t,"utf8");await b.workspace.fs.writeFile(s,n);try{let i=await b.workspace.openTextDocument(s);await b.window.showTextDocument(i,{preview:!1})}catch{}return{originalContent:a,wasCreated:o}}static async revertAction(e){if(e.type==="move"&&e.targetPath){await this.movePath(e.targetPath,e.path);return}if(e.type==="create_dir"){await this.deletePath(e.path,!0);return}let t=this.resolveUri(e.path);if(!t)throw new Error(`Workspace root not found for path: ${e.path}`);if(e.wasCreated)await b.workspace.fs.delete(t,{recursive:!1,useTrash:!0});else if(e.originalContent!==void 0){let s=Buffer.from(e.originalContent,"utf8");await b.workspace.fs.writeFile(t,s);try{let a=await b.workspace.openTextDocument(t);await b.window.showTextDocument(a,{preview:!1})}catch{}}}static async applySearchReplace(e,t,s){let a=await this.readFile(e),o=a.replace(/\r\n/g,`
`),n=t.replace(/\r\n/g,`
`).trim();if(!n)throw new Error("Search block cannot be empty");if(!o.includes(n)){let r=o.split(`
`),p=n.split(`
`).map(c=>c.trim()),l=-1;for(let c=0;c<=r.length-p.length;c++){let k=!0;for(let S=0;S<p.length;S++)if(r[c+S].trim()!==p[S]){k=!1;break}if(k){l=c;break}}if(l===-1)throw new Error(`Could not find target search block in "${e}". Please verify the code.`);let u=[...r.slice(0,l),s,...r.slice(l+p.length)].join(`
`);return await this.writeFile(e,u),{newContent:u,originalContent:a}}let i=o.replace(n,s);return await this.writeFile(e,i),{newContent:i,originalContent:a}}static async showDiff(e,t,s){let a=this.resolveUri(e);if(!a||!this._diffProvider)return;let o=b.Uri.parse(`${N.scheme}:${encodeURIComponent(e)}`);this._diffProvider.setContent(o,t);let n=s||`${e} (Proposed Changes \u2194 Current)`;await b.commands.executeCommand("vscode.diff",a,o,n)}static parseAgentActions(e){let t=[],s=1,a=/<write_file\s+path=["']([^"']+)["']\s*>([\s\S]*?)<\/write_file>/gi,o;for(;(o=a.exec(e))!==null;){let h=o[1].trim(),f=o[2];t.push({id:`act_write_${Date.now()}_${s++}`,type:"write",path:h,content:f,status:"pending",newContent:f})}let n=/<edit_file\s+path=["']([^"']+)["']\s*>([\s\S]*?)<\/edit_file>/gi;for(;(o=n.exec(e))!==null;){let h=o[1].trim(),f=o[2],x=/<search>([\s\S]*?)<\/search>/i.exec(f),A=/<replace>([\s\S]*?)<\/replace>/i.exec(f);x&&A?t.push({id:`act_edit_${Date.now()}_${s++}`,type:"edit",path:h,search:x[1],replace:A[1],status:"pending"}):f.trim()&&t.push({id:`act_write_${Date.now()}_${s++}`,type:"write",path:h,content:f,status:"pending",newContent:f})}let i=/<(?:read_file|cat)\s+path=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:read_file|cat)>|\s*>)/gi;for(;(o=i.exec(e))!==null;){let h=o[1].trim();t.push({id:`act_read_${Date.now()}_${s++}`,type:"read",path:h,status:"pending"})}let r=/<(?:create_folder|create_dir)\s+path=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:create_folder|create_dir)>|\s*>)/gi;for(;(o=r.exec(e))!==null;){let h=o[1].trim();t.push({id:`act_mkdir_${Date.now()}_${s++}`,type:"create_dir",path:h,status:"pending"})}let p=/<(?:delete_path|delete_file|delete_folder)\s+path=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:delete_path|delete_file|delete_folder)>|\s*>)/gi;for(;(o=p.exec(e))!==null;){let h=o[1].trim();t.push({id:`act_del_${Date.now()}_${s++}`,type:"delete",path:h,status:"pending"})}let l=/<(?:move_path|rename_path)\s+from=["']([^"']+)["']\s+to=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/(?:move_path|rename_path)>|\s*>)/gi;for(;(o=l.exec(e))!==null;){let h=o[1].trim(),f=o[2].trim();t.push({id:`act_move_${Date.now()}_${s++}`,type:"move",path:h,targetPath:f,status:"pending"})}let m=/<(?:list_dir|list_files)(?:\s+path=["']([^"']*)["'])?(?:\s*\/>|\s*>[\s\S]*?<\/(?:list_dir|list_files)>|\s*>)/gi;for(;(o=m.exec(e))!==null;){let h=(o[1]||"").trim();t.push({id:`act_list_${Date.now()}_${s++}`,type:"list_dir",path:h||".",status:"pending"})}let u=/<find_files\s+pattern=["']([^"']+)["'](?:\s*\/>|\s*>[\s\S]*?<\/find_files>|\s*>)/gi;for(;(o=u.exec(e))!==null;){let h=o[1].trim();t.push({id:`act_find_${Date.now()}_${s++}`,type:"find_files",path:h,pattern:h,status:"pending"})}let c=/<grep\s+query=["']([^"']+)["'](?:\s+path=["']([^"']*)["'])?(?:\s+is_regex=["'](true|false)["'])?(?:\s*\/>|\s*>[\s\S]*?<\/grep>|\s*>)/gi;for(;(o=c.exec(e))!==null;){let h=o[1].trim(),f=(o[2]||"").trim(),x=o[3]==="true";t.push({id:`act_grep_${Date.now()}_${s++}`,type:"grep",path:f||".",query:h,isRegex:x,status:"pending"})}let k=/<(?:run_command|execute_command)>([\s\S]*?)<\/(?:run_command|execute_command)>/gi;for(;(o=k.exec(e))!==null;){let h=o[1].trim();h&&t.push({id:`act_cmd_${Date.now()}_${s++}`,type:"command",path:"terminal",command:h,status:"pending"})}let S=/<web_search(?:\s+query=["']([^"']+)["'])?(?:\s*\/>|\s*>([\s\S]*?)<\/web_search>|\s*>)/gi;for(;(o=S.exec(e))!==null;){let h=(o[1]||o[2]||"").trim();h&&t.push({id:`act_web_${Date.now()}_${s++}`,type:"web_search",path:"web",query:h,status:"pending"})}if(t.length===0){let h=/```(?:[a-zA-Z0-9_-]+:)?([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)\r?\n([\s\S]*?)```/g;for(;(o=h.exec(e))!==null;){let f=o[1].trim(),x=o[2];/\.[a-zA-Z0-9]{1,10}$/.test(f)&&!f.startsWith("http")&&t.push({id:`act_fallback_${Date.now()}_${s++}`,type:"write",path:f,content:x,status:"pending",newContent:x})}if(t.length===0){let f=/(?:###|##|\*\*|File:?|Dosya:?)\s*`?([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)`?\s*(?:\*\*)?\s*\r?\n```(?:[a-zA-Z0-9_-]+)?\r?\n([\s\S]*?)```/gi;for(;(o=f.exec(e))!==null;){let x=o[1].trim(),A=o[2];/\.[a-zA-Z0-9]{1,10}$/.test(x)&&t.push({id:`act_fallback_${Date.now()}_${s++}`,type:"write",path:x,content:A,status:"pending",newContent:A})}}}return t}static getAgentSystemPrompt(e,t=[],s=!1){return`CRITICAL DIRECTIVE: You are OllamaChat AGENT, an autonomous software engineering and debugging agent inside Visual Studio Code.
You are equipped with a complete suite of system and project tools. When the user asks you to inspect, debug, fix, test, refactor, or build code, YOU MUST USE THE EXECUTABLE XML ACTIONS BELOW.

DO NOT merely speak or show conversational snippets. Emit executable tool action tags so that VS Code executes them, displays diffs, shows command outputs, or performs workspace operations.

=== WORKSPACE CONTEXT ===
Project files currently available in this workspace:
${t.length>0?t.slice(0,60).map(o=>`- ${o}`).join(`
`):"(No files listed)"}

=== FULL AGENT TOOLKIT & ACTION FORMATS ===

1. [INSPECT / READ FILE CONTENTS (cat)]
Use this when you need to inspect existing code or configuration:
<read_file path="src/index.ts" />

2. [LIST DIRECTORY CONTENTS (ls / list_dir)]
Use this to see files and subdirectories inside a specific folder:
<list_dir path="src/components" />

3. [FIND FILES BY PATTERN (find / glob)]
Use this to locate files matching a wildcard or pattern across the project:
<find_files pattern="*.config.js" />

4. [SEARCH CODE ACROSS PROJECT (grep)]
Use this to locate specific functions, imports, error messages, or identifiers:
<grep query="export interface AgentFileAction" path="src" />

5. [CREATE DIRECTORY / FOLDER (mkdir)]
Use this to create a new folder structure:
<create_folder path="src/utils/auth" />

6. [DELETE FILE OR DIRECTORY (rm)]
Use this to delete unnecessary or obsolete files/folders:
<delete_path path="temp/scratch.ts" />

7. [MOVE OR RENAME FILE / DIRECTORY (mv / rename)]
Use this to rename or move files or folders:
<move_path from="src/oldName.ts" to="src/newName.ts" />

8. [RUN TERMINAL COMMAND (DEBUGGING, TESTS, BUILD)]
Use this to execute terminal commands (e.g., test runners, linters, git status, build commands). NOTE: Never run destructive commands like rm -rf / or sudo:
<run_command>npm test</run_command>

9. [CREATE OR OVERWRITE FULL FILE]
Use this to create a new code file or completely overwrite an existing file:
<write_file path="src/example.ts">
export function example() {
    return true;
}
</write_file>

10. [SEARCH & REPLACE IN FILE (PRECISE EDIT)]
Use this for updating specific blocks in existing files without rewriting the entire file:
<edit_file path="src/example.ts">
<search>
    return true;
</search>
<replace>
    return false;
</replace>
</edit_file>
${s?`
11. [SEARCH THE WEB (LIVE INTERNET RESEARCH)]
Use this when you need latest documentation, external library APIs, error solutions, or up-to-date web information:
<web_search query="React 19 useActionState documentation" />
`:""}
=== RULES FOR SUCCESSFUL AGENT EXECUTION ===
1. Use relative file paths from the workspace root (e.g. "src/components/Header.tsx", "package.json").
2. The <search> block MUST match the existing file code character-for-character.
3. When investigating bugs, use <read_file>, <grep>, or <run_command> to gather real facts before applying code modifications.
4. You may emit multiple actions in a single response (e.g. create a folder, write two files, and run tests).
5. Always keep conversational text concise and let the tool actions do the heavy lifting.

${e?`=== USER PREFERENCES & CUSTOM INSTRUCTIONS ===
${e}`:""}`}};var H=class{static DANGEROUS_COMMAND_PATTERNS=[/\brm\s+(-[rfRF]{1,4}\s+|--recursive\s+|--force\s+)*(\/|~|\$HOME|\.\.|\*)/i,/\bsudo\b/i,/\bmkfs\b/i,/\bdd\s+if=/i,/:[(][{]\s*:[|]:[&]\s*[}];:/,/\bchmod\s+(-R\s+)?(777|000)\s+(\/|~)/i,/\b(curl|wget)\s+[^|]+\|\s*(ba)?sh\b/i,/>\s*\/dev\/(sd[a-z]|nvme|null|zero)/i];static SENSITIVE_FILE_PATTERNS=[/(^|\/)\.env(\.[a-z0-9_-]+)?$/i,/(^|\/)(id_rsa|id_ed25519|id_dsa)(\.pub)?$/i,/(^|\/)[a-z0-9_-]+\.(pem|key|pfx|p12)$/i,/(^|\/)\.npmrc$/i,/(^|\/)\.bashrc|\.zshrc|\.profile$/i,/^\/etc\/|^\/usr\/|^\/bin\/|^\/sbin\/|^\/var\/|^\/System\//i,/^\.\.\/|^\.\.\\/i];static resolveProsecutorModel(e,t){if(e.prosecutorModelId&&e.prosecutorModelId!=="auto")return e.prosecutorModelId;let s=t.map(o=>o.name),a=s.find(o=>/1\.5b|1b|2b|3b|0\.5b|tiny/i.test(o));return a||s[0]||void 0}static evaluateRules(e){let t=(e.path||"").trim();if(e.type==="command"){let a=(e.command||"").trim();if(!a)return{isSafe:!1,risk:"high",reason:"Bo\u015F terminal komutu.",blocked:!0};for(let o of this.DANGEROUS_COMMAND_PATTERNS)if(o.test(a))return{isSafe:!1,risk:"high",reason:`Y\u0131k\u0131c\u0131 veya zararl\u0131 olabilecek terminal komutu engellendi: "${a}"`,blocked:!0};return{isSafe:!0,risk:"low",reason:"Komut g\xFCvenlik filtresinden ba\u015Far\u0131yla ge\xE7ti.",blocked:!1}}if(e.type==="delete"&&(!t||t==="."||t==="/"||t==="*"||t==="~"||t.startsWith("..")))return{isSafe:!1,risk:"high",reason:`Kritik veya ge\xE7ersiz dizin silme giri\u015Fimi engellendi: "${t}"`,blocked:!0};if(e.type==="move"&&e.targetPath){for(let a of this.SENSITIVE_FILE_PATTERNS)if(a.test(e.targetPath.trim()))return{isSafe:!1,risk:"high",reason:`Hassas hedef dosya yolu tespit edildi: "${e.targetPath}"`,blocked:!0}}if(t&&t!=="terminal"){for(let a of this.SENSITIVE_FILE_PATTERNS)if(a.test(t))return{isSafe:!1,risk:"high",reason:`Hassas veya sistem d\xFCzeyinde dosya yolu tespit edildi: "${t}"`,blocked:!0}}let s=e.type==="write"?e.content||"":e.type==="edit"&&e.replace||"";if(s){for(let a of this.DANGEROUS_COMMAND_PATTERNS)if(a.test(s))return{isSafe:!1,risk:"high",reason:"Y\u0131k\u0131c\u0131 veya zararl\u0131 olabilecek komut/kod tespit edildi (rm -rf / sudo vb.)",blocked:!0}}return{isSafe:!0,risk:"low",reason:"Kural tabanl\u0131 denetimden ba\u015Far\u0131yla ge\xE7ti.",blocked:!1}}static async auditAction(e,t,s){let a=this.evaluateRules(e);if(a.blocked||a.risk==="high"||["read","list_dir","grep","find_files"].includes(e.type)||t.enableProsecutor===!1)return a;let o=this.resolveProsecutorModel(t,s);if(!o)return a;try{let n="";e.type==="command"?n=`COMMAND TO EXECUTE: ${e.command}`:e.type==="delete"?n=`DELETE PATH: ${e.path}`:e.type==="move"?n=`MOVE FROM: ${e.path} TO: ${e.targetPath}`:e.type==="create_dir"?n=`CREATE DIRECTORY: ${e.path}`:e.type==="write"?n=`WRITE FILE: ${e.path}
CONTENT:
${(e.content||"").slice(0,500)}`:e.type==="edit"&&(n=`EDIT FILE: ${e.path}
SEARCH:
${(e.search||"").slice(0,200)}
REPLACE:
${(e.replace||"").slice(0,200)}`);let i=`You are a strict Security Prosecutor (Savc\u0131) auditing an AI coding agent inside VS Code.
Analyze whether the following proposed action is safe or poses a security/data loss threat:

Action Type: ${e.type.toUpperCase()}
Action Details:
"""
${n}
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
}`,r="",p=new AbortController,l=setTimeout(()=>p.abort(),4e3);await O.streamChat({baseUrl:t.ollamaUrl,model:o,messages:[{role:"user",content:i}],temperature:0,numPredict:150,signal:p.signal,onChunk:u=>{r+=u},onDone:()=>{},onError:u=>{console.warn("Prosecutor model audit error:",u.message)}}),clearTimeout(l);let m=/\{[\s\S]*\}/.exec(r);if(m){let u=JSON.parse(m[0]),c=!!u.isSafe,k=["low","medium","high"].includes(u.risk)?u.risk:c?"low":"high",S=u.reason||(c?"Savc\u0131 onaylad\u0131.":"\u015E\xFCpheli i\u015Flem tespit edildi.");return{isSafe:c,risk:k,reason:S,prosecutorName:o,blocked:!c||k==="high"}}}catch(n){console.warn("Prosecutor audit fallback to rules:",n.message)}return{...a,prosecutorName:o}}};var U=class{static USER_AGENT="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";static async search(e,t){let s=e.trim();if(!s)return[];let a=Math.min(10,Math.max(1,t.webSearchMaxResults??5)),o=t.webSearchDepth||"standard",n=t.webSearchEngine||"duckduckgo",i=[];n==="searxng"&&(i=await this._searchSearXNG(s,a*2)),i.length===0&&(i=await this._searchDuckDuckGo(s,a*2)),i=this._applyDomainFilters(i,t.webSearchBlacklist,t.webSearchWhitelist);let r=i.slice(0,a);if(o==="fast")return r;let p=o==="deep"?Math.min(r.length,5):Math.min(r.length,3),l=r.slice(0,p).map(async m=>{try{let u=await this.fetchPageContent(m.url,o==="deep"?3500:1800);u&&(m.content=u,o==="deep"&&(m.summary=this._extractKeySentences(u,s,400)))}catch{}return m});return await Promise.all(l),r}static async _searchDuckDuckGo(e,t){let s=[];try{let a=`https://html.duckduckgo.com/html/?q=${encodeURIComponent(e)}`,o=new AbortController,n=setTimeout(()=>o.abort(),8e3),i=await fetch(a,{method:"GET",headers:{"User-Agent":this.USER_AGENT,Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8","Accept-Language":"tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"},signal:o.signal});if(clearTimeout(n),!i.ok)return s;let p=(await i.text()).split(/class="[^"]*result__body[^"]*"/);for(let l=1;l<p.length&&s.length<t;l++){let m=p[l],u=/<a [^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i.exec(m);if(!u)continue;let c=u[1],k=this._stripHtml(u[2]);if(c.includes("uddg=")){let x=/uddg=([^&]+)/.exec(c);if(x)try{c=decodeURIComponent(x[1])}catch{}}if(!c.startsWith("http://")&&!c.startsWith("https://"))continue;let S=/<a [^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i.exec(m),h=S?this._stripHtml(S[1]):"",f="";try{f=new URL(c).hostname.replace(/^www\./,"")}catch{}s.push({title:k||f||c,url:c,snippet:h,domain:f})}}catch(a){console.warn("DuckDuckGo search failed:",a)}return s}static async _searchSearXNG(e,t){let s=[],a=[`http://127.0.0.1:8080/search?q=${encodeURIComponent(e)}&format=json`,`https://searx.be/search?q=${encodeURIComponent(e)}&format=json`];for(let o of a)try{let n=new AbortController,i=setTimeout(()=>n.abort(),5e3),r=await fetch(o,{headers:{"User-Agent":this.USER_AGENT,Accept:"application/json"},signal:n.signal});if(clearTimeout(i),!r.ok)continue;let p=await r.json();if(Array.isArray(p.results))for(let l of p.results){if(s.length>=t)break;if(l.url&&(l.url.startsWith("http://")||l.url.startsWith("https://"))){let m="";try{m=new URL(l.url).hostname.replace(/^www\./,"")}catch{}s.push({title:l.title||m||l.url,url:l.url,snippet:l.content||l.snippet||"",domain:m})}}if(s.length>0)break}catch{}return s}static async fetchPageContent(e,t=2e3){try{let s=new AbortController,a=setTimeout(()=>s.abort(),6e3),o=await fetch(e,{method:"GET",headers:{"User-Agent":this.USER_AGENT,Accept:"text/html,text/plain"},signal:s.signal});if(clearTimeout(a),!o.ok)return"";let n=await o.text();return this._cleanHtmlToText(n,t)}catch{return""}}static _cleanHtmlToText(e,t){let s=e.replace(/<script[\s\S]*?<\/script>/gi,"").replace(/<style[\s\S]*?<\/style>/gi,"").replace(/<head[\s\S]*?<\/head>/gi,"").replace(/<nav[\s\S]*?<\/nav>/gi,"").replace(/<header[\s\S]*?<\/header>/gi,"").replace(/<footer[\s\S]*?<\/footer>/gi,"").replace(/<aside[\s\S]*?<\/aside>/gi,"").replace(/<svg[\s\S]*?<\/svg>/gi,"").replace(/<!--[\s\S]*?-->/g,"");return s=s.replace(/<\/(p|div|h\d|li|tr)>/gi,`
`).replace(/<br\s*\/?>/gi,`
`),s=this._stripHtml(s),s=s.split(`
`).map(a=>a.trim()).filter(a=>a.length>20).join(`

`),s.length>t&&(s=s.substring(0,t)+"..."),s}static _stripHtml(e){return e.replace(/<[^>]+>/g,"").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g," ").trim()}static _extractKeySentences(e,t,s){let a=t.toLowerCase().split(/\s+/).filter(p=>p.length>2),r=e.split(/[.!?\n]+/).map(p=>p.trim()).filter(Boolean).map(p=>{let l=p.toLowerCase(),m=0;return a.forEach(u=>{l.includes(u)&&(m+=1)}),{s:p,score:m}}).filter(p=>p.score>0).sort((p,l)=>l.score-p.score).map(p=>p.s).join(". ");return r.length>s?r.substring(0,s)+"...":r}static _applyDomainFilters(e,t,s){let a=(t||"").split(/[,;\n]/).map(n=>n.trim().toLowerCase()).filter(Boolean),o=(s||"").split(/[,;\n]/).map(n=>n.trim().toLowerCase()).filter(Boolean);return e.filter(n=>{if(!n.domain)return!0;let i=n.domain.toLowerCase();return!(a.some(r=>i===r||i.endsWith("."+r))||o.length>0&&!o.some(r=>i===r||i.endsWith("."+r)))})}static formatSourcesForPrompt(e,t="standard"){if(!e||e.length===0)return"";let s=new Date,a={weekday:"long",year:"numeric",month:"long",day:"numeric"},o=s.toLocaleDateString("tr-TR",a),n=s.getFullYear(),i=["=== \u{1F310} G\xDCNCEL \u0130NTERNET VE CANLI ARA\u015ETIRMA VER\u0130LER\u0130 ===",`[ZAMAN VE TAR\u0130H B\u0130LG\u0130S\u0130: Bug\xFCn\xFCn ger\xE7ek d\xFCnya tarihi: ${o}. Mevcut y\u0131l: ${n}.]`,`[TEMPORAL CONTEXT: Today is ${o}, and the current year is ${n}.]`,"A\u015Fa\u011F\u0131daki bilgiler kullan\u0131c\u0131n\u0131n sorusu do\u011Frultusunda canl\u0131 internet aramas\u0131ndan derlenmi\u015Ftir.",`\xD6NEML\u0130 TAL\u0130MAT: Modelinin e\u011Fitim kesilme tarihi (training cutoff) ge\xE7mi\u015Fte kalm\u0131\u015F olabilir. Yan\u0131t\u0131n\u0131 verirken ge\xE7mi\u015F e\u011Fitim veri s\u0131n\u0131r\u0131n yerine yukar\u0131daki bug\xFCn\xFCn y\u0131l\u0131n\u0131 (${n}) ve a\u015Fa\u011F\u0131daki canl\u0131 web arama sonu\xE7lar\u0131n\u0131 kesin olarak esas alacaks\u0131n. Kaynak numaralar\u0131yla ([1], [2] vb.) bilgiye at\u0131f yapabilirsin.`,""];return e.forEach((r,p)=>{if(i.push(`### [${p+1}] ${r.title}`),i.push(`- **URL**: ${r.url}`),r.domain&&i.push(`- **Kaynak Site**: ${r.domain}`),r.snippet&&i.push(`- **Arama \xD6zeti (Snippet)**: ${r.snippet}`),r.summary&&t==="deep"&&i.push(`- **\xD6ne \xC7\u0131kan Bulgular**: ${r.summary}`),r.content&&t!=="fast"){let l=t==="deep"?1600:1e3;i.push(`- **Sayfa \u0130\xE7eri\u011Fi/Al\u0131nt\u0131**: ${r.content.substring(0,l)}...`)}i.push("")}),i.push("=== G\xDCNCEL WEB VER\u0130LER\u0130N\u0130N SONU ==="),i.join(`
`)}static generateSourcesMarkdown(e,t,s){let a="",o=[],n="";if(typeof e=="object"&&"title"in e){let m=e;n=m.title;let u=t;o=u.webSources||[];let c=m.messages.findIndex(k=>k.id===u.id);c>0?a=m.messages[c-1]?.content||m.title:a=m.title}else a=e,o=t;let i=s?.webSearchDepth||"standard",r=s?.webSearchEngine||"duckduckgo",p=new Date().toLocaleString(),l=["# \u{1F310} Web Ara\u015Ft\u0131rma Kaynaklar\u0131 Raporu","","| Parametre | De\u011Fer |","| :--- | :--- |",...n?[`| **Oturum** | \`${n}\` |`]:[],`| **Arama Sorgusu / Ba\u011Flam** | \`${a.length>80?a.slice(0,80)+"...":a}\` |`,`| **Arama Motoru** | ${r==="duckduckgo"?"DuckDuckGo":r} |`,`| **Analiz Derinli\u011Fi** | ${i==="deep"?"\u{1F50D} Derin Analiz":i==="fast"?"\u26A1 H\u0131zl\u0131 (Snippet)":"\u{1F4C4} Standart (Sayfa \xD6zeti)"} |`,`| **Bulunan Kaynak Say\u0131s\u0131** | ${o.length} adet |`,`| **Tarih** | ${p} |`,"","---","","## \u{1F4D1} Ba\u015Fvurulan Kaynaklar ve \u0130nceleme Detaylar\u0131",""];return o.length===0?(l.push("*Bu arama i\xE7in herhangi bir web kayna\u011F\u0131 bulunamad\u0131 veya sonu\xE7lar filtreye tak\u0131ld\u0131.*"),l.join(`
`)):(o.forEach((m,u)=>{l.push(`### ${u+1}. [${m.title}](${m.url})`),l.push(`- **Kaynak Web Sitesi**: \`${m.domain||m.url}\``),l.push(`- **Do\u011Frudan Ba\u011Flant\u0131**: [${m.url}](${m.url})`),l.push(""),m.snippet&&(l.push("> **Arama Snippet'\u0131:**  "),l.push(`> ${m.snippet}`),l.push("")),m.summary&&(l.push("**\u{1F50D} Derin Analiz \xD6zeti:**  "),l.push(`${m.summary}`),l.push("")),m.content&&(l.push("<details>"),l.push("<summary><b>\u{1F4C4} Taranan Sayfa Metni (Geni\u015Flet)</b></summary>"),l.push(""),l.push("```text"),l.push(m.content),l.push("```"),l.push("</details>"),l.push("")),l.push("---"),l.push("")}),l.push("*Bu rapor OllamaChat \u0130nternet & Web Ara\u015Ft\u0131rma motoru taraf\u0131ndan otomatik olu\u015Fturulmu\u015Ftur.*"),l.join(`
`))}};var le={common:{save:"Save",cancel:"Cancel",delete:"Delete",edit:"Edit",copy:"Copy",copied:"Copied!",close:"Close",add:"+ Add",search:"Search",loading:"Loading...",error:"Error",default:"Default",unlimited:"Unlimited"},header:{listSessions:"List Sessions",newSession:"New Chat",untitledSession:"New Chat"},chat:{inputPlaceholder:"Ask a question or request code... (Enter to send, Shift+Enter for new line)",send:"Send (Enter)",stop:"Stop (Esc)",thinking:"Thinking...",tokenPerSec:"t/s",duration:"Duration",speed:"Speed",tokens:"tokens",emptyTitle:"Welcome to OllamaChat",emptySubtitle:"Your local and private AI coding assistant. Select a model below and ask a question to begin.",retry:"Retry",sourcesBtn:"Sources",sourcesTitle:"Inspect web sources and references",webAccessBtn:"Web",webSearching:"Searching the web..."},dropdowns:{searchSessions:"Search sessions...",noSessions:"No sessions found",searchModels:"Search models...",noModels:"No models found (You can add from Settings > Models)",selectModel:"Select Model",customTag:"Custom"},kvCache:{title:"Context & KV-Cache",model:"Model:",context:"Context (num_ctx):",temperature:"Temperature:",lastSpeed:"Last Speed:",badge:"\u26A1 KVCache"},settings:{title:"Settings",tabSessions:"Sessions",tabModels:"Models",tabSettings:"Extension Settings",saveSettings:"Save Settings",savedToast:"Settings saved.",languageLabel:"Language",languageHint:"Select interface language or match VS Code automatically.",langAuto:"Automatic (VS Code Language)",langEn:"English",langTr:"T\xFCrk\xE7e",ollamaUrlLabel:"Ollama API URL",ollamaUrlHint:"Local Ollama server connection endpoint.",systemPromptLabel:"Global System Prompt",systemPromptToggle:"Enable global system prompt",systemPromptPlaceholder:"Default assistant system prompt...",systemPromptHint:"Sets base behavior instructions for models without custom prompt.",maxTokensLabel:"Max Tokens Limit (num_predict)",maxTokensToggle:"Enable max token limit",maxTokensHint:"When off, tokens are unlimited. When on, minimum is 4096 tokens.",autoApplyLabel:"Auto-apply Agent File Edits",autoApplyHint:"When enabled, Agent mode writes file changes immediately without confirmation.",autoPermissionsTitle:"Autonomous Agent Permissions",autoPermissionsHint:"Control what actions the Agent can execute automatically:",allowFileEdits:"Always allow file edits (Search & Replace)",allowFileCreate:"Always allow new file creation",allowFolderCreate:"Always allow directory creation",prosecutorTitle:"Security Prosecutor (Guard Model)",prosecutorHint:"Uses a lightweight model (e.g. 1.5B) to audit agent commands and file edits for dangerous operations (e.g. rm -rf, file wipes).",prosecutorToggle:"Enable Security Prosecutor Audit",prosecutorModelLabel:"Prosecutor Model",prosecutorAuto:"Auto-detect small model (1.5B)",webSearchTitle:"Web Search & Internet Access",webEngineLabel:"Search Engine",webDepthLabel:"Search & Analysis Depth",webDepthFast:"Fast (Snippets only)",webDepthStandard:"Standard (Page summaries)",webDepthDeep:"Deep Analysis (Full page inspection & synthesis)",webMaxResultsLabel:"Max Web Sources",webBlacklistLabel:"Domain Blacklist (Blocked sites)",webBlacklistHint:"Comma-separated domains to ignore (e.g. pinterest.com, spam.com)",webWhitelistLabel:"Domain Whitelist (Allowed sites)",webWhitelistHint:"Comma-separated domains to restrict/prioritize"},mode:{chat:"Chat",agent:"Agent",chatDesc:"Conversation & coding assistant (Read-only, no workspace edits)",agentDesc:"Autonomous coding agent (Can read and edit project files)",apply:"Apply Changes",reject:"Reject",viewDiff:"View Diff",applied:"Changes applied successfully.",rejected:"Changes rejected.",readingFile:"Reading file...",editingFile:"Editing file...",creatingFile:"Creating file...",fileNotFound:"File not found in workspace.",prosecutorSafe:"Audited & Safe",prosecutorWarning:"Suspicious / Potential Risk",prosecutorBlocked:"Blocked by Security Prosecutor",prosecutorAuditing:"Prosecutor auditing action...",revert:"Revert",accept:"Keep",reverted:"Changes reverted.",accepted:"Changes kept permanently.",autoAppliedBadge:"Applied (Reversible)",actionDetailsTitle:"Action & Code Details",revertToast:"Change reverted.",acceptToast:"Change kept permanently.",reapply:"Re-apply",dragDropHint:"Drop files here to add as context",searchFilesPlaceholder:"Search files with @ or #...",contextFilesCount:g=>`${g} context files`,blackboxBtn:"Black Box",blackboxTitle:"Inspect all tokens, commands and response details in markdown",runCommand:"Run",toolOutputTitle:"Tool Output",executedBadge:"Executed",failedBadge:"Failed"},sessions:{hint:"You can export or delete your saved conversation sessions.",export:"Export",exportMarkdown:"Markdown (.md)",exportJson:"JSON (.json)",deleteConfirm:"Are you sure you want to delete this session?",deletedToast:"Session deleted.",messagesCount:g=>`${g} msg`},models:{title:"All Models (Ollama & Custom)",addDropdown:"+ Add \u25BE",importFromOllama:"Import from Ollama",createCustom:"Create custom model profile",deletedToast:"Model deleted.",editorTitleEdit:"Edit Model Profile",editorTitleNew:"New Model Profile",nameLabel:"Display Name",namePlaceholder:"e.g. Qwen Code Assistant",baseModelLabel:"Base Ollama Model",customPromptLabel:"Custom System Prompt",customPromptPlaceholder:"Role and instructions specific to this model...",numCtxLabel:"KV-Cache / Context (num_ctx)",temperatureLabel:"Temperature",nameRequired:"Please enter a model name.",savedToast:"Model saved.",importModalTitle:"Import Model from Ollama",importModalHint:"Locally installed Ollama models are listed below. Click import or customize:",importBtn:"Import",importedToast:"Model imported.",noOllamaModels:"No new Ollama models found to import."},export:{createdDate:"Created Date:",model:"Model:",quantization:"Quantization:",user:"\u{1F464} User",assistant:"\u{1F916} Assistant"}};var ce={common:{save:"Kaydet",cancel:"\u0130ptal",delete:"Sil",edit:"D\xFCzenle",copy:"Kopyala",copied:"Kopyaland\u0131!",close:"Kapat",add:"+ Ekle",search:"Ara",loading:"Y\xFCkleniyor...",error:"Hata",default:"Varsay\u0131lan",unlimited:"S\u0131n\u0131rs\u0131z"},header:{listSessions:"Oturumlar\u0131 Listele",newSession:"Yeni Sohbet",untitledSession:"Yeni Sohbet"},chat:{inputPlaceholder:"Bir soru sorun veya kod isteyin... (Enter ile g\xF6nder, Shift+Enter alt sat\u0131r)",send:"G\xF6nder (Enter)",stop:"Durdur (Esc)",thinking:"D\xFC\u015F\xFCn\xFCyor...",tokenPerSec:"token/sn",duration:"S\xFCre",speed:"H\u0131z",tokens:"tokens",emptyTitle:"OllamaChat'e Ho\u015F Geldiniz",emptySubtitle:"Yerel ve gizli yapay zeka kodlama asistan\u0131n\u0131z. Ba\u015Flamak i\xE7in a\u015Fa\u011F\u0131dan bir model se\xE7ip sorunuzu yaz\u0131n.",retry:"Yeniden Dene",sourcesBtn:"Kaynaklar",sourcesTitle:"Web arama kaynaklar\u0131n\u0131 ve referanslar\u0131 incele",webAccessBtn:"Web",webSearching:"\u0130nternette ara\u015Ft\u0131r\u0131l\u0131yor..."},dropdowns:{searchSessions:"Oturumlarda ara...",noSessions:"Oturum bulunamad\u0131",searchModels:"Model ara...",noModels:"Model bulunamad\u0131 (Ayarlar > Modeller sekmesinden ekleyebilirsiniz)",selectModel:"Model Se\xE7",customTag:"\xD6zel"},kvCache:{title:"Ba\u011Flam & KV-Cache",model:"Model:",context:"Context (num_ctx):",temperature:"S\u0131cakl\u0131k:",lastSpeed:"Son Yan\u0131t H\u0131z\u0131:",badge:"\u26A1 KVCache"},settings:{title:"Ayarlar",tabSessions:"Oturumlar",tabModels:"Modeller",tabSettings:"Eklenti Ayarlar\u0131",saveSettings:"Ayarlar\u0131 Kaydet",savedToast:"Ayarlar kaydedildi.",languageLabel:"Dil Se\xE7imi",languageHint:"Aray\xFCz dilini belirleyin veya VS Code diline otomatik e\u015Fitleyin.",langAuto:"Otomatik (VS Code Dili)",langEn:"English",langTr:"T\xFCrk\xE7e",ollamaUrlLabel:"Ollama API URL",ollamaUrlHint:"Ollama yerel sunucu ba\u011Flant\u0131 noktas\u0131.",systemPromptLabel:"Genel Sistem Promptu",systemPromptToggle:"Genel sistem promptunu etkinle\u015Ftir",systemPromptPlaceholder:"Varsay\u0131lan asistan sistem promptu...",systemPromptHint:"\xD6zel promptu bulunmayan t\xFCm modeller i\xE7in ge\xE7erli temel rol talimatlar\u0131.",maxTokensLabel:"Maksimum Token S\u0131n\u0131r\u0131 (num_predict)",maxTokensToggle:"Maksimum token s\u0131n\u0131r\u0131n\u0131 etkinle\u015Ftir",maxTokensHint:"Kapal\u0131yken \xFCretim s\u0131n\u0131rs\u0131zd\u0131r. A\xE7\u0131kken s\u0131n\u0131r minimum 4096 tokendir.",autoApplyLabel:"Agent Dosya G\xFCncellemelerini Otomatik Uygula",autoApplyHint:"Etkinle\u015Ftirildi\u011Finde, Agent modunda dosya de\u011Fi\u015Fiklikleri onay beklemeden do\u011Frudan kaydedilir.",autoPermissionsTitle:"Agent Otomatik \u0130zinleri",autoPermissionsHint:"Agent modunun onay istemeden do\u011Frudan yapabilece\u011Fi i\u015Flemleri belirleyin:",allowFileEdits:"Dosya d\xFCzenlemelerine her zaman izin ver (Search & Replace)",allowFileCreate:"Yeni dosya olu\u015Fturmaya her zaman izin ver",allowFolderCreate:"Klas\xF6r olu\u015Fturmaya her zaman izin ver",prosecutorTitle:"Savc\u0131 Modeli (G\xFCvenlik Denet\xE7isi)",prosecutorHint:"K\xFC\xE7\xFCk ve h\u0131zl\u0131 bir modeli (\xF6rn: 1.5B) savc\u0131 olarak konumland\u0131r\u0131p, komut ve dosya de\u011Fi\u015Fikliklerini zararl\u0131 m\u0131 (rm -rf, veri kayb\u0131 vb.) diye denetletir.",prosecutorToggle:"Savc\u0131 G\xFCvenlik Denetimini Etkinle\u015Ftir",prosecutorModelLabel:"Savc\u0131 Modeli",prosecutorAuto:"Otomatik K\xFC\xE7\xFCk Model Se\xE7 (1.5B)",webSearchTitle:"\u0130nternet & Web Arama Ayarlar\u0131",webEngineLabel:"Arama Motoru",webDepthLabel:"Arama ve Analiz Derinli\u011Fi",webDepthFast:"H\u0131zl\u0131 (Yaln\u0131zca arama snippet'lar\u0131)",webDepthStandard:"Standart (Sayfa \xF6zetleri ve ilk sayfalar)",webDepthDeep:"Derin Analiz (Sayfa metinleri ve sentezleme)",webMaxResultsLabel:"Maksimum Kaynak Say\u0131s\u0131",webBlacklistLabel:"Alan Ad\u0131 Kara Listesi (Yasakl\u0131 Siteler)",webBlacklistHint:"Virg\xFClle ayr\u0131lm\u0131\u015F engellenecek siteler (\xF6rn: pinterest.com, spam.com)",webWhitelistLabel:"Alan Ad\u0131 Beyaz Listesi (\xD6ncelikli Siteler)",webWhitelistHint:"Virg\xFClle ayr\u0131lm\u0131\u015F odaklan\u0131lacak veya k\u0131s\u0131tlanacak siteler"},mode:{chat:"Chat",agent:"Agent",chatDesc:"Sohbet ve kod dan\u0131\u015Fman\u0131 (Salt okunur, dosyalara dokunmaz)",agentDesc:"Otonom kod yaz\u0131c\u0131 (Proje dosyalar\u0131n\u0131 okuyabilir ve g\xFCncelleyebilir)",apply:"De\u011Fi\u015Fiklikleri Uygula",reject:"Reddet",viewDiff:"Fark\u0131 G\xF6r (Diff)",applied:"De\u011Fi\u015Fiklikler ba\u015Far\u0131yla uyguland\u0131.",rejected:"De\u011Fi\u015Fiklik reddedildi.",readingFile:"Dosya okunuyor...",editingFile:"Dosya g\xFCncelleniyor...",creatingFile:"Yeni dosya olu\u015Fturuluyor...",fileNotFound:"Dosya proje \xE7al\u0131\u015Fma alan\u0131nda bulunamad\u0131.",prosecutorSafe:"Savc\u0131 Onaylad\u0131 (G\xFCvenli)",prosecutorWarning:"\u015E\xFCpheli / Dikkat Gerektiren Eylem",prosecutorBlocked:"Savc\u0131 Taraf\u0131ndan Engellendi!",prosecutorAuditing:"Savc\u0131 eylemi denetliyor...",revert:"Geri D\xF6nd\xFCr",accept:"Kal\u0131c\u0131 Yap",reverted:"De\u011Fi\u015Fiklik geri al\u0131nd\u0131.",accepted:"De\u011Fi\u015Fiklik kal\u0131c\u0131 yap\u0131ld\u0131.",autoAppliedBadge:"Uyguland\u0131 (Geri D\xF6nd\xFCr\xFClebilir)",actionDetailsTitle:"Eylem ve Kod Detaylar\u0131",revertToast:"De\u011Fi\u015Fiklik geri al\u0131nd\u0131.",acceptToast:"De\u011Fi\u015Fiklik kal\u0131c\u0131 olarak onayland\u0131.",reapply:"Yeniden Uygula",dragDropHint:"Dosyalar\u0131 ba\u011Flam olarak eklemek i\xE7in buraya b\u0131rak\u0131n",searchFilesPlaceholder:"@ veya # ile dosya aray\u0131n...",contextFilesCount:g=>`${g} hedef dosya ba\u011Flamda`,blackboxBtn:"Kara Kutu",blackboxTitle:"Yan\u0131t\u0131n t\xFCm tokenlar\u0131n\u0131, komutlar\u0131n\u0131 ve ayr\u0131nt\u0131lar\u0131n\u0131 markdown olarak incele",runCommand:"\xC7al\u0131\u015Ft\u0131r",toolOutputTitle:"Ara\xE7 \xC7\u0131kt\u0131s\u0131",executedBadge:"Y\xFCr\xFCt\xFCld\xFC",failedBadge:"Ba\u015Far\u0131s\u0131z"},sessions:{hint:"Kay\u0131tl\u0131 oturumlar\u0131 d\u0131\u015Fa aktarabilir veya silebilirsiniz.",export:"D\u0131\u015Fa Aktar",exportMarkdown:"Markdown (.md)",exportJson:"JSON (.json)",deleteConfirm:"Bu oturumu silmek istedi\u011Finize emin misiniz?",deletedToast:"Oturum silindi.",messagesCount:g=>`${g} mesaj`},models:{title:"T\xFCm Modeller (Ollama & \xD6zel)",addDropdown:"+ Ekle \u25BE",importFromOllama:"Ollama'dan aktar",createCustom:"Kopya model olu\u015Ftur",deletedToast:"Model silindi.",editorTitleEdit:"Model Profili D\xFCzenle",editorTitleNew:"Yeni Model Profili",nameLabel:"G\xF6r\xFCnen Ad",namePlaceholder:"\xD6rn: Qwen Kod Asistan\u0131",baseModelLabel:"Taban Ollama Modeli",customPromptLabel:"\xD6zel Sistem Promptu",customPromptPlaceholder:"Bu modele \xF6zg\xFC rol ve talimatlar...",numCtxLabel:"KV-Cache / Context (num_ctx)",temperatureLabel:"S\u0131cakl\u0131k (Temperature)",nameRequired:"L\xFCtfen model ad\u0131n\u0131 girin.",savedToast:"Model kaydedildi.",importModalTitle:"Ollama'dan Model Aktar",importModalHint:"Cihaz\u0131n\u0131zda kurulu Ollama modelleri listeleniyor. Direkt aktarabilir veya parametrelerini d\xFCzenleyebilirsiniz:",importBtn:"Aktar",importedToast:"Model aktar\u0131ld\u0131.",noOllamaModels:"Aktar\u0131lacak yeni Ollama modeli bulunamad\u0131."},export:{createdDate:"Olu\u015Fturulma Tarihi:",model:"Model:",quantization:"Kuantizasyon:",user:"\u{1F464} Kullan\u0131c\u0131",assistant:"\u{1F916} Asistan"}};var K={en:le,tr:ce},de="en";function J(g,e){if(g&&g!=="auto"&&g in K)return g;if(e){let t=e.split("-")[0].toLowerCase();if(t in K)return t}return de}function Z(g){return g&&g in K?K[g]:K[de]}var G=class{constructor(e,t){this._extensionUri=e;this._storageService=t}_extensionUri;_storageService;static viewType="ollamachat.chatView";_view;_abortControllers=new Map;resolveWebviewView(e,t,s){this._view=e,e.webview.options={enableScripts:!0,localResourceRoots:[this._extensionUri]},e.webview.html=this._getHtmlForWebview(e.webview),e.webview.onDidReceiveMessage(async a=>{await this._handleMessage(a)})}async _handleMessage(e){switch(e.type){case"ready":{await this._sendInitialData();break}case"getWorkspaceFiles":{let t=await v.listFiles(300);this._postMessage({type:"workspaceFiles",files:t});break}case"sendMessage":{await this._handleSendMessage(e.sessionId,e.prompt,e.modelId,e.mode,e.webAccessEnabled);break}case"stopGeneration":{let t=this._abortControllers.get(e.sessionId);t&&(t.abort(),this._abortControllers.delete(e.sessionId));break}case"switchMode":{let t=this._storageService.getSession(e.sessionId);t&&(t.mode=e.mode,await this._storageService.saveSession(t)),await this._storageService.setLastSelectedMode(e.mode),this._postMessage({type:"modeUpdated",sessionId:e.sessionId,mode:e.mode});break}case"toggleWebAccess":{let t=!!e.enabled;await this._storageService.setLastSelectedWebAccess(t);let s=this._storageService.getSession(e.sessionId);s&&(s.webAccessEnabled=t,await this._storageService.saveSession(s)),this._postMessage({type:"webAccessUpdated",sessionId:e.sessionId,enabled:t});break}case"applyAgentAction":{try{let{sessionId:t,messageId:s,actionId:a}=e,o=this._storageService.getSession(t),n=o?.messages.find(r=>r.id===s),i=n?.actions?.find(r=>r.id===a);if(i&&o&&n){let r=this._storageService.getSettings(),p=await this._getInstalledOllamaModels(),l=i.securityAudit||await H.auditAction(i,r,p);if(i.securityAudit=l,l.blocked){this._postMessage({type:"toast",message:`Savc\u0131 Engelledi: ${l.reason}`}),this._postMessage({type:"agentActionUpdated",sessionId:t,messageId:s,actionId:a,status:"rejected",securityAudit:l});break}if(i.type==="write"&&i.content!==void 0){let u=await v.writeFile(i.path,i.content);i.originalContent=u.originalContent,i.wasCreated=u.wasCreated,i.status="applied"}else if(i.type==="edit"&&i.search&&i.replace){let u=await v.applySearchReplace(i.path,i.search,i.replace);i.originalContent=u.originalContent,i.wasCreated=!1,i.status="applied"}else if(i.type==="create_dir")await v.createDirectory(i.path),i.status="applied";else if(i.type==="delete")await v.deletePath(i.path),i.status="applied";else if(i.type==="move"&&i.targetPath)await v.movePath(i.path,i.targetPath),i.status="applied";else if(i.type==="read")i.output=await v.readFile(i.path),i.status="executed";else if(i.type==="list_dir"){let u=await v.listDirectory(i.path==="."?"":i.path);i.output=u.map(c=>`${c.isDirectory?"\u{1F4C1}":"\u{1F4C4}"} ${c.name}`).join(`
`)||"(Bo\u015F dizin)",i.status="executed"}else if(i.type==="find_files"&&i.pattern){let u=await v.findFiles(i.pattern);i.output=u.map(c=>`\u{1F4C4} ${c}`).join(`
`)||"(Dosya bulunamad\u0131)",i.status="executed"}else if(i.type==="grep"&&i.query){let u=await v.grepSearch(i.query,i.path==="."?"":i.path,i.isRegex);i.output=u.map(c=>`${c.file}:${c.line}: ${c.content}`).join(`
`)||"(E\u015Fle\u015Fme bulunamad\u0131)",i.status="executed"}else if(i.type==="command"&&i.command){let u=await v.executeCommand(i.command);i.output=u.stdout+(u.stderr?`
[STDERR]
${u.stderr}`:""),i.status=u.exitCode===0?"executed":"failed"}await this._storageService.saveSession(o),this._postMessage({type:"agentActionUpdated",sessionId:t,messageId:s,actionId:a,status:i.status,securityAudit:l,originalContent:i.originalContent,wasCreated:i.wasCreated,output:i.output});let m=i.type==="command"?i.command:i.path;this._postMessage({type:"toast",message:`${m}: \u0130\u015Flem tamamland\u0131 (${i.status}).`})}}catch(t){this._postMessage({type:"toast",message:`Hata: ${t.message}`})}break}case"revertAgentAction":{try{let{sessionId:t,messageId:s,actionId:a}=e,o=this._storageService.getSession(t),n=o?.messages.find(r=>r.id===s),i=n?.actions?.find(r=>r.id===a);i&&o&&n&&(await v.revertAction(i),i.status="reverted",await this._storageService.saveSession(o),this._postMessage({type:"agentActionUpdated",sessionId:t,messageId:s,actionId:a,status:"reverted",securityAudit:i.securityAudit}),this._postMessage({type:"toast",message:`${i.path}: De\u011Fi\u015Fiklik geri al\u0131nd\u0131.`}))}catch(t){this._postMessage({type:"toast",message:`Geri alma hatas\u0131: ${t.message}`})}break}case"acceptAgentAction":{let{sessionId:t,messageId:s,actionId:a}=e,o=this._storageService.getSession(t),n=o?.messages.find(r=>r.id===s),i=n?.actions?.find(r=>r.id===a);i&&o&&n&&(i.status="accepted",await this._storageService.saveSession(o),this._postMessage({type:"agentActionUpdated",sessionId:t,messageId:s,actionId:a,status:"accepted",securityAudit:i.securityAudit}),this._postMessage({type:"toast",message:`${i.path}: De\u011Fi\u015Fiklik kal\u0131c\u0131 yap\u0131ld\u0131.`}));break}case"rejectAgentAction":{let{sessionId:t,messageId:s,actionId:a}=e,o=this._storageService.getSession(t),n=o?.messages.find(r=>r.id===s),i=n?.actions?.find(r=>r.id===a);i&&o&&n&&(i.status="rejected",await this._storageService.saveSession(o),this._postMessage({type:"agentActionUpdated",sessionId:t,messageId:s,actionId:a,status:"rejected"}));break}case"viewAgentDiff":{try{let{path:t,newContent:s,search:a,replace:o}=e,n=s;if(n===void 0&&a&&o)try{n=(await v.readFile(t)).replace(a.trim(),o)}catch{n=o}n!==void 0&&await v.showDiff(t,n)}catch(t){this._postMessage({type:"toast",message:`Diff a\xE7\u0131lamad\u0131: ${t.message}`})}break}case"createSession":{let t=e.modelId||this._storageService.getLastSelectedModelId(),s=e.mode||this._storageService.getLastSelectedMode(),a=this._storageService.createDraftSession(e.title,t,s);this._postMessage({type:"newSessionDraft",session:a});break}case"switchSession":{await this._storageService.setActiveSessionId(e.sessionId);let t=this._storageService.getSession(e.sessionId);t?.modelId&&await this._storageService.setLastSelectedModelId(t.modelId),this._postMessage({type:"sessionsUpdated",sessions:this._storageService.getSessions(),activeSessionId:e.sessionId});break}case"openMessageBlackbox":{try{let{sessionId:t,messageId:s}=e,a=this._storageService.getSession(t),o=a?.messages.find(n=>n.id===s);if(a&&o){let n=this._buildBlackboxMarkdown(a,o),i=await C.workspace.openTextDocument({content:n,language:"markdown"});await C.window.showTextDocument(i,{preview:!0})}}catch(t){this._postMessage({type:"toast",message:`Kara kutu a\xE7\u0131lamad\u0131: ${t.message}`})}break}case"openWebSources":{try{let{sessionId:t,messageId:s}=e,a=this._storageService.getSession(t),o=a?.messages.find(n=>n.id===s);if(a&&o&&o.webSources&&o.webSources.length>0){let n=this._storageService.getSettings(),i=U.generateSourcesMarkdown(a,o,n),r=await C.workspace.openTextDocument({content:i,language:"markdown"});await C.window.showTextDocument(r,{preview:!0})}else this._postMessage({type:"toast",message:"Bu yan\u0131ta ait web kayna\u011F\u0131 bulunamad\u0131."})}catch(t){this._postMessage({type:"toast",message:`Kaynaklar a\xE7\u0131lamad\u0131: ${t.message}`})}break}case"deleteSession":{await this._storageService.deleteSession(e.sessionId),this._postMessage({type:"sessionsUpdated",sessions:this._storageService.getSessions(),activeSessionId:this._storageService.getActiveSessionId()}),this._postMessage({type:"toast",message:"Oturum silindi."});break}case"renameSession":{let t=this._storageService.getSession(e.sessionId);t&&(t.title=e.newTitle,await this._storageService.saveSession(t),this._postMessage({type:"sessionsUpdated",sessions:this._storageService.getSessions(),activeSessionId:t.id}));break}case"exportSession":{let t=this._storageService.getSettings(),s=J(t.language,C.env.language);await this._exportSession(e.sessionId,e.format,s);break}case"selectModel":{await this._storageService.setLastSelectedModelId(e.modelId);let t=this._storageService.getSession(e.sessionId);t&&(t.modelId=e.modelId,await this._storageService.saveSession(t));break}case"saveSettings":{let t=await this._storageService.saveSettings(e.settings),s=J(t.language,C.env.language);this._postMessage({type:"settingsUpdated",settings:t,language:s});break}case"saveCustomModel":{await this._storageService.saveCustomModel(e.model);let t=await this._getInstalledOllamaModels();this._postMessage({type:"modelsUpdated",models:this._storageService.getCustomModels(),installedOllamaModels:t}),this._postMessage({type:"toast",message:`"${e.model.name}" modeli kaydedildi.`});break}case"deleteCustomModel":{await this._storageService.deleteCustomModel(e.modelId);let t=await this._getInstalledOllamaModels();this._postMessage({type:"modelsUpdated",models:this._storageService.getCustomModels(),installedOllamaModels:t}),this._postMessage({type:"toast",message:"Model silindi."});break}}}async _sendInitialData(){let e=this._storageService.getSettings(),t=this._storageService.getCustomModels(),s=await this._getInstalledOllamaModels();if(t.length===0&&s.length>0){for(let m of s)await this._storageService.saveCustomModel({id:m.name,name:m.name,baseModel:m.name,numCtx:4096,temperature:.7,isCustom:!1});t=this._storageService.getCustomModels()}let a=this._storageService.getLastSelectedModelId(),o=this._storageService.getSessions(),n=this._storageService.getActiveSessionId();if(o.length===0){let m=this._storageService.createDraftSession("Yeni Sohbet",a);o=[m],n=m.id}else(!n||!o.some(m=>m.id===n))&&(n=o[0].id);let i=process.env.USER||process.env.USERNAME||"Geli\u015Ftirici",r=J(e.language,C.env.language),p=this._storageService.getLastSelectedMode(),l=await v.listFiles(300);this._postMessage({type:"initData",sessions:o,activeSessionId:n,models:t,installedOllamaModels:s,settings:e,username:i,lastSelectedModelId:a,lastSelectedMode:p,lastSelectedWebAccess:this._storageService.getLastSelectedWebAccess(),language:r,workspaceFiles:l})}async _getInstalledOllamaModels(){let e=this._storageService.getSettings();try{return await O.getInstalledModels(e.ollamaUrl)}catch(t){return console.warn("Ollama modelleri y\xFCklenemedi:",t),[]}}async _handleSendMessage(e,t,s,a,o){let n=this._storageService.getSession(e),i=this._storageService.getLastSelectedWebAccess(),r=o!==void 0?!!o:n?.webAccessEnabled!==void 0?!!n.webAccessEnabled:i;if(n)n.webAccessEnabled=r;else{let w=s||this._storageService.getLastSelectedModelId(),L=a||this._storageService.getLastSelectedMode();n={id:e||"session_"+Date.now()+"_"+Math.random().toString(36).substring(2,7),title:"Yeni Sohbet",createdAt:Date.now(),updatedAt:Date.now(),messages:[],modelId:w,mode:L,webAccessEnabled:r},e=n.id}await this._storageService.setLastSelectedWebAccess(r);let p=a||n.mode||this._storageService.getLastSelectedMode()||"chat";n.mode=p,await this._storageService.setLastSelectedMode(p);let l=/(?:^|\s)(?:@|#)(?:\[([^\]]+)\]|"([^"]+)"|'([^']+)'|([a-zA-Z0-9_\-./]+))/g,m=[],u;for(;(u=l.exec(t))!==null;){let w=(u[1]||u[2]||u[3]||u[4]||"").trim();w&&!m.includes(w)&&m.push(w)}let c=[];for(let w of m)try{let L=await v.readFile(w);c.push({path:w,content:L})}catch{}let k={id:"user_"+Date.now(),role:"user",content:t,createdAt:Date.now()};n.messages.length===0&&n.title==="Yeni Sohbet"&&(n.title=t.slice(0,30).trim()+(t.length>30?"...":"")),n.messages.push(k),n.updatedAt=Date.now(),n.modelId=s,await this._storageService.setLastSelectedModelId(s),await this._storageService.saveSession(n),await this._storageService.setActiveSessionId(n.id),this._postMessage({type:"sessionsUpdated",sessions:this._storageService.getSessions(),activeSessionId:n.id});let S=this._storageService.getSettings(),f=this._storageService.getCustomModels().find(w=>w.id===s),x=f?f.baseModel:s,A=f?.systemPrompt||(S.enableSystemPrompt!==!1?S.defaultSystemPrompt:void 0),F=!!n.webAccessEnabled,P=new Date,M={weekday:"long",year:"numeric",month:"long",day:"numeric"},D=P.toLocaleDateString("tr-TR",M),I=P.getFullYear(),j=`[ZAMAN B\u0130LG\u0130S\u0130: Bug\xFCn\xFCn ger\xE7ek d\xFCnya tarihi ${D}, mevcut y\u0131l ${I}. Model e\u011Fitim veri s\u0131n\u0131r\u0131n (cutoff) ge\xE7mi\u015Fte olsa dahi, kullan\u0131c\u0131n\u0131n y\u0131l, tarih, g\xFCn ve g\xFCncellik i\xE7eren sorular\u0131nda bu reel zaman\u0131 (${I}) esas alacaks\u0131n.]
[TEMPORAL CONTEXT: Today is ${D}, current year is ${I}.]`;if(p==="agent"){let w=await v.listFiles(80);A=v.getAgentSystemPrompt(A,w,F)}A&&A.trim()?A=`${j}

${A}`:A=j;let Y=f?.temperature,E=f?.numCtx,$;f?.numPredict!==void 0?$=f.numPredict:S.enableMaxTokens?$=Math.max(4096,S.defaultMaxTokens||4096):$=void 0;let B=await this._getInstalledOllamaModels(),ae=B.find(w=>w.name===x)?.details?.quantization_level||"";n.modelQuantization=ae,await this._storageService.saveSession(n);let R=[];if(F){this._postMessage({type:"webSearching",sessionId:e,searching:!0});try{R=await U.search(t,S)}catch(w){console.warn("Web search failed:",w)}finally{this._postMessage({type:"webSearching",sessionId:e,searching:!1})}}let ie=new AbortController;this._abortControllers.set(e,ie);let oe="",he=n.messages.map((w,L)=>{if(L===n.messages.length-1){let T=w.content;if(c.length>0){let W=c.map(y=>`=== TARGET FILE CONTENT: "${y.path}" ===
${y.content}
=== END OF FILE: "${y.path}" ===`).join(`

`),d=p==="agent"?`[AGENT DIRECTIVE: The user has targeted the file(s) above for editing. Review the code carefully and output exact file actions using <edit_file path="${c[0].path}"> or <write_file path="${c[0].path}"> tags.]`:"[CHAT DIRECTIVE: The user has provided the file(s) above for reference in CHAT mode. Analyze and discuss this code in your conversational response. DO NOT output file modification actions.]";T=`${W}

${d}

User Question/Request:
${w.content}`}return F&&(R.length>0?T=`${U.formatSourcesForPrompt(R,S.webSearchDepth)}

=== KULLANICI SORUSU ===
${T}`:T=`[\u0130NTERNET ER\u0130\u015E\u0130M\u0130 AKT\u0130F - ZAMAN B\u0130LG\u0130S\u0130: Bug\xFCn\xFCn tarihi ${D}, mevcut y\u0131l ${I}.]

${T}`),{role:w.role,content:T}}return{role:w.role,content:w.content}});await O.streamChat({baseUrl:S.ollamaUrl,model:x,messages:he,systemPrompt:A,temperature:Y,numCtx:E,numPredict:$,signal:ie.signal,onChunk:w=>{oe+=w,this._postMessage({type:"streamChunk",sessionId:e,chunk:w,fullText:oe})},onDone:async(w,L)=>{this._abortControllers.delete(e);let T=p==="agent"?v.parseAgentActions(L):[];if(T.length>0)for(let d of T)try{let y=await H.auditAction(d,S,B);d.securityAudit=y}catch(y){console.warn("Prosecutor audit failed:",y)}for(let d of T)if(!d.securityAudit?.blocked)try{if(d.type==="write"&&d.content!==void 0){let y=await v.writeFile(d.path,d.content);d.originalContent=y.originalContent,d.wasCreated=y.wasCreated,d.status="applied"}else if(d.type==="edit"&&d.search&&d.replace){let y=await v.applySearchReplace(d.path,d.search,d.replace);d.originalContent=y.originalContent,d.wasCreated=!1,d.status="applied"}else if(d.type==="create_dir")await v.createDirectory(d.path),d.status="applied";else if(d.type==="move"&&d.targetPath)await v.movePath(d.path,d.targetPath),d.status="applied";else if(d.type==="read")d.output=await v.readFile(d.path),d.status="executed";else if(d.type==="list_dir"){let y=await v.listDirectory(d.path==="."?"":d.path);d.output=y.map(_=>`${_.isDirectory?"\u{1F4C1}":"\u{1F4C4}"} ${_.name}`).join(`
`)||"(Bo\u015F dizin)",d.status="executed"}else if(d.type==="find_files"&&d.pattern){let y=await v.findFiles(d.pattern);d.output=y.map(_=>`\u{1F4C4} ${_}`).join(`
`)||"(Dosya bulunamad\u0131)",d.status="executed"}else if(d.type==="grep"&&d.query){let y=await v.grepSearch(d.query,d.path==="."?"":d.path,d.isRegex);d.output=y.map(_=>`${_.file}:${_.line}: ${_.content}`).join(`
`)||"(E\u015Fle\u015Fme bulunamad\u0131)",d.status="executed"}else if(d.type==="command"&&d.command){let y=await v.executeCommand(d.command);d.output=y.stdout+(y.stderr?`
[STDERR]
${y.stderr}`:""),d.status=y.exitCode===0?"executed":"failed"}else if(d.type==="web_search"&&d.query)try{let y=await U.search(d.query,S);if(y.length>0){for(let _ of y)R.some(fe=>fe.url===_.url)||R.push(_);d.output=y.map(_=>`[${_.title}](${_.url})
${_.snippet}`).join(`

`),d.status="executed"}else d.output="Arama sonucu bulunamad\u0131.",d.status="executed"}catch(y){d.output=`Web aramas\u0131 ba\u015Far\u0131s\u0131z: ${y.message}`,d.status="failed"}}catch(y){console.warn("Auto apply failed for action:",d,y),d.status="failed",d.output=`Hata: ${y.message}`}let W={id:"asst_"+Date.now(),role:"assistant",content:L,createdAt:Date.now(),stats:w,modelName:x,modelQuantization:ae,actions:T.length>0?T:void 0,webSources:R.length>0?R:void 0};n.messages.push(W),n.updatedAt=Date.now(),await this._storageService.saveSession(n),this._postMessage({type:"streamDone",sessionId:e,stats:w,message:W})},onError:w=>{this._abortControllers.delete(e),this._postMessage({type:"streamError",sessionId:e,error:w.message})}})}async _exportSession(e,t,s){let a=this._storageService.getSession(e);if(!a)return;let o=t==="markdown"?this._storageService.exportSessionAsMarkdown(e,s):this._storageService.exportSessionAsJson(e),n=await C.workspace.openTextDocument({content:o,language:t==="markdown"?"markdown":"json"});await C.window.showTextDocument(n);let i=Z(s);this._postMessage({type:"toast",message:`${a.title} (${t.toUpperCase()}) ${i.common.copied.toLowerCase()}`})}_buildBlackboxMarkdown(e,t){let s=t.stats,a=((s?.totalDurationMs||0)/1e3).toFixed(2),o=(s?.tokensPerSecond||0).toFixed(1),n=s?.evalCount||0,i=s?.promptEvalCount||0,r=s?.loadDurationMs||0,p=s?.promptEvalDurationMs||0,l=s?.evalDurationMs||0,m=new Date(t.createdAt).toLocaleString(),u="_(Herhangi bir ara\xE7 veya eylem y\xFCr\xFCt\xFClmedi)_";return t.actions&&t.actions.length>0&&(u=t.actions.map((c,k)=>{let S=c.securityAudit?`Risk: **${c.securityAudit.risk.toUpperCase()}** | G\xFCvenli: **${c.securityAudit.isSafe?"Evet":"Hay\u0131r"}**${c.securityAudit.blocked?" \u{1F6AB} **(ENGELLEND\u0130)**":""}
> Gerek\xE7e: ${c.securityAudit.reason}`:"Denetim bilgisi yok",h=c.output?`
**Sonu\xE7 / \xC7\u0131kt\u0131:**
\`\`\`
${c.output}
\`\`\``:"",f="";return c.type==="command"?f=`Komut: \`${c.command}\``:c.type==="move"?f=`Kaynak: \`${c.path}\` \u279C Hedef: \`${c.targetPath}\``:c.type==="grep"?f=`Sorgu: "${c.query}" (Dizin: \`${c.path}\`)`:c.type==="find_files"?f=`Desen: "${c.pattern}"`:f=`Hedef Dosya/Klas\xF6r: \`${c.path}\``,`### ${k+1}. [${c.type.toUpperCase()}] Durum: \`${c.status}\`
- **Ayr\u0131nt\u0131:** ${f}
- **Savc\u0131 Denetimi:**
> ${S}
${h}`}).join(`

---

`)),`# \u{1F4E6} Yan\u0131t Kara Kutusu (Black Box Log)

## \u2139\uFE0F Genel Bilgiler
- **Mesaj ID:** \`${t.id}\`
- **Tarih & Saat:** ${m}
- **Oturum Ba\u015Fl\u0131\u011F\u0131:** ${e.title}
- **Kullan\u0131lan Model:** \`${t.modelName||"Varsay\u0131lan"}\`
- **Kuantizasyon D\xFCzeyi:** \`${t.modelQuantization||"-"}\`
- **G\xF6rev Modu:** \`${e.mode||"chat"}\`

---

## \u26A1 Token ve Performans Metrikleri
| Metrik | De\u011Fer |
| :--- | :--- |
| **\xDCretim H\u0131z\u0131 (Tokens/sec)** | \`${o} tok/s\` |
| **Toplam Yan\u0131t S\xFCresi** | \`${a}s\` (\`${s?.totalDurationMs||0} ms\`) |
| **\xDCretilen Token Say\u0131s\u0131 (eval_count)** | \`${n}\` |
| **Prompt Token Say\u0131s\u0131 (prompt_eval_count)** | \`${i}\` |
| **Model Y\xFCkleme S\xFCresi (load_duration)** | \`${r} ms\` |
| **Prompt De\u011Ferlendirme S\xFCresi** | \`${p} ms\` |
| **\xDCretim De\u011Ferlendirme S\xFCresi** | \`${l} ms\` |

---

## \u{1F6E0}\uFE0F Y\xFCr\xFCt\xFClen Sistem Ara\xE7lar\u0131 ve Eylemler (Agent Actions)
${u}

---

## \u{1F4DC} Ham Yan\u0131t \u0130\xE7eri\u011Fi (Raw Response Content)
\`\`\`markdown
${t.content}
\`\`\`
`}_postMessage(e){this._view?.webview.postMessage(e)}_getHtmlForWebview(e){let t=e.asWebviewUri(C.Uri.joinPath(this._extensionUri,"dist","webview.js"));return`<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${e.asWebviewUri(C.Uri.joinPath(this._extensionUri,"dist","webview.css"))}" rel="stylesheet">
    <title>OllamaChat</title>
</head>
<body>
    <!-- Top Header -->
    <header class="app-header">
        <button class="session-selector-btn" id="sessionSelectorBtn" title="Oturumlar\u0131 Listele">
            <span class="session-title" id="sessionTitle">Yeni Sohbet</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </button>

        <div class="header-actions">
            <button class="icon-btn" id="newSessionBtn" title="Yeni Sohbet">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
            <button class="icon-btn" id="settingsBtn" title="Ayarlar">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
            </button>
        </div>
    </header>

    <!-- Sessions Dropdown -->
    <div class="dropdown-menu" id="sessionDropdown">
        <div class="dropdown-search">
            <input type="text" id="sessionSearchInput" placeholder="Oturumlarda ara..." autocomplete="off">
        </div>
        <div class="dropdown-list" id="sessionList"></div>
    </div>

    <!-- Models Dropdown -->
    <div class="dropdown-menu" id="modelDropdown" style="top: auto; bottom: 65px;">
        <div class="dropdown-search">
            <input type="text" id="modelSearchInput" placeholder="Model ara..." autocomplete="off">
        </div>
        <div class="dropdown-list" id="modelList"></div>
    </div>

    <!-- Mode / Task Dropdown -->
    <div class="dropdown-menu" id="modeDropdown" style="top: auto; bottom: 65px; width: 240px;">
        <div class="dropdown-list" id="modeList"></div>
    </div>

    <!-- Drag & Drop Overlay -->
    <div class="drag-drop-overlay" id="dragDropOverlay">
        <div class="drag-drop-modal">
            <span class="drag-drop-icon">\u{1F4C2}</span>
            <span class="drag-drop-text" id="dragDropText">Dosyay\u0131 buraya b\u0131rak\u0131n (@dosya olarak hedefler)</span>
        </div>
    </div>

    <!-- Main Chat Messages / Welcome Hero -->
    <main class="chat-container" id="chatContainer"></main>

    <!-- Bottom Chat Input (3 Rows Qwen Code Design) -->
    <div class="chat-input-wrapper" id="chatInputWrapper">
        <!-- Autocomplete Suggestions Popup for @ and # -->
        <div class="mention-autocomplete" id="mentionAutocomplete"></div>

        <div class="chat-input-card">
            <!-- Row 1 & 2: Textarea (Expands from 2 lines up to 4 text lines, scrolls after) -->
            <textarea
                class="chat-textarea"
                id="chatTextarea"
                rows="2"
                placeholder="Bir soru sorun veya kod isteyin... (Enter ile g\xF6nder, Shift+Enter alt sat\u0131r)"
            ></textarea>

            <!-- Row 3: Options Toolbar -->
            <div class="chat-input-toolbar">
                <div class="toolbar-left">
                    <button class="model-badge-btn" id="modelBadgeBtn">
                        <span class="model-badge-name" id="modelBadgeName">Model Se\xE7</span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>

                    <button class="mode-badge-btn" id="modeBadgeBtn" title="G\xF6rev / Mod Se\xE7">
                        <span class="mode-badge-icon" id="modeBadgeIcon">\u{1F4AC}</span>
                        <span class="mode-badge-name" id="modeBadgeName">Chat</span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>

                    <button class="web-access-btn" id="webAccessBtn" title="\u0130nternet Eri\u015Fimi (A\xE7\u0131k/Kapal\u0131)">
                        <span class="web-access-icon">\u{1F310}</span>
                        <span class="web-access-label" id="webAccessLabel">Web</span>
                    </button>
                </div>

                <div class="toolbar-right" style="position: relative;">
                    <button class="token-stat-badge" id="tokenStatBadge">
                        <span>\u26A1 KVCache</span>
                    </button>

                    <!-- KVCache Popover Tooltip -->
                    <div class="kvcache-popover" id="kvCachePopover">
                        <div class="kvcache-popover-title">Ba\u011Flam & KV-Cache</div>
                        <div class="kvcache-detail-row">
                            <span>Model:</span>
                            <strong id="kvModelName">-</strong>
                        </div>
                        <div class="kvcache-detail-row">
                            <span>Context (num_ctx):</span>
                            <strong id="kvCtxSize">-</strong>
                        </div>
                        <div class="kvcache-detail-row">
                            <span>S\u0131cakl\u0131k:</span>
                            <strong id="kvTemperature">-</strong>
                        </div>
                        <div class="kvcache-detail-row">
                            <span>Son Yan\u0131t H\u0131z\u0131:</span>
                            <strong id="kvSpeed">-</strong>
                        </div>
                    </div>

                    <button class="send-btn" id="sendBtn" title="G\xF6nder (Enter)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Settings Modal -->
    <div class="modal-overlay" id="settingsModal">
        <div class="modal-card">
            <div class="modal-header">
                <span class="modal-title">Ayarlar</span>
                <button class="icon-btn" id="closeSettingsBtn">\u2715</button>
            </div>
            <div class="modal-tabs">
                <button class="tab-btn active" data-tab="tabSessions">Oturumlar</button>
                <button class="tab-btn" data-tab="tabModels">Modeller</button>
                <button class="tab-btn" data-tab="tabSettings">Eklenti Ayarlar\u0131</button>
            </div>
            <div class="modal-body">
                <!-- Tab 1: Oturumlar -->
                <div class="tab-pane active" id="tabSessions">
                    <p class="form-hint">Kay\u0131tl\u0131 oturumlar\u0131 d\u0131\u015Fa aktarabilir veya silebilirsiniz.</p>
                    <div id="settingsSessionList" style="display: flex; flex-direction: column; gap: 6px;"></div>
                </div>

                <!-- Tab 2: Modeller -->
                <div class="tab-pane" id="tabModels">
                    <div style="display: flex; justify-content: space-between; align-items: center; position: relative;">
                        <span class="form-label">T\xFCm Modeller (Ollama & \xD6zel)</span>
                        <div style="position: relative;">
                            <button class="btn-primary" id="addModelBtn">+ Ekle \u25BE</button>
                            <div class="dropdown-menu" id="addModelMenu" style="top: 32px; right: 0; left: auto; width: 170px;">
                                <div class="dropdown-item" id="importFromOllamaBtn">Ollama'dan aktar</div>
                                <div class="dropdown-item" id="createNewModelBtn">Kopya model olu\u015Ftur</div>
                            </div>
                        </div>
                    </div>

                    <div id="settingsModelList" style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px;"></div>
                </div>

                <!-- Tab 3: Eklenti Ayarlar\u0131 -->
                <div class="tab-pane" id="tabSettings">
                    <div class="form-group">
                        <label class="form-label" id="settingLanguageLabel">Dil Se\xE7imi / Language</label>
                        <select class="form-select" id="settingLanguage">
                            <option value="auto">Otomatik (VS Code Dili) / Auto</option>
                            <option value="en">English</option>
                            <option value="tr">T\xFCrk\xE7e</option>
                        </select>
                        <span class="form-hint" id="settingLanguageHint">Aray\xFCz dilini belirleyin veya VS Code diline otomatik e\u015Fitleyin.</span>
                    </div>

                    <div class="form-group">
                        <label class="form-label" id="settingOllamaUrlLabel">Ollama API URL</label>
                        <input class="form-input" id="settingOllamaUrl" placeholder="http://127.0.0.1:11434">
                        <span class="form-hint" id="settingOllamaUrlHint">Ollama yerel sunucu ba\u011Flant\u0131 noktas\u0131.</span>
                    </div>

                    <div class="form-group">
                        <div class="toggle-row">
                            <label class="form-label" id="settingPromptLabel" style="margin-bottom: 0;">Genel Sistem Promptu</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="settingEnablePromptToggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div id="settingPromptContainer" class="setting-collapsible">
                            <textarea class="form-textarea" id="settingDefaultPrompt" placeholder="Varsay\u0131lan asistan sistem promptu..."></textarea>
                            <span class="form-hint" id="settingPromptHint">\xD6zel promptu bulunmayan t\xFCm modeller i\xE7in ge\xE7erli temel rol talimatlar\u0131.</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="toggle-row">
                            <label class="form-label" id="settingTokensLabel" style="margin-bottom: 0;">Maksimum Token S\u0131n\u0131r\u0131 (num_predict)</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="settingEnableTokensToggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div id="settingTokensContainer" class="setting-collapsible">
                            <input type="number" class="form-input" id="settingMaxTokens" value="4096" min="4096" step="512">
                            <span class="form-hint" id="settingTokensHint">Kapal\u0131yken \xFCretim s\u0131n\u0131rs\u0131zd\u0131r. A\xE7\u0131kken s\u0131n\u0131r minimum 4096 tokendir.</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="toggle-row">
                            <label class="form-label" id="settingAutoApplyLabel" style="margin-bottom: 0;">Agent Dosya G\xFCncellemelerini Otomatik Uygula</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="settingAutoApplyToggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <span class="form-hint" id="settingAutoApplyHint">Etkinle\u015Ftirildi\u011Finde, Agent modunda dosya de\u011Fi\u015Fiklikleri onay beklemeden do\u011Frudan kaydedilir.</span>
                    </div>

                    <!-- Granular Permissions -->
                    <div class="form-group" style="border-top: 1px solid var(--vscode-widget-border, #333); padding-top: 12px; margin-top: 12px;">
                        <label class="form-label" id="settingPermissionsTitle" style="font-weight: 600;">Otomatik \u0130zinler (Agent Modu)</label>
                        
                        <div class="toggle-row" style="margin-top: 8px;">
                            <label class="form-label" id="settingAutoFileEditsLabel" style="margin-bottom: 0;">Mevcut Dosya D\xFCzenlemelerine Otomatik \u0130zin Ver</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="settingAutoFileEditsToggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <span class="form-hint" id="settingAutoFileEditsHint">Varolan dosyalardaki search/replace veya write i\u015Flemlerine izin verir.</span>

                        <div class="toggle-row" style="margin-top: 8px;">
                            <label class="form-label" id="settingAutoFileCreateLabel" style="margin-bottom: 0;">Yeni Dosya Olu\u015Fturmaya Otomatik \u0130zin Ver</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="settingAutoFileCreateToggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <span class="form-hint" id="settingAutoFileCreateHint">Projeye yeni dosya eklenmesine otomatik onay verir.</span>

                        <div class="toggle-row" style="margin-top: 8px;">
                            <label class="form-label" id="settingAutoFolderCreateLabel" style="margin-bottom: 0;">Yeni Klas\xF6r Olu\u015Fturmaya Otomatik \u0130zin Ver</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="settingAutoFolderCreateToggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <span class="form-hint" id="settingAutoFolderCreateHint">Yeni alt klas\xF6rler olu\u015Fturulmas\u0131na izin verir.</span>
                    </div>

                    <!-- Prosecutor (Savc\u0131) Security Guard -->
                    <div class="form-group" style="border-top: 1px solid var(--vscode-widget-border, #333); padding-top: 12px; margin-top: 12px;">
                        <label class="form-label" id="settingProsecutorTitle" style="font-weight: 600;">Savc\u0131 G\xFCvenlik Denet\xE7isi (Guard Model)</label>
                        
                        <div class="toggle-row" style="margin-top: 8px;">
                            <label class="form-label" id="settingEnableProsecutorLabel" style="margin-bottom: 0;">Savc\u0131 Denet\xE7isini Etkinle\u015Ftir</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="settingEnableProsecutorToggle">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <span class="form-hint" id="settingEnableProsecutorHint">Y\u0131k\u0131c\u0131 komutlar\u0131 (rm -rf, sudo vb.) ve hassas dosya eri\u015Fimlerini otomatik engeller.</span>

                        <div id="settingProsecutorContainer" class="setting-collapsible" style="margin-top: 8px;">
                            <label class="form-label" id="settingProsecutorModelLabel">Savc\u0131 Modeli (Hafif LLM / 1.5B)</label>
                            <select class="form-select" id="settingProsecutorModel">
                                <option value="auto">Otomatik (1.5B / En Hafif Model)</option>
                            </select>
                            <span class="form-hint" id="settingProsecutorModelHint">Her eylemi an\u0131nda sorgulay\u0131p onaylayan hafif Ollama modeli.</span>
                        </div>
                    </div>

                    <!-- Web Search Settings -->
                    <div class="form-group" style="border-top: 1px solid var(--vscode-widget-border, #333); padding-top: 12px; margin-top: 12px;">
                        <label class="form-label" id="settingWebSearchTitle" style="font-weight: 600;">Web Arama ve \u0130nternet Eri\u015Fimi Ayarlar\u0131</label>

                        <div class="form-group" style="margin-top: 8px;">
                            <label class="form-label" id="settingWebEngineLabel">Arama Motoru</label>
                            <select class="form-select" id="settingWebEngine">
                                <option value="duckduckgo">DuckDuckGo</option>
                                <option value="searxng">SearXNG (Yerel/A\xE7\u0131k)</option>
                            </select>
                        </div>

                        <div class="form-group" style="margin-top: 8px;">
                            <label class="form-label" id="settingWebDepthLabel">Arama ve Analiz Derinli\u011Fi</label>
                            <select class="form-select" id="settingWebDepth">
                                <option value="fast">H\u0131zl\u0131 (Yaln\u0131zca Arama Sonu\xE7 Ba\u015Fl\u0131klar\u0131 ve \xD6zetleri)</option>
                                <option value="standard">Standart (Sayfa \u0130\xE7erikleri Analiz Edilir)</option>
                                <option value="deep">Derin (Her Sayfa Detayl\u0131 \u0130ncelenir ve \xD6zetlenir)</option>
                            </select>
                        </div>

                        <div class="form-group" style="margin-top: 8px;">
                            <label class="form-label" id="settingWebMaxResultsLabel">Maksimum Kaynak Say\u0131s\u0131 (1-10)</label>
                            <input type="number" class="form-input" id="settingWebMaxResults" min="1" max="10" value="5">
                        </div>

                        <div class="form-group" style="margin-top: 8px;">
                            <label class="form-label" id="settingWebBlacklistLabel">Kara Liste (Blacklist - Virg\xFClle Ayr\u0131lm\u0131\u015F Alan Adlar\u0131)</label>
                            <input class="form-input" id="settingWebBlacklist" placeholder="ornek.com, spam-site.net">
                            <span class="form-hint" id="settingWebBlacklistHint">Bu alan adlar\u0131 arama sonu\xE7lar\u0131ndan filtrelenir ve sayfalar\u0131na girilmez.</span>
                        </div>

                        <div class="form-group" style="margin-top: 8px;">
                            <label class="form-label" id="settingWebWhitelistLabel">Beyaz Liste (Whitelist - \u0130ste\u011Fe Ba\u011Fl\u0131 Alan Adlar\u0131)</label>
                            <input class="form-input" id="settingWebWhitelist" placeholder="github.com, stackoverflow.com">
                            <span class="form-hint" id="settingWebWhitelistHint">Doldurulursa, sadece bu alan adlar\u0131ndaki sonu\xE7lar kullan\u0131l\u0131r.</span>
                        </div>
                    </div>

                    <div style="margin-top: 14px;">
                        <button class="btn-primary" id="saveSettingsBtn">Ayarlar\u0131 Kaydet</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Model Edit / Create Pop-up Modal -->
    <div class="modal-overlay" id="modelEditorModal">
        <div class="modal-card" style="max-height: 520px; max-width: 460px;">
            <div class="modal-header">
                <span class="modal-title" id="modelEditorTitle">Model Profili D\xFCzenle</span>
                <button class="icon-btn" id="closeModelEditorBtn">\u2715</button>
            </div>
            <div class="modal-body" style="display: flex; flex-direction: column; gap: 12px;">
                <div class="form-group">
                    <label class="form-label" id="editorModelNameLabel">G\xF6r\xFCnen Ad</label>
                    <input class="form-input" id="editorModelName" placeholder="\xD6rn: Qwen Kod Asistan\u0131">
                </div>
                <div class="form-group">
                    <label class="form-label" id="editorBaseModelLabel">Taban Ollama Modeli</label>
                    <select class="form-select" id="editorBaseModel"></select>
                </div>
                <div class="form-group">
                    <label class="form-label" id="editorSystemPromptLabel">\xD6zel Sistem Promptu</label>
                    <textarea class="form-textarea" id="editorSystemPrompt" placeholder="Bu modele \xF6zg\xFC rol ve talimatlar..."></textarea>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div class="form-group">
                        <label class="form-label" id="editorNumCtxLabel">KV-Cache / Context (num_ctx)</label>
                        <input type="number" class="form-input" id="editorNumCtx" value="4096" step="1024">
                    </div>
                    <div class="form-group">
                        <label class="form-label" id="editorTemperatureLabel">S\u0131cakl\u0131k (Temperature)</label>
                        <input type="number" class="form-input" id="editorTemperature" value="0.7" step="0.1" min="0" max="2">
                    </div>
                </div>
                <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px;">
                    <button class="btn-secondary" id="cancelModelEditorBtn">\u0130ptal</button>
                    <button class="btn-primary" id="saveModelEditorBtn">Kaydet</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Ollama'dan Aktar Pop-up Modal -->
    <div class="modal-overlay" id="ollamaImportModal">
        <div class="modal-card" style="max-height: 520px; max-width: 480px;">
            <div class="modal-header">
                <span class="modal-title" id="ollamaImportModalTitle">Ollama'dan Model Aktar</span>
                <button class="icon-btn" id="closeOllamaImportBtn">\u2715</button>
            </div>
            <div class="modal-body">
                <p class="form-hint" id="ollamaImportModalHint" style="margin-bottom: 10px;">Cihaz\u0131n\u0131zda kurulu Ollama modelleri listeleniyor. Direkt aktarabilir veya parametrelerini d\xFCzenleyebilirsiniz:</p>
                <div id="ollamaImportList" style="display: flex; flex-direction: column; gap: 6px;"></div>
            </div>
        </div>
    </div>

    <!-- Toast Notification -->
    <div class="toast-msg" id="toast"></div>

    <script src="${t}"></script>
</body>
</html>`}};var ee="ollamachat.sessions",ue="ollamachat.activeSessionId",Q="ollamachat.lastSelectedModelId",pe="ollamachat.lastSelectedMode",te="ollamachat.customModels",me="ollamachat.settings",ge="ollamachat.lastSelectedWebAccess",Ae={ollamaUrl:"http://127.0.0.1:11434",defaultSystemPrompt:"You are a helpful, accurate, and concise AI coding assistant in Visual Studio Code.",enableSystemPrompt:!0,defaultMaxTokens:4096,enableMaxTokens:!1,language:"auto",autoApplyAgentEdits:!1,autoAllowFileEdits:!1,autoAllowFileCreate:!1,autoAllowFolderCreate:!1,enableProsecutor:!0,prosecutorModelId:"auto",webSearchEngine:"duckduckgo",webSearchDepth:"standard",webSearchMaxResults:5,webSearchBlacklist:"",webSearchWhitelist:""},X=class{constructor(e){this.context=e}context;getSettings(){let e=this.context.globalState.get(me);return{...Ae,...e||{}}}async saveSettings(e){let s={...this.getSettings(),...e};return await this.context.globalState.update(me,s),s}getLastSelectedModelId(){let e=this.context.globalState.get(Q),t=this.getCustomModels();return t.length>0?e&&t.some(s=>s.id===e)?e:t[0].id:e}async setLastSelectedModelId(e){e&&await this.context.globalState.update(Q,e)}getLastSelectedMode(){return this.context.globalState.get(pe,"chat")}async setLastSelectedMode(e){e&&await this.context.globalState.update(pe,e)}getLastSelectedWebAccess(){return this.context.globalState.get(ge,!1)}async setLastSelectedWebAccess(e){await this.context.globalState.update(ge,!!e)}getSessions(){return this.context.globalState.get(ee,[]).filter(s=>s.messages&&s.messages.length>0).sort((s,a)=>a.updatedAt-s.updatedAt)}getSession(e){return this.getSessions().find(s=>s.id===e)}async saveSession(e){let t=this.getSessions(),s=t.findIndex(a=>a.id===e.id);e.messages&&e.messages.length>0?s>=0?t[s]=e:t.unshift(e):s>=0&&t.splice(s,1),await this.context.globalState.update(ee,t),e.modelId&&await this.setLastSelectedModelId(e.modelId),e.mode&&await this.setLastSelectedMode(e.mode),e.webAccessEnabled!==void 0&&await this.setLastSelectedWebAccess(e.webAccessEnabled)}createDraftSession(e,t,s){let a=Date.now(),o=t||this.getLastSelectedModelId()||this.getSettings().defaultModelId,n=s||this.getLastSelectedMode(),i=this.getLastSelectedWebAccess();return{id:"session_"+a+"_"+Math.random().toString(36).substring(2,7),title:e||"Yeni Sohbet",createdAt:a,updatedAt:a,messages:[],modelId:o,mode:n,webAccessEnabled:i}}async createSession(e,t,s){let a=this.createDraftSession(e,t,s);return await this.setActiveSessionId(a.id),a}async deleteSession(e){let t=this.getSessions().filter(s=>s.id!==e);if(await this.context.globalState.update(ee,t),this.getActiveSessionId()===e){let s=t[0];await this.setActiveSessionId(s?s.id:"")}}getActiveSessionId(){return this.context.globalState.get(ue,"")}async setActiveSessionId(e){await this.context.globalState.update(ue,e)}exportSessionAsMarkdown(e,t){let s=this.getSession(e);if(!s)return"";let a=Z(t),o=new Date(s.createdAt).toLocaleString(),n=s.modelId||a.common.default,i=s.modelQuantization?` (${s.modelQuantization})`:"",r=`# ${s.title}

*${a.export.createdDate} ${o}*
*${a.export.model} ${n}${i}*

---

`;for(let p of s.messages){let l=p.role==="user"?`${a.export.user}`:`${a.export.assistant}`,m=new Date(p.createdAt).toLocaleTimeString();r+=`### ${l} (${m})

${p.content}

`;let u=[];p.modelName&&u.push(`${a.export.model} ${p.modelName}`),p.modelQuantization&&u.push(`${a.export.quantization} ${p.modelQuantization}`),p.stats?.tokensPerSecond&&u.push(`${a.chat.speed}: ${p.stats.tokensPerSecond.toFixed(1)} ${a.chat.tokenPerSec}`),p.stats?.totalDurationMs&&u.push(`${a.chat.duration}: ${((p.stats.totalDurationMs||0)/1e3).toFixed(1)}s`),u.length>0&&(r+=`> \u2139\uFE0F *${u.join(" | ")}*

`),r+=`---

`}return r}exportSessionAsJson(e){let t=this.getSession(e);return t?JSON.stringify(t,null,2):"{}"}getCustomModels(){return this.context.globalState.get(te,[])}async saveCustomModel(e){let t=this.getCustomModels(),s=t.findIndex(a=>a.id===e.id);s>=0?t[s]=e:t.push(e),await this.context.globalState.update(te,t)}async deleteCustomModel(e){let t=this.getCustomModels().filter(a=>a.id!==e);await this.context.globalState.update(te,t),this.context.globalState.get(Q)===e&&await this.context.globalState.update(Q,t[0]?t[0].id:"")}};function Me(g){v.register(g);let e=new X(g),t=new G(g.extensionUri,e);g.subscriptions.push(z.window.registerWebviewViewProvider(G.viewType,t,{webviewOptions:{retainContextWhenHidden:!0}}));let s=z.commands.registerCommand("ollamachat.newChat",async()=>{await e.createSession("Yeni Sohbet"),await z.commands.executeCommand("ollamachat.chatView.focus")}),a=z.commands.registerCommand("ollamachat.openSettings",async()=>{await z.commands.executeCommand("ollamachat.chatView.focus")});g.subscriptions.push(s,a)}function _e(){}0&&(module.exports={activate,deactivate});
