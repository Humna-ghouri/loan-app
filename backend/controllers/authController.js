import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import nodemailer from 'nodemailer';
import validator from 'validator';
import dns from 'dns/promises';
import dotenv from 'dotenv';

dotenv.config();

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper functions
async function validateEmail(email) {
  try {
    if (!validator.isEmail(email)) {
      return { valid: false, message: 'Invalid email format' };
    }
    const domain = email.split('@')[1];
    await dns.resolveMx(domain);
    return { valid: true, message: 'Email is valid' };
  } catch (error) {
    return { valid: false, message: 'Email domain does not exist' };
  }
}

async function sendEmail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: `"Loan App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
}

// Controller functions
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (user.mustChangePassword) {
      const tempToken = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_SECRETKEY,
        { expiresIn: '15m' }
      );
      
      return res.status(200).json({
        success: true,
        mustChangePassword: true,
        message: 'Please set a new password',
        tempToken
      });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRETKEY,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

export const submitLoanApplication = async (req, res) => {
  try {
    const { name, email, cnic, category, subcategory, emi } = req.body;

    if (!name || !email || !cnic || !category || !subcategory || !emi) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    const tempPassword = Math.random().toString(36).slice(2, 10);

    let user = await User.findOne({ email });
    if (!user) {
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
      user.tempPassword = tempPassword;
      user.mustChangePassword = true;
      user.loanDetails = { 
        category, 
        subcategory, 
        emi: parseFloat(emi) 
      };
    }

    await user.save();

    const emailResult = await sendEmail({
      to: email,
      subject: 'Your Loan Application',
      html: `<p>Your temporary password: <strong>${tempPassword}</strong></p>`
    });

    if (!emailResult.success) {
      console.error('Email failed:', emailResult.error);
    }

    res.status(200).json({
      success: true,
      message: 'Application submitted',
      tempPassword
    });

  } catch (error) {
    console.error('Loan submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Application failed',
      error: error.message
    });
  }
};

export const resetPasswordWithTemp = async (req, res) => {
  try {
    const { email, tempPassword, newPassword } = req.body;

    if (!email || !tempPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (user.tempPassword !== tempPassword.trim()) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid temporary password' 
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be 8+ characters' 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.tempPassword = undefined;
    user.mustChangePassword = false;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRETKEY,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset failed',
      error: error.message
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { tempToken, newPassword } = req.body;
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRETKEY);
    const user = await User.findById(decoded._id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (!user.mustChangePassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password already changed' 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.mustChangePassword = false;
    await user.save();

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRETKEY,
      { expiresIn: '1d' }
    );

    res.status(200).json({ 
      success: true, 
      message: 'Password changed successfully', 
      token, 
      user: { 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Password change failed', 
      error: error.message 
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      user 
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user data' 
    });
  }
};