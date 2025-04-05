import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import loanRoutes from './routes/loanRoutes.js';

dotenv.config();

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/loans', loanRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});