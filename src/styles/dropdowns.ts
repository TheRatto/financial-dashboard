export const dropdownStyles = {
  menu: {
    base: `absolute right-0 mt-2 w-56 origin-top-right 
      bg-white dark:bg-dark-800 rounded-md shadow-lg 
      ring-1 ring-black/5 dark:ring-white/10 focus:outline-none`,
    container: 'p-3',
    item: {
      base: `px-2 py-2 text-gray-700 dark:text-gray-200`,
      hover: 'hover:bg-gray-50 dark:hover:bg-dark-700 rounded-md cursor-pointer',
      active: 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50',
      inactive: 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-700'
    },
    text: {
      base: 'text-sm',
      muted: 'text-gray-400 dark:text-gray-500'
    }
  },
  toggle: {
    base: 'relative inline-flex items-center cursor-pointer',
    switch: `w-11 h-6 
      bg-gray-200 dark:bg-dark-600 
      peer-focus:ring-4 
      peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 
      rounded-full peer 
      peer-checked:after:translate-x-full 
      peer-checked:after:border-white 
      after:content-[''] after:absolute 
      after:top-[2px] after:left-[2px] 
      after:bg-white dark:after:bg-gray-200
      after:border-gray-300 dark:after:border-dark-600 
      after:border after:rounded-full 
      after:h-5 after:w-5 after:transition-all 
      peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500`
  }
}; 