"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyModuleService = void 0;
var utils_1 = require("@medusajs/framework/utils");
var _models_1 = require("@models");
var crypto_1 = require("crypto");
var util_1 = require("util");
var joiner_config_1 = require("../joiner-config");
var scrypt = util_1.default.promisify(crypto_1.default.scrypt);
var ApiKeyModuleService = function () {
    var _a;
    var _classSuper = (0, utils_1.MedusaService)({ ApiKey: _models_1.ApiKey });
    var _instanceExtraInitializers = [];
    var _deleteApiKeys_decorators;
    var _createApiKeys_decorators;
    var _createApiKeys__decorators;
    var _upsertApiKeys_decorators;
    var _updateApiKeys_decorators;
    var _updateApiKeys__decorators;
    var _retrieveApiKey_decorators;
    var _listApiKeys_decorators;
    var _listAndCountApiKeys_decorators;
    var _revoke_decorators;
    var _revoke__decorators;
    var _authenticate_decorators;
    var _authenticate__decorators;
    return _a = /** @class */ (function (_super) {
            __extends(ApiKeyModuleService, _super);
            function ApiKeyModuleService(_b, moduleDeclaration) {
                var baseRepository = _b.baseRepository, apiKeyService = _b.apiKeyService;
                // @ts-ignore
                var _this = _super.apply(this, arguments) || this;
                _this.moduleDeclaration = (__runInitializers(_this, _instanceExtraInitializers), moduleDeclaration);
                _this.baseRepository_ = baseRepository;
                _this.apiKeyService_ = apiKeyService;
                return _this;
            }
            ApiKeyModuleService.prototype.__joinerConfig = function () {
                return joiner_config_1.joinerConfig;
            };
            ApiKeyModuleService.prototype.deleteApiKeys = function (ids_1) {
                return __awaiter(this, arguments, void 0, function (ids, sharedContext) {
                    var apiKeyIds, unrevokedApiKeys;
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                apiKeyIds = Array.isArray(ids) ? ids : [ids];
                                return [4 /*yield*/, this.apiKeyService_.list({
                                        id: ids,
                                        $or: [
                                            { revoked_at: { $eq: null } },
                                            { revoked_at: { $gt: new Date() } },
                                        ],
                                    }, { select: ["id"] }, sharedContext)];
                            case 1:
                                unrevokedApiKeys = (_b.sent()).map(function (apiKey) { return apiKey.id; });
                                if ((0, utils_1.isPresent)(unrevokedApiKeys)) {
                                    throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_ALLOWED, "Cannot delete api keys that are not revoked - ".concat(unrevokedApiKeys.join(", ")));
                                }
                                return [4 /*yield*/, _super.prototype.deleteApiKeys.call(this, apiKeyIds, sharedContext)];
                            case 2: return [2 /*return*/, _b.sent()];
                        }
                    });
                });
            };
            ApiKeyModuleService.prototype.createApiKeys = function (data_1) {
                return __awaiter(this, arguments, void 0, function (data, sharedContext) {
                    var _b, createdApiKeys, generatedTokens, serializedResponse, responseWithRawToken;
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, this.createApiKeys_(Array.isArray(data) ? data : [data], sharedContext)];
                            case 1:
                                _b = _c.sent(), createdApiKeys = _b[0], generatedTokens = _b[1];
                                return [4 /*yield*/, this.baseRepository_.serialize(createdApiKeys, {
                                        populate: true,
                                    })
                                    // When creating we want to return the raw token, as this will be the only time the user will be able to take note of it for future use.
                                ];
                            case 2:
                                serializedResponse = _c.sent();
                                responseWithRawToken = serializedResponse.map(function (key) {
                                    var _b, _c;
                                    return (__assign(__assign({}, key), { token: (_c = (_b = generatedTokens.find(function (t) { return t.hashedToken === key.token; })) === null || _b === void 0 ? void 0 : _b.rawToken) !== null && _c !== void 0 ? _c : key.token, salt: undefined }));
                                });
                                return [2 /*return*/, Array.isArray(data) ? responseWithRawToken : responseWithRawToken[0]];
                        }
                    });
                });
            };
            ApiKeyModuleService.prototype.createApiKeys_ = function (data_1) {
                return __awaiter(this, arguments, void 0, function (data, sharedContext) {
                    var normalizedInput, generatedTokens, _i, data_2, key, tokenData, createdApiKeys;
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, this.validateCreateApiKeys_(data, sharedContext)];
                            case 1:
                                _b.sent();
                                normalizedInput = [];
                                generatedTokens = [];
                                _i = 0, data_2 = data;
                                _b.label = 2;
                            case 2:
                                if (!(_i < data_2.length)) return [3 /*break*/, 7];
                                key = data_2[_i];
                                tokenData = void 0;
                                if (!(key.type === utils_1.ApiKeyType.PUBLISHABLE)) return [3 /*break*/, 3];
                                tokenData = _a.generatePublishableKey();
                                return [3 /*break*/, 5];
                            case 3: return [4 /*yield*/, _a.generateSecretKey()];
                            case 4:
                                tokenData = _b.sent();
                                _b.label = 5;
                            case 5:
                                generatedTokens.push(tokenData);
                                normalizedInput.push(__assign(__assign({}, key), { token: tokenData.hashedToken, salt: tokenData.salt, redacted: tokenData.redacted }));
                                _b.label = 6;
                            case 6:
                                _i++;
                                return [3 /*break*/, 2];
                            case 7: return [4 /*yield*/, this.apiKeyService_.create(normalizedInput, sharedContext)];
                            case 8:
                                createdApiKeys = _b.sent();
                                return [2 /*return*/, [createdApiKeys, generatedTokens]];
                        }
                    });
                });
            };
            ApiKeyModuleService.prototype.upsertApiKeys = function (data_1) {
                return __awaiter(this, arguments, void 0, function (data, sharedContext) {
                    var input, forUpdate, forCreate, operations, op, op, result;
                    var _this = this;
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                input = Array.isArray(data) ? data : [data];
                                forUpdate = input.filter(function (apiKey) { return !!apiKey.id; });
                                forCreate = input.filter(function (apiKey) { return !apiKey.id; });
                                operations = [];
                                if (forCreate.length) {
                                    op = function () { return __awaiter(_this, void 0, void 0, function () {
                                        var _b, createdApiKeys, generatedTokens, serializedResponse;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0: return [4 /*yield*/, this.createApiKeys_(forCreate, sharedContext)];
                                                case 1:
                                                    _b = _c.sent(), createdApiKeys = _b[0], generatedTokens = _b[1];
                                                    return [4 /*yield*/, this.baseRepository_.serialize(createdApiKeys, {
                                                            populate: true,
                                                        })];
                                                case 2:
                                                    serializedResponse = _c.sent();
                                                    return [2 /*return*/, serializedResponse.map(function (key) {
                                                            var _b, _c;
                                                            return (__assign(__assign({}, key), { token: (_c = (_b = generatedTokens.find(function (t) { return t.hashedToken === key.token; })) === null || _b === void 0 ? void 0 : _b.rawToken) !== null && _c !== void 0 ? _c : key.token, salt: undefined }));
                                                        })];
                                            }
                                        });
                                    }); };
                                    operations.push(op());
                                }
                                if (forUpdate.length) {
                                    op = function () { return __awaiter(_this, void 0, void 0, function () {
                                        var updateResp;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0: return [4 /*yield*/, this.updateApiKeys_(forUpdate, sharedContext)];
                                                case 1:
                                                    updateResp = _b.sent();
                                                    return [4 /*yield*/, this.baseRepository_.serialize(updateResp)];
                                                case 2: return [2 /*return*/, _b.sent()];
                                            }
                                        });
                                    }); };
                                    operations.push(op());
                                }
                                return [4 /*yield*/, (0, utils_1.promiseAll)(operations)];
                            case 1:
                                result = (_b.sent()).flat();
                                return [2 /*return*/, Array.isArray(data) ? result : result[0]];
                        }
                    });
                });
            };
            ApiKeyModuleService.prototype.updateApiKeys = function (idOrSelector_1, data_1) {
                return __awaiter(this, arguments, void 0, function (idOrSelector, data, sharedContext) {
                    var normalizedInput, updatedApiKeys, serializedResponse;
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, this.normalizeUpdateInput_(idOrSelector, data, sharedContext)];
                            case 1:
                                normalizedInput = _b.sent();
                                return [4 /*yield*/, this.updateApiKeys_(normalizedInput, sharedContext)];
                            case 2:
                                updatedApiKeys = _b.sent();
                                return [4 /*yield*/, this.baseRepository_.serialize(updatedApiKeys.map(omitToken), {
                                        populate: true,
                                    })];
                            case 3:
                                serializedResponse = _b.sent();
                                return [2 /*return*/, (0, utils_1.isString)(idOrSelector) ? serializedResponse[0] : serializedResponse];
                        }
                    });
                });
            };
            ApiKeyModuleService.prototype.updateApiKeys_ = function (normalizedInput_1) {
                return __awaiter(this, arguments, void 0, function (normalizedInput, sharedContext) {
                    var updateRequest, updatedApiKeys;
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                updateRequest = normalizedInput.map(function (k) { return ({
                                    id: k.id,
                                    title: k.title,
                                }); });
                                return [4 /*yield*/, this.apiKeyService_.update(updateRequest, sharedContext)];
                            case 1:
                                updatedApiKeys = _b.sent();
                                return [2 /*return*/, updatedApiKeys];
                        }
                    });
                });
            };
            ApiKeyModuleService.prototype.retrieveApiKey = function (id, config, sharedContext) {
                return __awaiter(this, void 0, void 0, function () {
                    var apiKey;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, this.apiKeyService_.retrieve(id, config, sharedContext)];
                            case 1:
                                apiKey = _b.sent();
                                return [4 /*yield*/, this.baseRepository_.serialize(omitToken(apiKey), {
                                        populate: true,
                                    })];
                            case 2: return [2 /*return*/, _b.sent()];
                        }
                    });
                });
            };
            ApiKeyModuleService.prototype.listApiKeys = function (filters, config, sharedContext) {
                return __awaiter(this, void 0, void 0, function () {
                    var apiKeys;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, this.apiKeyService_.list(filters, config, sharedContext)];
                            case 1:
                                apiKeys = _b.sent();
                                return [4 /*yield*/, this.baseRepository_.serialize(apiKeys.map(omitToken), {
                                        populate: true,
                                    })];
                            case 2: return [2 /*return*/, _b.sent()];
                        }
                    });
                });
            };
            ApiKeyModuleService.prototype.listAndCountApiKeys = function (filters, config, sharedContext) {
                return __awaiter(this, void 0, void 0, function () {
                    var _b, apiKeys, count;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, this.apiKeyService_.listAndCount(filters, config, sharedContext)];
                            case 1:
                                _b = _c.sent(), apiKeys = _b[0], count = _b[1];
                                return [4 /*yield*/, this.baseRepository_.serialize(apiKeys.map(omitToken), {
                                        populate: true,
                                    })];
                            case 2: return [2 /*return*/, [
                                    _c.sent(),
                                    count
                                ]];
                        }
                    });
                });
            };
            ApiKeyModuleService.prototype.revoke = function (idOrSelector_1, data_1) {
                return __awaiter(this, arguments, void 0, function (idOrSelector, data, sharedContext) {
                    var normalizedInput, revokedApiKeys, serializedResponse;
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, this.normalizeUpdateInput_(idOrSelector, data, sharedContext)];
                            case 1:
                                normalizedInput = _b.sent();
                                return [4 /*yield*/, this.revoke_(normalizedInput, sharedContext)];
                            case 2:
                                revokedApiKeys = _b.sent();
                                return [4 /*yield*/, this.baseRepository_.serialize(revokedApiKeys.map(omitToken), {
                                        populate: true,
                                    })];
                            case 3:
                                serializedResponse = _b.sent();
                                return [2 /*return*/, (0, utils_1.isString)(idOrSelector) ? serializedResponse[0] : serializedResponse];
                        }
                    });
                });
            };
            ApiKeyModuleService.prototype.revoke_ = function (normalizedInput_1) {
                return __awaiter(this, arguments, void 0, function (normalizedInput, sharedContext) {
                    var updateRequest, revokedApiKeys;
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, this.validateRevokeApiKeys_(normalizedInput)];
                            case 1:
                                _b.sent();
                                updateRequest = normalizedInput.map(function (k) {
                                    var revokedAt = new Date();
                                    if (k.revoke_in && k.revoke_in > 0) {
                                        revokedAt.setSeconds(revokedAt.getSeconds() + k.revoke_in);
                                    }
                                    return {
                                        id: k.id,
                                        revoked_at: revokedAt,
                                        revoked_by: k.revoked_by,
                                    };
                                });
                                return [4 /*yield*/, this.apiKeyService_.update(updateRequest, sharedContext)];
                            case 2:
                                revokedApiKeys = _b.sent();
                                return [2 /*return*/, revokedApiKeys];
                        }
                    });
                });
            };
            ApiKeyModuleService.prototype.authenticate = function (token_1) {
                return __awaiter(this, arguments, void 0, function (token, sharedContext) {
                    var result, serialized;
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, this.authenticate_(token, sharedContext)];
                            case 1:
                                result = _b.sent();
                                if (!result) {
                                    return [2 /*return*/, false];
                                }
                                return [4 /*yield*/, this.baseRepository_.serialize(result, {
                                        populate: true,
                                    })];
                            case 2:
                                serialized = _b.sent();
                                return [2 /*return*/, serialized];
                        }
                    });
                });
            };
            ApiKeyModuleService.prototype.authenticate_ = function (token_1) {
                return __awaiter(this, arguments, void 0, function (token, sharedContext) {
                    var secretKeys, matches, matchedKeys;
                    var _this = this;
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, this.apiKeyService_.list({
                                    type: utils_1.ApiKeyType.SECRET,
                                    // If the revoke date is set in the future, it means the key is still valid.
                                    $or: [
                                        { revoked_at: { $eq: null } },
                                        { revoked_at: { $gt: new Date() } },
                                    ],
                                }, {}, sharedContext)];
                            case 1:
                                secretKeys = _b.sent();
                                return [4 /*yield*/, (0, utils_1.promiseAll)(secretKeys.map(function (dbKey) { return __awaiter(_this, void 0, void 0, function () {
                                        var hashedInput;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0: return [4 /*yield*/, _a.calculateHash(token, dbKey.salt)];
                                                case 1:
                                                    hashedInput = _b.sent();
                                                    if (hashedInput === dbKey.token) {
                                                        return [2 /*return*/, dbKey];
                                                    }
                                                    return [2 /*return*/, undefined];
                                            }
                                        });
                                    }); }))];
                            case 2:
                                matches = _b.sent();
                                matchedKeys = matches.filter(function (match) { return !!match; });
                                if (!matchedKeys.length) {
                                    return [2 /*return*/, false];
                                }
                                return [2 /*return*/, matchedKeys[0]];
                        }
                    });
                });
            };
            ApiKeyModuleService.prototype.validateCreateApiKeys_ = function (data_1) {
                return __awaiter(this, arguments, void 0, function (data, sharedContext) {
                    var secretKeysToCreate, dbSecretKeys;
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!data.length) {
                                    return [2 /*return*/];
                                }
                                secretKeysToCreate = data.filter(function (k) { return k.type === utils_1.ApiKeyType.SECRET; });
                                if (!secretKeysToCreate.length) {
                                    return [2 /*return*/];
                                }
                                if (secretKeysToCreate.length > 1) {
                                    throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "You can only create one secret key at a time. You tried to create ".concat(secretKeysToCreate.length, " secret keys."));
                                }
                                return [4 /*yield*/, this.apiKeyService_.list({
                                        type: utils_1.ApiKeyType.SECRET,
                                        $or: [
                                            { revoked_at: { $eq: null } },
                                            { revoked_at: { $gt: new Date() } },
                                        ],
                                    }, {}, sharedContext)];
                            case 1:
                                dbSecretKeys = _b.sent();
                                if (dbSecretKeys.length) {
                                    throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "You can only have one active secret key a time. Revoke or delete your existing key before creating a new one.");
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            };
            ApiKeyModuleService.prototype.normalizeUpdateInput_ = function (idOrSelector_1, data_1) {
                return __awaiter(this, arguments, void 0, function (idOrSelector, data, sharedContext) {
                    var normalizedInput, apiKeys;
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                normalizedInput = [];
                                if ((0, utils_1.isString)(idOrSelector)) {
                                    normalizedInput = [__assign({ id: idOrSelector }, data)];
                                }
                                if (!(0, utils_1.isObject)(idOrSelector)) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.apiKeyService_.list(idOrSelector, {}, sharedContext)];
                            case 1:
                                apiKeys = _b.sent();
                                normalizedInput = apiKeys.map(function (apiKey) {
                                    return (__assign({ id: apiKey.id }, data));
                                });
                                _b.label = 2;
                            case 2: return [2 /*return*/, normalizedInput];
                        }
                    });
                });
            };
            ApiKeyModuleService.prototype.validateRevokeApiKeys_ = function (data_1) {
                return __awaiter(this, arguments, void 0, function (data, sharedContext) {
                    var revokedApiKeys;
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!data.length) {
                                    return [2 /*return*/];
                                }
                                if (data.some(function (k) { return !k.id; })) {
                                    throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "You must provide an api key id field when revoking a key.");
                                }
                                if (data.some(function (k) { return !k.revoked_by; })) {
                                    throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "You must provide a revoked_by field when revoking a key.");
                                }
                                return [4 /*yield*/, this.apiKeyService_.list({
                                        id: data.map(function (k) { return k.id; }),
                                        type: utils_1.ApiKeyType.SECRET,
                                        revoked_at: { $ne: null },
                                    }, {}, sharedContext)];
                            case 1:
                                revokedApiKeys = _b.sent();
                                if (revokedApiKeys.length) {
                                    throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "There are ".concat(revokedApiKeys.length, " secret keys that are already revoked."));
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            };
            // These are public keys, so there is no point hashing them.
            ApiKeyModuleService.generatePublishableKey = function () {
                var token = "pk_" + crypto_1.default.randomBytes(32).toString("hex");
                return {
                    rawToken: token,
                    hashedToken: token,
                    salt: "",
                    redacted: redactKey(token),
                };
            };
            ApiKeyModuleService.generateSecretKey = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var token, salt, hashed;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                token = "sk_" + crypto_1.default.randomBytes(32).toString("hex");
                                salt = crypto_1.default.randomBytes(16).toString("hex");
                                return [4 /*yield*/, this.calculateHash(token, salt)];
                            case 1:
                                hashed = _b.sent();
                                return [2 /*return*/, {
                                        rawToken: token,
                                        hashedToken: hashed,
                                        salt: salt,
                                        redacted: redactKey(token),
                                    }];
                        }
                    });
                });
            };
            ApiKeyModuleService.calculateHash = function (token, salt) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, scrypt(token, salt, 64)];
                            case 1: return [2 /*return*/, (_b.sent()).toString("hex")];
                        }
                    });
                });
            };
            return ApiKeyModuleService;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _deleteApiKeys_decorators = [(0, utils_1.InjectTransactionManager)()];
            _createApiKeys_decorators = [(0, utils_1.InjectManager)()];
            _createApiKeys__decorators = [(0, utils_1.InjectTransactionManager)()];
            _upsertApiKeys_decorators = [(0, utils_1.InjectManager)()];
            _updateApiKeys_decorators = [(0, utils_1.InjectManager)()];
            _updateApiKeys__decorators = [(0, utils_1.InjectTransactionManager)()];
            _retrieveApiKey_decorators = [(0, utils_1.InjectManager)()];
            _listApiKeys_decorators = [(0, utils_1.InjectManager)()];
            _listAndCountApiKeys_decorators = [(0, utils_1.InjectManager)()];
            _revoke_decorators = [(0, utils_1.InjectManager)()];
            _revoke__decorators = [(0, utils_1.InjectTransactionManager)()];
            _authenticate_decorators = [(0, utils_1.InjectManager)()];
            _authenticate__decorators = [(0, utils_1.InjectTransactionManager)()];
            __esDecorate(_a, null, _deleteApiKeys_decorators, { kind: "method", name: "deleteApiKeys", static: false, private: false, access: { has: function (obj) { return "deleteApiKeys" in obj; }, get: function (obj) { return obj.deleteApiKeys; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _createApiKeys_decorators, { kind: "method", name: "createApiKeys", static: false, private: false, access: { has: function (obj) { return "createApiKeys" in obj; }, get: function (obj) { return obj.createApiKeys; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _createApiKeys__decorators, { kind: "method", name: "createApiKeys_", static: false, private: false, access: { has: function (obj) { return "createApiKeys_" in obj; }, get: function (obj) { return obj.createApiKeys_; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _upsertApiKeys_decorators, { kind: "method", name: "upsertApiKeys", static: false, private: false, access: { has: function (obj) { return "upsertApiKeys" in obj; }, get: function (obj) { return obj.upsertApiKeys; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _updateApiKeys_decorators, { kind: "method", name: "updateApiKeys", static: false, private: false, access: { has: function (obj) { return "updateApiKeys" in obj; }, get: function (obj) { return obj.updateApiKeys; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _updateApiKeys__decorators, { kind: "method", name: "updateApiKeys_", static: false, private: false, access: { has: function (obj) { return "updateApiKeys_" in obj; }, get: function (obj) { return obj.updateApiKeys_; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _retrieveApiKey_decorators, { kind: "method", name: "retrieveApiKey", static: false, private: false, access: { has: function (obj) { return "retrieveApiKey" in obj; }, get: function (obj) { return obj.retrieveApiKey; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _listApiKeys_decorators, { kind: "method", name: "listApiKeys", static: false, private: false, access: { has: function (obj) { return "listApiKeys" in obj; }, get: function (obj) { return obj.listApiKeys; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _listAndCountApiKeys_decorators, { kind: "method", name: "listAndCountApiKeys", static: false, private: false, access: { has: function (obj) { return "listAndCountApiKeys" in obj; }, get: function (obj) { return obj.listAndCountApiKeys; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _revoke_decorators, { kind: "method", name: "revoke", static: false, private: false, access: { has: function (obj) { return "revoke" in obj; }, get: function (obj) { return obj.revoke; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _revoke__decorators, { kind: "method", name: "revoke_", static: false, private: false, access: { has: function (obj) { return "revoke_" in obj; }, get: function (obj) { return obj.revoke_; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _authenticate_decorators, { kind: "method", name: "authenticate", static: false, private: false, access: { has: function (obj) { return "authenticate" in obj; }, get: function (obj) { return obj.authenticate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _authenticate__decorators, { kind: "method", name: "authenticate_", static: false, private: false, access: { has: function (obj) { return "authenticate_" in obj; }, get: function (obj) { return obj.authenticate_; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ApiKeyModuleService = ApiKeyModuleService;
// We are mutating the object here as what microORM relies on non-enumerable fields for serialization, among other things.
var omitToken = function (
// We have to make salt optional before deleting it (and we do want it required in the DB)
key) {
    key.token = key.type === utils_1.ApiKeyType.SECRET ? "" : key.token;
    delete key.salt;
    return key;
};
var redactKey = function (key) {
    return [key.slice(0, 6), key.slice(-3)].join("***");
};
