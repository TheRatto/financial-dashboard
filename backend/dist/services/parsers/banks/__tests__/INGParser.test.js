"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const INGParser_1 = require("../INGParser");
describe('INGParser', () => {
    const parser = new INGParser_1.INGParser();
    describe('canParse', () => {
        it('should identify ING statements correctly', () => {
            const sampleText = `
        Savings Maximiser
        statement
        Balance
        Opening balanceTotal money inTotal money outClosing balance
        BSB number: 923 100
      `;
            expect(parser.canParse(sampleText)).toBe(true);
        });
        it('should reject non-ING statements', () => {
            const sampleText = 'Some other bank statement';
            expect(parser.canParse(sampleText)).toBe(false);
        });
    });
    describe('parse', () => {
        it('should parse ING transactions correctly', async () => {
            const sampleText = `
        Savings Maximiser
        BSB number: 923 100
        DateDetailsMoney out $Money in $Balance $
        30/06/2024 1.06 Interest Credit - Receipt 905815 2335.02
        01/01/2024 5.00 Internal Transfer - Receipt 015976 6274.28
        From Orange Ever
      `;
            const result = await parser.parse(sampleText);
            expect(result).toHaveLength(2);
            const firstTransaction = result[0];
            expect(firstTransaction).toEqual({
                date: expect.any(Date),
                description: 'Interest Credit - Receipt 905815',
                amount: 1.06,
                type: 'credit',
                balance: 2335.02,
                category: null
            });
            expect(firstTransaction.date.toISOString()).toContain('2024-06-30');
            expect(result[1]).toEqual({
                date: expect.any(Date),
                description: 'Internal Transfer - Receipt 015976 From Orange Ever',
                amount: 5.00,
                type: 'credit',
                balance: 6274.28,
                category: null
            });
        });
        it('should handle multi-line descriptions', async () => {
            const sampleText = `
        Savings Maximiser
        BSB number: 923 100
        30/06/2024 1.06 Interest Credit - Receipt 905815 2335.02
        From Some Account
      `;
            const result = await parser.parse(sampleText);
            expect(result[0].description).toBe('Interest Credit - Receipt 905815 From Some Account');
        });
        it('should handle negative amounts correctly', async () => {
            const sampleText = `
        Savings Maximiser
        BSB number: 923 100
        30/06/2024 -50.00 Withdrawal 2335.02
      `;
            const result = await parser.parse(sampleText);
            expect(result[0].amount).toBe(50.00);
            expect(result[0].type).toBe('debit');
        });
    });
    it('should maintain consistent parsing behavior', async () => {
        const sampleStatement = `
      Savings Maximiser
      BSB number: 923 100
      DateDetailsMoney out $Money in $Balance $
      30/06/2024 1.06 Interest Credit - Receipt 905815 2335.02
      01/01/2024 5.00 Internal Transfer - Receipt 015976 6274.28
      From Orange Ever
      15/03/2024 -2500.00 Transfer to Orange Everyday 3774.28
    `;
        const result = await parser.parse(sampleStatement);
        expect(result).toMatchSnapshot();
    });
});
//# sourceMappingURL=INGParser.test.js.map