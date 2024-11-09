import { useQuery } from '@tanstack/react-query';
import { Transaction } from '../types/transaction';
import { API_BASE_URL } from '../services/api';

interface UseTransactionsParams {
  accountId?: string;
  startDate?: Date;
  endDate?: Date;
  includeArchived?: boolean;
}

export function useTransactions({
  accountId,
  startDate,
  endDate,
  includeArchived
}: UseTransactionsParams) {
  return useQuery<Transaction[]>({
    queryKey: ['transactions', accountId, startDate, endDate, includeArchived],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (accountId) params.append('accountId', accountId);
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());
      if (includeArchived) params.append('includeDeleted', 'true');

      const response = await fetch(`${API_BASE_URL}/transactions?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      return data;
    }
  });
} 