import type { 
  Transaction, 
  UploadResponse 
} from '../types/transaction';

export const API_BASE_URL = 'http://localhost:3001/api';

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Upload failed');
  }

  return response.json();
};

export async function fetchTransactions(includeArchived: boolean = false): Promise<Transaction[]> {
  const response = await fetch(`${API_BASE_URL}/transactions${includeArchived ? '?archived=true' : ''}`);
  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }
  const data = await response.json();
  return data as Transaction[];
}

export const updateTransaction = async (
  id: string, 
  updates: Partial<Transaction>
): Promise<Transaction> => {
  const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update transaction');
  }
  return response.json();
};

export const deleteTransaction = async (id: string, type: 'soft' | 'hard') => {
  console.log('Starting delete transaction:', { id, type });
  
  try {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ type })
    });

    console.log('Delete response:', { 
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    const text = await response.text();
    console.log('Response text:', text);

    if (!text) {
      console.error('Empty response received');
      throw new Error('Empty response from server');
    }

    try {
      const data = JSON.parse(text);
      console.log('Parsed response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete transaction');
      }

      return data;
    } catch (e) {
      console.error('Failed to parse response:', e);
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};