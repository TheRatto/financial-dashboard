import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { TrashIcon } from '@heroicons/react/24/outline';

interface Statement {
  id: string;
  month: number;
  year: number;
  fileName: string;
  createdAt: string;
}

interface Props {
  accountId: string;
}

export const UploadedStatements: React.FC<Props> = ({ accountId }) => {
  const [statements, setStatements] = useState<Statement[]>([]);
  const navigate = useNavigate();

  const fetchStatements = async () => {
    try {
      const response = await fetch(`/api/statements/account/${accountId}`);
      if (!response.ok) throw new Error('Failed to fetch statements');
      const data = await response.json();
      setStatements(data);
    } catch (error) {
      console.error('Error fetching statements:', error);
    }
  };

  useEffect(() => {
    fetchStatements();
  }, [accountId]);

  const handleDelete = async (statementId: string, fileName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}" and its transactions?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/statements/${statementId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete statement');
      
      // Refresh the statements list
      fetchStatements();
    } catch (error) {
      console.error('Error deleting statement:', error);
    }
  };

  const viewTransactions = (statement: Statement) => {
    const startDate = new Date(statement.year, statement.month - 1, 1);
    const endDate = new Date(statement.year, statement.month, 0);
    
    navigate(`/transactions?accountId=${accountId}&startDate=${format(startDate, 'yyyy-MM-dd')}&endDate=${format(endDate, 'yyyy-MM-dd')}`);
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        Uploaded Statements
      </h3>
      <div className="space-y-3">
        {statements.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic 
            bg-gray-50 dark:bg-dark-700 
            p-4 rounded-lg text-center">
            No statements uploaded yet
          </div>
        ) : (
          statements.map((statement) => (
            <div 
              key={statement.id} 
              className="flex items-center justify-between p-4 
                bg-gray-50 dark:bg-dark-700 
                rounded-lg 
                hover:bg-gray-100 dark:hover:bg-dark-600 
                transition-colors duration-200"
            >
              <div className="flex flex-col">
                <button
                  onClick={() => viewTransactions(statement)}
                  className="text-primary-600 dark:text-primary-400 
                    hover:text-primary-700 dark:hover:text-primary-300 
                    font-medium text-left"
                >
                  {format(new Date(statement.year, statement.month - 1), 'MMMM yyyy')}
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Uploaded {format(new Date(statement.createdAt), 'dd MMM yyyy')}
                </span>
              </div>
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
          ))
        )}
      </div>
    </div>
  );
}; 