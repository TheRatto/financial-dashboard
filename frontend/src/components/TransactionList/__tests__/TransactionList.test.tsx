import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionList } from '../TransactionList';
import { Transaction } from '../../../types/transaction';

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: new Date('2024-01-01'),
    description: 'First Transaction',
    amount: 100.00,
    type: 'credit',
    balance: 100.00,
    category: null,
    deleted: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    date: new Date('2024-01-02'),
    description: 'Second Transaction',
    amount: 50.00,
    type: 'credit',
    balance: 150.00,
    category: null,
    deleted: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock the useQuery hook
jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: mockTransactions,
    isLoading: false
  })
}));

describe('TransactionList Sorting', () => {
  it('should sort by most recent by default', () => {
    render(<TransactionList />);
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Second Transaction'); // First row after header
  });

  it('should sort by oldest first when selected', () => {
    render(<TransactionList />);
    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'oldest' } });
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('First Transaction');
  });

  it('should sort by largest amount when selected', () => {
    render(<TransactionList />);
    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'largest' } });
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('First Transaction'); // $100 transaction
  });

  it('should sort by smallest amount when selected', () => {
    render(<TransactionList />);
    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'smallest' } });
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Second Transaction'); // $50 transaction
  });
}); 