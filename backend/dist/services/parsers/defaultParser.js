"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultParser = void 0;
exports.defaultParser = {
    name: 'Default',
    canParse: (text) => {
        console.log('First 500 characters of statement:');
        console.log(text.substring(0, 500));
        return true;
    },
    parse: async (text) => {
        const transactions = [];
        const lines = text.split('\n');
        for (const line of lines) {
            if (!line.trim())
                continue;
            const datePattern = /^(\d{2}\/\d{2}\/\d{4})/;
            const dateMatch = line.match(datePattern);
            if (dateMatch) {
                const fullLine = line.trim();
                try {
                    const dateStr = fullLine.substring(0, 10);
                    let remainder = fullLine.substring(10).trim();
                    const moneyPattern = /(-?\$?\d+,?\d*\.\d{2})/g;
                    const allAmounts = [...remainder.matchAll(moneyPattern)].map(match => match[0]);
                    if (allAmounts.length > 0) {
                        const [day, month, year] = dateStr.split('/');
                        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                        const lastAmount = allAmounts[allAmounts.length - 1];
                        const description = remainder.substring(remainder.indexOf(lastAmount) + lastAmount.length).trim();
                        let debitAmount = 0;
                        let creditAmount = 0;
                        let balance = 0;
                        allAmounts.forEach(amt => {
                            const cleanAmt = parseFloat(amt.replace(/[$,]/g, ''));
                            if (amt.includes('-')) {
                                debitAmount = Math.abs(cleanAmt);
                            }
                            else if (allAmounts.indexOf(amt) === allAmounts.length - 1) {
                                balance = cleanAmt;
                            }
                            else {
                                creditAmount = cleanAmt;
                            }
                        });
                        const amount = debitAmount > 0 ? debitAmount : creditAmount;
                        const type = debitAmount > 0 ? 'debit' : 'credit';
                        const transaction = {
                            date,
                            description,
                            amount,
                            type,
                            balance
                        };
                        console.log('Successfully parsed transaction:', {
                            date: date.toISOString(),
                            description,
                            amount,
                            type,
                            balance,
                            debug: {
                                originalLine: fullLine,
                                foundAmounts: allAmounts
                            }
                        });
                        transactions.push(transaction);
                    }
                }
                catch (error) {
                    console.log('Failed to parse line:', line);
                    console.log('Error:', error);
                }
            }
        }
        console.log('\nParsing Summary:');
        console.log(`Total lines processed: ${lines.length}`);
        console.log(`Transactions found: ${transactions.length}`);
        return transactions;
    }
};
//# sourceMappingURL=defaultParser.js.map