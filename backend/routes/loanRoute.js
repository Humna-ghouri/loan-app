
// import express from 'express';
// import multer from 'multer';
// import loanRequest from '../models/loanRequest.js'; // Your Mongoose model
// import { v2 as cloudinary } from 'cloudinary'; // You'll need this for Cloudinary

// const router = express.Router();

// // Configure Cloudinary (make sure to add this)
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // 1. Multer Configuration
// const storage = multer.memoryStorage();

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed!'), false);
//     }
//   }
// });

// // Cloudinary upload function (you need this)
// const uploadToCloudinary = (buffer) => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       { folder: 'loan-app-uploads' },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result.secure_url);
//       }
//     );
    
//     uploadStream.end(buffer);
//   });
// };

// // 2. Loan Submission Route
// router.post('/submit', upload.single('userPhoto'), async (req, res) => {
//   try {
//     // Validate required fields
//     if (!req.body.guarantor1Name || !req.body.guarantor1CNIC) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required fields'
//       });
//     }

//     let imageUrl = '';
//     if (req.file) {
//       try {
//         imageUrl = await uploadToCloudinary(req.file.buffer);
//       } catch (uploadError) {
//         console.error('Cloudinary upload error:', uploadError);
//         return res.status(500).json({
//           success: false,
//           message: 'Failed to upload image'
//         });
//       }
//     }

//     const newLoanRequest = new loanRequest({
//       guarantor1Name: req.body.guarantor1Name,
//       guarantor1Email: req.body.guarantor1Email,
//       guarantor1Location: req.body.guarantor1Location,
//       guarantor1CNIC: req.body.guarantor1CNIC,
//       guarantor2Name: req.body.guarantor2Name,
//       guarantor2Email: req.body.guarantor2Email,
//       guarantor2Location: req.body.guarantor2Location,
//       guarantor2CNIC: req.body.guarantor2CNIC,
//       address: req.body.address,
//       phoneNumber: req.body.phoneNumber,
//       userPhoto: imageUrl,
//       amount: 50000, // Default values
//       tenure: 12,
//       interestRate: 10,
//       status: 'pending'
//     });

//     await newLoanRequest.save();
    
//     res.status(201).json({
//       success: true,
//       message: 'Loan request submitted successfully',
//       loanId: newLoanRequest._id,
//       redirectUrl: `/slip-generation/${newLoanRequest._id}`
//     });

//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message || 'Failed to submit loan request'
//     });
//   }
// });

// export default router;


// import express from 'express';
// import multer from 'multer';
// import mongoose from 'mongoose';
// import loanRequest from '../models/loanRequest.js';
// import { v2 as cloudinary } from 'cloudinary';
// import QRCode from 'qrcode';

// const router = express.Router();

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Multer Configuration
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) cb(null, true);
//     else cb(new Error('Only images are allowed!'), false);
//   }
// });

// // Generate QR Code
// const generateQR = async (text) => {
//   try {
//     return await QRCode.toDataURL(text);
//   } catch (err) {
//     console.error('QR Generation Error:', err);
//     return '';
//   }
// };

// // Upload to Cloudinary
// const uploadToCloudinary = (buffer) => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       { folder: 'loan-app' },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result.secure_url);
//       }
//     );
//     uploadStream.end(buffer);
//   });
// };

// // Submit Loan Route
// router.post('/submit', upload.single('userPhoto'), async (req, res) => {
//     try {
//       // Validate required fields
//       if (!req.body.guarantor1Name || !req.body.guarantor1CNIC) {
//         return res.status(400).json({ 
//           success: false, 
//           message: 'Missing required fields' 
//         });
//       }
  
//       // Upload image if exists
//       let imageUrl = '';
//       if (req.file) {
//         imageUrl = await uploadToCloudinary(req.file.buffer);
//       }
  
//       // Generate token number (simple timestamp based)
//       const tokenNumber = `TKN-${Date.now()}`;
      
//       // Generate appointment date (3 days from now)
//       const appointmentDate = new Date();
//       appointmentDate.setDate(appointmentDate.getDate() + 3);
      
//       // Generate QR code
//       const qrCode = await generateQR(tokenNumber);
      
//       // Create loan request - EXPLICITLY SET ALL FIELDS
//       const newLoanRequest = new loanRequest({
//         guarantor1Name: req.body.guarantor1Name,
//         guarantor1Email: req.body.guarantor1Email,
//         guarantor1Location: req.body.guarantor1Location,
//         guarantor1CNIC: req.body.guarantor1CNIC,
//         guarantor2Name: req.body.guarantor2Name,
//         guarantor2Email: req.body.guarantor2Email,
//         guarantor2Location: req.body.guarantor2Location,
//         guarantor2CNIC: req.body.guarantor2CNIC,
//         address: req.body.address,
//         phoneNumber: req.body.phoneNumber,
//         userPhoto: imageUrl,
//         amount: 50000,
//         tenure: 12,
//         interestRate: 10,
//         status: 'pending',
//         tokenNumber: tokenNumber, // Ensure this is saved
//         appointmentDate: appointmentDate, // Ensure this is saved
//         qrCode: qrCode
//       });
  
//       await newLoanRequest.save();
  
//       res.status(201).json({
//         success: true,
//         message: 'Loan request submitted successfully',
//         loanId: newLoanRequest._id,
//         redirectUrl: `/slip-generation/${newLoanRequest._id}`
//       });
  
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({
//         success: false,
//         message: error.message || 'Failed to submit loan request'
//       });
//     }
//   });
// // Get Loan Details for Slip - FIXED VERSION
// router.get('/details/:id', async (req, res) => {
//   try {
//     console.log("Fetching loan details for ID:", req.params.id);
    
//     // Validate ID format
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       console.log("Invalid ID format:", req.params.id);
//       return res.status(400).json({ 
//         success: false,
//         message: 'Invalid loan ID format' 
//       });
//     }

//     const loan = await loanRequest.findById(req.params.id).lean();
    
//     if (!loan) {
//       console.log("Loan not found for ID:", req.params.id);
//       return res.status(404).json({ 
//         success: false,
//         message: 'Loan request not found' 
//       });
//     }

//     // Ensure appointmentDate exists before formatting
//     let formattedDate = 'Not specified';
//     let formattedTime = 'Not specified';
    
//     if (loan.appointmentDate) {
//       formattedDate = new Date(loan.appointmentDate).toLocaleDateString();
//       formattedTime = '10:00 AM - 3:00 PM';
//     }

//     const responseData = {
//       ...loan,
//       formattedAppointmentDate: formattedDate,
//       formattedAppointmentTime: formattedTime
//     };

//     console.log("Returning loan details:", responseData);
//     res.json({
//       success: true,
//       data: responseData
//     });
    
//   } catch (error) {
//     console.error('Error fetching loan details:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch loan details',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// export default router;




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