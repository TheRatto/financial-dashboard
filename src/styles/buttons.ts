export const buttonStyles = {
  primary: `
    inline-flex items-center px-4 py-2 
    bg-primary-600 dark:bg-primary-500
    hover:bg-primary-700 dark:hover:bg-primary-600
    text-white font-medium rounded-lg
    transition-colors duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  secondary: `
    inline-flex items-center px-4 py-2
    bg-white dark:bg-dark-700
    text-gray-700 dark:text-gray-200
    border border-gray-300 dark:border-dark-600
    hover:bg-gray-50 dark:hover:bg-dark-600
    font-medium rounded-lg
    transition-colors duration-200
  `,
  danger: `
    inline-flex items-center px-4 py-2
    bg-error-600 dark:bg-error-500
    hover:bg-error-700 dark:hover:bg-error-600
    text-white font-medium rounded-lg
    transition-colors duration-200
  `
};

// Add consistent dark mode classes
const darkModeClasses = {
  background: "bg-white dark:bg-dark-800",
  border: "border-gray-200 dark:border-dark-700",
  text: {
    primary: "text-gray-900 dark:text-gray-100",
    secondary: "text-gray-700 dark:text-gray-300",
    muted: "text-gray-500 dark:text-gray-400"
  }
};

// Create consistent spacing utilities
const spacing = {
  section: "mb-8",
  component: "mb-4",
  element: "mb-2"
}; 