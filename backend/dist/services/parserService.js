"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findParser = void 0;
const INGParser_1 = require("./parsers/banks/INGParser");
const parsers = [
    new INGParser_1.INGParser(),
];
const findParser = (content) => {
    return parsers.find(parser => parser.canParse(content));
};
exports.findParser = findParser;
//# sourceMappingURL=parserService.js.map