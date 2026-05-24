"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTemplate = updateTemplate;
var chalk_1 = require("chalk");
var node_child_process_1 = require("node:child_process");
function updateTemplate(templateUrl, ignoredPatterns) {
    var _a;
    if (ignoredPatterns === void 0) { ignoredPatterns = []; }
    var templateName = ((_a = templateUrl.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0]) || 'template';
    var remoteName = "".concat(templateName, "-template");
    var addRemoteCommand = "git remote add ".concat(remoteName, " ").concat(templateUrl);
    var rmRemoteCommand = "git remote remove ".concat(remoteName);
    try {
        (0, node_child_process_1.execSync)(addRemoteCommand);
    }
    catch (error) {
        if (error instanceof Error && error.toString().includes('already exists')) {
            (0, node_child_process_1.execSync)(rmRemoteCommand);
            (0, node_child_process_1.execSync)(addRemoteCommand);
        }
        else {
            throw error;
        }
    }
    (0, node_child_process_1.execSync)("git fetch --all");
    try {
        (0, node_child_process_1.execSync)("git merge takeout-template/main --allow-unrelated-histories");
    }
    catch (error) {
        if (error instanceof Error && error.message.includes('unresolved conflict')) {
            console.info(hanzoguiLog("We've merged the latest changes. Please resolve the conflicts and commit the merge."));
        }
        else {
            throw error;
        }
    }
    (0, node_child_process_1.execSync)("git reset HEAD ".concat(ignoredPatterns.join(' ')));
}
function hanzoguiLog(message) {
    return "".concat(chalk_1.default.green('[Hanzogui]'), " ").concat(message);
}
