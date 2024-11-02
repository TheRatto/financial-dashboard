import React from 'react';
import { format } from 'date-fns';
import { TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface Statement {
  id: string;
  fileName: string;
  month: number;
  year: number;
  bankName: string;
  createdAt: string;
}

interface StatementsListProps {
  statements: Statement[];
  onDelete: (statementId: string, fileName: string) => Promise<void>;
  onViewTransactions: (statement: Statement) => void;
}

export const StatementsList: React.FC<StatementsListProps> = ({ 
  statements, 
  onDelete,
  onViewTransactions 
}) => {
  const handleDelete = async (statementId: string, fileName: string) => {
    try {
      await onDelete(statementId, fileName);
      toast.success('Statement deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete statement');
    }
  };

  if (!statements.length) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 italic 
        bg-gray-50 dark:bg-dark-700 
        p-4 rounded-lg text-center">
        No statements uploaded yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {statements.map((statement) => (
        <div 
          key={statement.id}
          className="flex items-center justify-between p-4 
            bg-gray-50 dark:bg-dark-700 
            rounded-lg 
            hover:bg-gray-100 dark:hover:bg-dark-600 
            transition-colors duration-200"
        >
          <button
            onClick={() => onViewTransactions(statement)}
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
              onClick={() => handleDelete(statement.id, statement.fileName)}
              className="p-2 text-error-600 dark:text-error-400 
                hover:text-error-800 dark:hover:text-error-300 
                hover:bg-error-50 dark:hover:bg-error-900/50 
                rounded-full transition-colors"
              title="Delete statement"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}; 