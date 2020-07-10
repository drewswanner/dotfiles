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
const editContent_1 = require("./editContent");
const utils_1 = require("../shared/utils");
const path = require("path");
const fs = require("fs");
function startEdit(context, fileurl) {
    return __awaiter(this, void 0, void 0, function* () {
        vscode_1.workspace.openTextDocument(fileurl).then(document => {
            let fileContent = document.getText().replace(/(?:\r\n|\r|\n)/g, " ");
            fileContent = fileContent.replace(/\\([\s\S])|(")/g, "\\$1$2");
            let editState = {
                uri: fileurl,
                content: fileContent
            };
            let folderPath = path.dirname(fileurl.fsPath) + path.sep;
            if (folderPath) {
                editState.processdirpath = folderPath;
            }
            // get the process id out of the xml
            let processidregex = /bpmn2:process id="(.*?)"\s/gm;
            let processidmatches = processidregex.exec(document.getText());
            if (processidmatches !== null) {
                editState.processid = processidmatches[1];
            }
            createEditPanel(context, editState);
        });
    });
}
exports.startEdit = startEdit;
function createEditPanel(context, editState) {
    return __awaiter(this, void 0, void 0, function* () {
        const editPanel = vscode_1.window.createWebviewPanel("processEdit", `Edit Process - ${editState.uri.path.replace(/^.*[\\\/]/, "")}`, vscode_1.ViewColumn.One, {
            enableScripts: true
        });
        editPanel.onDidDispose(() => {
            // panel cleanup code here...
        }, null, context.subscriptions);
        const media = utils_1.getMedia(context);
        editPanel.webview.html = editContent_1.getEditContent(context, editState, media);
        editPanel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case "info":
                    vscode_1.window.showInformationMessage(message.text);
                    return;
                case "alert":
                    vscode_1.window.showErrorMessage(message.text);
                    return;
                case "savesvg":
                    // start at <svg .../>
                    var svgStart = message.svg.indexOf("<svg");
                    let modifiedSvg = message.svg.substr(svgStart);
                    fs.writeFile(message.filename, modifiedSvg, function (err) {
                        if (err) {
                            vscode_1.window.showErrorMessage("Unable to save svg to file: " + err);
                        }
                        else {
                            vscode_1.window.showInformationMessage("Successfully saved process svg to file");
                        }
                    });
                    return;
            }
        }, undefined, context.subscriptions);
    });
}
//# sourceMappingURL=startEdit.js.map