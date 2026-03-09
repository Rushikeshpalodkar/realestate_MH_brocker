import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or 'outlook', 'yahoo', etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
    },
  });
};

export async function POST(request) {
  try {
    // Parse request body
    const { userName, userPhone, verifiedAt } = await request.json();

    // Validate required fields
    if (!userName || !userPhone || !verifiedAt) {
      return NextResponse.json(
        { error: 'Missing required fields: userName, userPhone, verifiedAt' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || !process.env.BROKER_EMAIL) {
      console.error('Missing email configuration in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Format the verification time
    const verificationTime = new Date(verifiedAt).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // Create transporter
    const transporter = createTransporter();

    // Email content
    const mailOptions = {
      from: `"OTP Verification System" <${process.env.EMAIL_USER}>`,
      to: process.env.BROKER_EMAIL,
      subject: '🔔 New User Verified - OTP System',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-row { margin: 15px 0; padding: 15px; background: white; border-left: 4px solid #667eea; }
            .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
            .value { font-size: 16px; color: #333; }
            .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🎉 New User Verified!</h1>
            </div>
            <div class="content">
              <p>A new user has successfully completed OTP verification.</p>

              <div class="info-row">
                <div class="label">👤 Name</div>
                <div class="value">${userName}</div>
              </div>

              <div class="info-row">
                <div class="label">📱 Phone Number</div>
                <div class="value">${userPhone}</div>
              </div>

              <div class="info-row">
                <div class="label">✅ Verified At</div>
                <div class="value">${verificationTime}</div>
              </div>

              <p style="margin-top: 30px; padding: 15px; background: #e8f5e9; border-radius: 5px;">
                <strong>Next Steps:</strong><br>
                The user is now verified and ready to proceed. You can contact them at <strong>${userPhone}</strong>.
              </p>
            </div>
            <div class="footer">
              <p>This is an automated notification from your OTP Verification System</p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Plain text version
      text: `
🔔 NEW USER VERIFIED

👤 Name: ${userName}
📱 Phone: ${userPhone}
✅ Verified At: ${verificationTime}

The user has successfully completed OTP verification and is ready to proceed.
You can contact them at ${userPhone}.

---
This is an automated notification from your OTP Verification System
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email notification sent:', info.messageId);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: 'Broker notified successfully via email',
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error sending email notification:', error);

    return NextResponse.json(
      {
        error: 'Failed to send notification',
        details: error.message,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Optional: Handle GET requests
export async function GET() {
  return NextResponse.json({
    message: 'Email Notification API',
    method: 'POST',
    requiredFields: ['userName', 'userPhone', 'verifiedAt'],
    emailProvider: 'Nodemailer (Gmail/Outlook/Yahoo supported)',
  }, { headers: corsHeaders });
}
