# PraveshKavach™ - User Journey Guide

## Getting Started (No Authentication Required)

### Step 1: Open the Application
```
URL: http://localhost:5173
Expected: Role Selection Page appears
```

### Step 2: Role Selection Page
You will see three large cards:

```
┌─────────────────────────────────────────┐
│  PraveshKavach™ Enterprise Visitor      │
│  Management System                      │
│  Select your role to continue           │
└─────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Shield     │  │    Home      │  │   Settings   │
│              │  │              │  │              │
│ Security     │  │  Resident    │  │ System       │
│ Guard        │  │              │  │ Administrator
│              │  │              │  │              │
│ Rajesh Patil │  │ Soham        │  │ System Admin │
│              │  │ Gonbhare     │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Step 3: Click Your Role
- **Security Guard**: Manage visitor entry, scanning, face verification
- **Resident**: Approve/reject visitors, view history
- **Admin**: Manage system, settings, analytics, integrations

No email or password required. Just click your role.

---

## User Journey: Security Guard

### 1. Enter Dashboard
Click "Enter Security Dashboard"
→ Dashboard loads immediately

### 2. Main Menu
```
Dashboard            → Today's stats, pending tasks
Scanner              → Scan visitor documents (OCR)
Visitor History      → View all past visitors
Residents Directory  → Find resident contact info
Reports & Analytics  → System metrics
Admin Settings       → System configuration
```

### 3. Typical Workflow
```
1. Visitor arrives at gate
2. Click "Scanner" tab
3. Select document type (Aadhaar, PAN, Passport, License)
4. Scan front and back of document
5. Capture visitor's face (liveness check)
6. System extracts data automatically via OCR
7. Resident receives approval request via Telegram
8. Once approved by resident, visitor gets pass number
9. Visitor can check in to building
10. Dashboard updates in real-time
```

### 4. Real-Time Updates
- Pending approvals shown at top
- Notifications from Telegram appear instantly
- Visitor logs update automatically
- Statistics refresh every 30 seconds

---

## User Journey: Resident

### 1. Enter Dashboard
Click "Enter Resident Dashboard"
→ Dashboard loads immediately

### 2. Main Menu
```
Dashboard            → Pending approvals, quick stats
Visitor History      → View all past visitors
Settings             → Manage family members, vehicles
```

### 3. Typical Workflow
```
1. Receive Telegram notification: "New visitor request"
2. Open Resident Dashboard
3. See "Pending Approvals" section
4. Review visitor info:
   - Visitor name
   - Document scanned
   - Purpose of visit
   - Security Guard notes
5. Click "Approve" or "Reject"
6. Visitor receives confirmation
7. Pass number generated if approved
8. Visitor can now enter building
```

### 4. Quick Stats
- Pending Approvals (yellow badge)
- Total Visitors Today
- Currently Inside
- Past Visitors History

---

## User Journey: System Administrator

### 1. Enter Dashboard
Click "Enter Admin Dashboard"
→ Dashboard loads immediately

### 2. Main Menu
```
Dashboard            → System overview, key metrics
Analytics            → Charts, trends, reports
Settings             → Full system configuration
```

### 3. Dashboard Sections
```
System Status:
├─ OCR Configuration    → API keys, model settings
├─ Telegram Integration → Bot token, chat IDs
├─ Database Connection  → Verify connectivity
└─ API Health           → Endpoint status

