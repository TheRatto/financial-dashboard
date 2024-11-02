import { PrismaClient, Prisma, TransactionType } from '@prisma/client';
import { Transaction, PrismaTransactionWithTags } from '../types/transaction';

const prisma = new PrismaClient();

const mapToTransaction = (data: PrismaTransactionWithTags): Transaction => {
    return {
        id: data.id,
        date: data.date,
        description: data.description,
        amount: data.amount,
        type: data.type,
        category: data.category ?? undefined,
        accountId: data.accountId,
        tags: data.tags?.map(tag => tag.name) || [],
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        deleted: data.deleted,
        statementId: data.statementId ?? undefined,
        balance: data.balance ?? undefined
    };
};

export const getTransactions = async (
    accountId?: string,
    startDate?: Date,
    endDate?: Date
): Promise<Transaction[]> => {
    const where: Prisma.TransactionWhereInput = {
        deleted: false,
        ...(accountId && { accountId }),
        ...(startDate && endDate && {
            date: {
                gte: startDate,
                lte: endDate,
            },
        }),
    };

    const transactions = await prisma.transaction.findMany({
        where,
        include: { tags: true },
        orderBy: { date: 'desc' },
    });

    return transactions.map(mapToTransaction);
};

interface CreateTransactionInput {
    date: Date;
    description: string;
    amount: number;
    type: TransactionType;
    accountId: string;
    category?: string;
    tags?: string[];
    balance?: number;
}

export const createTransaction = async (data: CreateTransactionInput): Promise<Transaction> => {
    const transaction = await prisma.transaction.create({
        data: {
            date: data.date,
            description: data.description,
            amount: data.amount,
            type: data.type,
            category: data.category || null,
            accountId: data.accountId,
            tags: data.tags ? {
                create: data.tags.map(name => ({ name }))
            } : undefined,
            balance: data.balance,
        },
        include: { tags: true }
    });

    return mapToTransaction(transaction);
};

export const updateTransaction = async (
    id: string,
    data: {
        date?: Date;
        description?: string;
        amount?: number;
        type?: TransactionType;
        category?: string;
        tags?: string[];
        deleted?: boolean;
    }
): Promise<Transaction> => {
    const transaction = await prisma.transaction.update({
        where: { id },
        data: {
            ...data,
            tags: data.tags ? {
                deleteMany: {},
                create: data.tags.map(name => ({ name }))
            } : undefined
        },
        include: { tags: true }
    });

    return mapToTransaction(transaction);
};

export const deleteTransaction = async (id: string): Promise<void> => {
    await prisma.transaction.update({
        where: { id },
        data: { deleted: true }
    });
};

export const importTransactions = async (
    transactions: {
        date: Date;
        description: string;
        amount: number;
        type: TransactionType;
        category?: string;
        accountId: string;
        balance?: number;
        statementId?: string;
    }[]
): Promise<Transaction[]> => {
    const saved = await prisma.$transaction(
        transactions.map(transaction =>
            prisma.transaction.create({
                data: {
                    date: transaction.date,
                    description: transaction.description,
                    amount: transaction.amount,
                    type: transaction.type,
                    category: transaction.category || null,
                    accountId: transaction.accountId,
                    balance: transaction.balance,
                    statementId: transaction.statementId
                },
                include: { tags: true }
            })
        )
    );

    return saved.map(mapToTransaction);
};