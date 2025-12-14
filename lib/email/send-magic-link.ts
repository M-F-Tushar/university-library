import nodemailer from 'nodemailer';

// Email configuration - uses environment variables
// User must set EMAIL_SERVER and EMAIL_FROM in .env
const getTransporter = () => {
  const emailServer = process.env.EMAIL_SERVER;

  if (!emailServer) {
    console.warn('EMAIL_SERVER not configured. Email sending disabled.');
    return null;
  }

  return nodemailer.createTransport(emailServer);
};

interface SendMagicLinkOptions {
  email: string;
  token?: string;
  baseUrl?: string;
  url?: string;
}

/**
 * Send a magic link email for passwordless login
 */
export async function sendMagicLinkEmail({ email, token, baseUrl, url }: SendMagicLinkOptions): Promise<{ success: boolean; error?: string }> {
  const transporter = getTransporter();
  const fromEmail = process.env.EMAIL_FROM || 'noreply@library.edu';

  // Determine the login URL
  const loginUrl = url || (token && baseUrl ? `${baseUrl}/api/auth/verify?token=${token}` : '');

  if (!loginUrl) {
    return { success: false, error: 'Missing login URL' };
  }

  if (!transporter) {
    // For development without email server, log the link
    console.log('===========================================');
    console.log('📧 Magic Link (EMAIL NOT CONFIGURED)');
    console.log(`To: ${email}`);
    console.log(`Login URL: ${loginUrl}`);
    console.log('===========================================');
    return { success: true };
  }

  const mailOptions = {
    from: fromEmail,
    to: email,
    subject: 'Login to University Library',
    text: `Click the following link to log in to University Library:\n\n${loginUrl}\n\nThis link will expire in 15 minutes.\n\nIf you didn't request this, please ignore this email.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📚 University Library</h1>
          </div>
          <div class="content">
            <h2>Login Request</h2>
            <p>Hello,</p>
            <p>Click the button below to log in to your University Library account:</p>
            <p style="text-align: center;">
              <a href="${loginUrl}" class="button">Log In to Library</a>
            </p>
            <p>Or copy and paste this link:</p>
            <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${loginUrl}</p>
            <p><strong>This link will expire in 15 minutes.</strong></p>
            <p>If you didn't request this login link, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>University Digital Library © ${new Date().getFullYear()}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send email. Please try again.' };
  }
}
