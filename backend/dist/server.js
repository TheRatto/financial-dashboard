"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const transactions_1 = __importDefault(require("./routes/transactions"));
const statements_1 = __importDefault(require("./routes/statements"));
const accounts_1 = __importDefault(require("./routes/accounts"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`, {
        body: req.body,
        query: req.query,
        params: req.params
    });
    next();
});
app.use('/api/transactions', transactions_1.default);
app.use('/api/statements', statements_1.default);
app.use('/api/accounts', accounts_1.default);
app.use((err, _req, res, _next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        details: err.message
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map