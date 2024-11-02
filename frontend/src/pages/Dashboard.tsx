import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  layout, 
  typography, 
  colors, 
  buttonStyles 
} from '../styles';
import { fetchTransactions } from '../services/api';
import { format } from 'date-fns';
import { PlusIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => fetchTransactions(false),
  } as const);

  const lastUpload = transactions && transactions[0]?.createdAt 
    ? format(new Date(transactions[0].createdAt), 'dd MMM yyyy')
    : '-';

  return (
    <div className={`min-h-screen ${colors.gray[50]} dark:bg-dark-900 py-8`}>
      <div className={layout.container.default}>
        {/* Header Section */}
        <div className={layout.spacing.section}>
          <h1 className={typography.heading.h1}>Dashboard</h1>
          <p className={`${typography.body.base} mt-2 text-gray-600 dark:text-gray-400`}>
            Welcome to your financial overview
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${layout.card.base} ${layout.card.padding}`}>
            <h3 className={typography.body.small}>Total Accounts</h3>
            <p className={`${typography.heading.h2} mt-2`}>0</p>
          </div>
          {/* Add other stat cards as needed */}
        </div>

        {/* Main Content Grid */}
        <div className={layout.grid.sidebar}>
          {/* Recent Activity */}
          <div className={`${layout.card.base} ${layout.card.padding}`}>
            <h2 className={`${typography.heading.h4} mb-4`}>Recent Activity</h2>
            {transactions?.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No transactions yet. Upload your first statement to get started.
                </p>
                <button 
                  onClick={() => navigate('/accounts')}
                  className={`${buttonStyles.primary} inline-flex items-center`}
                >
                  <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                  Upload Statement
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Add your transactions list here */}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className={`${layout.card.base} ${layout.card.padding}`}>
            <h2 className={`${typography.heading.h4} mb-4`}>Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/accounts/new')}
                className={`${buttonStyles.secondary} w-full justify-between inline-flex items-center`}
              >
                <span>Add New Account</span>
                <PlusIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate('/accounts')}
                className={`${buttonStyles.secondary} w-full justify-between inline-flex items-center`}
              >
                <span>View All Accounts</span>
                <ArrowUpTrayIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 