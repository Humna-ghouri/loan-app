import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import axios from 'axios';
import fs from 'fs';

// Helper function to calculate EMI
const calculateEMI = (principal, rate, tenure) => {
  const monthlyRate = rate / 12 / 100;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / 
             (Math.pow(1 + monthlyRate, tenure) - 1);
  return emi.toFixed(2);
};

// Helper to download image for PDF
const getImageBuffer = async (url) => {
  try {
    if (url.startsWith('http')) {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return Buffer.from(response.data, 'binary');
    } else if (fs.existsSync(`.${url}`)) {
      return fs.readFileSync(`.${url}`);
    }
    return null;
  } catch (error) {
    console.error('Error loading image:', error);
    return null;
  }
};

export const generatePDF = async (loanData) => {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 30,
      bufferPages: true
    });

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // Calculate EMI
    const emi = calculateEMI(
      loanData.amount || 50000,
      loanData.interestRate || 10,
      loanData.tenure || 12
    );

    // Header
    doc.fillColor('#0D47A1')
       .rect(0, 0, doc.page.width, 80)
       .fill()
       .fillColor('white')
       .font('Helvetica-Bold')
       .fontSize(20)
       .text('LOAN APPLICATION', 50, 30);

    // Applicant Photo
    if (loanData.userPhoto) {
      try {
        const imgBuffer = await getImageBuffer(loanData.userPhoto);
        if (imgBuffer) {
          doc.image(imgBuffer, 450, 100, {
            width: 80,
            height: 80,
            fit: [80, 80],
            align: 'center'
          });
        }
      } catch (error) {
        console.error('Error loading applicant photo:', error);
      }
    }

    // Loan Details
    doc.fillColor('#424242')
       .fontSize(12)
       .text('LOAN DETAILS', 50, 120)
       .text(`Amount: ${loanData.amount || 0} PKR`, 50, 140)
       .text(`Tenure: ${loanData.tenure || 0} months`, 50, 160)
       .text(`Interest Rate: ${loanData.interestRate || 0}%`, 50, 180)
       .text(`Monthly EMI: ${emi} PKR`, 50, 200, { underline: true });

    // Applicant Information
    doc.text('APPLICANT INFORMATION', 50, 240)
       .text(`Name: ${loanData.applicantName || 'N/A'}`, 50, 260)
       .text(`CNIC: ${loanData.applicantCNIC || 'N/A'}`, 50, 280);

    // QR Code
    if (loanData.tokenNumber) {
      try {
        const qrBuffer = await QRCode.toBuffer(loanData.tokenNumber, {
          width: 120,
          margin: 2
        });
        doc.image(qrBuffer, 450, 200, { width: 100 });
      } catch (error) {
        console.error('QR code generation failed:', error);
      }
    }

    doc.end();
  });
};