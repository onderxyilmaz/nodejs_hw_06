const nodemailer = require('nodemailer');
const createHttpError = require('http-errors');

class EmailService {
  constructor() {
    // Don't initialize the transporter in the constructor
    // It will be initialized when needed
    this.transporter = null;
  }

  // Initialize the transporter if it hasn't been initialized yet
  getTransporter() {
    if (!this.transporter) {
      console.log('SMTP yapılandırması başlatılıyor:', {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        user: process.env.SMTP_USER,
        from: process.env.SMTP_FROM
      });
      
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false
        },
        debug: true, // Debug modunu aktifleştir
        logger: true // Logger'ı aktifleştir
      });
    }
    
    return this.transporter;
  }

  async sendResetPasswordEmail(email, token) {
    try {
      const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;
      
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Password Reset Request',
        html: `
          <h1>Password Reset Request</h1>
          <p>You have requested to reset your password. Click the link below to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>This link will expire in 5 minutes.</p>
          <p>If you did not request this password reset, please ignore this email.</p>
        `,
      };

      const transporter = this.getTransporter();
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('EMAIL ERROR:', error);
      throw createHttpError(500, 'Failed to send the email, please try again later.');
    }
  }
}

module.exports = new EmailService();
