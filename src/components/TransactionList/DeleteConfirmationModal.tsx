import React from 'react';
import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'soft' | 'hard' | null;
  count: number;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  count
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          
          <Dialog.Title className="mt-4 text-lg font-medium text-center text-gray-900">
            {type === 'hard' ? 'Permanently Delete' : 'Hide'} Transactions?
          </Dialog.Title>

          <Dialog.Description className="mt-2 text-sm text-center text-gray-500">
            {type === 'hard' 
              ? `This will permanently delete ${count} transaction${count !== 1 ? 's' : ''}. This action cannot be undone.`
              : `This will hide ${count} transaction${count !== 1 ? 's' : ''} from view. You can restore them later.`
            }
          </Dialog.Description>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === 'hard'
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              }`}
              onClick={onConfirm}
            >
              {type === 'hard' ? 'Delete' : 'Hide'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}; 