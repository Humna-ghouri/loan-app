import mongoose from 'mongoose';

const loanApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  loanAmount: { type: Number, required: true },
  loanType: { type: String, required: true },
});

export const LoanApplication = mongoose.model('LoanApplication', loanApplicationSchema);
// backend/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cnic: { type: String },
  role: { type: String, default: 'user' },
  mustChangePassword: { type: Boolean, default: false },
  loanDetails: {
    category: { type: String },
    subcategory: { type: String },
    emi: { type: Number },
  },
});

export const User = mongoose.model('User', userSchema);;
