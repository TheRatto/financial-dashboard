"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfToText = void 0;
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const pdfToText = async (buffer) => {
    try {
        const data = await (0, pdf_parse_1.default)(buffer);
        return data.text;
    }
    catch (error) {
        console.error('Error converting PDF to text:', error);
        throw new Error('Failed to convert PDF to text');
    }
};
exports.pdfToText = pdfToText;
//# sourceMappingURL=pdfService.js.map