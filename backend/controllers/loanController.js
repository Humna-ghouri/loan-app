import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';

export const submitLoanApplication = async (req, res) => {
  try {
    const { name, email, cnic, category, subcategory, emi } = req.body;

    // Validate required fields
    if (!name || !email || !cnic || !category || !subcategory || !emi) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Generate temporary password (8 characters)
    const tempPassword = Math.random().toString(36).slice(2, 10);

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with temp password
      user = new User({
        name,
        email,
        cnic,
        tempPassword,
        mustChangePassword: true,
        loanDetails: {
          category,
          subcategory,
          emi: parseFloat(emi)
        }
      });
    } else {
      // Update existing user
      user.tempPassword = tempPassword;
      user.mustChangePassword = true;
      user.loanDetails = {
        category,
        subcategory,
        emi: parseFloat(emi)
      };
    }

    // Save to database
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Loan application submitted successfully',
      tempPassword
    });

  } catch (error) {
    console.error('Loan submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process loan application',
      error: error.message
    });
  }
};