import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import loanRequest from '../models/loanRequest.js';
import { v2 as cloudinary } from 'cloudinary';
import QRCode from 'qrcode';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images are allowed!'), false);
  }
});

// Generate QR Code
const generateQR = async (text) => {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error('QR Generation Error:', err);
    return '';
  }
};

// Upload to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'loan-app' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

// Submit Loan Route
router.post('/submit', upload.single('userPhoto'), async (req, res) => {
    try {
      // Validate required fields
      if (!req.body.guarantor1Name || !req.body.guarantor1CNIC || !req.body.appointmentDate) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields' 
        });
      }
  
      // Upload image if exists
      let imageUrl = '';
      if (req.file) {
        imageUrl = await uploadToCloudinary(req.file.buffer);
      }
      
      // Create loan request first to get MongoDB _id
      const newLoanRequest = new loanRequest({
        guarantor1Name: req.body.guarantor1Name,
        guarantor1Email: req.body.guarantor1Email,
        guarantor1Location: req.body.guarantor1Location,
        guarantor1CNIC: req.body.guarantor1CNIC,
        guarantor2Name: req.body.guarantor2Name,
        guarantor2Email: req.body.guarantor2Email,
        guarantor2Location: req.body.guarantor2Location,
        guarantor2CNIC: req.body.guarantor2CNIC,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        userPhoto: imageUrl,
        amount: 50000,
        tenure: 12,
        interestRate: 10,
        status: 'pending'
      });

      // Save to get the _id
      await newLoanRequest.save();

      // Now use the _id as token number
      const tokenNumber = newLoanRequest._id.toString();
      
      // Calculate next day from user provided date
      const userDate = new Date(req.body.appointmentDate);
      const appointmentDate = new Date(userDate);
      appointmentDate.setDate(userDate.getDate() + 1); // Add 1 day
      
      // Generate QR code using the _id
      const qrCode = await generateQR(tokenNumber);
      
      // Update the document with token and appointment details
      newLoanRequest.tokenNumber = tokenNumber;
      newLoanRequest.appointmentDate = appointmentDate;
      newLoanRequest.qrCode = qrCode;
      await newLoanRequest.save();
  
      res.status(201).json({
        success: true,
        message: 'Loan request submitted successfully',
        loanId: newLoanRequest._id,
        tokenNumber: tokenNumber,
        appointmentDate: appointmentDate,
        redirectUrl: `/slip-generation/${newLoanRequest._id}`
      });
  
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to submit loan request'
      });
    }
});

// Get Loan Details for Slip - Updated Version
router.get('/details/:id', async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ 
          success: false,
          message: 'Invalid loan ID format' 
        });
      }
  
      const loan = await loanRequest.findById(req.params.id).lean();
      
      if (!loan) {
        return res.status(404).json({ 
          success: false,
          message: 'Loan request not found' 
        });
      }
  
      // Format dates
      let formattedDate = 'Not specified';
      let formattedTime = '10:00 AM - 3:00 PM';
      
      if (loan.appointmentDate) {
        formattedDate = new Date(loan.appointmentDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
  
      // Ensure all required fields exist
      const responseData = {
        ...loan,
        tokenNumber: loan.tokenNumber || loan._id.toString(), // Fallback to _id if tokenNumber missing
        formattedAppointmentDate: formattedDate,
        formattedAppointmentTime: formattedTime,
        qrCode: loan.qrCode || '' // Provide empty string if qrCode missing
      };
  
      res.json({
        success: true,
        data: responseData
      });
      
    } catch (error) {
      console.error('Error fetching loan details:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch loan details'
      });
    }
 
});

export default router;