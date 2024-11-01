import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ArrowsUpDownIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { SortOption, SortConfig } from '../types/transaction';

interface SortDropdownProps {
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
}

const sortOptions: SortConfig[] = [
  { value: 'newest', label: 'Sort by Newest', shortLabel: 'Newest' },
  { value: 'oldest', label: 'Sort by Oldest', shortLabel: 'Oldest' },
  { value: 'largest', label: 'Sort by Smallest', shortLabel: 'Largest' },
  { value: 'smallest', label: 'Sort by Smallest', shortLabel: 'Smallest' },
];

export const SortDropdown: React.FC<SortDropdownProps> = ({
  sortBy,
  setSortBy,
}) => {
  const currentSort = sortOptions.find(option => option.value === sortBy);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center justify-between px-3 py-2 
        border border-gray-300 dark:border-dark-600 
        rounded-md shadow-sm text-sm font-medium 
        text-gray-700 dark:text-gray-200 
        bg-white dark:bg-dark-800 
        hover:bg-gray-50 dark:hover:bg-dark-700 
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-primary-500 dark:focus:ring-offset-dark-900
        transition-colors duration-200" 
        style={{ width: '235px' }}>
        <div className="inline-flex items-center min-w-0">
          <ArrowsUpDownIcon className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          <span className="truncate">{currentSort?.label}</span>
        </div>
        <ChevronDownIcon className="h-4 w-4 ml-1 text-gray-400 dark:text-gray-500 flex-shrink-0" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right 
          rounded-md bg-white dark:bg-dark-800 
          shadow-lg ring-1 ring-black/5 dark:ring-white/10 
          focus:outline-none
          divide-y divide-gray-100 dark:divide-dark-700">
          <div className="py-1">
            {sortOptions.map((option) => (
              <Menu.Item key={option.value}>
                {({ active }) => (
                  <button
                    onClick={() => setSortBy(option.value)}
                    className={`w-full px-4 py-2 text-sm text-left 
                      transition-colors duration-200
                      ${sortBy === option.value
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50'
                        : active
                        ? 'bg-gray-50 dark:bg-dark-700 text-gray-700 dark:text-gray-200'
                        : 'text-gray-700 dark:text-gray-200'
                      }`}
                  >
                    {option.shortLabel}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}; 