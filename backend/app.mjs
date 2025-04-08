// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import userRoutes from './routes/userRoutes.js';
// import dotenv from 'dotenv';
// import loanRequestRoutes from './routes/loanRoute.js'; // Import loan request routes

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// const MONGODB_URI = process.env.MONGODB_URI;

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // Add this line for form data

// mongoose.connect(MONGODB_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// app.use('/api/auth', userRoutes);
// console.log("Routes Mounted : /api/auth");

// app.use('/api/loan', loanRequestRoutes); // Integrate loan request routes
// console.log("Routes Mounted : /api/loan"); //added this line

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!' });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import loanRoute from './routes/loanRoute.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', userRoutes);
console.log('Routes Mounted : /api/auth');

app.use('/api/loans', loanRoute);
console.log('Routes Mounted : /api/loans');

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});