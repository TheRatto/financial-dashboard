"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewBankParser = void 0;
const statementParser_1 = require("../../statementParser");
class NewBankParser extends statementParser_1.BaseBankParser {
    constructor() {
        super(...arguments);
        this.name = 'Bank Name';
    }
    canParse(text) {
        return text.includes('BANK IDENTIFIER');
    }
    async parse(text) {
        const transactions = [];
        const lines = text.split('\n');
        console.log(`Starting ${this.name} parser...`);
        console.log(`Processing ${lines.length} lines`);
        for (const line of lines) {
            if (!line.trim())
                continue;
        }
        console.log(`\n${this.name} Parsing Summary:`);
        console.log(`Total lines processed: ${lines.length}`);
        console.log(`Transactions found: ${transactions.length}`);
        return transactions;
    }
}
exports.NewBankParser = NewBankParser;
//# sourceMappingURL=BankParserTemplate.js.map