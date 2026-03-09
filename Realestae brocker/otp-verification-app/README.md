# OTP Verification System with Email Notifications

A complete OTP verification system for Indian users built with Next.js, Firebase Phone Authentication, and email broker notifications.

## 🚀 Features

- **Phone OTP Authentication**: Secure Firebase Phone Authentication for Indian phone numbers (+91)
- **Email Notifications**: Automatic email notifications to brokers when users verify
- **Beautiful UI**: Modern, responsive interface with gradient design
- **Indian Phone Validation**: Validates 10-digit numbers starting with 6/7/8/9
- **User Name Collection**: Captures user name along with phone number
- **Email Templates**: Professional HTML email templates with user details

## 📋 Prerequisites

- Node.js 18+ installed
- Firebase account (free tier works)
- Gmail/Outlook/Yahoo email account for sending notifications

## 🛠️ Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Phone Authentication**:
   - Go to Authentication > Sign-in method
   - Enable "Phone" provider
4. Register a web app:
   - Project Settings > General > Add app > Web
   - Copy the configuration values

### 2. Email Setup (Gmail Example)

1. **Enable 2-Step Verification**:
   - Go to Google Account: https://myaccount.google.com/
   - Security > 2-Step Verification > Turn On

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select App: "Mail"
   - Select Device: "Other (Custom name)" → type "OTP App"
   - Click "Generate"
   - Copy the 16-character password (remove spaces)

### 3. Install Dependencies

```bash
cd otp-verification-app/nextjs-web
npm install
```

### 4. Configure Environment Variables

1. Copy the example file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` with your values:

```env
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...

# Email Config
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
BROKER_EMAIL=broker@example.com
```

### 5. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## 📱 How It Works

### User Flow

1. **Enter Details**:
   - User enters full name
   - User enters 10-digit Indian phone number

2. **OTP Verification**:
   - Firebase sends 6-digit OTP via SMS
   - User enters OTP to verify

3. **Success**:
   - User gets verification confirmation
   - Broker receives email notification with:
     - User's name
     - User's phone number
     - Verification timestamp (Indian timezone)

### Technical Flow

```
User Input → Firebase Auth → OTP SMS
↓
User Enters OTP → Firebase Verify
↓
Success → API Call → Nodemailer → Email to Broker
```

## 📧 Email Configuration for Different Providers

### Gmail
```javascript
service: 'gmail',
auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD, // App Password
}
```

### Outlook
```javascript
service: 'outlook',
auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD, // Regular password
}
```

### Yahoo
```javascript
service: 'yahoo',
auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD, // App Password
}
```

## 🎨 Project Structure

```
otp-verification-app/
├── nextjs-web/
│   ├── app/
│   │   ├── api/
│   │   │   └── notify-broker/
│   │   │       └── route.js          # Email notification API
│   │   ├── components/
│   │   │   └── OTPVerification.jsx   # Main OTP component
│   │   ├── layout.js                 # Root layout
│   │   └── page.js                   # Home page
│   ├── lib/
│   │   └── firebase.js               # Firebase config
│   ├── package.json
│   └── .env.local.example
└── README.md
```

## 🔒 Security Features

- **Firebase reCAPTCHA**: Prevents bot attacks
- **Phone Number Validation**: Server-side validation
- **Environment Variables**: Sensitive data not exposed
- **App Passwords**: Using app-specific passwords for email
- **HTTPS**: Firebase requires HTTPS in production

## 🐛 Troubleshooting

### OTP Not Sending

1. **Check Firebase Console**: Ensure Phone Authentication is enabled
2. **reCAPTCHA Issues**: Try clearing browser cache
3. **Phone Number Format**: Must be +91 followed by 10 digits starting with 6/7/8/9

### Email Not Sending

1. **Gmail App Password**: Make sure you're using App Password, not regular password
2. **2-Step Verification**: Must be enabled for Gmail
3. **Check Spam Folder**: Email might be in spam
4. **Environment Variables**: Verify all EMAIL_* variables are set correctly
5. **Console Logs**: Check server logs for detailed error messages

### Common Errors

**"Missing email configuration"**
- Ensure EMAIL_USER, EMAIL_PASSWORD, and BROKER_EMAIL are set in `.env.local`

**"Invalid OTP"**
- OTP expires after a few minutes
- Request new OTP if expired

**"reCAPTCHA error"**
- Clear browser cache
- Try incognito/private browsing mode
- Check Firebase Console for reCAPTCHA settings

## 📊 API Endpoints

### POST `/api/notify-broker`

Sends email notification to broker.

**Request Body**:
```json
{
  "userName": "John Doe",
  "userPhone": "+919876543210",
  "verifiedAt": "2024-01-15T10:30:00.000Z"
}
```

**Response**:
```json
{
  "success": true,
  "messageId": "<message-id>",
  "message": "Broker notified successfully via email"
}
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables on Vercel

Add all variables from `.env.local.example` in:
- Project Settings > Environment Variables

## 📝 Customization

### Change Email Template

Edit `app/api/notify-broker/route.js`:
- Modify the `html` template in `mailOptions`
- Update colors, layout, or content

### Change Email Provider

Update `service` in `createTransporter()`:
```javascript
service: 'gmail', // or 'outlook', 'yahoo', etc.
```

### Modify Phone Validation

Edit validation regex in `OTPVerification.jsx`:
```javascript
const indianPhoneRegex = /^[6-9]\d{9}$/;
```

## 🎯 Best Practices

1. **Never commit `.env.local`**: Already in `.gitignore`
2. **Use App Passwords**: Never use regular email password
3. **Test in Development**: Test thoroughly before production
4. **Monitor Email Quota**: Gmail has daily sending limits (500/day for free)
5. **Keep Dependencies Updated**: Regularly update packages

## 📄 License

MIT License - feel free to use in your projects

## 🤝 Support

For issues or questions:
- Check Firebase documentation
- Check Nodemailer documentation
- Review error logs in browser console and server logs

## 🔄 Version History

- **v1.0.0**: Initial release with email notifications
  - Firebase Phone OTP
  - Nodemailer email integration
  - Indian phone number validation
  - Beautiful UI with success states
