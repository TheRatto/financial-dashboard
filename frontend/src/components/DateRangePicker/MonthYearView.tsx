import React from 'react';
import { format, addYears } from 'date-fns';

interface MonthYearViewProps {
  date: Date;
  onSelectMonth: (date: Date) => void;
  onClose: () => void;
}

export const MonthYearView: React.FC<MonthYearViewProps> = ({
  date,
  onSelectMonth,
  onClose,
}) => {
  const years = [-1, 0, 1].map(offset => addYears(date, offset));
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="absolute inset-0 bg-white dark:bg-dark-800 z-10 overflow-auto">
      {years.map(year => (
        <div key={year.getFullYear()} 
          className="flex border-b border-gray-100 dark:border-dark-700"
        >
          <div className="w-24 p-4 flex items-center justify-end 
            border-r border-gray-100 dark:border-dark-700 
            font-medium text-gray-900 dark:text-gray-100"
          >
            {year.getFullYear()}
          </div>
          <div className="flex-1 grid grid-cols-6 gap-1 p-2">
            {months.map(month => (
              <button
                key={month}
                onClick={() => {
                  const newDate = new Date(year.getFullYear(), month, 1);
                  onSelectMonth(newDate);
                }}
                className="h-10 text-sm font-medium 
                  text-gray-700 dark:text-gray-300 
                  hover:bg-primary-50 dark:hover:bg-primary-900/50 
                  hover:text-primary-600 dark:hover:text-primary-400 
                  rounded-md transition-colors"
              >
                {month + 1}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}; 