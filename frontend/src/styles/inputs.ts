export const inputStyles = {
  base: `
    block w-full rounded-lg 
    border-gray-300 dark:border-dark-600
    bg-white dark:bg-dark-800
    text-gray-900 dark:text-gray-100
    placeholder-gray-500 dark:placeholder-gray-400
    shadow-sm transition-colors duration-200
    focus:border-primary-500 dark:focus:border-primary-400
    focus:ring-primary-500 dark:focus:ring-primary-400
  `,
  error: `
    block w-full rounded-lg border-error-300 
    focus:border-error-500 focus:ring-error-500 
    sm:text-sm
  `,
  select: {
    control: (state: { isFocused: boolean }) => `
      rounded-lg border-gray-300 dark:border-dark-600
      bg-white dark:bg-dark-800 
      hover:border-gray-400 dark:hover:border-dark-500
      ${state.isFocused 
        ? 'border-primary-500 dark:border-primary-400 ring-1 ring-primary-500 dark:ring-primary-400' 
        : ''}
    `,
    menu: `
      mt-1 bg-white dark:bg-dark-800 
      border border-gray-200 dark:border-dark-600 
      rounded-md shadow-lg
    `,
    option: (state: { isSelected: boolean, isFocused: boolean }) => `
      ${state.isSelected 
        ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400' 
        : state.isFocused 
        ? 'bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-gray-100' 
        : 'text-gray-700 dark:text-gray-200'}
    `,
    noOptionsMessage: `
      text-gray-500 dark:text-gray-400
    `
  }
}; 