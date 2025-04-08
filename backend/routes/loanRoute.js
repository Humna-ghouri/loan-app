import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { uploadImageToCloudinary } from '../config/cloudinary.js';
import loanRequest from '../models/loanRequest.js';
import path from 'path';

const router = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png) are allowed'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/submit', upload.single('userPhoto'), async (req, res) => {
  console.log('POST request to /api/loans/submit');
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);

  try {
    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadImageToCloudinary(req.file.buffer);
    }

    const newLoanRequest = new loanRequest({
      ...req.body,
      userPhoto: imageUrl,
      amount: 50000,
      tenure: 12,
      interestRate: 10,
      status: 'pending',
    });

    await newLoanRequest.save();

    res.status(201).json({
      success: true,
      message: 'Loan request submitted successfully',
      loanId: newLoanRequest._id,
      redirectUrl: `/slip-generation/${newLoanRequest._id}`,
    });
  } catch (error) {
    console.error('Loan submission error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit loan request',
    });
  }
});

router.get('/details/:id', async (req, res) => {
    try {
      const loan = await loanRequest.findById(req.params.id);
      if (!loan) {
        return res.status(404).json({ message: 'Loan request not found' });
      }
      res.json(loan);
    } catch (error) {
      console.error('Error fetching loan details:', error);
      res.status(500).json({ message: 'Failed to fetch loan details' });
    }
  });
  export default router;
  
// ... rest of your code