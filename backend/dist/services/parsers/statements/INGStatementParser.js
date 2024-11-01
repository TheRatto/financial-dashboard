"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INGStatementParser = void 0;
class INGStatementParser {
    constructor() {
        this.name = 'ING Bank';
    }
    async canParse(text) {
        console.log('Checking if text is ING format...');
        const hasDatePattern = /\d{2}\/\d{2}\/\d{4}/.test(text);
        const hasAmountPattern = /\$?\d+\.\d{2}/.test(text);
        const hasIngMarkers = text.includes('ING') &&
            text.includes('Savings Maximiser');
        const canParse = hasDatePattern && hasAmountPattern && hasIngMarkers;
        console.log('ING Bank parser check results:', {
            hasDatePattern,
            hasAmountPattern,
            hasIngMarkers
        });
        return canParse;
    }
    async parse(text) {
        console.log('Parsing ING statement...');
        const statement = {
            accountType: 'Savings Maximiser',
            openingBalance: 0,
            closingBalance: 0,
            totalMoneyIn: 0,
            totalMoneyOut: 0,
            transactions: []
        };
        const lines = text.split('\n').map(line => line.trim());
        const dateRegex = /(\d{2}\/\d{2}\/\d{4})/;
        const amountRegex = /\$?([-]?\d{1,3}(?:,\d{3})*(?:\.\d{2}))/g;
        for (const line of lines) {
            if (line.includes('Interest rate') || line.length < 5) {
                continue;
            }
            const dateMatch = line.match(dateRegex);
            if (!dateMatch)
                continue;
            const date = dateMatch[1];
            let remainingText = line.replace(dateMatch[0], '').trim();
            const amounts = [...remainingText.matchAll(amountRegex)];
            if (amounts.length < 1)
                continue;
            const amount = this.parseAmount(amounts[0][0]);
            const balance = amounts.length > 1 ? this.parseAmount(amounts[1][0]) : undefined;
            const description = remainingText.replace(/\$?([-]?\d{1,3}(?:,\d{3})*(?:\.\d{2}))/g, '').trim();
            statement.transactions.push({
                date,
                description,
                amount: Math.abs(amount),
                type: amount >= 0 ? 'credit' : 'debit',
                balance
            });
        }
        console.log('Parsed transactions:', statement.transactions);
        return statement;
    }
    parseAmount(text) {
        const cleanText = text.replace(/[$,]/g, '').trim();
        const amount = parseFloat(cleanText);
        if (isNaN(amount)) {
            throw new Error(`Invalid amount format: ${text}`);
        }
        return amount;
    }
}
exports.INGStatementParser = INGStatementParser;
//# sourceMappingURL=INGStatementParser.js.map