"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
async function testConnection() {
    try {
        const client = await db_1.pool.connect();
        console.log('Successfully connected to PostgreSQL');
        const result = await client.query('SELECT NOW()');
        console.log('Current time from DB:', result.rows[0]);
        client.release();
    }
    catch (err) {
        console.error('Database connection error:', err);
    }
}
testConnection();
//# sourceMappingURL=test-connection.js.map