import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Helper function to convert local logo to base64
const getLogoBase64 = () => {
  const logoPath = path.join(process.cwd(), 'frontend', 'src', 'assets', 'logo.png');
  try {
    const fileData = fs.readFileSync(logoPath);
    return `data:image/png;base64,${fileData.toString('base64')}`;
  } catch (error) {
    console.warn('Local logo not found, using placeholder');
    return 'https://saylaniwelfare.com/static/media/logo_saylani.1f19f076.png';
  }
};

export const sendWelcomeEmail = async (name, email) => {
  const logoData = getLogoBase64();
  
  const mailOptions = {
    from: `"Saylani Qarze Hasana" <${EMAIL_USER}>`,
    to: email,
    subject: 'Account Created - Qarze Hasana Microfinance Portal',
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Qarze Hasana Registration</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 0;
          background-color: #f5f5f5;
        }
        .email-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #005f87;
          padding: 25px;
          text-align: center;
        }
        .logo {
          height: 70px;
          margin-bottom: 10px;
        }
        .content {
          padding: 25px;
        }
        .footer {
          padding: 20px;
          text-align: center;
          background-color: #f0f4f7;
          font-size: 13px;
          color: #666;
        }
        .button {
          display: inline-block;
          padding: 12px 25px;
          background-color: #005f87;
          color: white !important;
          text-decoration: none;
          border-radius: 4px;
          margin: 15px 0;
          font-weight: bold;
        }
        .contact-box {
          background-color: #f8fafc;
          border-left: 4px solid #005f87;
          padding: 15px;
          margin: 20px 0;
        }
        .features {
          margin: 20px 0;
        }
        .feature-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .feature-icon {
          color: #005f87;
          margin-right: 10px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <img src="${logoData}" alt="Qarze Hasana Logo" class="logo">
          <h1 style="color: white; margin: 10px 0 0; font-size: 22px;">Interest-Free Microfinance Solution</h1>
        </div>
        
        <div class="content">
          <p>Assalam-o-Alaikum <strong>${name}</strong>,</p>
          
          <p>Your account has been successfully created for the <strong>Qarze Hasana</strong> program by Saylani Welfare.</p>
          
          <div class="features">
            <div class="feature-item">
              <span class="feature-icon">✓</span>
              <span>Apply for Qarze Hasana loans online</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✓</span>
              <span>Track application status in real-time</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✓</span>
              <span>Secure document uploads</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✓</span>
              <span>Admin dashboard for approvals</span>
            </div>
          </div>
          
          <div class="contact-box">
            <h3 style="margin-top: 0;">Need Help?</h3>
            <p>Our support team is available to assist you:</p>
            <ul style="margin-bottom: 0;">
              <li><strong>Email:</strong> qarzehasana@saylani.org</li>
              <li><strong>Phone:</strong> +92 21 111 729 526 (9AM-6PM PKT)</li>
              <li><strong>Address:</strong> Bahdurabad, Karachi, Pakistan</li>
            </ul>
          </div>
          
          <p style="margin-bottom: 25px;">
            <a href="#" class="button">Access Your Account</a>
          </p>
          
          <p>JazakAllah Khair for choosing our platform.</p>
          
          <p>Best regards,<br>
          <strong>Saylani IT Team</strong><br>
          <em>12-Hour Hackathon Project</em></p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Saylani Welfare International Trust</p>
          <p>
            <a href="https://saylaniwelfare.com" style="color: #005f87; text-decoration: none;">Website</a> | 
            <a href="https://facebook.com/SaylaniWelfare" style="color: #005f87; text-decoration: none;">Facebook</a> | 
            <a href="https://twitter.com/SaylaniWelfare" style="color: #005f87; text-decoration: none;">Twitter</a>
          </p>
        </div>
      </div>
    </body>
    </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};