"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.post('/', async (req, res) => {
    try {
        const { accountName, bankId } = req.body;
        const account = await prisma.account.create({
            data: {
                name: accountName,
                bankId: bankId,
            },
        });
        res.json(account);
    }
    catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
});
router.get('/', async (_req, res) => {
    try {
        const accounts = await prisma.account.findMany();
        res.json(accounts);
    }
    catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Failed to fetch accounts' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const account = await prisma.account.findUnique({
            where: { id },
        });
        if (!account) {
            res.status(404).json({ error: 'Account not found' });
            return;
        }
        res.json(account);
    }
    catch (error) {
        console.error('Error fetching account:', error);
        res.status(500).json({ error: 'Failed to fetch account' });
    }
});
exports.default = router;
//# sourceMappingURL=accounts.js.map