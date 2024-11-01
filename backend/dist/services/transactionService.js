"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importTransactions = exports.deleteTransaction = exports.updateTransaction = exports.createTransaction = exports.getTransactions = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const mapToTransaction = (data) => {
    var _a;
    return {
        id: data.id,
        date: data.date,
        description: data.description,
        amount: data.amount,
        type: data.type,
        category: data.category,
        accountId: data.accountId,
        tags: ((_a = data.tags) === null || _a === void 0 ? void 0 : _a.map(tag => tag.name)) || [],
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        deleted: data.deleted
    };
};
const getTransactions = async (accountId, startDate, endDate) => {
    const where = Object.assign(Object.assign({ deleted: false }, (accountId && { accountId })), (startDate && endDate && {
        date: {
            gte: startDate,
            lte: endDate,
        },
    }));
    const transactions = await prisma.transaction.findMany({
        where,
        include: { tags: true },
        orderBy: { date: 'desc' },
    });
    return transactions.map(mapToTransaction);
};
exports.getTransactions = getTransactions;
const createTransaction = async (data) => {
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
exports.createTransaction = createTransaction;
const updateTransaction = async (id, data) => {
    const transaction = await prisma.transaction.update({
        where: { id },
        data: Object.assign(Object.assign({}, data), { tags: data.tags ? {
                deleteMany: {},
                create: data.tags.map(name => ({ name }))
            } : undefined }),
        include: { tags: true }
    });
    return mapToTransaction(transaction);
};
exports.updateTransaction = updateTransaction;
const deleteTransaction = async (id) => {
    await prisma.transaction.update({
        where: { id },
        data: { deleted: true }
    });
};
exports.deleteTransaction = deleteTransaction;
const importTransactions = async (transactions) => {
    const saved = await prisma.$transaction(transactions.map(transaction => prisma.transaction.create({
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
    })));
    return saved.map(mapToTransaction);
};
exports.importTransactions = importTransactions;
//# sourceMappingURL=transactionService.js.map