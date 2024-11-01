"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ADFPaySlipParser_1 = require("../ADFPaySlipParser");
describe('ADFPaySlipParser', () => {
    const parser = new ADFPaySlipParser_1.ADFPaySlipParser();
    const samplePaySlip = `Department of Defence
ABN 68706814312
Paul Rattigan
Russell Offices
Canberra, ACT, 2600
Pay Period :10/10/2024 - 23/10/2024
Payment Date :24/10/2024
Pay Centre :8017
Employee ID :8496619
Rank / Name :FLTLT/Paul Rattigan
Unit/Dept/Location :174759/Dir Air Mobility&Aircrew Trg/Russell
Skill Grade :OA Specialist (ROO: SQNLDR)
Service Category :Service Category 7
Service Option :Not Applicable
Job Description :Fixed Wing Pilot
Pay Grade /Incr :OAPS SP B4/O03/5
Annual Salary :$195,480.00
Categorisation :Accompanied Resident Family
Pay Summary
GROSS TAXABLE TAXES DEDUCTIONS NET PAY
Current 7889.67 7021.01 1882.00 2486.72 3520.95
FYTD 71007.03 63189.09 16938.00 22325.39 31743.64
Earnings
Description Date From Rate Units Current Prior Total
Military Salary 66.945205 112.00 7497.86 7497.86
Tier A: Flying DIS 29/08/2024 27.986301 14.00 391.81 391.81
Total 7889.67
Taxes
Description Year To Date Current Prior Total
Marginal Tax 1882.00
16938.00 1882.00
Total 1882.00
16938.00
Before-Tax Deductions
Description Date From Remaining Balance Year To Date Current Prior Total
Flexible Rem Pkg Pre-Tax 23/10/2024 368.66
3317.94 368.66
Flexible Rem Pkg - ADF RESC 23/10/2024 4500.00 500.00
500.00
Total 868.66
7817.94
After-Tax Deductions
Description Date From Remaining Balance Year To Date Current Prior Total
MSBS Member Contribution 10/08/2017 374.89
3374.01 374.89
Service Residence Contribution 01/01/2023 738.48
6591.61 738.48
Service Residence Water 01/01/2023 19.74
177.28 19.74
Flexible Rem Pkg Post-Tax 23/10/2024 484.95
4364.55 484.95
Total 1618.06
14507.45
Disbursement Details
Bank BSB Account # Amount
ING Bank (Australia) Limited 923-100 61557471 3520.95
Total 3520.95`;
    it('should correctly identify ADF pay slip', () => {
        expect(parser.canParse(samplePaySlip)).toBe(true);
    });
    it('should reject non-ADF pay slip', () => {
        const nonADFText = 'Some random text';
        expect(parser.canParse(nonADFText)).toBe(false);
    });
    it('should correctly parse all financial components', async () => {
        const result = await parser.parse(samplePaySlip);
        expect(result.employerName).toBe('Department of Defence');
        expect(result.grossPay).toBe(7889.67);
        expect(result.netPay).toBe(3520.95);
        expect(result.taxWithheld).toBe(1882.00);
        expect(result.earnings).toContainEqual({
            description: 'Military Salary',
            amount: 7497.86
        });
        expect(result.earnings).toContainEqual({
            description: 'Tier A: Flying DIS',
            amount: 391.81
        });
        expect(result.deductions).toContainEqual({
            description: 'Flexible Rem Pkg Pre-Tax',
            amount: 368.66
        });
        expect(result.deductions).toContainEqual({
            description: 'MSBS Member Contribution',
            amount: 374.89
        });
        console.log('\nPay Period Analysis:');
        console.log('-------------------');
        console.log('Employer:', result.employerName);
        console.log('Pay Period:', result.payPeriod.startDate.toLocaleDateString(), 'to', result.payPeriod.endDate.toLocaleDateString());
        console.log('Gross Pay:', result.grossPay.toFixed(2));
        console.log('Tax Withheld:', result.taxWithheld.toFixed(2));
        console.log('\nEarnings:');
        console.log('---------');
        result.earnings.forEach(earning => {
            console.log(`${earning.description}: ${earning.amount.toFixed(2)}`);
        });
        console.log('\nDeductions:');
        console.log('-----------');
        result.deductions.forEach(deduction => {
            console.log(`${deduction.description}: ${deduction.amount.toFixed(2)}`);
        });
        console.log('\nTake Home Pay:');
        console.log('-------------');
        console.log('Net Pay:', result.netPay.toFixed(2));
    });
});
//# sourceMappingURL=ADFPaySlipParser.test.js.map