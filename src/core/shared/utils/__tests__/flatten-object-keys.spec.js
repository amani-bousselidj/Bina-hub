"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flatten_object_keys_1 = require("../flatten-object-keys");
describe("flattenWhereClauses", () => {
    it("should flatten where clauses", () => {
        const where = {
            a: 1,
            b: {
                c: 2,
                d: 3,
                z: {
                    $ilike: "%test%",
                },
                y: null,
            },
            e: 4,
        };
        const result = (0, flatten_object_keys_1.flattenObjectKeys)(where);
        expect(result).toEqual({
            a: 1,
            "b.c": 2,
            "b.d": 3,
            "b.z": { $ilike: "%test%" },
            "b.y": null,
            e: 4,
        });
    });
});
//# sourceMappingURL=flatten-object-keys.spec.js.map