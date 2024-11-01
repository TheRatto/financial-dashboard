import React from 'react';
import { format, addYears, subYears } from 'date-fns';

interface MonthYearSelectorProps {
  date: Date;
  onSelect: (date: Date) => void;
  onCancel: () => void;
}

export const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
  date,
  onSelect,
  onCancel,
}) => {
  const [scrollYear, setScrollYear] = React.useState(date.getFullYear());
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Generate array of years centered on current year
  const years = Array.from({ length: 50 }, (_, i) => scrollYear - 25 + i);

  const months = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    date: new Date(scrollYear, i, 1)
  }));

  return (
    <div className="absolute inset-0 bg-white dark:bg-dark-800 z-10">
      <div className="p-2 border-b border-gray-200 dark:border-dark-700">
        <button
          onClick={onCancel}
          className="text-sm text-gray-600 dark:text-gray-400 
            hover:text-gray-900 dark:hover:text-gray-200 
            transition-colors"
        >
          ← Back to calendar
        </button>
      </div>
      <div 
        ref={scrollRef}
        className="h-[280px] overflow-y-auto 
          scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-dark-600 
          scrollbar-track-transparent"
        onScroll={(e) => {
          const element = e.currentTarget;
          const rowHeight = 90; // Height of each year row
          const scrollTop = element.scrollTop;
          const centerRow = Math.floor(scrollTop / rowHeight);
          setScrollYear(years[centerRow]);
        }}
      >
        {years.map(year => (
          <div 
            key={year}
            className="flex items-center h-[90px] border-b border-gray-100 dark:border-dark-700"
          >
            <div className="w-20 px-4 text-right font-medium text-gray-900 dark:text-gray-100">
              {year}
            </div>
            <div className="flex-1 grid grid-cols-6 gap-2 p-2">
              {months.map(month => (
                <button
                  key={month.number}
                  onClick={() => onSelect(new Date(year, month.number - 1, 1))}
                  className="h-10 text-sm font-medium 
                    text-gray-700 dark:text-gray-300 
                    hover:bg-primary-50 dark:hover:bg-primary-900/50 
                    hover:text-primary-600 dark:hover:text-primary-400 
                    rounded-md transition-colors"
                >
                  {month.number}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 