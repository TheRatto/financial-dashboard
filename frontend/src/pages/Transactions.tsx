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
import { deleteTransaction } from '../services/api';
import { 
  layout, 
  typography, 
  inputStyles, 
} from '../styles';
import { Transaction } from '../types/transaction';
import { formatBalance, getBalanceClass } from '../utils/formatters';
import { toast } from 'react-hot-toast';

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

  const processedTransactions = useMemo(() => {
    const filtered = (transactions ?? []).filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const matchesAccount = selectedAccounts.length === 0 || 
        selectedAccounts.some(account => account.value === transaction.accountId);
      const matchesDateRange = (!startDate || transactionDate >= startDate) &&
                            (!endDate || transactionDate <= endDate);
      const matchesBalanceRange = !minBalance || 
        (transaction.balance ?? -Infinity) >= minBalance;
      return matchesAccount && matchesDateRange && matchesBalanceRange;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'largest') return b.amount - a.amount;
      if (sortBy === 'smallest') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, selectedAccounts, startDate, endDate, minBalance, sortBy]);

  const handleDelete = async (type: 'soft' | 'hard') => {
    const action = type === 'soft' ? 'archive' : 'delete';
    if (!window.confirm(`Are you sure you want to ${action} the selected transactions?`)) {
      return;
    }

    const previousTransactions = new Set(selectedTransactions);
    
    try {
      setSelectedTransactions(new Set());
      await Promise.all(
        Array.from(previousTransactions).map(id => 
          deleteTransaction(id, type)
        )
      );
      toast.success(`Successfully ${action}d selected transactions`);
    } catch (error) {
      setSelectedTransactions(previousTransactions);
      console.error(`Error ${action}ing transactions:`, error);
      toast.error(`Failed to ${action} transactions`);
    }
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
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 dark:border-gray-600 text-violet-600 focus:ring-violet-500"
                        checked={selectedTransactions.size === dayTransactions.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            const newSelected = new Set(selectedTransactions);
                            dayTransactions.forEach(t => newSelected.add(t.id));
                            setSelectedTransactions(newSelected);
                          } else {
                            const newSelected = new Set(selectedTransactions);
                            dayTransactions.forEach(t => newSelected.delete(t.id));
                            setSelectedTransactions(newSelected);
                          }
                        }}
                      />
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