"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFileUpload = void 0;
const pdfService_1 = require("../services/pdfService");
const handleFileUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }
        const transactions = await (0, pdfService_1.processStatement)(req.file.path);
        res.json({
            success: true,
            message: 'File uploaded successfully',
            statementId: req.file.filename,
            transactionCount: transactions.length
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
};
exports.handleFileUpload = handleFileUpload;
//# sourceMappingURL=uploadController.js.map