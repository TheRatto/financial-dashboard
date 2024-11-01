import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { PrismaClient, Prisma } from '@prisma/client';

dotenv.config();

// Initialize Prisma client with logging
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// PostgreSQL pool setup
export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5433'),
});

export const query = async (text: string, params?: any[]) => {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
};

export const getClient = () => {
    return pool.connect();
};

// Add error handling for Prisma client with correct event type
prisma.$on('query' as never, (e: Prisma.QueryEvent) => {
  console.log('Query:', e.query);
  console.log('Duration:', e.duration, 'ms');
});

// Handle cleanup
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});