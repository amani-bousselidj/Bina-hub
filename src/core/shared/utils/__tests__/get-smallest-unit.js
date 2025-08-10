"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_smallest_unit_1 = require("../get-smallest-unit");
describe("getSmallestUnit", () => {
    it("should convert an amount to the format required by Stripe based on currency", () => {
        // 0 decimals
        expect((0, get_smallest_unit_1.getSmallestUnit)(50098, "JPY")).toBe(50098);
        // 3 decimals
        expect((0, get_smallest_unit_1.getSmallestUnit)(5.124, "KWD")).toBe(5130);
        // 2 decimals
        expect((0, get_smallest_unit_1.getSmallestUnit)(2.675, "USD")).toBe(268);
        expect((0, get_smallest_unit_1.getSmallestUnit)(100.54, "USD")).toBe(10054);
        expect((0, get_smallest_unit_1.getSmallestUnit)(5.126, "KWD")).toBe(5130);
        expect((0, get_smallest_unit_1.getSmallestUnit)(0.54, "USD")).toBe(54);
        expect((0, get_smallest_unit_1.getSmallestUnit)(0.054, "USD")).toBe(5);
        expect((0, get_smallest_unit_1.getSmallestUnit)(0.005104, "USD")).toBe(1);
        expect((0, get_smallest_unit_1.getSmallestUnit)(0.004104, "USD")).toBe(0);
    });
});
//# sourceMappingURL=get-smallest-unit.js.map