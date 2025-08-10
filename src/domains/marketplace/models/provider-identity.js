"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderIdentity = void 0;
var utils_1 = require("@medusajs/framework/utils");
var auth_identity_1 = require("./auth-identity");
exports.ProviderIdentity = utils_1.model
    .define("provider_identity", {
    id: utils_1.model.id().primaryKey(),
    entity_id: utils_1.model.text(),
    provider: utils_1.model.text(),
    auth_identity: utils_1.model.belongsTo(function () { return auth_identity_1.AuthIdentity; }, {
        mappedBy: "provider_identities",
    }),
    user_metadata: utils_1.model.json().nullable(),
    provider_metadata: utils_1.model.json().nullable(),
})
    .indexes([
    {
        name: "IDX_provider_identity_provider_entity_id",
        on: ["entity_id", "provider"],
        unique: true,
    },
]);
