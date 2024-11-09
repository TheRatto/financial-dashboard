import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ViewDropdown } from '../components/ViewDropdown';
import { SortDropdown } from '../components/SortDropdown';
import { SortOption } from '../types/transaction';
import {
  ArchiveBoxIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import Select from 'react-select';
import { DateRangePicker } from '../components/DateRangePicker';
import { useTransactions } from '../hooks/useTransactions';
import { useSearchParams } from 'react-router-dom';
import { deleteTransaction, API_BASE_URL } from '../services/api';
import { 
  layout, 
  typography, 
  inputStyles, 
} from '../styles';
import { Transaction } from '../types/transaction';
import { formatBalance, getBalanceClass } from '../utils/formatters';
import { toast } from 'react-hot-toast';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';

interface AccountOption {
  value: string;
  label: string;
}

export function Transactions() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get('accountId');

  // Add accounts query
  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/accounts`);
      if (!response.ok) throw new Error('Failed to fetch accounts');
      return response.json();
    }
  });

  // Create memoized account options
  const accountOptions = useMemo(() => {
    return (accounts ?? []).map((account: { id: string; name: string }) => ({
      value: account.id,
      label: account.name
    }));
  }, [accounts]);

  const [startDate, setStartDate] = useState<Date | null>(() => 
    searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(() => 
    searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : null
  );

  const [showArchived, setShowArchived] = useState(false);
  const [perPage, setPerPage] = useState(25);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [selectedAccounts, setSelectedAccounts] = useState<AccountOption[]>([]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState<'soft' | 'hard' | null>(null);

  const deleteMutation = useMutation({
    mutationFn: ({ ids, type }: { ids: string[]; type: 'soft' | 'hard' }) =>
      Promise.all(ids.map(id => deleteTransaction(id, type))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setSelectedTransactions(new Set());
      setShowDeleteConfirm(false);
      toast.success(`Successfully ${deleteType === 'soft' ? 'archived' : 'deleted'} transactions`);
    },
    onError: (error: Error) => {
      console.error('Delete error:', error);
      toast.error(error.message || `Failed to ${deleteType === 'soft' ? 'archive' : 'delete'} transactions`);
    }
  });

  const { data: transactions, isLoading } = useTransactions({
    accountId: accountId ?? undefined,
    startDate: startDate ?? undefined,
    endDate: endDate ?? undefined,
    includeArchived: showArchived
  });

  const processedTransactions = useMemo(() => {
    const filtered = (transactions ?? []).filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const matchesAccount = selectedAccounts.length === 0 || 
        selectedAccounts.some(account => account.value === transaction.accountId);
      const matchesDateRange = (!startDate || transactionDate >= startDate) &&
                            (!endDate || transactionDate <= endDate);
      return matchesAccount && matchesDateRange;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'largest') return b.amount - a.amount;
      if (sortBy === 'smallest') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, selectedAccounts, startDate, endDate, sortBy]);

  const handleDelete = (type: 'soft' | 'hard') => {
    setDeleteType(type);
    setShowDeleteConfirm(true);
  };

  const handleSoftDelete = () => handleDelete('soft');
  const handleHardDelete = () => handleDelete('hard');

  const groupedTransactions = useMemo(() => {
    return processedTransactions.reduce((groups: { [date: string]: Transaction[] }, transaction: Transaction) => {
      const date = format(new Date(transaction.date), 'EEEE, d MMMM yyyy');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {});
  }, [processedTransactions]);

  const handleConfirmDelete = async () => {
    if (!deleteType) return;
    
    try {
      await deleteMutation.mutateAsync({
        ids: Array.from(selectedTransactions),
        type: deleteType
      });
    } catch (error) {
      console.error('Failed to delete transactions:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header - Remove delete buttons */}
      <div className={layout.spacing.section}>
        <div className="flex justify-between items-center">
          <h1 className={typography.heading.h1}>Transactions</h1>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={`${layout.card.base} ${layout.card.padding} mb-6`}>
        <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-6">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
          />
          
          <Select
            isMulti
            options={accountOptions}
            value={selectedAccounts}
            onChange={(newValue) => setSelectedAccounts(newValue as AccountOption[])}
            placeholder="Search accounts..."
            classNames={{
              control: (state) => `${inputStyles.select.control(state)} !min-h-[38px]`,
              menu: () => inputStyles.select.menu,
              option: (state) => inputStyles.select.option(state),
              container: () => 'w-full'
            }}
          />

          <ViewDropdown 
            showArchived={showArchived}
            setShowArchived={setShowArchived}
            perPage={perPage}
            setPerPage={setPerPage}
          />

          <SortDropdown 
            sortBy={sortBy} 
            setSortBy={setSortBy} 
          />
        </div>
      </div>

      {/* Keep existing table implementation */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
            <div key={date} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <h3 className={typography.heading.h4}>{date}</h3>
              </div>
              
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="w-12 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {/* Remove the checkbox, keep the column width */}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Balance</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {dayTransactions.map(transaction => (
                    <tr 
                      key={transaction.id}
                      className={`
                        ${transaction.deleted ? 'text-gray-400 dark:text-gray-500 line-through bg-gray-50 dark:bg-gray-900' : 'text-gray-900 dark:text-gray-100'}
                        hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150
                      `}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 dark:border-gray-600 text-violet-600 focus:ring-violet-500"
                          checked={selectedTransactions.has(transaction.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedTransactions);
                            if (e.target.checked) {
                              newSelected.add(transaction.id);
                            } else {
                              newSelected.delete(transaction.id);
                            }
                            setSelectedTransactions(newSelected);
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">{transaction.description}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={transaction.type === 'CREDIT' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {formatBalance(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`${getBalanceClass(transaction.balance)} dark:opacity-90`}>
                          {formatBalance(transaction.balance)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* Popup Action Bar */}
      {selectedTransactions.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 dark:border-gray-600 text-violet-600 dark:text-violet-500 focus:ring-violet-500 dark:focus:ring-violet-400 bg-white dark:bg-gray-700"
                  checked={selectedTransactions.size === processedTransactions.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTransactions(new Set(processedTransactions.map(t => t.id)));
                    } else {
                      setSelectedTransactions(new Set());
                    }
                  }}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Select All ({selectedTransactions.size}/{processedTransactions.length})
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleDelete('soft')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ArchiveBoxIcon className="h-4 w-4 mr-2" />
                Archive Selected
              </button>
              <button
                onClick={() => handleDelete('hard')}
                className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-500 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-gray-700"
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {deleteType === 'soft' ? 'Archive' : 'Delete'} Transactions?
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {deleteType === 'soft' 
                ? 'Archived transactions can be restored later.' 
                : 'This action cannot be undone.'}
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  deleteType === 'soft' 
                    ? 'bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600' 
                    : 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600'
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
} 