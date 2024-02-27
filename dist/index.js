"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSymbolFiles = exports.UploadableFile = exports.OAuthClientCredentialsClient = exports.SymbolsApiClient = exports.VersionsApiClient = exports.BugSplatApiClient = void 0;
var js_api_client_1 = require("@bugsplat/js-api-client");
Object.defineProperty(exports, "BugSplatApiClient", { enumerable: true, get: function () { return js_api_client_1.BugSplatApiClient; } });
Object.defineProperty(exports, "VersionsApiClient", { enumerable: true, get: function () { return js_api_client_1.VersionsApiClient; } });
Object.defineProperty(exports, "SymbolsApiClient", { enumerable: true, get: function () { return js_api_client_1.SymbolsApiClient; } });
Object.defineProperty(exports, "OAuthClientCredentialsClient", { enumerable: true, get: function () { return js_api_client_1.OAuthClientCredentialsClient; } });
Object.defineProperty(exports, "UploadableFile", { enumerable: true, get: function () { return js_api_client_1.UploadableFile; } });
var upload_1 = require("./src/upload");
Object.defineProperty(exports, "uploadSymbolFiles", { enumerable: true, get: function () { return upload_1.uploadSymbolFiles; } });
//# sourceMappingURL=index.js.map