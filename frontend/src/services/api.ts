import type { 
  Transaction, 
  UploadResponse 
} from '../types/transaction';

export const API_BASE_URL = 'http://localhost:3001/api';

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  console.log('Starting upload for file:', file.name);
  
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('Upload response status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('Upload failed:', text);
      try {
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || 'Upload failed');
      } catch (e) {
        throw new Error(`Upload failed: ${text}`);
      }
    }

    return response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
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

export const uploadStatement = async (file: File, accountId: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('accountId', accountId);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
    // Don't set Content-Type header - browser will set it with boundary
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
};