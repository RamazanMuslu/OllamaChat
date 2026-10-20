import * as vscode from 'vscode';
import { ChatViewProvider } from './providers/ChatViewProvider';
import { StorageService } from './services/StorageService';
import { AgentService } from './services/AgentService';

export function activate(context: vscode.ExtensionContext) {
    AgentService.register(context);
    const storageService = new StorageService(context);
    const chatViewProvider = new ChatViewProvider(context.extensionUri, storageService);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            ChatViewProvider.viewType,
            chatViewProvider,
            {
                webviewOptions: {
                    retainContextWhenHidden: true,
                },
            }
        )
    );

    const newChatCommand = vscode.commands.registerCommand('ollamachat.newChat', async () => {
        await storageService.createSession('Yeni Sohbet');
        await vscode.commands.executeCommand('ollamachat.chatView.focus');
    });

    const openSettingsCommand = vscode.commands.registerCommand('ollamachat.openSettings', async () => {
        await vscode.commands.executeCommand('ollamachat.chatView.focus');
    });

    context.subscriptions.push(newChatCommand, openSettingsCommand);
}

export function deactivate() {
    // cleanup if needed
}
