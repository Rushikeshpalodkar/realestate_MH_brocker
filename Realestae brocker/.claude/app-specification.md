# Real Estate Broker Application Specification

## 1. Project Overview
**Application Name:** MH Property Portal

**Purpose:** A real estate listing platform for property brokers in Maharashtra, 
India. Brokers can list properties (lands, plots, houses, flats, shops) through 
an admin portal. Buyers can browse listings, view property details on a map, 
and send their interest directly to the broker with one click.

**Target Users:**
- Property brokers in Maharashtra (Admin side)
- Property buyers and investors in Maharashtra (Public side)

**Key Goals:**
- Allow brokers to independently manage their property listings
- Allow buyers to browse properties without creating an account
- Connect interested buyers directly to brokers via phone number
- Focus on Maharashtra-specific property types and local context

---

## 2. Technical Stack

### Frontend
- **Framework:** React 18 + Vite
- **UI Library:** Plain inline CSS only (no Tailwind, no Bootstrap)
- **State Management:** React useState and useEffect hooks
- **Routing:** React Router v6

### Backend
- **Framework:** No custom backend — Firebase handles everything
- **Database:** Firebase Firestore (NoSQL cloud database)
- **Authentication:** Firebase Auth (email + password for brokers)
- **API Type:** Firebase SDK (direct calls from frontend)

### Deployment & Infrastructure
- **Hosting:** Firebase Hosting (free tier to start)
- **CI/CD:** Manual deploy via Firebase CLI
- **Storage:** Firebase Storage (for property images in future phase)

---

## 3. Core Features

### Feature 1: Buyer Phone Gate
**Description:** Buyer must enter their mobile number before browsing any 
properties. The number is stored in React state and only shared with the 
broker when buyer clicks "I'm Interested."

**User Flow:**
1. Buyer lands on homepage
2. Sees a phone number input form
3. Enters 10 digit mobile number
4. Clicks "Browse Properties"
5. Gets access to full listings

**Technical Requirements:**
- Validate minimum 10 digits
- Store phone in React state (not in database yet)
- Block access to listings if phone not entered
- No OTP verification needed in Phase 1

---

### Feature 2: Property Listings with Filters
**Description:** Grid of property cards with filters by type and district, 
plus a search bar and optional Maharashtra map view.

**User Flow:**
1. Buyer sees grid of all available properties
2. Can filter by property type (Land, Plot, House, Flat, Commercial)
3. Can filter by district (Pune, Nashik, Aurangabad, Satara, Kolhapur, Ratnagiri)
4. Can search by title, taluka or area name
5. Can toggle map view to see property pin locations
6. Clicks any card to view full property details

**Technical Requirements:**
- Load properties from Firebase Firestore in real time
- Filter and search done on frontend
- SVG Maharashtra outline map with emoji pins
- Show loading state while fetching
- Show "No properties found" if filters return empty

---

### Feature 3: Property Detail and Interest Submission
**Description:** Full property detail page with all information and a sticky 
broker sidebar. Buyer can express interest with one click.

**User Flow:**
1. Buyer clicks a property card
2. Sees full details — price, area, description, tags, facing, map
3. Sees broker name and phone in sidebar
4. Sees their own phone number displayed before submitting
5. Clicks "I'm Interested" button
6. System saves interest record to Firebase
7. Buyer sees success confirmation screen

**Technical Requirements:**
- Load single property from Firestore by ID
- Save interest document to Firestore interests collection
- Interest document includes buyerPhone, propertyId, propertyTitle, 
  brokerEmail, timestamp
- Button changes to "Interest Submitted" after clicking
- Cannot submit interest twice for same property

---

### Feature 4: Broker Admin Portal
**Description:** Password-protected portal where brokers log in and manage 
their own property listings and view interested buyers.

**User Flow:**
1. Broker goes to /admin route
2. Enters email and password
3. Lands on dashboard showing stats
4. Can add a new property using a form
5. Can edit or delete their existing properties
6. Can view list of buyers interested in their properties

