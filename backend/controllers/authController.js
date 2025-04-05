import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import nodemailer from 'nodemailer';
import validator from 'validator';
import dns from 'dns/promises';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function validateEmail(email) {
  try {
    if (!validator.isEmail(email)) {
      return { valid: false, message: 'Invalid email format' };
    }
    const domain = email.split('@')[1];
    try {
      await dns.resolveMx(domain);
      return { valid: true, message: 'Email is valid' };
    } catch (error) {
      return { valid: false, message: 'Email domain does not exist' };
    }
  } catch (error) {
    console.error('Email validation error:', error);
    return { valid: false, message: 'Error validating email' };
  }
}

async function sendEmail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (user.mustChangePassword) {
      return res.status(200).json({
        success: true,
        mustChangePassword: true,
        message: 'Please set a new password',
        tempToken: jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRETKEY, { expiresIn: '15m' }),
      });
    }
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRETKEY, { expiresIn: '1d' });
    res.status(200).json({ success: true, message: 'Login successful', token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const emailValidation = await validateEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({ success: false, message: emailValidation.message });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered. Please login instead.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role: 'user' });
    await newUser.save();
    const emailContent = `<h2>Welcome to Our Service!</h2><p>Hello ${name},</p><p>Thank you for registering. You can now login using your credentials.</p>`;
    const emailResult = await sendEmail({ to: email, subject: 'Welcome to Our Service', html: emailContent });
    if (!emailResult.success) {
      return res.status(500).json({ success: false, message: 'User registered, but email could not be sent.', error: emailResult.error });
    }
    res.status(201).json({ success: true, message: 'User registered successfully. A confirmation email has been sent.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { tempToken, newPassword } = req.body;
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRETKEY);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!user.mustChangePassword) {
      return res.status(400).json({ success: false, message: 'Password already changed' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.mustChangePassword = false;
    await user.save();
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRETKEY, { expiresIn: '1d' });
    res.status(200).json({ success: true, message: 'Password changed successfully', token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ success: false, message: 'Password change failed', error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Error fetching user data' });
  }
};