"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_fields_selection_1 = require("../normalize-fields-selection");
describe("normalizeFieldsSelection", () => {
    it("should normalize fields selection", () => {
        const fields = [
            "product.id",
            "product.title",
            "product.variants.*",
            "product.variants.prices.*",
        ];
        const result = (0, normalize_fields_selection_1.normalizeFieldsSelection)(fields);
        expect(result).toEqual({
            product: {
                id: true,
                title: true,
                variants: {
                    prices: true,
                },
            },
        });
    });
});
//# sourceMappingURL=normalize-fields-selcetion.spec.js.map