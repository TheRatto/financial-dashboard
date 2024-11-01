"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADFPaySlipParser = void 0;
class ADFPaySlipParser {
    constructor() {
        this.name = 'ADF Payslip';
    }
    async canParse(text) {
        return text.includes('ADF') || text.includes('Australian Defence Force');
    }
    async parse(text) {
        try {
            const lines = text.split('\n').map(line => this.cleanLine(line));
            console.log('Cleaned lines:', lines);
            const paySlipData = {
                paymentDate: this.extractPaymentDate(lines),
                payPeriod: this.extractPayPeriod(lines),
                grossPay: this.extractGrossPay(lines),
                netPay: this.extractNetPay(lines),
                earnings: this.extractEarnings(lines),
                deductions: this.extractDeductions(lines),
                taxWithheld: this.extractTaxWithheld(lines),
                yearToDate: {
                    grossPay: this.extractYTDGrossPay(lines),
                    taxWithheld: this.extractYTDTaxWithheld(lines),
                    superannuation: this.extractYTDSuperannuation(lines)
                }
            };
            console.log('Parsed payslip data:', paySlipData);
            return paySlipData;
        }
        catch (error) {
            console.error('Error parsing payslip:', error);
            throw error;
        }
    }
    cleanLine(line) {
        return line.replace(/\s+/g, ' ').trim();
    }
    findLine(lines, searchText) {
        return lines.find(line => line.toLowerCase().includes(searchText.toLowerCase()));
    }
    extractAmount(line) {
        if (!line)
            return 0;
        const match = line.match(/\$?([\d,]+\.?\d*)/);
        return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
    }
    extractDate(line) {
        if (!line)
            return new Date();
        const match = line.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
        return match ? new Date(match[0]) : new Date();
    }
    extractPaymentDate(lines) {
        const paymentLine = this.findLine(lines, 'Payment Date');
        return this.extractDate(paymentLine);
    }
    extractPayPeriod(lines) {
        const periodLine = this.findLine(lines, 'Pay Period');
        if (!periodLine) {
            return {
                startDate: new Date(),
                endDate: new Date()
            };
        }
        const dates = periodLine.match(/\d{1,2}\/\d{1,2}\/\d{4}/g) || [];
        return {
            startDate: dates[0] ? new Date(dates[0]) : new Date(),
            endDate: dates[1] ? new Date(dates[1]) : new Date()
        };
    }
    extractGrossPay(lines) {
        const grossLine = this.findLine(lines, 'Gross Pay');
        return this.extractAmount(grossLine);
    }
    extractNetPay(lines) {
        const netLine = this.findLine(lines, 'Net Pay');
        return this.extractAmount(netLine);
    }
    extractEarnings(lines) {
        const earnings = [];
        const startIndex = lines.findIndex(line => line.toLowerCase().includes('earnings'));
        const endIndex = lines.findIndex(line => line.toLowerCase().includes('deductions'));
        if (startIndex === -1 || endIndex === -1)
            return earnings;
        for (let i = startIndex + 1; i < endIndex; i++) {
            const line = lines[i];
            const amount = this.extractAmount(line);
            if (amount > 0) {
                earnings.push({
                    description: line.replace(/\$?([\d,]+\.?\d*)/, '').trim(),
                    amount
                });
            }
        }
        return earnings;
    }
    extractDeductions(lines) {
        const deductions = [];
        const startIndex = lines.findIndex(line => line.toLowerCase().includes('deductions'));
        const endIndex = lines.findIndex(line => line.toLowerCase().includes('total'));
        if (startIndex === -1 || endIndex === -1)
            return deductions;
        for (let i = startIndex + 1; i < endIndex; i++) {
            const line = lines[i];
            const amount = this.extractAmount(line);
            if (amount > 0) {
                deductions.push({
                    description: line.replace(/\$?([\d,]+\.?\d*)/, '').trim(),
                    amount
                });
            }
        }
        return deductions;
    }
    extractTaxWithheld(lines) {
        const taxLine = this.findLine(lines, 'Tax Withheld');
        return this.extractAmount(taxLine);
    }
    extractYTDGrossPay(lines) {
        const ytdGrossLine = this.findLine(lines, 'YTD Gross');
        return this.extractAmount(ytdGrossLine);
    }
    extractYTDTaxWithheld(lines) {
        const ytdTaxLine = this.findLine(lines, 'YTD Tax');
        return this.extractAmount(ytdTaxLine);
    }
    extractYTDSuperannuation(lines) {
        const ytdSuperLine = this.findLine(lines, 'YTD Super');
        return this.extractAmount(ytdSuperLine);
    }
}
exports.ADFPaySlipParser = ADFPaySlipParser;
//# sourceMappingURL=ADFPaySlipParser.js.map