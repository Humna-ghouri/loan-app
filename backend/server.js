// // backend/app.mjs
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import userRoutes from './routes/userRoutes.js';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// const MONGODB_URI = process.env.MONGODB_URI;

// app.use(cors());
// app.use(express.json());

// mongoose.connect(MONGODB_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// app.use('/api/auth', userRoutes);
// console.log("Routes Mounted : /api/auth"); //add this line

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });