# Maharashtra Real Estate Broker Portal

A comprehensive real estate platform for Maharashtra featuring OTP verification, property management, and automated broker notifications.

## Features

### Public Portal (MH Property Portal)
- Phone number verification via SMS OTP (2Factor.in)
- Browse properties across 5 categories:
  - Agricultural Land
  - NA Plots
  - Independent Houses
  - Flats & Apartments
  - Commercial Properties
- Property details with images and pricing
- Interest submission system
- Email notifications to brokers

### Admin Dashboard
- Secure broker login
- Property management (Add/Edit/Delete)
- View interested buyers
- Track leads with contact information

## Tech Stack

### Frontend
- React 18 with Vite
- React Router v6
- Plain CSS (Georgia serif theme)

### Backend API
- Next.js 14 (App Router)
- 2Factor.in SMS OTP service
- Nodemailer for email notifications
- Axios for HTTP requests

## Project Structure

```
Realestae brocker/
├── mh-property-portal/          # React frontend (Port 5173)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── GateScreen.jsx   # OTP verification
│   │   │   ├── ListingsScreen.jsx
│   │   │   ├── PropertyDetail.jsx
│   │   │   └── admin/           # Admin dashboard
│   │   └── data/
│   │       └── sampleProperties.js
│   └── package.json
│
└── otp-verification-app/
    └── nextjs-web/              # Next.js API backend (Port 3003)
        ├── app/
        │   └── api/
        │       ├── send-otp/route.js
        │       ├── verify-otp/route.js
        │       └── notify-broker/route.js
        └── package.json
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Rushikeshpalodkar/realestate_MH_brocker.git
cd "realestate_MH_brocker"
```

### 2. Setup Backend API

```bash
cd "otp-verification-app/nextjs-web"
npm install
```

Create `.env.local` file:

```env
TWOFACTOR_API_KEY=your_2factor_api_key_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
BROKER_EMAIL=broker_email@gmail.com
```

Start the backend:

```bash
npm run dev
# Runs on http://localhost:3003
```

### 3. Setup Frontend Portal

```bash
cd "../../mh-property-portal"
npm install
npm run dev
# Runs on http://localhost:5173
```

## Environment Variables

### Required for Backend (.env.local)

| Variable | Description |
|----------|-------------|
| `TWOFACTOR_API_KEY` | API key from 2Factor.in |
| `EMAIL_USER` | Gmail address for sending emails |
| `EMAIL_PASSWORD` | Gmail App Password (not regular password) |
| `BROKER_EMAIL` | Email to receive buyer notifications |

### Getting API Keys

1. **2Factor.in** - Sign up at https://2factor.in for SMS OTP service
2. **Gmail App Password** - Enable 2FA on Gmail, then generate app password

## Usage

1. Open http://localhost:5173
2. Enter name and phone number
3. Receive 6-digit OTP via SMS
4. Verify OTP to access property listings
5. Browse properties and express interest
6. Broker receives email notification with buyer details

## Admin Access

- URL: http://localhost:5173/admin
- Default credentials configured in code

## API Endpoints

### Send OTP
```
POST http://localhost:3003/api/send-otp
Body: { "phoneNumber": "9876543210" }
```

### Verify OTP
```
POST http://localhost:3003/api/verify-otp
Body: { "sessionId": "xxx", "otp": "123456" }
```

### Notify Broker
```
POST http://localhost:3003/api/notify-broker
Body: { "userName": "John", "userPhone": "+919876543210", "verifiedAt": "ISO date" }
```

## Security Features

- OTP verification prevents spam
- Environment variables for sensitive data
- CORS headers for API security
- .gitignore excludes credentials

## Future Enhancements

- Firebase integration for data persistence
- Advanced property search filters
- WhatsApp notifications
- Multi-language support
- Payment gateway integration

## License

Private project - All rights reserved

## Author

Developed by Rushikesh Palodkar
