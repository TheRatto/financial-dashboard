import type { Transaction, SortOption } from '../types/transaction';

/**
 * Transaction Sort Utility
 * Version: 1.0.0
 * 
 * Handles sorting of transactions by various criteria
 */
export const sortTransactions = (transactions: Transaction[], sortBy: SortOption): Transaction[] => {
  const sorted = [...transactions];
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    case 'largest':
      return sorted.sort((a, b) => b.amount - a.amount);
    case 'smallest':
      return sorted.sort((a, b) => a.amount - b.amount);
    default:
      return sorted;
  }
}; 