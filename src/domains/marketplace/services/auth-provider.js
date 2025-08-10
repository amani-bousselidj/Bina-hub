"use strict";
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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AuthProviderService_logger;
Object.defineProperty(exports, "__esModule", { value: true });
var _types_1 = require("@types");
var AuthProviderService = /** @class */ (function () {
    function AuthProviderService(container) {
        _AuthProviderService_logger.set(this, void 0);
        this.dependencies = container;
        __classPrivateFieldSet(this, _AuthProviderService_logger, container["logger"]
            ? container.logger
            : console, "f");
    }
    AuthProviderService.prototype.retrieveProviderRegistration = function (providerId) {
        try {
            return this.dependencies["".concat(_types_1.AuthProviderRegistrationPrefix).concat(providerId)];
        }
        catch (err) {
            if (err.name === "AwilixResolutionError") {
                var errMessage_1 = "\nUnable to retrieve the auth provider with id: ".concat(providerId, "\nPlease make sure that the provider is registered in the container and it is configured correctly in your project configuration file.");
                throw new Error(errMessage_1);
            }
            var errMessage = "Unable to retrieve the auth provider with id: ".concat(providerId, ", the following error occurred: ").concat(err.message);
            __classPrivateFieldGet(this, _AuthProviderService_logger, "f").error(errMessage);
            throw new Error(errMessage);
        }
    };
    AuthProviderService.prototype.authenticate = function (provider, auth, authIdentityProviderService) {
        return __awaiter(this, void 0, void 0, function () {
            var providerHandler;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        providerHandler = this.retrieveProviderRegistration(provider);
                        return [4 /*yield*/, providerHandler.authenticate(auth, authIdentityProviderService)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AuthProviderService.prototype.register = function (provider, auth, authIdentityProviderService) {
        return __awaiter(this, void 0, void 0, function () {
            var providerHandler;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        providerHandler = this.retrieveProviderRegistration(provider);
                        return [4 /*yield*/, providerHandler.register(auth, authIdentityProviderService)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AuthProviderService.prototype.update = function (provider, data, authIdentityProviderService) {
        return __awaiter(this, void 0, void 0, function () {
            var providerHandler;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        providerHandler = this.retrieveProviderRegistration(provider);
                        return [4 /*yield*/, providerHandler.update(data, authIdentityProviderService)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AuthProviderService.prototype.validateCallback = function (provider, auth, authIdentityProviderService) {
        return __awaiter(this, void 0, void 0, function () {
            var providerHandler;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        providerHandler = this.retrieveProviderRegistration(provider);
                        return [4 /*yield*/, providerHandler.validateCallback(auth, authIdentityProviderService)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return AuthProviderService;
}());
_AuthProviderService_logger = new WeakMap();
exports.default = AuthProviderService;
