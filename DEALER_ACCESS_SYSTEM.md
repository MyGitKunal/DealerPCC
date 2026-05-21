# Dealer Access Request & Approval System

## Overview

A complete dealer registration and approval workflow has been implemented with the following features:

1. **Dealer Access Request Form** - Dealers submit their registration details
2. **Manufacturer Approval Interface** - Super Admin reviews and approves/rejects requests  
3. **Email Notifications** - Automated emails with credentials upon approval
4. **User Creation** - Approved dealers automatically get user accounts

---

## System Flow

### 1. Dealer Registration (Public Route: `/access-request`)

**Access:** From LoginPage, click "Sign Up" button

**Form Fields (Dealer Side Requirements):**
```
✓ Brand (Dropdown: Volkswagen, Škoda, VW Group)
✓ Dealer Workshop Code (KVPS) - 5 digit validation
✓ Dealer Name - Open text
✓ Employee Full Name - Open text  
✓ Official Dealer Email ID - Email format validation
✓ Official Mobile Number - Min 10 digits
✓ Role (Dropdown):
  - Service Head/Service Manager
  - Warranty Manager
  - Master Technician
✓ Location / Branch - Open text
✓ Employee ID - Open text
✓ Terms & Conditions - Checkbox (must be checked)
```

**Validation:**
- KVPS: Exactly 5 digits
- Email: Valid email format
- Mobile: 10+ digits
- All fields required
- Terms must be agreed

**On Success:**
- Request stored in localStorage
- Request ID generated and displayed
- Success message with request ID shown
- User can return to login page

---

### 2. Request Approval (Protected Route: `/approval-requests`)

**Access:** Super Admin only (at manufacturer side)
- Automatic role check on page load
- Only users with `role='super_admin'` and `accountType='manufacturer'` can access

**Features:**

#### View Pending Requests
- List of all pending dealer access requests
- Shows: Employee name, Dealer name, Brand, Role, Request ID
- Expandable request details

#### Request Details Section (Expandable)
Shows:
- Dealer Information: Email, Mobile, Workshop Code, Location
- Request Details: Dealer Name, Location, Requested Role

#### Approval Form
Fill in manufacturer details:
```
Manufacturer Details (Open Text)
├─ Purpose: Additional notes/details from manufacturer side
└─ Min 0 chars

Preferred Username (Required)
├─ Format: Any alphanumeric username
└─ Example: dealer_user_001

Initial Password (Required)
├─ Min: 6 characters
├─ Sent to dealer in approval email
└─ Dealer should change on first login

Confirm Password (Required)
└─ Must match Initial Password

Action Buttons:
├─ ✓ Approve & Send Email (Green)
├─ ✗ Reject Request (Red)
└─ Cancel
```

#### Rejection Form
When rejecting:
```
Rejection Reason (Required)
├─ Open text field
├─ Example: "Duplicate registration" or "Incomplete information"
└─ Sent in rejection email to dealer

Action Buttons:
├─ Confirm Rejection (Red)
└─ Cancel
```

---

### 3. Email Notifications

#### Approval Email
**Sent to:** Dealer's official email
**Subject:** "Your Dealer Portal Access Approved - Login Credentials"

**Content:**
```
Dear {EmployeeName},

Congratulations! Your access request to the Dealer Portal has been approved.

Your login credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Username: {preferredUsername}
🔑 Temporary Password: {initialPassword}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Portal URL: http://localhost:8080/login
Account Type: Dealer

⚠️ IMPORTANT SECURITY NOTICE:
1. Change your password immediately after first login
2. Keep your credentials confidential
3. Do not share this email with anyone
4. Contact support if you don't recognize this request

If you have any questions, please contact the Manufacturer Support Team.

Best regards,
Dealer Portal Admin Team
```

#### Rejection Email
**Sent to:** Dealer's official email
**Subject:** "Dealer Portal Access Request - Status Update"

**Content:**
```
Dear {EmployeeName},

Thank you for submitting your access request to the Dealer Portal.

Unfortunately, your request has been rejected for the following reason:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{rejectionReason}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you believe this is an error or need further assistance, 
please contact the Manufacturer Support Team.

Best regards,
Dealer Portal Admin Team
```

---

### 4. User Login with Approved Credentials

**After Approval Flow:**

1. Dealer receives approval email with username & password
2. Dealer visits login page: `/login`
3. Selects Account Type: **Dealer**
4. Enters credentials:
   - Email/Username: Can use either the preferred username or original email
   - Password: Initial password from email
5. Selects Role: (Same role they requested)
6. On successful login → Redirected to HomePage

