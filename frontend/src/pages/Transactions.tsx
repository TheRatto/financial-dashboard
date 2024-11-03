import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ViewDropdown } from '../components/ViewDropdown';
import { SortDropdown } from '../components/SortDropdown';
import { SortOption } from '../types/transaction';
import {
  CheckCircleIcon,
  ArchiveBoxIcon,
  TrashIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import Select from 'react-select';
import { DateRangePicker } from '../components/DateRangePicker';
import { useTransactions } from '../hooks/useTransactions';
import { useSearchParams } from 'react-router-dom';
import { deleteTransaction } from '../services/api';
import { 
  layout, 
  typography, 
  colors, 
  forms, 
  buttonStyles, 
  inputStyles, 
  badgeStyles 
} from '../styles';
import { Transaction } from '../types/transaction';
import { formatBalance, getBalanceClass } from '../utils/formatters';

interface AccountOption {
  value: string;
  label: string;
}

export function Transactions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const accountId = searchParams.get('accountId');
  
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
  const [minBalance, setMinBalance] = useState<number | null>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<AccountOption[]>([]);

  const { data: transactions, isLoading, error } = useTransactions({
    accountId: accountId ?? undefined,
    startDate: startDate ?? undefined,
    endDate: endDate ?? undefined,
    includeArchived: showArchived
  });

  const accountOptions: AccountOption[] = [
    { value: 'everyday', label: 'Everyday Account' },
    { value: 'savings', label: 'Savings Account' },
    { value: 'credit', label: 'Credit Card' },
    { value: 'investment', label: 'Investment Account' },
  ];

  const filteredTransactions = useMemo(() => {
    return (transactions ?? []).filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const matchesAccount = selectedAccounts.length === 0 || 
        selectedAccounts.some(account => account.value === transaction.accountId);
      const matchesDateRange = (!startDate || transactionDate >= startDate) &&
                            (!endDate || transactionDate <= endDate);
      const matchesBalanceRange = !minBalance || 
        (transaction.balance ?? -Infinity) >= minBalance;
      return matchesAccount && matchesDateRange && matchesBalanceRange;
    });
  }, [transactions, selectedAccounts, startDate, endDate, minBalance]);

  const sortedTransactions = useMemo(() => {
    return (transactions ?? []).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      return 0; // Default case
    });
  }, [transactions, sortBy]);

  // Preserve delete handlers
  const handleSoftDelete = async () => {
    try {
      await Promise.all(
        Array.from(selectedTransactions).map(id => 
          deleteTransaction(id, 'soft')
        )
      );
      setSelectedTransactions(new Set());
    } catch (error) {
      console.error('Error soft deleting transactions:', error);
    }
  };

  const handleHardDelete = async () => {
    try {
      await Promise.all(
        Array.from(selectedTransactions).map(id => 
          deleteTransaction(id, 'hard')
        )
      );
      setSelectedTransactions(new Set());
    } catch (error) {
      console.error('Error hard deleting transactions:', error);
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
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4 text-red-600">
          {error instanceof Error ? error.message : 'Failed to load transactions'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Fix 6: Replace typography table classes with Tailwind */}
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.size === sortedTransactions.length}
                    onChange={() => {
                      if (selectedTransactions.size === sortedTransactions.length) {
                        setSelectedTransactions(new Set());
                      } else {
                        setSelectedTransactions(new Set(sortedTransactions.map(t => t.id)));
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.has(transaction.id)}
                      onChange={() => {
                        const newSelected = new Set(selectedTransactions);
                        if (newSelected.has(transaction.id)) {
                          newSelected.delete(transaction.id);
                        } else {
                          newSelected.add(transaction.id);
                        }
                        setSelectedTransactions(newSelected);
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(transaction.date), 'dd MMM yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <span className={transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}>
                      {formatBalance(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <span className={getBalanceClass(transaction.balance)}>
                      {formatBalance(transaction.balance)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  checked={selectedTransactions.size === sortedTransactions.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTransactions(new Set(sortedTransactions.map(t => t.id)));
                    } else {
                      setSelectedTransactions(new Set());
                    }
                  }}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Select All ({selectedTransactions.size}/{sortedTransactions.length})
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSoftDelete}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ArchiveBoxIcon className="h-4 w-4 mr-2" />
                Archive Selected
              </button>
              <button
                onClick={handleHardDelete}
                className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-500 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-gray-700"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 