import { PayslipParser } from '../../../types/parser';
import { PaySlipData } from '../../../types/payslip';

export class ADFPaySlipParser implements PayslipParser {
    name = 'ADF Payslip';

    async canParse(text: string): Promise<boolean> {
        return text.includes('ADF') || text.includes('Australian Defence Force');
    }

    async parse(text: string): Promise<PaySlipData> {
        try {
            const lines = text.split('\n').map(line => this.cleanLine(line));
            console.log('Cleaned lines:', lines);
            
            const paySlipData: PaySlipData = {
                employer: 'Department of Defence',
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
        } catch (error) {
            console.error('Error parsing payslip:', error);
            throw error;
        }
    }

    private cleanLine(line: string): string {
        return line.replace(/\s+/g, ' ').trim();
    }

    private findLine(lines: string[], searchText: string): string | undefined {
        return lines.find(line => line.toLowerCase().includes(searchText.toLowerCase()));
    }

    private extractAmount(line: string | undefined): number {
        if (!line) return 0;
        const match = line.match(/\$?([\d,]+\.?\d*)/);
        return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
    }

    private extractDate(line: string | undefined): Date {
        if (!line) return new Date();
        const match = line.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
        return match ? new Date(match[0]) : new Date();
    }

    private extractPaymentDate(lines: string[]): Date {
        const paymentLine = this.findLine(lines, 'Payment Date');
        return this.extractDate(paymentLine);
    }

    private extractPayPeriod(lines: string[]): { startDate: Date; endDate: Date } {
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

    private extractGrossPay(lines: string[]): number {
        const grossLine = this.findLine(lines, 'Gross Pay');
        return this.extractAmount(grossLine);
    }

    private extractNetPay(lines: string[]): number {
        const netLine = this.findLine(lines, 'Net Pay');
        return this.extractAmount(netLine);
    }

    private extractEarnings(lines: string[]): Array<{ description: string; amount: number }> {
        const earnings: Array<{ description: string; amount: number }> = [];
        const startIndex = lines.findIndex(line => line.toLowerCase().includes('earnings'));
        const endIndex = lines.findIndex(line => line.toLowerCase().includes('deductions'));
        
        if (startIndex === -1 || endIndex === -1) return earnings;

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

    private extractDeductions(lines: string[]): Array<{ description: string; amount: number }> {
        const deductions: Array<{ description: string; amount: number }> = [];
        const startIndex = lines.findIndex(line => line.toLowerCase().includes('deductions'));
        const endIndex = lines.findIndex(line => line.toLowerCase().includes('total'));
        
        if (startIndex === -1 || endIndex === -1) return deductions;

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

    private extractTaxWithheld(lines: string[]): number {
        const taxLine = this.findLine(lines, 'Tax Withheld');
        return this.extractAmount(taxLine);
    }

    private extractYTDGrossPay(lines: string[]): number {
        const ytdGrossLine = this.findLine(lines, 'YTD Gross');
        return this.extractAmount(ytdGrossLine);
    }

    private extractYTDTaxWithheld(lines: string[]): number {
        const ytdTaxLine = this.findLine(lines, 'YTD Tax');
        return this.extractAmount(ytdTaxLine);
    }

    private extractYTDSuperannuation(lines: string[]): number {
        const ytdSuperannuationLine = this.findLine(lines, 'YTD Superannuation');
        return this.extractAmount(ytdSuperannuationLine);
    }
} 