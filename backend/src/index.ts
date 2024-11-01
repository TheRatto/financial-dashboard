import express from 'express';
import accountsRouter from './routes/accounts';

const app = express();

app.use(express.json());
app.use('/api/accounts', accountsRouter);

// ... rest of your Express setup