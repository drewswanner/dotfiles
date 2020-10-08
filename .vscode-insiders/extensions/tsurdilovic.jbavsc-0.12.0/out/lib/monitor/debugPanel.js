"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const debugContent_1 = require("./content/debugContent");
const path = require("path");
function createDebugPanel(context, appState) {
    return __awaiter(this, void 0, void 0, function* () {
        const createDebugPanel = vscode_1.window.createWebviewPanel("jbpmAppDebugger", `jBPM App Debugger - ${appState.url}`, vscode_1.ViewColumn.One, {
            enableScripts: true
        });
        const media = {
            extlogo: getMediaUri(context, "ext_logo.png"),
            extcss: getMediaUri(context, "ext_style.css")
        };
        createDebugPanel.onDidDispose(() => {
            // panel cleanup code here...
        }, null, context.subscriptions);
        createDebugPanel.webview.html = debugContent_1.getDebugContent(context, appState, media);
        createDebugPanel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case "info":
                    vscode_1.window.showInformationMessage(message.text);
                    return;
                case "alert":
                    vscode_1.window.showErrorMessage(message.text);
                    return;
            }
        }, undefined, context.subscriptions);
    });
}
exports.createDebugPanel = createDebugPanel;
function getMediaUri(context, mediaName) {
    var onDiskPath = vscode_1.Uri.file(path.join(context.extensionPath, "media", mediaName));
    return onDiskPath.with({ scheme: "vscode-resource" }).toString();
}
//# sourceMappingURL=debugPanel.js.map