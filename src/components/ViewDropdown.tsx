import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { 
  EyeIcon, 
  ChevronDownIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';
import { buttonStyles, textStyles, dropdownStyles } from '../styles';

interface ViewDropdownProps {
  showArchived: boolean;
  setShowArchived: (show: boolean) => void;
  perPage: number;
  setPerPage: (count: number) => void;
}

export const ViewDropdown: React.FC<ViewDropdownProps> = ({
  showArchived,
  setShowArchived,
  perPage,
  setPerPage,
}) => {
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ close }) => (
        <>
          <Menu.Button className={`${buttonStyles.secondary} focus:ring-2 focus:ring-offset-2 
            focus:ring-primary-500 dark:focus:ring-offset-dark-900`}>
            <EyeIcon className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
            View
            <ChevronDownIcon className="h-4 w-4 ml-1 text-gray-400 dark:text-gray-500" aria-hidden="true" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className={dropdownStyles.menu.base}>
              <div className={dropdownStyles.menu.container}>
                <div className={`flex items-center justify-between ${dropdownStyles.menu.item.base}`}>
                  <span className={dropdownStyles.menu.text.base}>Show archived</span>
                  <label className={dropdownStyles.toggle.base}>
                    <input
                      type="checkbox"
                      checked={showArchived}
                      onChange={(e) => setShowArchived(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className={dropdownStyles.toggle.switch}></div>
                  </label>
                </div>

                <div
                  className={`relative px-2 py-2 mt-2 
                    ${dropdownStyles.menu.item.base} group`}
                  onMouseEnter={() => setShowPerPageDropdown(true)}
                  onMouseLeave={() => setShowPerPageDropdown(false)}
                >
                  <div className="flex items-center justify-between">
                    <span className={dropdownStyles.menu.text.base}>Per page</span>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">{perPage}</span>
                      <ChevronRightIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>

                  <Transition
                    show={showPerPageDropdown}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 -translate-x-2"
                    enterTo="transform opacity-100 translate-x-0"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 translate-x-0"
                    leaveTo="transform opacity-0 -translate-x-2"
                  >
                    <div className="absolute left-full top-0 ml-2 w-36 
                      rounded-md bg-white dark:bg-dark-800 
                      shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                      <div className="py-1">
                        {[10, 25, 50, 100].map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setPerPage(option);
                              close();
                            }}
                            className={`w-full px-4 py-2 text-sm text-left 
                              ${perPage === option
                                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50'
                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700'
                              }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}; 