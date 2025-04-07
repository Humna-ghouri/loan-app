// // backend/routes/userRoutes.js
// import express from 'express';
// import { login, register, changePassword, getCurrentUser,verifyTempPassword  } from '../controllers/authController.js';
// import authenticate from '../Middlewares/authenticate.js';

// const router = express.Router();

// router.post('/login', login);
// router.post('/register', register);
// router.post('/change-password', changePassword);
// router.get('/me', authenticate, getCurrentUser);
// // router.post('/verify-temp-password', verifyTempPassword);

// router.post('/reset-password', authController.resetPasswordWithTemp);

// export default router;

// import express from 'express';
// import { 
//   login,
//   register,
//   changePassword,
//   getCurrentUser,
//   resetPasswordWithTemp,
//   submitLoanApplication
// } from '../controllers/authController.js';
// import authenticate from '../Middlewares/authenticate.js';

// const router = express.Router();

// // Auth routes
// router.post('/login', login);
// router.post('/register', register);
// router.post('/change-password', changePassword);
// router.get('/me', authenticate, getCurrentUser);
// router.post('/reset-password', resetPasswordWithTemp);

// // Loan routes
// router.post('/submit-loan', submitLoanApplication);

// export default router;

import express from 'express';
import {
  login,
  submitLoanApplication,
  resetPasswordWithTemp,
  changePassword,
  getCurrentUser
} from '../controllers/authController.js';
import authMiddleware from '../Middlewares/authenticate.js';

const router = express.Router();

router.post('/login', login);
router.post('/submit-application', submitLoanApplication);
router.post('/reset-password', resetPasswordWithTemp);
router.post('/change-password', changePassword);
router.get('/me', authMiddleware, getCurrentUser);

export default router;