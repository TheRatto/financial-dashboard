import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAccount } from '../services/accountService';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { PDFUpload } from '../components/PDFUpload/PDFUpload';
import { buttonStyles, inputStyles, cardStyles } from '../styles';
import { StatementsList } from '../components/StatementsList';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import axios from 'axios';
import { deleteAccount } from '../services/accountService';

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
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Account query
  const { data: account, isLoading } = useQuery({
    queryKey: ['account', id],
    queryFn: () => getAccount(id!),
    enabled: !!id && id !== 'new'
  });

  // Statements query
  const { 
    data: statements = [], 
    isLoading: statementsLoading, 
    error: statementsError 
  } = useQuery({
    queryKey: ['statements', id],
    queryFn: () => fetch(`/api/statements/account/${id}`).then(res => res.json()),
    enabled: !!id
  });

  // Handle navigation after hooks
  useEffect(() => {
    if (id === 'new') {
      navigate('/accounts/new');
    }
  }, [id, navigate]);

  // Add delete handler
  const handleDeleteStatement = async (statementId: string, fileName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/statements/${statementId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete statement');
      }

      toast.success('Statement deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['statements', id] });
    } catch (error) {
      console.error('Error deleting statement:', error);
      toast.error('Failed to delete statement');
    }
  };

  // Add save handler
  const handleSave = async () => {
    try {
      const response = await fetch(`/api/accounts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        throw new Error('Failed to update account name');
      }

      toast.success('Account name updated');
      queryClient.invalidateQueries({ queryKey: ['account', id] });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('Failed to update account name');
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount(id!);
      toast.success('Account deleted successfully');
      navigate('/accounts');
    } catch (error) {
      console.error('Error deleting account:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to delete account');
      } else {
        toast.error('Failed to delete account');
      }
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (id === 'new') return null;
  if (isLoading) return <div>Loading...</div>;
  if (!account) return <div>Account not found</div>;

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
        <div className="mb-6 flex justify-between items-center">
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
          
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className={`${buttonStyles.danger} inline-flex items-center`}
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Delete Account
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
                  <button onClick={handleSave} className={buttonStyles.primary}>
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
              accountId={id!}
              onUploadSuccess={() => {
                // Invalidate all statement queries for this account
                queryClient.invalidateQueries({ 
                  queryKey: ['statements']
                });
                queryClient.invalidateQueries({ 
                  queryKey: ['statements', id]
                });
                queryClient.invalidateQueries({ 
                  queryKey: ['transactions']
                });
                
                // Force an immediate refetch
                queryClient.refetchQueries({ 
                  queryKey: ['statements', id]
                });
              }} 
            />
          </div>

          {/* Statements List */}
          <div className="px-6 py-5 border-t border-gray-200 dark:border-dark-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Uploaded Statements
            </h3>
            
            <div className="mt-6">
              {statementsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
                </div>
              ) : (
                <>
                  {statementsError && (
                    <div className="text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-900/50 p-4 rounded-lg">
                      Error loading statements: {statementsError.message}
                    </div>
                  )}
                  <StatementsList 
                    statements={statements} 
                    onDelete={handleDeleteStatement}
                    onViewTransactions={(statement) => {
                      navigate(`/transactions?accountId=${id}&startDate=${format(new Date(statement.year, statement.month - 1, 1), 'yyyy-MM-dd')}&endDate=${format(new Date(statement.year, statement.month, 0), 'yyyy-MM-dd')}`);
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        isLoading={isDeleting}
        title="Delete Account"
        message="Are you sure you want to delete this account? All related transactions and statements will be permanently deleted. This action cannot be undone."
      />
    </div>
  );
} 