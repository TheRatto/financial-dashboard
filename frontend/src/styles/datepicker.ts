export const datePickerStyles = {
  variables: `
    :root {
      --border-color: #e5e7eb;
      --bg-color: #ffffff;
      --text-color: #111827;
      --text-secondary: #9ca3af;
      --hover-bg: #f3f4f6;
      --primary-color: #7c3aed;
      --primary-color-light: #5b21b6;
      --primary-color-lighter: #ede9fe;
    }

    .dark {
      --border-color: #374151;
      --bg-color: #1f2937;
      --text-color: #f3f4f6;
      --text-secondary: #9ca3af;
      --hover-bg: #374151;
      --primary-color: #7c3aed;
      --primary-color-light: #5b21b6;
      --primary-color-lighter: #4c1d95;
    }
  `,
  calendar: `
    .react-datepicker-popper {
      padding-left: 3rem !important;
    }

    .react-datepicker {
      font-family: inherit;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      background-color: var(--bg-color);
      color: var(--text-color);
    }
    
    .react-datepicker__header {
      background-color: var(--bg-color);
      border-bottom: 1px solid var(--border-color);
      padding: 0.5rem 0;
    }
    
    .react-datepicker__day-name {
      color: var(--text-secondary);
    }
    
    .react-datepicker__day {
      color: var(--text-color);
    }
    
    .react-datepicker__day:hover {
      background-color: var(--hover-bg);
    }
    
    .react-datepicker__day--selected,
    .react-datepicker__day--range-start,
    .react-datepicker__day--range-end {
      background-color: var(--primary-color);
      color: white;
    }
    
    .react-datepicker__day--in-range {
      background-color: var(--primary-color-light);
      color: var(--text-color);
    }
    
    .react-datepicker__day--in-selecting-range {
      background-color: var(--primary-color-lighter);
    }
    
    .react-datepicker__day--keyboard-selected {
      background-color: var(--primary-color-lighter);
      color: var(--primary-color);
    }
  `
}; 