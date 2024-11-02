import { Transaction as PrismaTransaction, TransactionType } from '@prisma/client';

export interface Transaction {
    id: string;
    date: Date;
    description: string;
    amount: number;
    type: TransactionType;
    balance?: number;
    category?: string;
    accountId: string;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean;
    statementId?: string;
}

export interface BaseTransaction {
    date: Date;
    description: string;
    amount: number;
    type: TransactionType;
}

export interface BasicParsedTransaction extends BaseTransaction {
    balance: number;
}

export interface StatementParser {
    name: string;
    canParse(text: string): Promise<boolean>;
    parse(text: string): Promise<BasicParsedTransaction[]>;
}

// Add this interface to handle the Prisma transaction with tags
export interface PrismaTransactionWithTags extends PrismaTransaction {
    tags?: Array<{ name: string }>;
}