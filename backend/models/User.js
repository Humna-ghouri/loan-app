// // backend/models/User.js
// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   name: { type: String },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   cnic: { type: String },
//   role: { type: String, default: 'user' },
//   mustChangePassword: { type: Boolean, default: false },
//   tempPassword: { type: String }, // Add this field
//   loanDetails: {
//     category: { type: String },
//     subcategory: { type: String },
//     emi: { type: Number },
//   },
// });

// export const User = mongoose.model('User', userSchema); // Correct export

// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   name: { type: String },
//   email: { type: String, required: true, unique: true },
//   password: { type: String },
//   cnic: { type: String },
//   role: { type: String, default: 'user' },
//   mustChangePassword: { type: Boolean, default: false },
//   tempPassword: { type: String },
//   loanDetails: {
//     category: { type: String },
//     subcategory: { type: String },
//     emi: { type: Number }
//   }
// });

// export const User = mongoose.model('User', userSchema);

// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   name: { 
//     type: String,
//     trim: true
//   },
//   email: { 
//     type: String, 
//     required: true, 
//     unique: true,
//     trim: true,
//     lowercase: true
//   },
//   password: { 
//     type: String,
//     required: true
//   },
//   cnic: { 
//     type: String,
//     trim: true
//   },
//   role: { 
//     type: String, 
//     default: 'user',
//     enum: ['user', 'admin']
//   },
//   mustChangePassword: { 
//     type: Boolean, 
//     default: false 
//   },
//   tempPassword: { 
//     type: String 
//   },
//   loanDetails: {
//     category: { type: String },
//     subcategory: { type: String },
//     emi: { type: Number }
//   }
// }, {
//   timestamps: true
// });

// // Add index for better query performance
// userSchema.index({ email: 1 });

// export const User = mongoose.model('User', userSchema);

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: 'Invalid email format'
    }
  },
  password: { type: String, select: false },
  tempPassword: { type: String },
  mustChangePassword: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  cnic: { 
    type: String, 
    unique: true, 
    sparse: true,
    validate: {
      validator: (cnic) => /^\d{5}-\d{7}-\d{1}$/.test(cnic),
      message: 'CNIC must be in XXXXX-XXXXXXX-X format'
    }
  },
  loanDetails: {
    category: String,
    subcategory: String,
    emi: Number
  }
}, { 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.tempPassword;
      return ret;
    }
  }
});

// Create and export the model
const User = mongoose.model('User', userSchema);
export { User };  // Named export instead of default export