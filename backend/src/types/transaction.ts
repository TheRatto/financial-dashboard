import { TransactionType } from '@prisma/client';

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: TransactionType;
  category: string | null;
  accountId: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
}

/* 
// Tag interface
export interface Tag {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Base transaction interface
export interface BaseTransaction {
  date: Date;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  balance: number | null;
  category: string | null;
  tags: Tag[];
}

// Database transaction (includes ID and metadata)
export interface Transaction extends BaseTransaction {
  id: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Parser transaction (no ID needed)
export interface ParsedTransaction extends Omit<BaseTransaction, 'tags'> {
  tags?: string[];
}

// DTOs
export interface CreateTransactionDTO {
  date: string | Date;
  description: string;
  amount: number;
  balance?: number | null;
  type: 'credit' | 'debit';
  category?: string | null;
  tags?: string[];
}

export interface UpdateTransactionDTO {
  date?: string | Date;
  description?: string;
  amount?: number;
  balance?: number | null;
  type?: 'credit' | 'debit';
  category?: string | null;
  tags?: string[];
  deleted?: boolean;
}

// Parser interface
export interface StatementParser {
  name: string;
  canParse(text: string): boolean;
  parse(text: string): Promise<ParsedTransaction[]>;
}

// Upload response
export interface UploadResponse {
  success: boolean;
  message: string;
  transactions?: Transaction[];
}

// Transaction type enum
export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

// Parsed transaction interface
export interface ParsedTransaction {
  date: Date;
  description: string;
  amount: number;
  type: TransactionType;
  balance: number | null;
  category: string | null;
}
*/ 