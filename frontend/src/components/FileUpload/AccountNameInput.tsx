interface AccountNameInputProps {
  value: string;
  onChange: (value: string) => void;
  isProcessing: boolean;
}

export const AccountNameInput: React.FC<AccountNameInputProps> = ({
  value,
  onChange,
  isProcessing
}) => {
  return (
    <div>
      <label 
        htmlFor="accountName" 
        className="block text-sm font-medium text-gray-700"
      >
        Account Name
      </label>
      <input
        type="text"
        id="accountName"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isProcessing}
        placeholder="e.g., Savings Maximiser"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
          focus:border-violet-500 focus:ring-violet-500 sm:text-sm
          disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}; 