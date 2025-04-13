import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

export const generatePDF = async (loanData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 30,
        bufferPages: true,
        info: {
          Title: `Loan Application - ${loanData.tokenNumber}`,
          Author: 'Premier Banking Solutions',
          Creator: 'Digital Loan System'
        }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // ======================
      // 1. WATERMARK BACKGROUND
      // ======================
      doc.opacity(0.03)
         .fillColor('#1565C0')
         .rect(0, 0, doc.page.width, doc.page.height)
         .fill()
         .opacity(1);

      // ======================
      // 2. BANK LETTERHEAD
      // ======================
      // Bank logo placeholder (replace with actual image)
      doc.fillColor('#0D47A1')
         .rect(0, 0, doc.page.width, 80)
         .fill();
      
      doc.fillColor('white')
         .font('Helvetica-Bold')
         .fontSize(20)
         .text('PREMIER BANK', 50, 30);
      
      doc.font('Helvetica')
         .fontSize(10)
         .text('Digital Loan Application System', 50, 55);

      // ======================
      // 3. DOCUMENT ID BADGE
      // ======================
      const docId = loanData.tokenNumber || `L-${loanData._id.toString().slice(-8).toUpperCase()}`;
      
      doc.fillColor('#0D47A1')
         .roundedRect(400, 40, 150, 40, 5)
         .fill();
      
      doc.fillColor('white')
         .font('Helvetica-Bold')
         .fontSize(12)
         .text('DOCUMENT ID', 410, 50, { width: 130, align: 'center' });
      
      doc.fontSize(14)
         .text(docId, 410, 65, { width: 130, align: 'center' });

      // ======================
      // 4. MAIN CONTENT AREA
      // ======================
      let yPosition = 120;

      // Applicant Card
      doc.fillColor('#E3F2FD')
         .roundedRect(40, yPosition, 520, 100, 8)
         .fill();
      
      doc.fillColor('#0D47A1')
         .fontSize(16)
         .text('APPLICANT INFORMATION', 60, yPosition + 20);
      
      doc.fillColor('#424242')
         .fontSize(11)
         .text(`Name: ${loanData.applicantName || 'N/A'}`, 60, yPosition + 45)
         .text(`Contact: ${loanData.phoneNumber || 'N/A'}`, 60, yPosition + 65)
         .text(`Email: ${loanData.email || 'N/A'}`, 60, yPosition + 85);
      
      doc.text(`Address: ${loanData.address || 'N/A'}`, 250, yPosition + 45, { width: 280 });

      yPosition += 130;

      // ======================
      // 5. LOAN DETAILS CARDS
      // ======================
      // Two-column layout
      doc.fillColor('#E3F2FD')
         .roundedRect(40, yPosition, 250, 120, 8)
         .fill();
      
      doc.fillColor('#0D47A1')
         .fontSize(14)
         .text('LOAN TERMS', 60, yPosition + 20);
      
      doc.fillColor('#424242')
         .fontSize(11)
         .text(`Amount: ${loanData.amount || 0} PKR`, 60, yPosition + 45)
         .text(`Tenure: ${loanData.tenure || 0} months`, 60, yPosition + 65)
         .text(`Rate: ${loanData.interestRate || 0}% APR`, 60, yPosition + 85)
         .text(`Purpose: ${loanData.purpose || 'General'}`, 60, yPosition + 105);

      // Appointment Card
      doc.fillColor('#E3F2FD')
         .roundedRect(310, yPosition, 250, 120, 8)
         .fill();
      
      doc.fillColor('#0D47A1')
         .fontSize(14)
         .text('APPOINTMENT', 330, yPosition + 20);
      
      doc.fillColor('#424242')
         .fontSize(11)
         .text(`Date: ${loanData.formattedAppointmentDate || 'Pending'}`, 330, yPosition + 45)
         .text(`Time: ${loanData.formattedAppointmentTime || '10:00 AM'}`, 330, yPosition + 65)
         .text(`Branch: Main Banking Center`, 330, yPosition + 85)
         .text(`Officer: Loan Specialist`, 330, yPosition + 105);

      yPosition += 150;

      // ======================
      // 6. GUARANTORS SECTION
      // ======================
      doc.fillColor('#0D47A1')
         .fontSize(16)
         .text('GUARANTOR DETAILS', 40, yPosition);
      
      yPosition += 30;

      // Guarantor 1 Card
      doc.fillColor('#F5F5F5')
         .roundedRect(40, yPosition, 250, 100, 6)
         .fill();
      
      doc.fillColor('#0D47A1')
         .fontSize(12)
         .text('PRIMARY GUARANTOR', 60, yPosition + 15);
      
      doc.fillColor('#424242')
         .fontSize(10)
         .text(loanData.guarantor1Name || 'N/A', 60, yPosition + 35)
         .text(`CNIC: ${loanData.guarantor1CNIC || 'N/A'}`, 60, yPosition + 55)
         .text(`Contact: ${loanData.guarantor1Phone || 'N/A'}`, 60, yPosition + 75);

      // Guarantor 2 Card
      doc.fillColor('#F5F5F5')
         .roundedRect(310, yPosition, 250, 100, 6)
         .fill();
      
      doc.fillColor('#0D47A1')
         .fontSize(12)
         .text('SECONDARY GUARANTOR', 330, yPosition + 15);
      
      doc.fillColor('#424242')
         .fontSize(10)
         .text(loanData.guarantor2Name || 'N/A', 330, yPosition + 35)
         .text(`CNIC: ${loanData.guarantor2CNIC || 'N/A'}`, 330, yPosition + 55)
         .text(`Contact: ${loanData.guarantor2Phone || 'N/A'}`, 330, yPosition + 75);

      yPosition += 130;

      // ======================
      // 7. QR CODE & BARCODE
      // ======================
      if (loanData.tokenNumber) {
        try {
          // Generate QR Code
          const qrCode = await QRCode.toBuffer(loanData.tokenNumber, {
            errorCorrectionLevel: 'H',
            margin: 2,
            width: 120
          });

          // QR Code Container
          doc.fillColor('#E3F2FD')
             .roundedRect(400, yPosition, 150, 180, 8)
             .fill();
          
          doc.image(qrCode, 415, yPosition + 20, { width: 120 });
          
          doc.fillColor('#0D47A1')
             .fontSize(10)
             .text('VERIFICATION CODE', 400, yPosition + 150, {
               width: 150,
               align: 'center'
             });
          
          doc.fillColor('#424242')
             .fontSize(8)
             .text(loanData.tokenNumber, 400, yPosition + 165, {
               width: 150,
               align: 'center'
             });
        } catch (error) {
          console.error('QR Generation Error:', error);
        }
      }

      // ======================
      // 8. FOOTER & SECURITY
      // ======================
      doc.fillColor('#616161')
         .fontSize(8)
         .text('This is a computer-generated document that does not require a signature.', 40, 750, {
           width: 500,
           align: 'center'
         });
      
      doc.text(`Document generated on: ${new Date().toLocaleString()} | System ID: ${Math.random().toString(36).substring(2, 10).toUpperCase()}`, 40, 770, {
        width: 500,
        align: 'center'
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};