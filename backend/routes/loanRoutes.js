import express from 'express';
import { submitApplication, submitLoanDetails } from '../controllers/loanController.js';
import authenticate from '../Middlewares/authenticate.js';

const router = express.Router();

router.post('/submit', submitApplication);
router.post('/submit-details', authenticate, submitLoanDetails);

export default router;

