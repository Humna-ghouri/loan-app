

// const loanRequestSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//   },
//   amount: {
//     type: Number,
//     default: 50000,
//   },
//   tenure: {
//     type: Number,
//     default: 12,
//   },
//   interestRate: {
//     type: Number,
//     default: 10,
//   },
//   guarantor1Name: String,
//   guarantor1Email: String,
//   guarantor1Location: String,
//   guarantor1CNIC: String,
//   guarantor2Name: String,
//   guarantor2Email: String,
//   guarantor2Location: String,
//   guarantor2CNIC: String,
//   address: String,
//   phoneNumber: String,
//   userPhoto: String,
//   status: {
//     type: String,
//     default: 'pending',
//   },
// }, { timestamps: true });

// export default mongoose.model('LoanRequest', loanRequestSchema);


import mongoose from 'mongoose';

const loanRequestSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    amount: {
      type: Number,
      default: 50000,
    },
    tenure: {
      type: Number,
      default: 12,
    },
    interestRate: {
      type: Number,
      default: 10,
    },
    guarantor1Name: String,
    guarantor1Email: String,
    guarantor1Location: String,
    guarantor1CNIC: String,
    guarantor2Name: String,
    guarantor2Email: String,
    guarantor2Location: String,
    guarantor2CNIC: String,
    address: String,
    phoneNumber: String,
    userPhoto: String,
    status: {
      type: String,
      default: 'pending',
    },
    tokenNumber: String, // Add this field
    appointmentDate: Date, // Add this field
    qrCode: String // Add this field
  }, { timestamps: true });
  
  export default mongoose.model('LoanRequest', loanRequestSchema);