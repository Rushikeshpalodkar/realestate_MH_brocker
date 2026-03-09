# Getting Started with MH Property Portal

## Quick Start

Your application is now running at: **http://localhost:5173**

## What's Been Built

### ✅ Phase 1: Public Portal (Complete)
All buyer-facing pages are functional:

1. **Homepage** (`/`) - Phone number gate screen
2. **Listings** (`/listings`) - Browse all properties with filters
3. **Property Detail** (`/property/:id`) - View single property
4. **Success** (`/success`) - Interest submission confirmation

### ✅ Phase 2: Admin Portal (Complete)
All broker admin pages are functional:

1. **Login** (`/admin/login`) - Broker authentication
2. **Dashboard** (`/admin/dashboard`) - Overview and stats
3. **My Properties** (`/admin/properties`) - Manage listings
4. **Add Property** (`/admin/properties/add`) - Create new listing
5. **Edit Property** (`/admin/properties/edit/:id`) - Update listing
6. **Interested Buyers** (`/admin/buyers`) - View leads

## How to Test

### Test the Public Portal

1. Open http://localhost:5173
2. Enter any 10-digit phone number (e.g., 9876543210)
3. Click "Browse Properties"
4. Try filtering by type (Land, Plot, House, etc.)
5. Try filtering by district (Pune, Nashik, etc.)
6. Search for "Nashik" or "Land"
7. Click on any property card
8. Click "I'm Interested" button
9. You should see the success screen

### Test the Admin Portal

1. Open http://localhost:5173/admin/login
2. Enter demo credentials:
   - Email: `broker1@example.com`
   - Password: `password`
3. Click "Login"
4. You'll see the Dashboard with:
   - 2 Total Properties
   - 0 Total Leads (initially)
   - Property status breakdown
5. Click "My Properties" to see your 2 listings
6. Click "Add Property" to create a new listing
7. Click "Interested Buyers" to see leads (empty until buyers submit interest)

### Test the Full Flow

1. As a **buyer**:
   - Enter phone: 9876543210
   - Browse listings
   - Click on "Premium Agricultural Land in Nashik"
   - Click "I'm Interested"
   - See success confirmation

2. As a **broker** (broker1@example.com):
   - Login to admin
   - Go to "Interested Buyers"
   - You should see the buyer's phone number (9876543210) listed

## Sample Data

The app includes 6 sample properties across 3 brokers:

### Broker 1 (broker1@example.com)
- Premium Agricultural Land in Nashik
- CIDCO Approved NA Plot in Aurangabad

### Broker 2 (broker2@example.com)
- 3 BHK Spacious House in Pune
- 2 BHK Premium Flat in Kolhapur

### Broker 3 (broker3@example.com)
- Commercial Shop in Satara Market
- Beachside Plot in Ratnagiri

## Key Features to Test

### Public Portal Features
- ✅ Phone gate validation (minimum 10 digits)
- ✅ Property type filters (5 types)
- ✅ District filters (6 districts)
- ✅ Search by title/taluka/location
- ✅ Property cards with all details
- ✅ Interest submission
- ✅ Prevention of duplicate interest

### Admin Portal Features
- ✅ Login authentication
- ✅ Dashboard stats
- ✅ Property CRUD operations
- ✅ Broker can only see their own properties
- ✅ Leads tracking
- ✅ Logout functionality

## What's Next (Phase 3)

The application currently uses in-memory data. To make it production-ready:

1. **Set up Firebase Project**
   - Create a new Firebase project
   - Enable Authentication (Email/Password)
   - Create Firestore database

2. **Update Configuration**
   - Add Firebase config to the project
   - Replace sample data with Firestore calls
   - Add real authentication

3. **Deploy**
   - Build production bundle: `npm run build`
   - Deploy to Firebase Hosting: `firebase deploy`

All the UI is complete - Phase 3 is just about swapping the data layer!

## Troubleshooting

### Dev Server Not Starting
```bash
cd mh-property-portal
npm install
npm run dev
```

### Port Already in Use
If port 5173 is busy:
```bash
npm run dev -- --port 3000
```

### Browser Not Showing Updates
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache

## Project Structure

```
mh-property-portal/
├── src/
│   ├── pages/           # All page components
│   ├── components/      # Reusable components
│   ├── data/            # Sample data
│   └── App.jsx          # Main app with routing
├── README.md            # Full documentation
└── package.json         # Dependencies
```

## Need Help?

Refer to:
- `README.md` - Full project documentation
- `.claude/app-specification.md` - Complete specification
- Firebase docs for Phase 3 setup

---

**Status**: Fully functional with sample data  
**Ready for**: Phase 3 Firebase integration
