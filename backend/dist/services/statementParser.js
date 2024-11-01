"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBankParser = exports.StatementParser = void 0;
const date_fns_1 = require("date-fns");
const INGParser_1 = require("./parsers/banks/INGParser");
class StatementParser {
    constructor() {
        this.parsers = [
            new INGParser_1.INGParser(),
        ];
    }
    async parseStatement(pdfText) {
        console.log('\n=== Statement Parser Starting ===');
        console.log('PDF text length:', pdfText.length);
        console.log('\n=== Testing Available Parsers ===');
        for (const p of this.parsers) {
            console.log(`Testing ${p.name} parser...`);
            const canParse = p.canParse(pdfText);
            console.log(`Result: ${canParse ? 'MATCHED' : 'Not matched'}`);
        }
        const parser = this.parsers.find(p => p.canParse(pdfText));
        if (!parser) {
            throw new Error('No suitable parser found for this statement format');
        }
        console.log(`\n✅ Using ${parser.name} parser`);
        const transactions = await parser.parse(pdfText);
        if (transactions.length === 0) {
            throw new Error('No transactions could be parsed from the statement');
        }
        const firstTransaction = transactions[0];
        return {
            month: firstTransaction.date.getMonth() + 1,
            year: firstTransaction.date.getFullYear(),
            bankName: parser.name,
            transactions
        };
    }
}
exports.StatementParser = StatementParser;
class BaseBankParser {
    parseDate(dateStr, formatStr) {
        try {
            return (0, date_fns_1.parse)(dateStr, formatStr, new Date());
        }
        catch (error) {
            throw new Error(`Failed to parse date: ${dateStr} with format ${formatStr}`);
        }
    }
    parseAmount(amountStr) {
        return parseFloat(amountStr.replace(/[$,]/g, ''));
    }
}
exports.BaseBankParser = BaseBankParser;
//# sourceMappingURL=statementParser.js.map