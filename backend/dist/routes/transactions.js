"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionService_1 = require("../services/transactionService");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const accountId = req.query.accountId;
        const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
        const transactions = await (0, transactionService_1.getTransactions)(accountId, startDate, endDate);
        res.json(transactions);
    }
    catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});
router.post('/', async (req, res) => {
    try {
        const { date, description, amount, type, category, accountId, tags } = req.body;
        const transaction = await (0, transactionService_1.createTransaction)({
            date: new Date(date),
            description,
            amount,
            type: type,
            category,
            accountId,
            tags
        });
        res.json(transaction);
    }
    catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { date, description, amount, type, category, tags, deleted } = req.body;
        const transaction = await (0, transactionService_1.updateTransaction)(id, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (date && { date: new Date(date) })), (description && { description })), (amount && { amount })), (type && { type: type })), (category !== undefined && { category })), (tags && { tags })), (deleted !== undefined && { deleted })));
        res.json(transaction);
    }
    catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: 'Failed to update transaction' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await (0, transactionService_1.deleteTransaction)(id);
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
});
exports.default = router;
//# sourceMappingURL=transactions.js.map