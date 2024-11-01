"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const statementParser_1 = require("../services/statementParser");
const db_1 = require("../db");
const path_1 = __importDefault(require("path"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const promises_1 = __importDefault(require("fs/promises"));
const crypto_1 = __importDefault(require("crypto"));
const transactionService_1 = require("../services/transactionService");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: 'uploads/',
    filename: (_req, file, cb) => {
        const hash = crypto_1.default.createHash('md5').update(Date.now().toString()).digest('hex');
        cb(null, hash + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (_req, file, cb) => {
        const allowedTypes = ['application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only PDF files are allowed.'));
        }
    }
});
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const { accountId } = req.body;
        console.log('\n=== Upload Request ===');
        console.log('File:', file === null || file === void 0 ? void 0 : file.originalname);
        console.log('Account ID:', accountId);
        if (!file || !accountId) {
            res.status(400).json({ error: 'Missing file or account ID' });
            return;
        }
        console.log('\n=== Reading PDF ===');
        const dataBuffer = await promises_1.default.readFile(file.path);
        const pdfData = await (0, pdf_parse_1.default)(dataBuffer);
        console.log('PDF text length:', pdfData.text.length);
        console.log('First 200 chars:', pdfData.text.substring(0, 200));
        const parser = new statementParser_1.StatementParser();
        const parsedStatement = await parser.parseStatement(pdfData.text);
        const result = await db_1.prisma.$transaction(async () => {
            const newStatement = await db_1.prisma.statement.create({
                data: {
                    fileName: file.originalname,
                    filePath: file.path,
                    month: parsedStatement.month,
                    year: parsedStatement.year,
                    bankName: parsedStatement.bankName,
                    accountId: accountId,
                },
            });
            const transactions = await (0, transactionService_1.importTransactions)(parsedStatement.transactions.map(t => (Object.assign(Object.assign({}, t), { accountId, statementId: newStatement.id }))));
            return {
                statement: newStatement,
                transactionCount: transactions.length
            };
        });
        res.json(Object.assign({ success: true }, result));
    }
    catch (error) {
        console.error('\n=== Upload Error ===');
        console.error('Error details:', error);
        res.status(500).json({
            error: 'Failed to process statement',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.prisma.$transaction(async () => {
            await db_1.prisma.transaction.updateMany({
                where: { statementId: id },
                data: { deleted: true }
            });
            await db_1.prisma.statement.delete({
                where: { id }
            });
        });
        res.json({ success: true });
    }
    catch (error) {
        console.error('Statement deletion error:', error);
        res.status(500).json({ error: 'Failed to delete statement' });
    }
});
router.get('/account/:accountId', async (req, res) => {
    try {
        const { accountId } = req.params;
        const statements = await db_1.prisma.statement.findMany({
            where: { accountId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(statements);
    }
    catch (error) {
        console.error('Statement fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch statements' });
    }
});
exports.default = router;
//# sourceMappingURL=statements.js.map