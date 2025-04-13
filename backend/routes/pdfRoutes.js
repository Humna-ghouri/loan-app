import express from 'express';
import { generateLoanPDF } from '../controllers/pdfController.js';

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'PDF sub-route works' });
});

// Actual PDF endpoint - NOW USING THE CONTROLLER
router.get('/:loanRequestId', generateLoanPDF);

export default router;