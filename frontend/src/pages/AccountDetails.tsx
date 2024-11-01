import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAccount } from '../services/accountService';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { PDFUpload } from '../components/PDFUpload/PDFUpload';
import { buttonStyles, inputStyles, cardStyles } from '../styles';

const BANK_CONFIGS = {
  ing: {
    name: 'ING',
    acceptedFormats: '.pdf',
    maxSize: '10MB',
    instructions: 'Upload your ING bank statement PDF'
  },
  westpac: {
    name: 'Westpac',
    acceptedFormats: '.csv',
    maxSize: '5MB',
    instructions: 'Upload your Westpac transaction CSV'
  },
  commbank: {
    name: 'CommBank',
    acceptedFormats: '.csv',
    maxSize: '5MB',
    instructions: 'Upload your CommBank transaction CSV'
  }
};

interface Statement {
  id: string;
  month: number;
  year: number;
  fileName: string;
  createdAt: string;
}

export default function AccountDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const queryClient = useQueryClient();

  const { data: account, isLoading } = useQuery({
    queryKey: ['account', id],
    queryFn: () => getAccount(id!),
    enabled: !!id
  });

  const { data: statements = [] } = useQuery({
    queryKey: ['statements', id],
    queryFn: async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/statements/account/${id}`);
      if (!response.ok) throw new Error('Failed to fetch statements');
      return response.json();
    },
    enabled: !!id
  });

  const handleDeleteStatement = async (statementId: string, fileName: string) => {
    toast((t) => (
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-gray-900">
          Are you sure you want to delete "{fileName}"?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/statements/${statementId}`, {
                  method: 'DELETE',
                });
                
                if (!response.ok) throw new Error('Failed to delete statement');
                
                toast.success('Statement deleted successfully');
                queryClient.invalidateQueries({ queryKey: ['statements', id] });
                queryClient.invalidateQueries({ queryKey: ['account', id] });
              } catch (error) {
                console.error('Error deleting statement:', error);
                toast.error('Failed to delete statement');
              }
            }}
            className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
      style: {
        background: 'white',
        padding: '1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
    });
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!account) {
    return <div className="p-6">Account not found</div>;
  }

  const bankConfig = BANK_CONFIGS[account.bankId as keyof typeof BANK_CONFIGS] || {
    name: account.bankId,
    acceptedFormats: '.csv,.pdf',
    maxSize: '10MB',
    instructions: 'Upload your bank statement'
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/accounts')}
            className="inline-flex items-center text-sm font-medium 
              text-gray-500 dark:text-gray-400 
              hover:text-primary-600 dark:hover:text-primary-400 
              transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to Accounts
          </button>
        </div>

        <div className={cardStyles.base}>
          {/* Account Name Section */}
          <div className="px-6 py-5 border-b border-gray-200 dark:border-dark-700">
            <div className="flex items-center">
              {isEditing ? (
                <div className="flex-1 flex items-center gap-4">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className={inputStyles.base}
                  />
                  <button onClick={() => {/* your existing handleSave logic */}} className={buttonStyles.primary}>
                    Save
                  </button>
                  <button onClick={() => setIsEditing(false)} className={buttonStyles.secondary}>
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {account?.name}
                  </h2>
                  <button
                    onClick={() => {
                      setNewName(account?.name || '');
                      setIsEditing(true);
                    }}
                    className="ml-4 p-2 text-gray-400 dark:text-gray-500 
                      hover:text-gray-600 dark:hover:text-gray-300 
                      hover:bg-gray-100 dark:hover:bg-dark-700 
                      rounded-full transition-colors"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Account Info */}
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Bank</dt>
                <dd className="mt-1 text-lg font-medium text-gray-900 dark:text-gray-100">
                  {bankConfig.name}
                </dd>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Transactions</dt>
                <dd className="mt-1 text-lg font-medium text-gray-900 dark:text-gray-100">0</dd>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                <dd className="mt-1 text-lg font-medium text-gray-900 dark:text-gray-100">
                  {statements[0] ? format(new Date(statements[0].createdAt), 'dd MMM yyyy') : '-'}
                </dd>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="px-6 py-5 border-t border-gray-200 dark:border-dark-700">
            <PDFUpload 
              onUploadSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ['statements', id] });
                queryClient.invalidateQueries({ queryKey: ['account', id] });
              }} 
            />
          </div>

          {/* Statements List */}
          <div className="px-6 py-5 border-t border-gray-200 dark:border-dark-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Uploaded Statements
            </h3>
            <div className="space-y-3">
              {statements.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400 italic 
                  bg-gray-50 dark:bg-dark-700 p-4 rounded-lg text-center">
                  No statements uploaded yet
                </div>
              ) : (
                statements.map((statement: Statement) => (
                  <div 
                    key={statement.id} 
                    className="flex items-center justify-between p-4 
                      bg-gray-50 dark:bg-dark-700 
                      rounded-lg 
                      hover:bg-gray-100 dark:hover:bg-dark-600 
                      transition-colors duration-200"
                  >
                    <button
                      onClick={() => navigate(`/transactions?accountId=${id}&startDate=${format(new Date(statement.year, statement.month - 1, 1), 'yyyy-MM-dd')}&endDate=${format(new Date(statement.year, statement.month, 0), 'yyyy-MM-dd')}`)}
                      className="text-primary-600 dark:text-primary-400 
                        hover:text-primary-700 dark:hover:text-primary-300 
                        font-medium"
                    >
                      {format(new Date(statement.year, statement.month - 1), 'MMMM yyyy')}
                    </button>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Uploaded {format(new Date(statement.createdAt), 'dd MMM yyyy')}
                      </span>
                      <button
                        onClick={() => handleDeleteStatement(statement.id, statement.fileName)}
                        className="p-2 text-error-600 dark:text-error-400 
                          hover:text-error-800 dark:hover:text-error-300 
                          hover:bg-error-50 dark:hover:bg-error-900/50 
                          rounded-full transition-colors"
                        title="Delete statement"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 