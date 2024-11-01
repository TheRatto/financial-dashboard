import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { BankIcon } from './BankIcon';

type Bank = {
  id: string;
  name: string;
  logo: string;
  supported: boolean;
};

const banks: Bank[] = [
  {
    id: 'ing',
    name: 'ING',
    logo: '/bank-logos/ing.svg', // We'll need to add these logos
    supported: true
  },
  {
    id: 'commbank',
    name: 'Commonwealth Bank',
    logo: '/bank-logos/commbank.svg',
    supported: false
  },
  {
    id: 'westpac',
    name: 'Westpac',
    logo: '/bank-logos/westpac.svg',
    supported: false
  },
  // Add more banks here
];

interface BankGridProps {
  isOpen: boolean;
  onClose: () => void;
  onBankSelect: (bankId: string) => void;
}

export const BankGrid: React.FC<BankGridProps> = ({ isOpen, onClose, onBankSelect }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl rounded-xl bg-white p-8">
          <Dialog.Title className="text-xl font-semibold text-gray-900 mb-6">
            Select Your Bank
          </Dialog.Title>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {banks.map((bank) => (
              <button
                key={bank.id}
                onClick={() => bank.supported && onBankSelect(bank.id)}
                className={`
                  p-4 rounded-lg border-2 text-center hover:border-violet-500 
                  transition-colors duration-200 relative
                  ${bank.supported 
                    ? 'border-gray-200 cursor-pointer' 
                    : 'border-gray-100 cursor-not-allowed opacity-50'
                  }
                `}
              >
                <div className="flex flex-col items-center gap-2">
                  <BankIcon bankId={bank.id} className="w-16 h-16" />
                  <span className="text-sm font-medium text-gray-900">
                    {bank.name}
                  </span>
                </div>
                {!bank.supported && (
                  <span className="absolute top-2 right-2 text-xs text-gray-500">
                    Coming Soon
                  </span>
                )}
              </button>
            ))}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}; 