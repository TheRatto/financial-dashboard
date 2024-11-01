"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INGCreditParser = void 0;
class INGCreditParser {
    constructor() {
        this.name = 'ING Credit Card';
    }
    canParse(text) {
        const ingCreditIdentifiers = [
            'Orange One',
            'Rewards Platinum',
            'Credit Card'
        ];
        const hasDatePattern = /\d{2}\/\d{2}\/\d{4}/.test(text);
        const hasAmountPattern = /(-?\$?\d+,?\d*\.\d{2})/.test(text);
        const hasIngIdentifier = ingCreditIdentifiers.some(id => text.toUpperCase().includes(id.toUpperCase()));
        return hasDatePattern && hasAmountPattern && hasIngIdentifier;
    }
    async parse(text) {
        const transactions = [];
        const lines = text.split('\n');
        let currentTransaction = {};
        let currentLine = '';
        let pendingAmounts = [];
        console.log('Starting to parse lines...');
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine)
                continue;
            console.log('Processing line:', trimmedLine);
            const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})/;
            const dateMatch = trimmedLine.match(datePattern);
            const moneyPattern = /(-?\$?\d+,?\d*\.\d{2})/g;
            const allAmounts = [...trimmedLine.matchAll(moneyPattern)].map(match => match[0]);
            if (allAmounts.length > 0) {
                pendingAmounts = allAmounts;
            }
            if (dateMatch) {
                if (currentTransaction.date) {
                    currentTransaction.description = this.cleanDescription(currentTransaction.description || '');
                    this.logTransaction(currentTransaction, currentLine);
                    transactions.push(currentTransaction);
                }
                const [_, day, month, year] = dateMatch;
                currentTransaction = {
                    date: new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0)),
                    description: trimmedLine.replace(dateMatch[0], '').trim()
                };
                currentLine = trimmedLine;
                if (pendingAmounts.length > 0) {
                    const amount = parseFloat(pendingAmounts[0].replace(/[$,]/g, ''));
                    currentTransaction.amount = Math.abs(amount);
                    currentTransaction.type = amount >= 0 ? 'credit' : 'debit';
                    if (pendingAmounts.length > 1) {
                        const balance = parseFloat(pendingAmounts[pendingAmounts.length - 1].replace(/[$,]/g, ''));
                        currentTransaction.balance = balance;
                    }
                }
            }
            else if (currentTransaction.date) {
                currentTransaction.description += ' ' + trimmedLine;
                currentLine += ' ' + trimmedLine;
                if (allAmounts.length > 0 && !currentTransaction.amount) {
                    const amount = parseFloat(allAmounts[0].replace(/[$,]/g, ''));
                    currentTransaction.amount = Math.abs(amount);
                    currentTransaction.type = amount >= 0 ? 'credit' : 'debit';
                    if (allAmounts.length > 1) {
                        const balance = parseFloat(allAmounts[allAmounts.length - 1].replace(/[$,]/g, ''));
                        currentTransaction.balance = balance;
                    }
                }
            }
        }
        if (currentTransaction.date) {
            currentTransaction.description = this.cleanDescription(currentTransaction.description || '');
            this.logTransaction(currentTransaction, currentLine);
            transactions.push(currentTransaction);
        }
        console.log(`Found ${transactions.length} transactions`);
        return transactions;
    }
    cleanDescription(description) {
        description = description.replace(/Date \d{2}\/\d{2}\/\d{2}/, '');
        description = description.replace(/Card \d+/, '');
        description = description.replace(/(-?\$?\d+,?\d*\.\d{2})/g, '');
        return description.replace(/\s+/g, ' ').trim();
    }
    logTransaction(transaction, originalLine) {
        console.log('Successfully parsed transaction:', {
            date: transaction.date.toISOString(),
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type,
            balance: transaction.balance,
            debug: {
                originalLine,
                foundAmounts: originalLine.match(/(-?\$?\d+,?\d*\.\d{2})/g) || []
            }
        });
    }
}
exports.INGCreditParser = INGCreditParser;
//# sourceMappingURL=INGCreditParser.js.map