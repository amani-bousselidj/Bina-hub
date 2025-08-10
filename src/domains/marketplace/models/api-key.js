"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@medusajs/framework/utils");
var ApiKey = utils_1.model
    .define("ApiKey", {
    id: utils_1.model.id({ prefix: "apk" }).primaryKey(),
    token: utils_1.model.text(),
    salt: utils_1.model.text(),
    redacted: utils_1.model.text().searchable(),
    title: utils_1.model.text().searchable(),
    type: utils_1.model.enum(["publishable", "secret"]),
    last_used_at: utils_1.model.dateTime().nullable(),
    created_by: utils_1.model.text(),
    revoked_by: utils_1.model.text().nullable(),
    revoked_at: utils_1.model.dateTime().nullable(),
})
    .indexes([
    {
        on: ["token"],
        unique: true,
    },
    {
        on: ["type"],
    },
]);
exports.default = ApiKey;
