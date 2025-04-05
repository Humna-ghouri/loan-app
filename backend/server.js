import express from 'express';
import cors from 'cors';
import connectDB from './db.js';
import userRoutes from './routes/userRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

connectDB();

app.use('/api/auth', userRoutes);
app.use('/api/loans', loanRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
