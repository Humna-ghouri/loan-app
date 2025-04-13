import loanRequest from '../models/loanRequest.js';
import mongoose from 'mongoose';
import { generatePDF } from '../utils/pdfGenerator.js';

export const generateLoanPDF = async (req, res) => {
  try {
    const { loanRequestId } = req.params;

    // Validate loan ID
    if (!mongoose.Types.ObjectId.isValid(loanRequestId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid loan ID format' 
      });
    }

    // Fetch loan details
    const loan = await loanRequest.findById(loanRequestId).lean();
    
    if (!loan) {
      return res.status(404).json({ 
        success: false,
        message: 'Loan request not found' 
      });
    }

    // Generate PDF - ACTUALLY USING THE GENERATE FUNCTION NOW
    const pdfBuffer = await generatePDF(loan);

    // Set proper PDF headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition', 
      `attachment; filename=loan-slip-${loan.tokenNumber || loan._id}.pdf`
    );

    // Send the PDF
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF'
    });
  }
};