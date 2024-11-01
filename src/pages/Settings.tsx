import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import {
  MoonIcon,
  SunIcon,
  BellIcon,
  CurrencyDollarIcon,
  LanguageIcon,
  KeyIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { inputStyles, cardStyles } from '../styles';
import { useTheme } from '../contexts/ThemeContext';

export const Settings: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');

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
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-8">Settings</h1>

        <div className={`${cardStyles.base} divide-y divide-gray-200 dark:divide-dark-700`}>
          {/* Dark Mode Toggle */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Appearance</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <MoonIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                ) : (
                  <SunIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                )}
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Adjust the appearance of the app</div>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                className={`${toggleStyles.base} ${darkMode ? toggleStyles.active : toggleStyles.inactive}`}
              >
                <span className="sr-only">Enable dark mode</span>
                <span className={`${toggleStyles.knob} ${darkMode ? toggleStyles.knobActive : toggleStyles.knobInactive}`} />
              </Switch>
            </div>
          </div>

          {/* Notifications Toggle */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Notifications</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Push Notifications</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Receive notifications about your accounts</div>
                </div>
              </div>
              <Switch
                checked={notifications}
                onChange={setNotifications}
                className={`${toggleStyles.base} ${notifications ? toggleStyles.active : toggleStyles.inactive}`}
              >
                <span className="sr-only">Enable notifications</span>
                <span className={`${toggleStyles.knob} ${notifications ? toggleStyles.knobActive : toggleStyles.knobInactive}`} />
              </Switch>
            </div>
          </div>

          {/* Currency Select */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Currency</h2>
            <div className="flex items-center gap-3">
              <CurrencyDollarIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              <div className="flex-1">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={inputStyles.base}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>
            </div>
          </div>

          {/* Language Select */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Language</h2>
            <div className="flex items-center gap-3">
              <LanguageIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              <div className="flex-1">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={inputStyles.base}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Security</h2>
            <div className="space-y-4">
              <button className="flex items-center gap-3 w-full text-left hover:bg-gray-50 dark:hover:bg-dark-700 p-2 rounded-lg transition-colors">
                <KeyIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Change Password</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Update your password</div>
                </div>
              </button>
              <button className="flex items-center gap-3 w-full text-left hover:bg-gray-50 dark:hover:bg-dark-700 p-2 rounded-lg transition-colors">
                <DocumentDuplicateIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 