**Important:** 
- First login should be with the initial temporary password
- Dealer should change password after first login (future enhancement)
- Role determines module access and service visibility

---

## Technical Implementation

### 1. Data Storage
**File:** `src/utils/dealerRequests.ts`

All requests stored in localStorage under key: `dealerAccessRequests`

**Request Object Structure:**
```typescript
{
  id: string;                    // Unique request ID
  requestDate: string;           // ISO timestamp
  status: 'pending'|'approved'|'rejected';
  
  // Dealer-provided fields
  brand: string;
  dealerWorkshopCode: string;
  dealerName: string;
  employeeFullName: string;
  officialDealerEmail: string;
  officialMobileNumber: string;
  role: string;
  locationBranch: string;
  employeeId: string;
  termsAgreed: boolean;
  
  // Manufacturer-filled fields (on approval)
  mfgDetails?: string;
  preferredUsername?: string;
  initialPassword?: string;
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  createdUser?: any;
}
```

**Approved users stored in localStorage under:** `approvedDealerUsers`

### 2. Email Service
**File:** `src/utils/emailService.ts`

Mock email service tracking:
- All sent emails logged to localStorage
- Key: `sentEmails`
- Can be viewed in browser console or admin interface

**Functions:**
- `sendApprovalEmail()` - Send credentials to dealer
- `sendRejectionEmail()` - Notify dealer of rejection
- `getAllSentEmails()` - Retrieve all sent emails
- `getEmailsForRecipient()` - Get emails for specific dealer

### 3. Pages Created

#### Access Request Page
**Path:** `/src/pages/AccessRequestPage.tsx`
- Public route (no authentication required)
- Full form with validation
- Success message with request ID
- Information box explaining next steps

#### Approval Requests Page  
**Path:** `/src/pages/ApprovalRequestsPage.tsx`
- Protected route (Super Admin only)
- Expandable request list
- Inline approval/rejection forms
- Email sending on action

### 4. Routes Updated
**File:** `src/App.tsx`

New routes added:
```typescript
<Route path="/access-request" element={<AccessRequestPage />} />
<Route path="/approval-requests" element={
  <ProtectedRoute>
    <ApprovalRequestsPage />
  </ProtectedRoute>
} />
```

---

## Testing Workflow

### Test Scenario 1: Complete Approval Flow

**Step 1: Submit Access Request**
1. Go to `/login`
2. Click "Sign Up"
3. Fill form:
   - Brand: Volkswagen
   - KVPS: 12345
   - Dealer Name: Test Dealer Ltd
   - Employee Name: John Smith
   - Email: john.smith@testdealer.com
   - Mobile: 9876543210
   - Role: Service Head/Service Manager
   - Location: New York Branch
   - Employee ID: EMP001
   - ✓ Agree to terms
4. Click "Submit Access Request"
5. ✓ Success message shows Request ID

**Step 2: Approve Request**
1. Login with Super Admin credentials:
   - Account Type: Manufacturer
   - Role: Super Admin
   - Email: superadmin@manufacturer.com
   - Password: password
2. Click "Services" → "Approval Requests"
3. Find your request in the list
4. Click to expand
5. Click "Review & Approve/Reject"
6. Fill approval form:
   - Manufacturer Details: "Verified all documents"
   - Preferred Username: john_dealer_001
   - Initial Password: Temp@123456
   - Confirm Password: Temp@123456
7. Click "Approve & Send Email"
8. ✓ Confirmation: "Request approved! Email sent to dealer"

**Step 3: Login with Approved Credentials**
1. Go to `/login`
2. Select Account Type: Dealer
3. Enter credentials:
   - Email/Username: john_dealer_001 (or john.smith@testdealer.com)
   - Password: Temp@123456
   - Role: Service Head/Service Manager
4. Click Login
5. ✓ Redirected to Homepage
6. ✓ Navigation shows only "Event Registration" service

---

### Test Scenario 2: Rejection Flow

**Step 1-2:** Submit request (same as above)

**Step 2: Reject Request**
1. Login as Super Admin
2. Navigate to Approval Requests
3. Find request and expand
4. Click "Review & Approve/Reject"
5. Click "Reject Request"
6. Enter rejection reason: "Incomplete employee information provided"
7. Click "Confirm Rejection"
8. ✓ Email sent to dealer with rejection reason

**Step 3: Verify Rejection**
1. Go to browser console
2. Run: `JSON.parse(localStorage.getItem('sentEmails'))` 
3. ✓ See rejection email with reason in the list

---

## API Endpoints (Future Backend Integration)

When integrating with backend, implement these endpoints:

