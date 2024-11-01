import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  BanknotesIcon,
  CreditCardIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export function Navigation() {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Accounts', href: '/accounts', icon: BanknotesIcon },
    { name: 'Transactions', href: '/transactions', icon: CreditCardIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  const navLinkStyles = {
    base: `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`,
    active: `border-primary-500 text-gray-900 dark:text-gray-100`,
    inactive: `border-transparent 
      text-gray-500 dark:text-gray-400 
      hover:border-gray-300 dark:hover:border-gray-600 
      hover:text-gray-700 dark:hover:text-gray-200`
  };

  return (
    <nav className="bg-white dark:bg-dark-800 shadow dark:shadow-dark-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
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
                      ${navLinkStyles.base}
                      ${isActive ? navLinkStyles.active : navLinkStyles.inactive}
                    `}
                  >
                    <item.icon className={`h-5 w-5 mr-2 ${
                      isActive 
                        ? 'text-primary-500 dark:text-primary-400' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 