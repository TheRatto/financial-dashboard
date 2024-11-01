import { Transaction, StatementParser } from '../../types/transaction';

export const defaultParser: StatementParser = {
  name: 'Default',
  
  canParse: (text: string): boolean => {
    console.log('First 500 characters of statement:');
    console.log(text.substring(0, 500));
    return true;
  },
  
  parse: async (text: string): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (!line.trim()) continue;

      const datePattern = /^(\d{2}\/\d{2}\/\d{4})/;
      const dateMatch = line.match(datePattern);

      if (dateMatch) {
        const fullLine = line.trim();
        
        try {
          // Extract date
          const dateStr = fullLine.substring(0, 10);
          
          // Get the rest of the line
          let remainder = fullLine.substring(10).trim();
          
          // Look for money patterns
          const moneyPattern = /(-?\$?\d+,?\d*\.\d{2})/g;
          const allAmounts = [...remainder.matchAll(moneyPattern)].map(match => match[0]);
          
          if (allAmounts.length > 0) {
            // Parse the date
            const [day, month, year] = dateStr.split('/');
            const date = new Date(
              parseInt(year),
              parseInt(month) - 1,
              parseInt(day)
            );

            // Get description (everything after the last amount)
            const lastAmount = allAmounts[allAmounts.length - 1];
            const description = remainder.substring(
              remainder.indexOf(lastAmount) + lastAmount.length
            ).trim();

            // Parse amounts
            let debitAmount = 0;
            let creditAmount = 0;
            let balance = 0;

            // Process all found amounts
            allAmounts.forEach(amt => {
              const cleanAmt = parseFloat(amt.replace(/[$,]/g, ''));
              if (amt.includes('-')) {
                debitAmount = Math.abs(cleanAmt);
              } else if (allAmounts.indexOf(amt) === allAmounts.length - 1) {
                // Last amount is balance
                balance = cleanAmt;
              } else {
                creditAmount = cleanAmt;
              }
            });

            const amount = debitAmount > 0 ? debitAmount : creditAmount;
            const type = debitAmount > 0 ? 'debit' as const : 'credit' as const;

            const transaction: Transaction = {
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
        } catch (error) {
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