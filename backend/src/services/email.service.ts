import nodemailer from 'nodemailer';

class EmailService {
  private transporter!: nodemailer.Transporter;
  private brandName = 'VELORIA';

  constructor() {
    // Initialization is deferred to avoid race conditions with dotenv.config()
  }

  private getTransporter(): nodemailer.Transporter {
    if (!this.transporter) {
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('[EmailService] CRITICAL: SMTP_USER or SMTP_PASS environment variables are missing!');
      }
      
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }
    return this.transporter;
  }

  async verifyConnection(): Promise<void> {
    try {
      await this.getTransporter().verify();
      console.log('✅ [EmailService] SMTP connection verified successfully.');
    } catch (error) {
      console.error('❌ [EmailService] SMTP connection failed:', error);
    }
  }

  private getBaseTemplate(title: string, content: string): string {
    return `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #000000; padding: 30px; text-align: center;">
          <h1 style="color: #d4af37; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 4px;">${this.brandName}</h1>
        </div>
        <div style="padding: 40px 30px; color: #333333; line-height: 1.6;">
          <h2 style="color: #000000; font-size: 22px; margin-top: 0; font-weight: 600;">${title}</h2>
          ${content}
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; color: #888888; font-size: 12px; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} ${this.brandName} Luxury Multi-Vendor Platform. All rights reserved.</p>
        </div>
      </div>
    `;
  }

  async sendVerificationOTP(email: string, otp: string, name: string): Promise<void> {
    const content = `
      <p>Dear ${name},</p>
      <p>Welcome to ${this.brandName}. To complete your registration, please verify your email address using the One-Time Password (OTP) below.</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #000000; background-color: #f4f4f4; padding: 15px 30px; border-radius: 4px;">${otp}</span>
      </div>
      <p>This code will expire in <strong>10 minutes</strong>.</p>
      <p>If you did not initiate this request, please disregard this email.</p>
    `;

    await this.getTransporter().sendMail({
      from: `"${this.brandName} Security" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Verify Your Email - ${this.brandName}`,
      html: this.getBaseTemplate('Email Verification', content)
    });
  }

  async sendPasswordResetOTP(email: string, otp: string): Promise<void> {
    const content = `
      <p>Hello,</p>
      <p>We received a request to reset the password for your ${this.brandName} account. Please use the verification code below to proceed.</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #000000; background-color: #f4f4f4; padding: 15px 30px; border-radius: 4px;">${otp}</span>
      </div>
      <p>This code will expire in <strong>10 minutes</strong>.</p>
      <p>If you did not request a password reset, please ignore this email. Your account remains secure.</p>
    `;

    await this.getTransporter().sendMail({
      from: `"${this.brandName} Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Password Reset Request - ${this.brandName}`,
      html: this.getBaseTemplate('Password Reset', content)
    });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const content = `
      <p>Dear ${name},</p>
      <p>Congratulations and welcome to <strong>${this.brandName}</strong>.</p>
      <p>Your account has been successfully verified and activated. You can now explore our curated collection of luxury items or begin setting up your boutique.</p>
      <div style="text-align: center; margin: 40px 0;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 28px; font-weight: bold; font-size: 16px; border-radius: 4px; display: inline-block;">Explore ${this.brandName}</a>
      </div>
      <p>Thank you for joining our exclusive community.</p>
    `;

    await this.getTransporter().sendMail({
      from: `"${this.brandName} Concierge" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Welcome to ${this.brandName}`,
      html: this.getBaseTemplate('Welcome to the Experience', content)
    });
  }
}

export const emailService = new EmailService();