import { useNavigate } from 'react-router-dom';
import { BankIcon } from '../components/BankSelection/BankIcon';
import { cardStyles } from '../styles';

const banks = [
  {
    id: 'ing',
    name: 'ING',
    logo: '/bank-logos/ing.svg',
    supported: true
  },
  {
    id: 'commbank',
    name: 'Commonwealth Bank',
    logo: '/bank-logos/commbank.svg',
    supported: false
  },
  {
    id: 'westpac',
    name: 'Westpac',
    logo: '/bank-logos/westpac.svg',
    supported: false
  },
  // Add more banks here
];

export const BankSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Select Your Bank
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {banks.map((bank) => (
          <button
            key={bank.id}
            onClick={() => bank.supported && navigate(`/accounts/new/${bank.id}`)}
            className={`
              ${cardStyles.base} ${bank.supported ? cardStyles.hover : ''}
              p-6 transition-all duration-200
              ${!bank.supported ? 'cursor-not-allowed opacity-50' : ''}
            `}
          >
            <div className="flex flex-col items-center gap-3">
              <BankIcon bankId={bank.id} className="w-20 h-20" />
              <span className="text-sm font-medium text-gray-900">
                {bank.name}
              </span>
            </div>
            {!bank.supported && (
              <span className="absolute top-2 right-2 text-xs text-gray-500">
                Coming Soon
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}; 