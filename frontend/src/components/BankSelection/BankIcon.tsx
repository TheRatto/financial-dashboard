import { INGIcon } from './icons';

interface BankIconProps {
  bankId: string;
  className?: string;
}

export const BankIcon: React.FC<BankIconProps> = ({ bankId, className }) => {
  switch (bankId) {
    case 'ing':
      return <INGIcon className={className} />;
    default:
      return <div className={`${className} bg-gray-200 rounded-lg`} />;
  }
}; 