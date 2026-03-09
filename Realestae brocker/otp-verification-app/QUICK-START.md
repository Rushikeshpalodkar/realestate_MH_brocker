# Quick Start Guide - OTP Verification with Email

Get your OTP verification system running in 5 minutes!

## ⚡ Quick Setup

### Step 1: Install Dependencies (1 min)

```bash
cd otp-verification-app/nextjs-web
npm install
```

### Step 2: Firebase Setup (2 min)

1. Go to https://console.firebase.google.com/
2. Create project → Enable Phone Auth
3. Get your config from Project Settings > Web App

### Step 3: Gmail App Password (2 min)

1. Enable 2-Step: https://myaccount.google.com/security
2. Create App Password: https://myaccount.google.com/apppasswords
   - App: Mail
   - Device: Other (type "OTP App")
   - Copy the 16-character password

### Step 4: Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Firebase (from Step 2)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123...
NEXT_PUBLIC_FIREBASE_APP_ID=1:123...

# Email (from Step 3)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop  # Remove spaces!
BROKER_EMAIL=broker@example.com
```

### Step 5: Run

```bash
npm run dev
```

Open http://localhost:3000

## ✅ Test Flow

1. Enter name: "Test User"
2. Enter phone: "9876543210"
3. Click "Send OTP" → Check SMS
4. Enter 6-digit OTP
5. Verify → Check broker email!

## 🔍 Troubleshooting

**OTP not received?**
- Check Firebase Console → Authentication → Phone enabled
- Try different phone number
- Check browser console for errors

**Email not sent?**
- Verify EMAIL_PASSWORD has no spaces
- Check 2-Step Verification is ON
- Look in spam folder
- Check server console for errors

**"Missing email configuration" error?**
- Make sure `.env.local` exists
- All EMAIL_* variables are set
- Restart dev server after changing .env

## 📧 Email Providers

### Gmail (Recommended)
- Requires App Password
- 2-Step Verification must be enabled
- Free tier: 500 emails/day

### Outlook
- Use regular password (no app password)
- Change `service: 'gmail'` to `service: 'outlook'` in route.js

### Yahoo
- Requires App Password
- Change `service: 'gmail'` to `service: 'yahoo'` in route.js

## 🎯 What You Get

✅ Phone OTP verification via SMS
✅ User name + phone collection
✅ Email notifications to broker with:
  - User name
  - Phone number
  - Verification timestamp (Indian time)
✅ Beautiful UI with success states
✅ Indian phone validation (6/7/8/9 start)

## 📁 Key Files

- `app/components/OTPVerification.jsx` - Main UI component
- `app/api/notify-broker/route.js` - Email sending API
- `lib/firebase.js` - Firebase configuration
- `.env.local` - Your environment variables

## 🚀 Next Steps

1. Customize email template in `route.js`
2. Add user database storage
3. Deploy to Vercel
4. Add analytics tracking

Need help? Check README.md for detailed documentation!
