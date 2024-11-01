import { pool } from '../../db';
import { PaySlipData } from '../../types/payslip';

export class PayslipService {
    async savePayslip(payslipData: PaySlipData) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');  // Start transaction

            // Insert main salary transaction
            const salaryResult = await client.query(
                `INSERT INTO transactions 
                (date, description, amount, category, type) 
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING id`,
                [
                    payslipData.payPeriod.endDate,
                    'Military Salary',
                    payslipData.grossPay,
                    'Salary',
                    'income'
                ]
            );

            // Insert tax as a transaction
            if (payslipData.taxWithheld) {
                await client.query(
                    `INSERT INTO transactions 
                    (date, description, amount, category, type) 
                    VALUES ($1, $2, $3, $4, $5)`,
                    [
                        payslipData.payPeriod.endDate,
                        'Tax Withheld',
                        payslipData.taxWithheld,
                        'Tax',
                        'expense'
                    ]
                );
            }

            // Insert each deduction as a transaction
            for (const deduction of payslipData.deductions) {
                await client.query(
                    `INSERT INTO transactions 
                    (date, description, amount, category, type) 
                    VALUES ($1, $2, $3, $4, $5)`,
                    [
                        payslipData.payPeriod.endDate,
                        deduction.description,
                        deduction.amount,
                        'Deductions',
                        'expense'
                    ]
                );
            }

            await client.query('COMMIT');
            
            console.log('Successfully saved payslip data to database');
            return salaryResult.rows[0].id;

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error saving payslip to database:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    async getPayslipTransactions(startDate: Date, endDate: Date) {
        try {
            const result = await pool.query(
                `SELECT * FROM transactions 
                WHERE date BETWEEN $1 AND $2 
                AND (category = 'Salary' OR category = 'Deductions' OR category = 'Tax')
                ORDER BY date DESC`,
                [startDate, endDate]
            );
            return result.rows;
        } catch (error) {
            console.error('Error fetching payslip transactions:', error);
            throw error;
        }
    }
} 