**Technical Requirements:**
- Firebase Auth for login/logout
- Protected routes — redirect to login if not authenticated
- Broker only sees their own properties (filtered by brokerEmail)
- Broker only sees buyers interested in their own properties
- Form validation on all required fields
- Success/error messages on all actions

---

## 4. Real Estate Specific Features

### Property Listings
**Fields:**
- Title, Type, Price (₹), Area, Bedrooms (optional), Bathrooms (optional)
- District, Taluka, Full Address (with Gat No. or Plot No.)
- Facing direction, Tags, Description, Status, Icon (emoji)

**Search/Filter Capabilities:**
- Filter by property type
- Filter by district
- Text search on title, taluka, location

**Map Integration:**
- SVG based Maharashtra outline (no paid API needed)
- Emoji pin markers per property
- Click pin to open property detail

---

### Agent/Broker Management
**Broker Profiles stored in Firestore:**
- Name, email, phone, createdAt

**Contact System:**
- Buyer phone number sent to broker via Firestore interest record
- Broker contacts buyer directly by phone (no in-app chat in Phase 1)

**Performance Metrics on Dashboard:**
- Total properties listed
- Total interested buyers this month
- Properties by status (Available / Under Negotiation / Sold)

---

### Client Management
**Lead Tracking:**
- Every "I'm Interested" click creates a record in Firestore
- Broker sees all leads in InterestedBuyers screen
- Shows buyer phone, property name, date and time

**Communication:**
- Phase 1: Broker calls buyer directly
- Phase 2 (future): WhatsApp link integration

---

### Transactions
**Document Management:** Not in scope for Phase 1
**Payment Integration:** Not in scope
**Status Tracking:** Property status field (Available / Under Negotiation / Sold)

---

## 5. User Roles & Permissions

### Role 1: Broker (Admin)
**Permissions:**
- Login and logout
- Add new property listings
- Edit their own property listings
- Delete their own property listings
- View buyers interested in their properties
- Cannot see other brokers' properties or leads

### Role 2: Buyer (Public)
**Permissions:**
- Enter phone number to access listings
- Browse all available properties
- View full property details
- Submit interest for any property
- Cannot add, edit or delete any property

### Role 3: Super Admin (Future Phase)
**Permissions:**
- View all brokers and their listings
- Approve or reject new broker registrations
- Remove any property or broker

---

## 6. Database Schema

### Collection: properties
```
- id (auto generated by Firestore)
- brokerEmail (string — links property to broker)
- title (string)
- type (string — Land / Plot / House / Flat / Commercial)
- price (string — e.g. "₹45,00,000")
- area (string — e.g. "2 Acres" or "950 sq ft")
- beds (number or null)
- baths (number or null)
- district (string)
- location (string — e.g. "Nashik, Maharashtra")
- taluka (string)
- address (string — full address with Gat No. or Plot No.)
- facing (string — East / West / North / South)
- tags (array of strings)
- description (string)
- icon (string — emoji)
- status (string — Available / Under Negotiation / Sold)
- createdAt (timestamp)
- updatedAt (timestamp)
```

### Collection: interests
```
- id (auto generated by Firestore)
- buyerPhone (string)
- propertyId (string — Firestore document ID)
- propertyTitle (string)
- brokerEmail (string)
- timestamp (timestamp)
```

### Collection: brokers
```
- id (same as Firebase Auth UID)
- name (string)
- email (string)
- phone (string)
- createdAt (timestamp)
```

---

## 7. API Endpoints

No traditional REST API — all calls use Firebase SDK directly.

### Firebase Auth Calls
- `signInWithEmailAndPassword` — broker login
- `signOut` — broker logout
- `onAuthStateChanged` — check if broker is logged in

