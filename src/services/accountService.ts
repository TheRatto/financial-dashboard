import axios from 'axios';

interface CreateAccountParams {
  accountName: string;
  bankId: string;
}

interface Account {
  id: string;
  name: string;
  bankId: string;
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_URL
  : 'http://localhost:3001';

export const createAccount = async (params: CreateAccountParams): Promise<Account> => {
  console.log('Creating account with params:', params);
  console.log('API URL:', API_URL);
  
  try {
    const response = await axios.post<Account>(`${API_URL}/api/accounts`, {
      accountName: params.accountName,
      bankId: params.bankId,
    });
    console.log('Create account response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};

export const getAccounts = async (): Promise<Account[]> => {
  const response = await axios.get<Account[]>(`${API_URL}/api/accounts`);
  return response.data;
};

export const getAccount = async (id: string): Promise<Account> => {
  const response = await axios.get<Account>(`${API_URL}/api/accounts/${id}`);
  return response.data;
}; 