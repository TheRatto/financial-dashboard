"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INGParser = void 0;
const client_1 = require("@prisma/client");
class INGParser {
    constructor() {
        this.name = 'ING Bank';
    }
    canParse(text) {
        console.log('\n=== ING Parser Detection ===');
        console.log('Text length:', text.length);
        console.log('First 200 characters:', text.substring(0, 200));
        const isING = text.includes('ING');
        console.log('Contains "ING":', isING);
        return isING;
    }
    async parse(text) {
        const transactions = [];
        const lines = text.split('\n');
        console.log('\n=== ING Parser Starting ===');
        console.log(`Total lines in document: ${lines.length}`);
        console.log('\nFirst 5 lines:');
        lines.slice(0, 5).forEach((line, i) => {
            console.log(`Line ${i + 1}: "${line.trim()}"`);
        });
        let lineCount = 0;
        let matchedLines = 0;
        for (const line of lines) {
            lineCount++;
            if (!line.trim())
                continue;
            const datePattern = /^(\d{2}\/\d{2}\/\d{2}|\d{2}\/\d{2}\/\d{4})/;
            const dateMatch = line.match(datePattern);
            if (dateMatch) {
                matchedLines++;
                const fullLine = line.trim();
                console.log(`\n[Line ${lineCount}] Processing: "${fullLine}"`);
                try {
                    const dateStr = fullLine.substring(0, 10);
                    console.log(`Found date: ${dateStr}`);
                    let remainder = fullLine.substring(10).trim();
                    console.log(`Remainder after date: "${remainder}"`);
                    const moneyPattern = /(-?\$?\d+,?\d*\.\d{2})/g;
                    const allAmounts = [...remainder.matchAll(moneyPattern)].map(match => match[0]);
                    if (allAmounts.length > 0) {
                        console.log(`Found amounts: ${allAmounts.join(', ')}`);
                        const [day, month, year] = dateStr.split('/');
                        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                        const firstAmount = allAmounts[0];
                        const description = remainder
                            .substring(0, remainder.indexOf(firstAmount))
                            .trim();
                        let amount = 0;
                        let type = client_1.TransactionType.CREDIT;
                        let balance = 0;
                        if (allAmounts.length >= 2) {
                            const amtStr = allAmounts[0];
                            amount = Math.abs(parseFloat(amtStr.replace(/[$,]/g, '')));
                            type = amtStr.includes('-') ? client_1.TransactionType.DEBIT : client_1.TransactionType.CREDIT;
                            const balStr = allAmounts[allAmounts.length - 1];
                            balance = parseFloat(balStr.replace(/[$,]/g, ''));
                        }
                        const transaction = {
                            date,
                            description,
                            amount,
                            type,
                            balance
                        };
                        console.log('\nParsed Transaction:');
                        console.log('------------------');
                        console.log(`Date: ${date.toISOString()}`);
                        console.log(`Description: ${description}`);
                        console.log(`Amount: ${amount} (${type})`);
                        console.log(`Balance: ${balance}`);
                        console.log('------------------\n');
                        transactions.push(transaction);
                    }
                    else {
                        console.log('❌ No amounts found in line');
                    }
                }
                catch (error) {
                    console.error(`Error parsing line ${lineCount}:`, error);
                    console.error('Line content:', fullLine);
                }
            }
        }
        console.log('\n=== ING Parser Summary ===');
        console.log(`Total lines processed: ${lines.length}`);
        console.log(`Lines with date matches: ${matchedLines}`);
        console.log(`Transactions successfully parsed: ${transactions.length}`);
        if (transactions.length > 0) {
            console.log('\nFirst transaction:', transactions[0]);
            console.log('Last transaction:', transactions[transactions.length - 1]);
        }
        return transactions;
    }
}
exports.INGParser = INGParser;
//# sourceMappingURL=INGParser.js.map