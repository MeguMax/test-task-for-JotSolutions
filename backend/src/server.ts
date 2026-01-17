import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import candidatesRouter from './routes/candidates';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGIN || '*'
        : 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

// Health
app.get('/', (_req, res) => {
    res.json({
        message: 'Candidate Management API',
        version: '1.0.0',
        status: 'running'
    });
});

app.use('/api/candidates', candidatesRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
