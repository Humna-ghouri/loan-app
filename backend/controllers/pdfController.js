import LoanRequest from '../models/LoanRequest.js';
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

    // Fetch loan details with all fields
    const loan = await LoanRequest.findById(loanRequestId).lean();
    
    if (!loan) {
      return res.status(404).json({ 
        success: false,
        message: 'Loan request not found' 
      });
    }

    // Format dates for PDF
    const formattedAppointmentDate = loan.appointmentDate 
      ? new Date(loan.appointmentDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'Not specified';

    const loanWithFormattedDates = {
      ...loan,
      formattedAppointmentDate,
      formattedAppointmentTime: '10:00 AM - 3:00 PM'
    };

    // Generate PDF with all loan details
    const pdfBuffer = await generatePDF(loanWithFormattedDates);

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