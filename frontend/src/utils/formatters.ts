export const formatBalance = (balance: number | undefined): string => {
  if (balance === undefined) return '-';
  return `$${balance.toFixed(2)}`;
};

export const getBalanceClass = (balance: number | undefined): string => {
  if (balance === undefined) return 'text-gray-900 dark:text-gray-100';
  return balance < 0 
    ? 'text-error-600 dark:text-error-400' 
    : 'text-gray-900 dark:text-gray-100';
}; 