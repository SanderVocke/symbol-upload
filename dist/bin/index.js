#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_api_client_1 = require("@bugsplat/js-api-client");
const command_line_args_1 = __importDefault(require("command-line-args"));
const command_line_usage_1 = __importDefault(require("command-line-usage"));
const promises_1 = require("node:fs/promises");
const upload_1 = require("../src/upload");
const command_line_definitions_1 = require("./command-line-definitions");
const tmp_1 = require("../src/tmp");
const node_fs_1 = require("node:fs");
(async () => {
    let { help, database, application, version, user, password, clientId, clientSecret, remove, files, directory, } = await getCommandLineOptions(command_line_definitions_1.argDefinitions);
    if (help) {
        logHelpAndExit();
    }
    database = database ?? process.env.BUGSPLAT_DATABASE;
    user = user ?? process.env.SYMBOL_UPLOAD_USER;
    password = password ?? process.env.SYMBOL_UPLOAD_PASSWORD;
    clientId = clientId ?? process.env.SYMBOL_UPLOAD_CLIENT_ID;
    clientSecret = clientSecret ?? process.env.SYMBOL_UPLOAD_CLIENT_SECRET;
    if (!database) {
        logMissingArgAndExit('database');
    }
    if (!application) {
        logMissingArgAndExit('application');
    }
    if (!version) {
        logMissingArgAndExit('version');
    }
    if (!validAuthenticationArguments({
        user,
        password,
        clientId,
        clientSecret
    })) {
        logMissingAuthAndExit();
    }
    console.log('About to authenticate...');
    const bugsplat = await createBugSplatClient({
        user,
        password,
        clientId,
        clientSecret
    });
    console.log('Authentication success!');
    if (remove) {
        try {
            const versionsApiClient = new js_api_client_1.VersionsApiClient(bugsplat);
            console.log(`About to delete symbols for ${database}-${application}-${version}...`);
            await versionsApiClient.deleteSymbols(database, application, version);
            console.log('Symbols deleted successfully!');
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
        finally {
            return;
        }
    }
    directory = normalizeDirectory(directory);
    if (!node_fs_1.existsSync(tmp_1.tmpDir)) {
        await promises_1.mkdir(tmp_1.tmpDir);
    }
    await upload_1.uploadSymbolFiles(bugsplat, database, application, version, directory, files);
    process.exit(0);
})().catch((error) => {
    console.error(error.message);
    process.exit(1);
}).finally(async () => {
    await tmp_1.safeRemoveTmp();
});
async function createBugSplatClient({ user, password, clientId, clientSecret }) {
    const host = process.env.BUGSPLAT_HOST;
    if (user && password) {
        return js_api_client_1.BugSplatApiClient.createAuthenticatedClientForNode(user, password, host);
    }
    return js_api_client_1.OAuthClientCredentialsClient.createAuthenticatedClient(clientId, clientSecret, host);
}
async function fileExists(path) {
    try {
        return !!(await promises_1.stat(path));
    }
    catch {
        return false;
    }
}
async function getCommandLineOptions(argDefinitions) {
    const options = command_line_args_1.default(argDefinitions);
    let { application, version } = options;
    let packageJson;
    if (!application || !version) {
        const packageJsonPath = './package.json';
        packageJson = await fileExists(packageJsonPath) ? JSON.parse((await promises_1.readFile(packageJsonPath)).toString()) : null;
    }
    if (!application && packageJson) {
        application = packageJson.name;
    }
    if (!version && packageJson) {
        version = packageJson.version;
    }
    return {
        ...options,
        application,
        version
    };
}
function logHelpAndExit() {
    const help = command_line_usage_1.default(command_line_definitions_1.usageDefinitions);
    console.log(help);
    process.exit(1);
}
function logMissingArgAndExit(arg) {
    console.log(`\nMissing argument: -${arg}\n`);
    process.exit(1);
}
function logMissingAuthAndExit() {
    console.log('\nInvalid authentication arguments: please provide either a user and password, or a clientId and clientSecret\n');
    process.exit(1);
}
function normalizeDirectory(directory) {
    return directory.replace(/\\/g, '/');
}
function validAuthenticationArguments({ user, password, clientId, clientSecret }) {
    return !!(user && password) || !!(clientId && clientSecret);
}
//# sourceMappingURL=index.js.map