```
POST /api/v1/dealer/access-requests
├─ Body: { brand, dealerWorkshopCode, dealerName, ... }
└─ Returns: { id, requestDate, status: 'pending' }

GET /api/v1/dealer/access-requests
├─ Query: ?status=pending|approved|rejected
└─ Returns: DealerAccessRequest[]

GET /api/v1/dealer/access-requests/:id
└─ Returns: DealerAccessRequest

POST /api/v1/admin/access-requests/:id/approve
├─ Body: { mfgDetails, preferredUsername, initialPassword }
├─ Action: Create user account
├─ Action: Send approval email
└─ Returns: { status: 'approved', createdUser }

POST /api/v1/admin/access-requests/:id/reject
├─ Body: { reason }
├─ Action: Send rejection email
└─ Returns: { status: 'rejected', rejectionReason }

GET /api/v1/admin/emails
├─ Query: ?recipient=email@domain.com
└─ Returns: EmailNotification[]

POST /api/v1/auth/login-dealer
├─ Body: { username, password }
├─ Action: Validate against approved users
└─ Returns: { user, token }
```

---

## Features & Validation

✅ **Dealer Side:**
- KVPS 5-digit validation
- Email format validation
- Mobile number (10+ digits) validation
- All required fields validation
- Terms agreement checkbox
- Success page with request ID
- Information box about process

✅ **Manufacturer Side (Super Admin):**
- Role-based access control
- Expandable request list
- Inline forms (no page reload)
- Password confirmation matching
- Minimum password length (6 chars)
- Rejection reason required
- Email sending confirmation

✅ **Email Service:**
- Professional email templates
- Credentials sent securely
- Rejection reasons included
- Email logging for audit trail
- Mock implementation ready for real email service

✅ **Data Persistence:**
- LocalStorage for development
- Ready for backend API integration
- Request tracking with timestamps
- Approval audit trail (approvedBy, approvalDate)

---

## Module Access After Approval

Roles mapped to modules:

| Role | Modules |
|------|---------|
| Service Head/Manager | event_registration |
| Warranty Manager | survey |
| Master Technician | survey, dealer_pcc |

Users can only see services matching their assigned modules in the Navigation.

---

## Security Notes

⚠️ **Current Implementation (Development):**
- Passwords stored in plaintext in localStorage
- Mock email service (not real)
- No database persistence
- No user password hashing

🔒 **For Production:**
- Implement backend email service (SendGrid, etc.)
- Hash passwords using bcrypt
- Use database (PostgreSQL, MongoDB)
- Implement JWT tokens
- Add HTTPS/TLS
- Rate limiting on registration
- CAPTCHA verification
- Email verification step
- Admin approval logs
- User activity tracking

---

## Files Created/Modified

**New Files:**
```
src/utils/dealerRequests.ts          (Mock database for requests)
src/utils/emailService.ts             (Email notification service)
src/pages/AccessRequestPage.tsx       (Dealer registration form)
src/pages/ApprovalRequestsPage.tsx    (Super Admin approval interface)
```

**Modified Files:**
```
src/App.tsx                           (Added new routes)
src/pages/LoginPage.tsx               (Updated Sign Up link)
```

---

## Testing URLs

```
Dealer Registration Form:
http://localhost:8080/access-request

Approval Interface (Super Admin only):
http://localhost:8080/approval-requests

Login Page:
http://localhost:8080/login

Home Page (Protected):
http://localhost:8080/
```

---

## Troubleshooting

### Issue: "You do not have permission to access this page"
**Solution:** Must be logged in as Super Admin (manufacturer account, super_admin role)

### Issue: Email not showing in console
**Solution:** Run in browser console:
```javascript
JSON.parse(localStorage.getItem('sentEmails'))
```

### Issue: Request not appearing in approval list
**Solution:** 
1. Make sure it's still "pending" status
2. Check: `JSON.parse(localStorage.getItem('dealerAccessRequests'))`
3. Refresh page with F5

### Issue: Login with new credentials fails
**Solution:** 
1. Verify password matches exactly (case-sensitive)
2. Check: `JSON.parse(localStorage.getItem('approvedDealerUsers'))`
3. Try using username from approval form

---

## Next Steps

1. **Backend Integration** - Replace localStorage with API calls
2. **Real Email Service** - Integrate SendGrid or similar
3. **Password Hashing** - Use bcrypt for security
4. **Email Verification** - Add email verification step
5. **Admin Dashboard** - View all requests history
6. **Audit Logs** - Track all approvals/rejections
7. **Bulk Operations** - Approve multiple requests
8. **Export Reports** - Download request history as CSV/PDF
9. **Notification Center** - In-app notifications
10. **Self-Service Password Reset** - User password management

