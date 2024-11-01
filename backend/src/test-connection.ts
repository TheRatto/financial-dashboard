import { pool } from './db';

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('Successfully connected to PostgreSQL');
        const result = await client.query('SELECT NOW()');
        console.log('Current time from DB:', result.rows[0]);
        client.release();
    } catch (err) {
        console.error('Database connection error:', err);
    }
}

testConnection(); 