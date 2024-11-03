import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  BanknotesIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';
import { navigationStyles } from '../../styles';
import { useTheme } from '../../contexts/ThemeContext';
import { Switch } from '@headlessui/react';

export function Navigation() {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Accounts', href: '/accounts', icon: BanknotesIcon },
    { name: 'Transactions', href: '/transactions', icon: CreditCardIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  const toggleStyles = {
    base: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
           dark:focus:ring-offset-dark-800`,
    active: 'bg-primary-600 dark:bg-primary-500',
    inactive: 'bg-gray-200 dark:bg-dark-600',
    knob: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform`,
    knobActive: 'translate-x-6',
    knobInactive: 'translate-x-1'
  };

  return (
    <nav className={navigationStyles.container}>
      <div className={navigationStyles.wrapper}>
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className={navigationStyles.brand}>
                FinanceApp
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      ${navigationStyles.nav.base}
                      ${isActive ? navigationStyles.nav.active : navigationStyles.nav.inactive}
                    `}
                  >
                    <item.icon className={`h-5 w-5 mr-2 ${
                      isActive 
                        ? navigationStyles.icon.active 
                        : navigationStyles.icon.inactive
                    }`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Dark Mode Toggle */}
          <div className="flex items-center">
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              className={`${toggleStyles.base} ${darkMode ? toggleStyles.active : toggleStyles.inactive}`}
            >
              <span className="sr-only">Toggle dark mode</span>
              <span className={`${toggleStyles.knob} ${darkMode ? toggleStyles.knobActive : toggleStyles.knobInactive}`} />
            </Switch>
            {darkMode ? (
              <MoonIcon className="h-5 w-5 ml-2 text-gray-500 dark:text-gray-400" />
            ) : (
              <SunIcon className="h-5 w-5 ml-2 text-gray-500 dark:text-gray-400" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 