### Firestore Calls — Properties
- `getDocs(collection, where brokerEmail == current broker)` — get broker properties
- `getDocs(collection)` — get all properties for public listing
- `getDoc(doc ref)` — get single property by ID
- `addDoc(collection, data)` — add new property
- `updateDoc(doc ref, data)` — edit property
- `deleteDoc(doc ref)` — delete property

### Firestore Calls — Interests
- `addDoc(collection, data)` — save buyer interest
- `getDocs(collection, where brokerEmail == current broker)` — get broker leads

---

## 8. UI/UX Requirements

### Design Style
- **Color Scheme:** Background #faf7f2 (warm cream), Primary #8b6d38 (earthy 
  brown), Accent amber gradient, Success green #2e7d32
- **Typography:** Georgia, serif for all text
- **Layout Style:** Clean, practical, no fancy animations

### Key Pages/Views

1. **Gate Screen (/):**
   - Split layout — left side branding panel in brown, right side phone form
   - List of property types on left panel
   - Simple mobile number input with validation

2. **Listings Screen (/listings):**
   - Sticky header with logo, search bar, district dropdown, phone display
   - Filter pills for property type
   - Toggle button for map view
   - Property cards in responsive grid (min 310px per card)
   - Card shows: icon, type badge, status badge, title, taluka, area, 
     facing, tags, price, broker initial avatar

3. **Detail Screen (/property/:id):**
   - Full width hero with property icon
   - Status and type badges
   - 3 stat boxes: price, area, bedrooms
   - Tags row
   - Description paragraph
   - Mini Maharashtra map
   - Sticky broker sidebar: broker name, phone, buyer phone, interest button

4. **Success Screen (/success):**
   - Centered confirmation with green checkmark
   - Shows broker will call on buyer's number
   - Back to listings button

5. **Admin Login (/admin/login):**
   - Centered card with email and password fields
   - Error message for wrong credentials

6. **Admin Dashboard (/admin/dashboard):**
   - Left sidebar navigation
   - Stats cards: total properties, total leads, properties by status
   - Quick action buttons: Add Property, View Leads

7. **My Properties (/admin/properties):**
   - Table with columns: Icon, Title, Type, Price, Status, Actions
   - Edit and Delete buttons per row
   - Add New Property button at top

8. **Add/Edit Property (/admin/properties/add and /edit/:id):**
   - Single page form with all property fields
   - Dropdown for type, district, facing, status
   - Textarea for description
   - Comma separated input for tags
   - Save and Cancel buttons

9. **Interested Buyers (/admin/buyers):**
   - Table with columns: Buyer Phone, Property Name, Date, Time
   - Sorted by most recent first

### Responsive Design
- Mobile-first: Yes
- Desktop: full sidebar layout
- Mobile: stacked layout, sidebar becomes top navigation

---

## 9. Third-Party Integrations

- **Maps:** Custom SVG Maharashtra map (no paid API)
- **Email Service:** Not in Phase 1
- **SMS:** Not in Phase 1
- **Payment:** Not required
- **Cloud Storage:** Firebase Storage (Phase 2 — for property images)
- **Analytics:** Not in Phase 1
- **Database + Auth:** Firebase (free Spark plan)

---

## 10. Security & Compliance

### Security Measures
- [x] Input validation on all forms
- [x] Firebase Auth for broker login
- [x] Firestore security rules — broker can only read/write own data
- [x] Buyers cannot write to properties collection
- [x] Anyone can read properties collection (public listings)
- [x] Anyone can write to interests collection (buyer submission)
- [ ] Rate limiting on interest submissions (Phase 2)
- [ ] HTTPS via Firebase Hosting (automatic)

