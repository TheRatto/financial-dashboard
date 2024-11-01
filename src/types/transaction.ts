export {};  // This line must be first

export type SortOption = 'newest' | 'oldest' | 'largest' | 'smallest';

export interface SortConfig {
  value: SortOption;
  label: string;
  shortLabel: string;
}

export interface Transaction {
  id: string;
  date: string | Date;
  description: string;
  amount: number;
  balance?: number;
  type: 'credit' | 'debit';
  category?: string;
  tags?: string[];
  deleted?: boolean;
  archived?: boolean;
  accountId: string;
  accountName: string;
  statementId: string;
  createdAt: string;
}

export interface UploadProgress {
  status: 'idle' | 'processing' | 'complete' | 'error';
  progress: number;
  message: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  transactions?: Transaction[];
}

export interface PDFUploadProps {
  onUploadSuccess?: () => void;
}

export interface CreateTransactionDTO {
  date: string;
  description: string;
  amount: number;
  balance?: number;
  tags?: string[];
  category?: string;
}

export interface UpdateTransactionDTO {
  date?: string;
  description?: string;
  amount?: number;
  balance?: number;
  tags?: string[];
  category?: string;
}

export interface BatchUpdateTransactionsDTO {
  transactionIds: string[];
  updates: {
    archived?: boolean;
    deleted?: boolean;
    category?: string;
    tags?: string[];
  };
}

export interface TransactionFilters {
  accountIds?: string[];
  startDate?: Date;
  endDate?: Date;
  showArchived?: boolean;
  searchTerm?: string;
  categories?: string[];
  tags?: string[];
}