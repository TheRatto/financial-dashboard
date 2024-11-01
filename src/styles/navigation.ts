export const navigationStyles = {
  container: `bg-white dark:bg-dark-800 shadow dark:shadow-dark-900/50`,
  wrapper: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,
  nav: {
    base: `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`,
    active: `border-primary-500 text-gray-900 dark:text-gray-100`,
    inactive: `border-transparent 
      text-gray-500 dark:text-gray-400 
      hover:border-gray-300 dark:hover:border-gray-600 
      hover:text-gray-700 dark:hover:text-gray-200`
  },
  icon: {
    active: 'text-primary-500 dark:text-primary-400',
    inactive: 'text-gray-400 dark:text-gray-500'
  },
  brand: 'text-xl font-bold text-primary-600 dark:text-primary-400'
}; 