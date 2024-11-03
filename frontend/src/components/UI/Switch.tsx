import { Switch as HeadlessSwitch } from '@headlessui/react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}

export function Switch({ checked, onChange, children, className = '' }: SwitchProps) {
  return (
    <HeadlessSwitch
      checked={checked}
      onChange={onChange}
      className={`${className} relative inline-flex h-6 w-11 items-center rounded-full 
        bg-gray-200 dark:bg-gray-700 transition-colors
        ${checked ? 'bg-primary-600' : ''}`}
    >
      <span
        className={`${checked ? 'translate-x-6' : 'translate-x-1'}
          inline-block h-4 w-4 transform rounded-full 
          bg-white transition-transform`}
      />
      {children}
    </HeadlessSwitch>
  );
} 