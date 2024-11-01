"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserFactory = void 0;
const INGParser_1 = require("./banks/INGParser");
class ParserFactory {
    static getParser(bankType) {
        switch (bankType.toLowerCase()) {
            case 'ing':
                return new INGParser_1.INGParser();
            default:
                throw new Error(`Parser not yet implemented for bank type: ${bankType}`);
        }
    }
}
exports.ParserFactory = ParserFactory;
//# sourceMappingURL=ParserFactory.js.map