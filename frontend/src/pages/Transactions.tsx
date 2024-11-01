import React, { useState, useEffect } from 'react';
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
import { 
  layout, 
  typography, 
  colors, 
  forms, 
  buttonStyles, 
  inputStyles, 
  badgeStyles 
} from '../styles';

interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  balance: number;
  accountName: string;
}

const testTransactions: Transaction[] = [
  {
    id: '1',
    date: new Date('2024-03-15'),
    description: 'Woolworths Groceries',
    amount: 85.50,
    type: 'DEBIT',
    balance: 1425.30,
    accountName: 'Everyday Account'
  },
  {
    id: '2',
    date: new Date('2024-03-14'),
    description: 'Salary Payment',
    amount: 2500.00,
    type: 'CREDIT',
    balance: 1510.80,
    accountName: 'Savings Account'
  },
  {
    id: '3',
    date: new Date('2024-03-14'),
    description: 'Netflix Subscription',
    amount: 15.99,
    type: 'DEBIT',
    balance: -989.20,
    accountName: 'Everyday Account'
  }
];

interface AccountOption {
  value: string;
  label: string;
}

export function Transactions() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<AccountOption[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [perPage, setPerPage] = useState(25);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const accountOptions: AccountOption[] = [
    { value: 'everyday', label: 'Everyday Account' },
    { value: 'savings', label: 'Savings Account' },
    { value: 'credit', label: 'Credit Card' },
    { value: 'investment', label: 'Investment Account' },
    // Add more accounts as needed
  ];

  const accountSelect = (
    <div className="w-64">
      <Select
        isMulti
        options={accountOptions}
        value={selectedAccounts}
        onChange={(newValue) => setSelectedAccounts(newValue as AccountOption[])}
        placeholder="Search accounts..."
        classNames={{
          control: (state) => inputStyles.select.control(state),
          menu: () => inputStyles.select.menu,
          option: (state) => inputStyles.select.option(state),
          noOptionsMessage: () => inputStyles.select.noOptionsMessage,
          multiValue: () => badgeStyles.neutral,
          multiValueLabel: () => 'text-gray-700 dark:text-gray-200 text-sm px-2 py-1',
          multiValueRemove: () => 'hover:bg-gray-200 dark:hover:bg-dark-600 hover:text-gray-900 dark:hover:text-gray-100 rounded-r-md px-1'
        }}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            neutral0: 'var(--bg-color)',
            neutral20: 'var(--border-color)',
            neutral30: 'var(--border-hover-color)',
            primary: 'var(--primary-color)',
          },
        })}
      />
    </div>
  );

  const filteredTransactions = testTransactions.filter(transaction => {
    const matchesAccount = selectedAccounts.length === 0 || 
      selectedAccounts.some(account => account.value === transaction.accountName);
    const matchesDateRange = (!startDate || transaction.date >= startDate) &&
                           (!endDate || transaction.date <= endDate);
    return matchesAccount && matchesDateRange;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.date.getTime() - a.date.getTime();
      case 'oldest':
        return a.date.getTime() - b.date.getTime();
      case 'largest':
        const absA = Math.abs(a.amount);
        const absB = Math.abs(b.amount);
        if (absA === absB) {
          return a.type === 'DEBIT' ? -1 : 1;
        }
        return absB - absA;
      case 'smallest':
        const absALow = Math.abs(a.amount);
        const absBLow = Math.abs(b.amount);
        if (absALow === absBLow) {
          return a.type === 'CREDIT' ? -1 : 1;
        }
        return absALow - absBLow;
      default:
        return 0;
    }
  });

  const handleSelectAll = () => {
    if (selectedTransactions.size === sortedTransactions.length) {
      setSelectedTransactions(new Set());
    } else {
      setSelectedTransactions(new Set(sortedTransactions.map(t => t.id)));
    }
  };

  const handleSelectTransaction = (id: string) => {
    const newSelected = new Set(selectedTransactions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTransactions(newSelected);
  };

  const handleSoftDelete = () => {
    console.log('Soft delete:', Array.from(selectedTransactions));
    // Implement soft delete logic
    setSelectedTransactions(new Set());
  };

  const handleHardDelete = () => {
    console.log('Hard delete:', Array.from(selectedTransactions));
    // Implement hard delete logic
    setSelectedTransactions(new Set());
  };

  useEffect(() => {
    async function loadTransactions() {
      setIsLoading(true);
      try {
        // Your data fetching logic here
        // For now, we'll just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadTransactions();
  }, [/* your dependencies */]);

  return (
    <div className={`min-h-screen ${colors.gray[50]} py-8`}>
      <div className={layout.container.default}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className={`${buttonStyles.icon} ${buttonStyles.secondary} rounded-full p-2`}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className={typography.heading.h2}>Transactions</h1>
          </div>
        </div>

        {/* Filters Section */}
        <div className={`${layout.card.base} ${layout.card.padding} mt-8`}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Date Range */}
            <div className={layout.spacing.element}>
              <label className={forms.label}>Date Range</label>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onChange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
              />
            </div>

            {/* Account Filter */}
            <div className={layout.spacing.element}>
              <label className={forms.label}>Account</label>
              <Select
                isMulti
                options={accountOptions}
                value={selectedAccounts}
                onChange={(newValue) => setSelectedAccounts(newValue as AccountOption[])}
                placeholder="Search accounts..."
                classNames={{
                  control: (state) => inputStyles.select.control(state),
                  menu: () => inputStyles.select.menu,
                  option: (state) => inputStyles.select.option(state),
                  multiValue: () => badgeStyles.neutral,
                  multiValueLabel: () => typography.body.small,
                  multiValueRemove: () => buttonStyles.icon
                }}
              />
            </div>

            {/* Similar updates for other filters */}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-6 bg-white dark:bg-dark-800 rounded-xl shadow-sm p-12">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded"></div>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="mt-6 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden bg-white dark:bg-dark-800 rounded-xl shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
                <thead className="bg-gray-50 dark:bg-dark-700">
                  <tr>
                    <th scope="col" className="relative py-3.5 pl-4 pr-3 sm:pl-6">
                      <input
                        type="checkbox"
                        checked={selectedTransactions.size === sortedTransactions.length}
                        onChange={handleSelectAll}
                        className="h-4 w-4 rounded border-gray-300 dark:border-dark-600 
                          text-primary-600 dark:text-primary-500
                          focus:ring-primary-500 dark:focus:ring-primary-400 
                          focus:ring-offset-0"
                      />
                    </th>
                    {/* Header cells */}
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs 
                      font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Date
                    </th>
                    {/* ... other header cells with same dark mode classes ... */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
                  {sortedTransactions.map((transaction) => (
                    <tr 
                      key={transaction.id}
                      className={`
                        hover:bg-gray-50 dark:hover:bg-dark-700 
                        transition-colors duration-150 ease-in-out
                        ${selectedTransactions.has(transaction.id) 
                          ? 'bg-primary-50 dark:bg-primary-900/50 hover:bg-primary-100 dark:hover:bg-primary-900/75' 
                          : ''}
                      `}
                    >
                      {/* Checkbox cell */}
                      <td className="relative py-4 pl-4 pr-3 sm:pl-6">
                        <input
                          type="checkbox"
                          checked={selectedTransactions.has(transaction.id)}
                          onChange={() => handleSelectTransaction(transaction.id)}
                          className="h-4 w-4 rounded border-gray-300 dark:border-dark-600 
                            text-primary-600 dark:text-primary-500
                            focus:ring-primary-500 dark:focus:ring-primary-400 
                            focus:ring-offset-0"
                        />
                      </td>
                      {/* Data cells */}
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 
                        text-sm font-medium text-gray-900 dark:text-gray-100">
                        {format(transaction.date, 'dd/MM/yyyy')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 
                        text-sm text-gray-600 dark:text-gray-300">
                        {transaction.accountName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 
                        text-sm text-gray-600 dark:text-gray-300">
                        {transaction.description}
                      </td>
                      <td className={`whitespace-nowrap px-3 py-4 text-sm font-medium text-right
                        ${transaction.type === 'DEBIT' 
                          ? 'text-error-600 dark:text-error-400' 
                          : 'text-success-600 dark:text-success-400'}`}>
                        {transaction.type === 'DEBIT' ? '-' : ''}${transaction.amount.toFixed(2)}
                      </td>
                      <td className={`whitespace-nowrap px-3 py-4 text-sm font-medium text-right
                        ${transaction.balance < 0 
                          ? 'text-error-600 dark:text-error-400' 
                          : 'text-gray-900 dark:text-gray-100'}`}>
                        ${transaction.balance.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {sortedTransactions.length === 0 && (
          <div className="mt-6 bg-white dark:bg-dark-800 rounded-xl shadow-sm p-12 text-center">
            <ArchiveBoxIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
              No transactions found
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your filters to see more results
            </p>
          </div>
        )}

        {/* Action Bar */}
        {selectedTransactions.size > 0 && (
          <div className="fixed bottom-0 inset-x-0 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-4 
                flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {selectedTransactions.size} {selectedTransactions.size === 1 ? 'transaction' : 'transactions'} selected
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <button onClick={handleSoftDelete} className={buttonStyles.secondary}>
                    <ArchiveBoxIcon className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
                    Archive
                  </button>
                  <button onClick={handleHardDelete} className={buttonStyles.danger}>
                    <TrashIcon className="h-5 w-5 mr-2 text-error-400" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 