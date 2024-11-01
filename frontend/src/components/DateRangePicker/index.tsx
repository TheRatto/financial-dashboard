import React, { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { format, addYears, subYears, subMonths, startOfYear, endOfYear } from 'date-fns';
import { 
  CalendarIcon, 
  ChevronDownIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { MonthYearView } from './MonthYearView';
import "react-datepicker/dist/react-datepicker.css";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
}

interface QuickRange {
  label: string;
  getValue: () => { start: Date; end: Date };
}

const quickRanges: QuickRange[] = [
  {
    label: 'This tax year',
    getValue: () => ({
      start: new Date(2023, 6, 1), // July 1st 2023
      end: new Date(2024, 5, 30), // June 30th 2024
    }),
  },
  {
    label: 'Last tax year',
    getValue: () => ({
      start: new Date(2022, 6, 1),
      end: new Date(2023, 5, 30),
    }),
  },
  {
    label: 'Last 12 months',
    getValue: () => ({
      start: subMonths(new Date(), 12),
      end: new Date(),
    }),
  },
  {
    label: '2024',
    getValue: () => ({
      start: startOfYear(new Date(2024, 0, 1)),
      end: endOfYear(new Date(2024, 0, 1)),
    }),
  },
];

const calendarContainerStyle = `
  :root {
    --datepicker-bg: #ffffff;
    --datepicker-border: #e5e7eb;
    --day-color: #374151;
    --day-hover-bg: #f3f4f6;
    --day-name-color: #6b7280;
    --selected-bg: #4f46e5;
    --selected-color: #ffffff;
    --in-range-bg: #e0e7ff;
    --in-range-color: #4f46e5;
    --header-btn-hover: #f3f4f6;
    --header-btn-text: #4b5563;
    --header-btn-text-hover: #111827;
  }

  .dark {
    --datepicker-bg: #1f2937;
    --datepicker-border: #374151;
    --day-color: #e5e7eb;
    --day-hover-bg: #374151;
    --day-name-color: #9ca3af;
    --selected-bg: #6366f1;
    --selected-color: #ffffff;
    --in-range-bg: rgba(99, 102, 241, 0.2);
    --in-range-color: #a5b4fc;
    --header-btn-hover: #374151;
    --header-btn-text: #9ca3af;
    --header-btn-text-hover: #e5e7eb;
  }

  .react-datepicker {
    font-family: inherit;
    display: flex !important;
    flex-direction: row !important;
    border: 1px solid var(--datepicker-border);
    border-radius: 0.5rem;
    background-color: var(--datepicker-bg);
  }
  
  .react-datepicker__month-container {
    float: none !important;
    width: 320px;
    background-color: var(--datepicker-bg);
  }
  
  .react-datepicker__month-container + .react-datepicker__month-container {
    border-left: 1px solid var(--datepicker-border);
  }
  
  .react-datepicker__header {
    background-color: var(--datepicker-bg);
    border-bottom: 1px solid var(--datepicker-border);
    padding: 0.5rem 0;
  }
  
  .react-datepicker__day-name {
    color: var(--day-name-color);
    width: 2.5rem;
    line-height: 2rem;
    margin: 0;
  }
  
  .react-datepicker__day {
    color: var(--day-color);
    width: 2.5rem;
    line-height: 2.5rem;
    margin: 0;
    border-radius: 0;
    background-color: transparent;
  }
  
  .react-datepicker__day:hover {
    border-radius: 9999px;
    background-color: var(--day-hover-bg);
  }
  
  .react-datepicker__day--selected,
  .react-datepicker__day--range-start,
  .react-datepicker__day--range-end {
    border-radius: 9999px;
    background-color: var(--selected-bg);
    color: var(--selected-color);
  }
  
  .react-datepicker__day--in-range {
    background-color: var(--in-range-bg);
    color: var(--in-range-color);
  }

  .react-datepicker__day--disabled {
    color: var(--day-name-color);
    opacity: 0.5;
  }

  .react-datepicker__current-month {
    color: var(--day-color);
  }

  .react-datepicker__navigation-icon::before {
    border-color: var(--header-btn-text);
  }

  .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
    border-color: var(--header-btn-text-hover);
  }
`;

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const [showMonthYearView, setShowMonthYearView] = useState<'left' | 'right' | null>(null);
  const [activeDate, setActiveDate] = useState<Date | null>(null);

  const CustomInput = forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void }>(
    ({ value, onClick }, ref) => (
      <button
        type="button"
        ref={ref}
        onClick={onClick}
        className="inline-flex items-center justify-between px-3 py-2 
          border border-gray-300 dark:border-dark-600 
          rounded-md shadow-sm text-sm font-medium 
          text-gray-700 dark:text-gray-200 
          bg-white dark:bg-dark-800 
          hover:bg-gray-50 dark:hover:bg-dark-700 
          focus:outline-none focus:ring-2 focus:ring-offset-2 
          focus:ring-primary-500 dark:focus:ring-offset-dark-800"
        style={{ width: '235px' }}
      >
        <CalendarIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <span>{value || 'Select date range'}</span>
        <XMarkIcon 
          className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400" 
          onClick={(e) => {
            e.stopPropagation();
            onChange(null, null);
          }}
        />
      </button>
    )
  );

  const renderCustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: any) => (
    <div className="flex items-center justify-between px-2 py-1">
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        type="button"
        className="p-1 text-gray-600 dark:text-gray-400 
          hover:text-gray-900 dark:hover:text-gray-200 
          disabled:opacity-50"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => {
          setActiveDate(date);
          setShowMonthYearView(showMonthYearView === null ? 'left' : 'right');
        }}
        className="px-2 py-1 text-sm font-medium 
          text-gray-700 dark:text-gray-300 
          hover:text-primary-600 dark:hover:text-primary-400 
          hover:bg-primary-50 dark:hover:bg-primary-900/50 
          rounded-md transition-colors flex items-center gap-1"
      >
        {format(date, 'MMM yyyy')}
        <ChevronDownIcon className="h-3 w-3" />
      </button>
      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        type="button"
        className="p-1 text-gray-600 dark:text-gray-400 
          hover:text-gray-900 dark:hover:text-gray-200 
          disabled:opacity-50"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className="relative">
      <style>{calendarContainerStyle}</style>
      <DatePicker
        selected={startDate}
        onChange={(dates: Date | null | [Date | null, Date | null]) => {
          if (Array.isArray(dates)) {
            const [start, end] = dates;
            onChange(start, end);
          }
        }}
        startDate={startDate || undefined}
        endDate={endDate || undefined}
        selectsRange
        monthsShown={2}
        showPopperArrow={false}
        customInput={<CustomInput />}
        renderCustomHeader={renderCustomHeader}
        calendarClassName="shadow-lg"
        wrapperClassName="w-full"
      >
        {showMonthYearView && activeDate && (
          <MonthYearView
            date={activeDate}
            onSelectMonth={(newDate) => {
              // Handle month selection and update the calendar view
              setShowMonthYearView(null);
              // You'll need to implement the logic to update the calendar month
            }}
            onClose={() => setShowMonthYearView(null)}
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 
          border-t border-gray-200 dark:border-dark-600 
          bg-gray-50 dark:bg-dark-800">
          <div className="grid grid-cols-4 gap-0.5 p-1 max-w-[575px]">
            {quickRanges.map((range, index) => (
              <button
                key={index}
                onClick={() => {
                  const { start, end } = range.getValue();
                  onChange(start, end);
                }}
                className="text-xs text-gray-700 dark:text-gray-200 
                  hover:bg-gray-100 dark:hover:bg-dark-700 
                  px-1 py-1 rounded-md"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </DatePicker>
    </div>
  );
}; 