import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  BanknotesIcon,
  CreditCardIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { navigationStyles } from '../../styles';

export function Navigation() {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Accounts', href: '/accounts', icon: BanknotesIcon },
    { name: 'Transactions', href: '/transactions', icon: CreditCardIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

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
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 