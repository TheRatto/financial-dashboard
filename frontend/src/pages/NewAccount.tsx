import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { createAccount } from '../services/accountService';
import { buttonStyles, inputStyles, cardStyles } from '../styles';

export default function NewAccount() {
  const navigate = useNavigate();
  const [accountName, setAccountName] = useState('');
  const [bankId, setBankId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const account = await createAccount({ accountName, bankId });
      navigate(`/accounts/${account.id}`);
    } catch (error) {
      console.error('Failed to create account:', error);
      setError(error instanceof Error ? error.message : 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className={`${cardStyles.base} relative px-4 py-10 sm:p-20`}>
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 text-gray-600 dark:text-gray-400 
              hover:text-gray-900 dark:hover:text-gray-200"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200 dark:divide-dark-700">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 dark:text-gray-300 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
                  New Account
                </h2>
                
                {error && (
                  <div className="rounded-md bg-error-50 dark:bg-error-900/50 p-4 mb-4">
                    <div className="text-sm text-error-700 dark:text-error-400">{error}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Account Name
                    </label>
                    <input
                      type="text"
                      id="accountName"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className={inputStyles.base}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="bankId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bank
                    </label>
                    <select
                      id="bankId"
                      value={bankId}
                      onChange={(e) => setBankId(e.target.value)}
                      className={inputStyles.base}
                      required
                    >
                      <option value="">Select a bank</option>
                      <option value="ing">ING</option>
                      <option value="westpac">Westpac</option>
                      <option value="commbank">CommBank</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={buttonStyles.primary}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Account'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}