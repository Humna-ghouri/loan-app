import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { User } from '../models/User.js';
import validator from 'validator';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmailWithRetry = async (to, subject, html) => {
  if (!validator.isEmail(to)) {
    throw new Error('Invalid email address');
  }
  const maxRetries = 3;
  let lastError = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const info = await transporter.sendMail({
        from: `"Loan App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        text: html.replace(/<[^>]*>/g, ''),
      });
      console.log('Email sent:', info.messageId);
      return { success: true, info };
    } catch (error) {
      lastError = error;
      console.warn(`Email attempt ${attempt} failed:`, error.message);
      if (attempt < maxRetries) await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  throw lastError;
};

export const submitApplication = async (req, res) => {
  try {
    const { name, email, cnic, category, subcategory, emi } = req.body;
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      cnic,
      role: 'borrower',
      mustChangePassword: true,
      loanDetails: { category, subcategory, emi },
    });
    await newUser.save();
    const emailContent = `<h2>Your Loan Application Details</h2><p>Dear ${name},</p><p>Your ${category} (${subcategory}) loan application has been approved!</p><h3>Login Credentials:</h3><p><strong>Email:</strong> ${email}</p><p><strong>Temporary Password:</strong> ${tempPassword}</p><p style="color: red;">You must change this password after first login</p><p><strong>EMI Amount:</strong> PKR ${emi}/month</p><p>Thank you for choosing our services.</p>`;
    try {
      await sendEmailWithRetry(email, 'Your Loan Application Approval', emailContent);
      res.status(201).json({ success: true, message: 'Application submitted. Check your email for credentials.' });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(201).json({ success: true, message: 'Application saved but email failed - please contact support', tempPassword });
    }
  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({ success: false, message: error.message.includes('EAUTH') ? 'Email configuration error' : 'Application processing failed', error: error.message });
  }
};

export const submitLoanDetails = async (req, res) => {
  try {
    const { guarantors, documents } = req.body;
    console.log('Received loan details:', req.body);
    const userId = req.user.id;
  } catch (error) {
    console.error('Loan details submission error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit loan details', error: error.message });
  }
};