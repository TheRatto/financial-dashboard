import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  layout, 
  typography, 
  colors, 
  textStyles, 
  buttonStyles 
} from '../styles';
import { PDFUpload } from '../components/PDFUpload/PDFUpload';
import { fetchTransactions } from '../services/api';
import { format } from 'date-fns';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: transactions, refetch } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => fetchTransactions(false),
  } as const);

  const handleUploadSuccess = () => {
    refetch();
  };

  const lastUpload = transactions && transactions[0]?.createdAt 
    ? format(new Date(transactions[0].createdAt), 'dd MMM yyyy')
    : '-';

  return (
    <div className={`min-h-screen ${colors.gray[50]} py-8`}>
      <div className={layout.container.default}>
        {/* Header Section */}
        <div className={layout.spacing.section}>
          <h1 className={typography.heading.h1}>Dashboard</h1>
          <p className={`${typography.body.base} mt-2`}>
            Welcome to your financial overview
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stats Card */}
          <div className={`${layout.card.base} ${layout.card.padding}`}>
            <h3 className={typography.body.small}>Total Accounts</h3>
            <p className={`${typography.heading.h2} mt-2`}>0</p>
          </div>

          {/* Similar updates for other stat cards */}
        </div>

        {/* Main Content Grid */}
        <div className={layout.grid.sidebar}>
          {/* Recent Activity */}
          <div className={`${layout.card.base} ${layout.card.padding}`}>
            <h2 className={`${typography.heading.h4} mb-4`}>Recent Activity</h2>
            <PDFUpload onUploadSuccess={handleUploadSuccess} />
          </div>

          {/* Quick Actions */}
          <div className={`${layout.card.base} ${layout.card.padding}`}>
            <h2 className={`${typography.heading.h4} mb-4`}>Quick Actions</h2>
            <div className={layout.spacing.component}>
              {/* Action Buttons */}
              <button 
                onClick={() => navigate('/accounts')}
                className={`${buttonStyles.secondary} ${buttonStyles.icon} w-full justify-between`}>
                Upload New Statement
              </button>
              {/* Similar updates for other action buttons */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 