### Firestore Security Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /properties/{propertyId} {
      allow read: if true;
      allow write: if request.auth != null 
        && request.auth.token.email == resource.data.brokerEmail;
      allow create: if request.auth != null;
    }

    match /interests/{interestId} {
      allow create: if true;
      allow read: if request.auth != null 
        && request.auth.token.email == resource.data.brokerEmail;
    }

    match /brokers/{brokerId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == brokerId;
    }
  }
}
```

---

## 11. Performance Requirements

- **Page Load Time:** Under 3 seconds on mobile 4G
- **API Response Time:** Firebase queries under 1 second
- **Concurrent Users:** Up to 100 (free Firebase tier is sufficient)
- **Image Optimization:** No images in Phase 1 — emoji icons only
- **Caching Strategy:** Firebase SDK handles offline caching automatically

---

## 12. Testing Requirements

- [ ] Manual testing on Chrome desktop
- [ ] Manual testing on Android mobile browser
- [ ] Test all filter combinations on listings screen
- [ ] Test broker login with wrong password
- [ ] Test interest submission flow end to end
- [ ] Test that broker cannot see another broker's properties
- [ ] Test form validation on add property form
- **Testing Framework:** Manual only in Phase 1

---

## 13. Deployment & DevOps

### Environments
- **Development:** localhost:5173 (Vite dev server)
- **Production:** Firebase Hosting (free .web.app domain)

### Deployment Process
1. Run `npm run build` to create production build
2. Run `firebase deploy` to push to Firebase Hosting
3. Visit yourapp.web.app to verify

### Monitoring
- **Error Tracking:** Browser console in Phase 1
- **Usage Stats:** Firebase Console dashboard
- **Uptime:** Firebase Hosting is managed — 99.9% uptime guaranteed

---

## 14. Future Enhancements (Nice to Have)

- [ ] Property photo upload using Firebase Storage
- [ ] WhatsApp direct message button on property detail
- [ ] OTP verification for buyer phone number
- [ ] Broker registration self-service page
- [ ] Super admin panel to manage all brokers
- [ ] SMS notification to broker when buyer expresses interest
- [ ] Share property link feature
- [ ] Save/bookmark properties for buyers
- [ ] Marathi language toggle for full UI

---

## 15. Timeline & Milestones

### Phase 1: Public Portal UI (COMPLETED)
- [x] Gate screen with phone validation
- [x] Listings screen with filters and search
- [x] Property detail screen with interest button
- [x] Success screen
- [x] SVG Maharashtra map with pins
- [x] 6 sample Maharashtra properties hardcoded

### Phase 2: Admin Portal UI (IN PROGRESS)
- [ ] Admin login screen
- [ ] Dashboard with stats
- [ ] My Properties table
- [ ] Add Property form
- [ ] Edit Property form
- [ ] Interested Buyers table
- [ ] Sidebar navigation layout

### Phase 3: Firebase Integration (NOT STARTED)
- [ ] Set up Firebase project
- [ ] Create firebase.js config file
- [ ] Replace hardcoded properties with Firestore data
- [ ] Connect interest submissions to Firestore
- [ ] Connect admin portal to Firebase Auth
- [ ] Deploy to Firebase Hosting
- [ ] Set Firestore security rules

---

## 16. Known Issues & Constraints

- Map is SVG only — pin positions are approximate, not GPS accurate
- No image upload in Phase 1 — only emoji icons for properties
- Broker registration is manual — super admin must create broker accounts
  directly in Firebase Console for now
- No SMS or email notifications to broker in Phase 1 — broker must 
  check the portal manually

---

## 17. Notes & Additional Information

- All prices must use Indian number format (₹45,00,000 not ₹450,000)
- Property addresses should use local Maharashtra conventions 
  (Gat numbers for land, society names for flats)
- Marathi words used naturally: गाळा for shop, शेतजमीन for farm land
- 7/12 utara is an important land document reference in Maharashtra — 
  always mention in land property descriptions
- CIDCO is a Maharashtra government body that approves NA plots — 
  mention in plot descriptions

---

## 18. Contact & Stakeholders

- **Project Owner:** [Your Name]
- **Tech Lead:** [Your Name / Developer Name]
- **Designer:** N/A — developer handles design
- **Firebase Console Access:** [Your Google account email]