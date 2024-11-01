import express from 'express';
import uploadRouter from './routes/upload';

const app = express();

app.use('/upload', uploadRouter);

// ... rest of your app configuration ...

export default app; 