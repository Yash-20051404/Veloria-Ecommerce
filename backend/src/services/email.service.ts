import nodemailer from 'nodemailer';

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  // Lazy load transporter to ensure environment variables are loaded first
  private getTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail', // Automatically configures standard Gmail settings
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
    return this.transporter;
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const transporter = this.getTransporter();
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"VELORIA" <noreply@veloria.com>',
        to,
        subject,
        html,
      });
      console.log('Email sent successfully: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendOtpEmail(to: string, name: string, otp: string) {
    const subject = 'Your Veloria Privilege Code';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #030303; color: #ffffff; text-align: center;">
        <h1 style="color: #D6B57A; letter-spacing: 0.3em; font-weight: 300; margin-bottom: 30px;">VELORIA</h1>
        <p style="color: #aaaaaa; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase;">Welcome to the Maison, ${name}</p>
        <p style="color: #ffffff; margin-top: 20px;">Your secure verification code is:</p>
        <h2 style="font-size: 36px; letter-spacing: 0.3em; margin: 30px 0; color: #D6B57A; font-weight: 300;">${otp}</h2>
        <p style="color: #aaaaaa; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">This code will expire in 10 minutes. Do not share it.</p>
      </div>
    `;
    return this.sendEmail(to, subject, html);
  }

  async sendVerificationOTP(to: string, otp: string, name: string) {
    // Maps the param order from auth.service.ts to sendOtpEmail
    return this.sendOtpEmail(to, name, otp);
  }

  async sendPasswordResetOTP(to: string, otp: string) {
    const subject = 'Your Password Reset OTP';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #030303; color: #ffffff; text-align: center;">
        <h1 style="color: #D6B57A; letter-spacing: 0.3em; font-weight: 300; margin-bottom: 30px;">VELORIA</h1>
        <p style="color: #aaaaaa; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase;">Password Reset Request</p>
        <p style="color: #ffffff; margin-top: 20px;">You requested to reset your password. Use the OTP below to proceed:</p>
        <h2 style="font-size: 36px; letter-spacing: 0.3em; margin: 30px 0; color: #D6B57A; font-weight: 300;">${otp}</h2>
        <p style="color: #aaaaaa; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">If you did not request this, please ignore this email.</p>
      </div>
    `;
    return this.sendEmail(to, subject, html);
  }

  async sendWelcomeEmail(to: string, name: string) {
    const subject = 'Welcome to Veloria';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #030303; color: #ffffff; text-align: center;">
        <h1 style="color: #D6B57A; letter-spacing: 0.3em; font-weight: 300; margin-bottom: 30px;">VELORIA</h1>
        <p style="color: #aaaaaa; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase;">Welcome to the Maison, ${name}</p>
        <p style="color: #ffffff; margin-top: 20px;">Your account has been successfully verified. You can now explore timeless creations crafted for generations.</p>
      </div>
    `;
    return this.sendEmail(to, subject, html);
  }

  async sendOrderConfirmationEmail(to: string, name: string, orderId: string, amount: number) {
    const subject = `Veloria Order Confirmed - ${orderId}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #030303; color: #ffffff; text-align: center;">
        <h1 style="color: #D6B57A; letter-spacing: 0.3em; font-weight: 300; margin-bottom: 30px;">VELORIA</h1>
        <p style="color: #aaaaaa; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase;">Order Confirmed, ${name}</p>
        <p style="color: #ffffff; margin-top: 20px; line-height: 1.6;">Thank you for your purchase. Our master artisans are now preparing your creation.</p>
        <div style="border: 1px solid rgba(214, 181, 122, 0.3); background-color: rgba(214, 181, 122, 0.05); padding: 30px; margin: 30px 0;">
          <p style="margin: 0; color: #aaaaaa; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;">Order Number</p>
          <h3 style="margin: 10px 0 20px 0; color: #ffffff; font-size: 20px; font-weight: 300;">${orderId}</h3>
          <p style="margin: 0; color: #aaaaaa; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;">Total Paid</p>
          <h3 style="margin: 10px 0 0 0; color: #D6B57A; font-size: 24px; font-weight: 300;">₹${amount.toLocaleString('en-IN')}</h3>
        </div>
        <p style="color: #aaaaaa; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">Complimentary Insured Delivery Included</p>
      </div>
    `;
    return this.sendEmail(to, subject, html);
  }
}

export const emailService = new EmailService();