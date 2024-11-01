import { useNavigate } from 'react-router-dom';
import { PlusIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { getAccounts } from '../services/accountService';
import { format } from 'date-fns';
import { buttonStyles, cardStyles, textStyles } from '../styles';

export function Accounts() {
  const navigate = useNavigate();
  const { data: accounts, isLoading, error } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className={textStyles.heading}>Accounts</h1>
          <button
            onClick={() => navigate('/accounts/new')}
            className={buttonStyles.primary}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Account
          </button>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse text-gray-500 dark:text-gray-400">
                Loading accounts...
              </div>
            </div>
          ) : error ? (
            <div className="rounded-lg bg-error-50 dark:bg-error-900/50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-error-800 dark:text-error-200">
                    Error loading accounts
                  </h3>
                </div>
              </div>
            </div>
          ) : accounts && accounts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  onClick={() => navigate(`/accounts/${account.id}`)}
                  className={`${cardStyles.base} ${cardStyles.hover} cursor-pointer`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {account.name}
                        </h3>
                        <div className="mt-1 text-sm font-medium text-primary-600 capitalize">
                          {account.bankId}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <BanknotesIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Created {format(new Date(account.createdAt), 'dd MMM yyyy')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={cardStyles.base}>
              <div className="p-12 text-center">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <BanknotesIcon className="h-full w-full" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No accounts yet</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Get started by creating your first account
                </p>
                <button
                  onClick={() => navigate('/accounts/new')}
                  className={`${buttonStyles.primary} mt-6`}
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 