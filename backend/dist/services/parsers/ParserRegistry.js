"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserRegistry = void 0;
const INGParser_1 = require("./banks/INGParser");
const INGCreditParser_1 = require("./banks/INGCreditParser");
class ParserRegistry {
    constructor() {
        this.parsers = [];
        this.registerParser(new INGCreditParser_1.INGCreditParser());
        this.registerParser(new INGParser_1.INGParser());
    }
    registerParser(parser) {
        this.parsers.push(parser);
        console.log(`Registered parser: ${parser.name}`);
    }
    findParser(text) {
        console.log('Looking for suitable parser...');
        for (const parser of this.parsers) {
            console.log(`Trying ${parser.name}...`);
            if (parser.canParse(text)) {
                console.log(`Found matching parser: ${parser.name}`);
                return parser;
            }
        }
        console.log('No suitable parser found for this statement');
        return null;
    }
}
exports.ParserRegistry = ParserRegistry;
//# sourceMappingURL=ParserRegistry.js.map