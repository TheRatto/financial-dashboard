import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { format, subMonths, startOfYear, endOfYear } from 'date-fns';
import { CalendarIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import "react-datepicker/dist/react-datepicker.css";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
}

interface QuickDateRange {
  label: string;
  getValue: () => { start: Date; end: Date };
}

const quickRanges: QuickDateRange[] = [
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

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const CustomInput = forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void }>(
    ({ value, onClick }, ref) => (
      <button
        ref={ref}
        onClick={onClick}
        className="inline-flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        style={{ width: '280px' }}
      >
        <div className="inline-flex items-center min-w-0">
          <CalendarIcon className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate">
            {startDate && endDate ? (
              <span className="inline-flex items-center">
                {`${format(startDate, 'd MMM yyyy')} - ${format(endDate, 'd MMM yyyy')}`}
              </span>
            ) : (
              'Dates'
            )}
          </span>
        </div>
        <div className="flex items-center">
          {startDate && endDate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(null, null);
              }}
              className="mr-1 p-1 hover:bg-gray-100 rounded-full"
            >
              <XMarkIcon className="h-4 w-4 text-gray-400" />
            </button>
          )}
          <ChevronDownIcon className="h-4 w-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
        </div>
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
        className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>
      <span className="text-sm font-medium text-gray-700">
        {format(date, 'MMM yyyy')}
      </span>
      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        type="button"
        className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  );

  const calendarContainerStyle = `
    .react-datepicker-popper {
      padding-left: 3rem !important;
    }

    .react-datepicker {
      font-family: inherit;
      border: 1px solid #374151;
      border-radius: 0.5rem;
      background-color: #1f2937;
      color: #e5e7eb;
    }
    
    .react-datepicker__month-container {
      float: none !important;
      width: 300px;
      padding-right: 0 !important;
    }
    
    .react-datepicker__month-container + .react-datepicker__month-container {
      border-left: 1px solid #e5e7eb;
    }
    
    .react-datepicker__header {
      background-color: #1f2937;
      border-bottom: 1px solid #374151;
      padding: 0.5rem 0;
    }
    
    .react-datepicker__day-names {
      display: flex;
      justify-content: space-around;
      padding: 0 0.5rem;
    }
    
    .react-datepicker__day-name {
      color: #9ca3af;
      width: 2.5rem;
      line-height: 2rem;
      margin: 0;
    }
    
    .react-datepicker__month {
      margin: 0;
      padding: 0.5rem;
      padding-right: 0 !important;
      padding-bottom: 3rem;
    }
    
    .react-datepicker__day {
      width: 2.5rem;
      line-height: 2.5rem;
      margin: 0;
      border-radius: 0;
      color: #e5e7eb;
    }
    
    .react-datepicker__day:hover {
      background-color: #374151;
    }
    
    .react-datepicker__day--selected,
    .react-datepicker__day--range-start,
    .react-datepicker__day--range-end {
      border-radius: 9999px;
      background-color: #7c3aed;
      color: white;
    }
    
    .react-datepicker__day--in-range {
      background-color: #5b21b6;
      color: #e5e7eb;
    }
    
    .react-datepicker__day--in-selecting-range {
      background-color: #ede9fe;
    }
    
    .react-datepicker__day--keyboard-selected {
      background-color: #ede9fe;
      color: #6d28d9;
      border-radius: 9999px;
    }
    
    .react-datepicker__children-container {
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }
  `;

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
        renderDayContents={(day) => (
          <div className="w-full h-full flex items-center justify-center">
            {day}
          </div>
        )}
      >
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-4 gap-0.5 p-1 max-w-[575px]">
            {quickRanges.map((range, index) => (
              <button
                key={index}
                onClick={() => {
                  const { start, end } = range.getValue();
                  onChange(start, end);
                }}
                className="text-xs text-gray-700 hover:bg-gray-100 px-1 py-1 rounded-md"
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