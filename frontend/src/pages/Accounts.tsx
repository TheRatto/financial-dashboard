import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TrashIcon, BanknotesIcon, PlusIcon } from '@heroicons/react/24/outline';
import { getAccounts, deleteAccount, restoreAccount } from '../services/accountService';
import { buttonStyles, textStyles, cardStyles } from '../styles';
import { toast } from 'react-hot-toast';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Switch } from '@headlessui/react';


export function Accounts() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<{id: string, name: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  const { data: accounts, isLoading, error } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts
  });

  const handleDeleteClick = (e: React.MouseEvent, account: { id: string, name: string }) => {
    e.stopPropagation(); // Prevent navigation to account details
    setAccountToDelete(account);
    setDeleteModalOpen(true);
  };

  const handleDeleteAccount = async () => {
    if (!accountToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteAccount(accountToDelete.id);
      toast.success('Account deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    } catch (error) {
      console.error('Error deleting account:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to delete account');
      } else {
        toast.error('Failed to delete account');
      }
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setAccountToDelete(null);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreAccount(id);
      toast.success('Account restored successfully');
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    } catch (error) {
      console.error('Error restoring account:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to restore account');
      } else {
        toast.error('Failed to restore account');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className={textStyles.heading}>Accounts</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Switch
                checked={showDeleted}
                onChange={setShowDeleted}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  dark:focus:ring-offset-dark-800
                  ${showDeleted ? 'bg-primary-600 dark:bg-primary-500' : 'bg-gray-200 dark:bg-dark-600'}`}
              >
                <span className="sr-only">Show deleted accounts</span>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${showDeleted ? 'translate-x-6' : 'translate-x-1'}`} 
                />
              </Switch>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Show deleted
              </span>
            </div>
            <button
              onClick={() => navigate('/accounts/new')}
              className={buttonStyles.primary}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Account
            </button>
          </div>
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {accounts?.map((account) => (
                  <motion.div
                    key={account.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => navigate(`/accounts/${account.id}`)}
                    className="bg-white dark:bg-dark-800 overflow-hidden rounded-lg 
                      shadow hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                            {account.name}
                          </h3>
                          <div className="mt-1 text-sm font-medium text-primary-600 dark:text-primary-400 capitalize">
                            {account.bankId}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => handleDeleteClick(e, account)}
                            className="p-2 text-error-600 hover:text-error-700 
                              hover:bg-error-50 dark:hover:bg-error-900/50 
                              rounded-full transition-colors"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                          <BanknotesIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
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

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setAccountToDelete(null);
        }}
        onConfirm={handleDeleteAccount}
        isLoading={isDeleting}
        title={`Delete ${accountToDelete?.name}`}
        message="Are you sure you want to delete this account? All related transactions and statements will be permanently deleted. This action cannot be undone."
      />
    </div>
  );
} 