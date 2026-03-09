# MH Property Portal

A real estate listing platform for property brokers in Maharashtra, India. Brokers can list properties through an admin portal, and buyers can browse listings and express interest.

## Features

### Phase 1: Public Portal (✅ Completed)
- **Phone Gate Screen**: Buyers enter mobile number before browsing
- **Property Listings**: Grid view with filters by type and district
- **Search**: Text search by title, taluka, or area
- **Property Details**: Full property information with broker contact
- **Interest Submission**: One-click buyer interest submission
- **Success Screen**: Confirmation after expressing interest

### Phase 2: Admin Portal (✅ Completed)
- **Broker Login**: Email/password authentication
- **Dashboard**: Stats overview (total properties, leads, status breakdown)
- **My Properties**: Table view of broker's listings with edit/delete
- **Add Property**: Comprehensive form for new listings
- **Edit Property**: Update existing property details
- **Interested Buyers**: View all leads with buyer contact info

### Phase 3: Firebase Integration (⏳ Pending)
- Firebase Authentication for brokers
- Firestore database for properties and interests
- Real-time data synchronization
- Firebase Hosting deployment
- Firestore security rules

## Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: Plain inline CSS (no frameworks)
- **State Management**: React useState and useEffect
- **Backend (Phase 3)**: Firebase (Auth, Firestore, Hosting)

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Navigate to the project directory:
```bash
cd "C:/Users/rpaod/Realestae brocker/mh-property-portal"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to [http://localhost:5173](http://localhost:5173)

## Usage

### Public Site

1. **Enter Phone Number**: Visit the homepage and enter a 10-digit mobile number
2. **Browse Properties**: Filter by property type (Land, Plot, House, Flat, Commercial)
3. **Filter by District**: Select from Pune, Nashik, Aurangabad, Satara, Kolhapur, Ratnagiri
4. **Search**: Use the search bar to find properties by title, taluka, or area
5. **View Details**: Click on any property card to see full details
6. **Express Interest**: Click "I'm Interested" to submit your contact to the broker

### Admin Portal

1. **Login**: Visit `/admin/login`
   - Demo credentials: `broker1@example.com` / `password`

2. **Dashboard**: View your property stats and recent leads

3. **Manage Properties**: Add, edit, or view your property listings

4. **View Leads**: Check buyers who expressed interest in your properties

## Demo Broker Accounts

- broker1@example.com / password (2 properties)
- broker2@example.com / password (2 properties)
- broker3@example.com / password (2 properties)

## Design Details

### Color Scheme
- **Background**: #faf7f2 (warm cream)
- **Primary**: #8b6d38 (earthy brown)
- **Accent**: Amber gradient
- **Success**: #2e7d32 (green)

### Typography
- **Font Family**: Georgia, serif

## Next Steps (Phase 3)

1. Set up Firebase Project
2. Integrate Firebase Auth
3. Connect Firestore database
4. Configure Firestore security rules
5. Deploy to Firebase Hosting

See `.claude/app-specification.md` for full project details.

---

**Status**: Phase 1 & 2 Complete ✅ | Phase 3 Pending ⏳  
**Last Updated**: March 8, 2026
