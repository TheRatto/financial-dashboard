export const layout = {
  container: {
    default: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    small: 'max-w-3xl mx-auto px-4 sm:px-6',
    tight: 'max-w-xl mx-auto px-4'
  },
  spacing: {
    section: 'space-y-8',
    component: 'space-y-4',
    element: 'space-y-2'
  },
  grid: {
    default: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
    sidebar: 'grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8'
  },
  card: {
    base: `
      bg-white dark:bg-dark-800 
      border border-gray-200 dark:border-dark-700 
      rounded-xl shadow-sm
      text-gray-900 dark:text-gray-100
    `,
    hover: `
      hover:shadow-md 
      hover:border-primary-100 dark:hover:border-primary-900
      transition-all duration-200
    `,
    padding: 'p-4 sm:p-6'
  }
}; 