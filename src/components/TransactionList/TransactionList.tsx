import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTransactions, deleteTransaction } from '../../services/api';
import type { Transaction, SortOption } from '../../types/transaction';
import { sortTransactions } from '../../utils/transactionSort';
import { 
  TrashIcon, 
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';

/**
 * Transaction List Component with Sorting
 * Version: 1.0.0
 * Last verified: [current date]
 * 
 * ⚠️ WARNING: The sorting functionality is critical for user experience.
 * Please run tests before modifying the sort logic.
 * 
 * Features:
 * - Sort by date (newest/oldest)
 * - Sort by amount (largest/smallest)
 * - Maintains sort state during component lifecycle
 * 
 * @example
 * <TransactionList />
 */

type GroupedTransactions = {
  [date: string]: Transaction[];
};

export const TransactionList: React.FC = () => {
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState<'soft' | 'hard' | null>(null);

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions', true],
    queryFn: () => fetchTransactions(true),
  });

  console.log('Transactions data:', transactions);

  const deleteMutation = useMutation({
    mutationFn: ({ ids, type }: { ids: string[]; type: 'soft' | 'hard' }) =>
      Promise.all(ids.map(id => deleteTransaction(id, type))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setSelectedIds(new Set());
      setShowDeleteConfirm(false);
    }
  });

  const groupTransactionsByDate = (transactions: Transaction[]): GroupedTransactions => {
    const sorted = sortTransactions(transactions, sortBy);
    return sorted.reduce((groups: GroupedTransactions, transaction: Transaction) => {
      const date = new Date(transaction.date).toLocaleDateString('en-AU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {});
  };

  const groupedTransactions = transactions ? groupTransactionsByDate(transactions) : {};

  const handleSelectAll = (checked: boolean) => {
    if (checked && transactions) {
      setSelectedIds(new Set(transactions.map(t => t.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDelete = (type: 'soft' | 'hard') => {
    setDeleteType(type);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteType) return;
    
    try {
      await deleteMutation.mutateAsync({
        ids: Array.from(selectedIds),
        type: deleteType
      });
    } catch (error) {
      console.error('Failed to delete transactions:', error);
      // Optionally add error handling UI here
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="block w-48 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
        >
          <option value="newest">Most Recent</option>
          <option value="oldest">Oldest First</option>
          <option value="largest">Largest Amount</option>
          <option value="smallest">Smallest Amount</option>
        </select>
      </div>

      {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
        <div key={date} className="bg-white rounded-lg shadow overflow-hidden mb-4">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{date}</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dayTransactions.map((transaction) => (
                <tr 
                  key={transaction.id}
                  className={`
                    ${transaction.deleted ? 
                      'text-gray-400 line-through text-sm bg-gray-50' : 
                      'text-gray-900'
                    }
                    hover:bg-gray-50 transition-colors duration-150
                  `}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                      checked={selectedIds.has(transaction.id)}
                      onChange={(e) => handleSelect(transaction.id, e.target.checked)}
                    />
                  </td>
                  <td className="px-6 py-4">{transaction.description}</td>
                  <td className="px-6 py-4 text-right">${transaction.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    {transaction.balance ? `$${transaction.balance.toFixed(2)}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Updated Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                  checked={transactions?.length === selectedIds.size}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <span className="text-sm text-gray-700">
                  Select All ({selectedIds.size}/{transactions?.length})
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleDelete('soft')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArchiveBoxIcon className="h-4 w-4 mr-2" />
                Archive Selected
              </button>
              <button
                onClick={() => handleDelete('hard')}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900">
              {deleteType === 'soft' ? 'Archive' : 'Delete'} Transactions?
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {deleteType === 'soft' 
                ? 'Archived transactions can be restored later.' 
                : 'This action cannot be undone.'}
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  deleteType === 'soft' 
                    ? 'bg-violet-600 hover:bg-violet-700' 
                    : 'bg-red-600 hover:bg-red-700'
                } ${deleteMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {deleteMutation.isPending ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};