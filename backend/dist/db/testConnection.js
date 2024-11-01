"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function testConnection() {
    try {
        await prisma.$connect();
        console.log('Successfully connected to the database');
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
testConnection();
//# sourceMappingURL=testConnection.js.map