Key Metrics:
├─ Total Visitors (daily, weekly, monthly)
├─ Approval Rate
├─ Avg Processing Time
├─ Peak Hours
└─ Rejection Rate
```

### 4. Analytics Dashboard
View detailed charts:
- Visitor traffic by hour
- Approval/rejection breakdown
- Purpose of visit analysis
- Building-wise distribution
- Security guard performance
- Resident approval patterns

### 5. Settings Configuration
Manage:
- Building information
- Resident accounts
- Security guard assignments
- OCR document types
- Telegram notifications
- API integrations
- System policies

---

## Changing Roles

### During Session
1. Look for "Change Role" button in navigation (top menu)
2. Click to return to Role Selection Page
3. Select a different role
4. New dashboard opens immediately
5. Previous session data is retained

### After Page Refresh
1. Refresh page (F5 or Ctrl+R)
2. App checks localStorage
3. Previous role is loaded automatically
4. Dashboard appears without Role Selection screen

---

## No Authentication Screen Examples

### ❌ What You Won't See
```
[ X ] Login page
[ X ] Email/Password fields
[ X ] "Forgot Password" link
[ X ] "Remember Me" checkbox
[ X ] Register form
[ X ] Verification codes
[ X ] Session timeout
[ X ] "Please log in again" message
[ X ] JWT token errors
[ X ] "Unauthorized" errors
```

### ✅ What You Will See
```
[ ✓ ] Role Selection Page (first time only)
[ ✓ ] Dashboard immediately loads
[ ✓ ] Welcome message with demo user name
[ ✓ ] Role persists on refresh
[ ✓ ] Quick role switching option
[ ✓ ] All features available
[ ✓ ] No login required
```

---

## Available Modules

All of these work without authentication:

### Document Scanning (OCR)
- Scan Aadhaar card (front & back)
- Scan PAN card
- Scan Passport
- Scan Driving License
- Automatic field extraction
- Confidence scoring

### Face Verification
- Liveness detection
- Face quality check
- Brightness/sharpness verification
- Frame alignment check
- Face match scoring

### Visitor Management
- Register new visitors
- Generate pass numbers
- QR code generation
- Check-in/check-out
- Duration tracking

### Resident Approvals
- Receive approval requests
- Approve or reject
- Add notes
- View history
- Manage family

### Notifications
- Telegram bot integration
- Real-time updates
- Approval notifications
- Visitor check-in alerts

### Analytics & Reports
- Daily visitor count
- Approval statistics
- Processing time metrics
- Peak hour analysis
- Visitor purpose breakdown

### AI Chatbot
- Answer user questions
- Provide system help
- Guide through workflows
- Available 24/7

---

## Tech Stack (Backend)

All these services work without authentication:

```
API Server:        Express.js (localhost:3000)
Frontend:          React + Vite (localhost:5173)
OCR Engine:        OCR Space API
Face Detection:    TensorFlow.js (browser)
Notifications:     Telegram Bot API
Storage:           In-memory (demo mode)
Authentication:    None (demo mode)
```

---

## Quick Reference: Demo Users

### Security Guard
```
Name:     Rajesh Patil
Role:     SECURITY_GUARD
Gate:     Main Gate
Building: Tower A
```

### Resident
```
Name:     Soham Gonbhare
Role:     RESIDENT
Building: Pravesh Residency
Flat:     A-702
```

### Administrator
```
Name:     System Administrator
Role:     ADMIN
Building: All Buildings
```

---

## Troubleshooting

### Page shows blank after role selection
- Refresh the page (F5)
- Check browser console for errors
- Verify API server is running on port 3000

### Role doesn't persist on refresh
- Check if localStorage is enabled
- Clear localStorage and try again
- Check browser console for errors

### OCR not scanning documents
- Verify OCR_SPACE_API_KEY is set
- Check network connectivity
- Try with a clear, high-quality image

### Telegram notifications not working
- Verify TELEGRAM_BOT_TOKEN is set
- Check TELEGRAM_DEFAULT_CHAT_ID is correct
- Verify bot is member of chat group

### Face verification failing
- Ensure camera has permission
- Check lighting conditions
- Verify camera is working in browser
- Try a different document scan

---

## Summary

**No passwords. No logins. No authentication.**

1. Open the app
2. Select your role
3. Start using all features immediately
4. Everything works like a production system

The entire visitor management workflow is available without any authentication required.

**PraveshKavach™ - Enterprise Visitor Management System**
Ready to use. Ready to demo.
