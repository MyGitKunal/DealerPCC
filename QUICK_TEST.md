# Quick Test Guide - Dealer Access System

## 🎯 Complete Test Flow (5 minutes)

### PART 1: Submit Dealer Access Request (2 min)

1. **Go to Login Page**
   - URL: `http://localhost:8080/login`

2. **Click "Sign Up" Link**
   - Located below the Login button
   - Takes you to Access Request Form

3. **Fill the Form** (Copy & Paste)
   ```
   Brand: Volkswagen
   KVPS: 12345
   Dealer Name: Test Dealer Ltd
   Employee Name: John Smith
   Email: john.smith@dealer.com
   Mobile: 9876543210
   Role: Service Head/Service Manager
   Location: New York
   Employee ID: EMP001
   ✓ Check Terms & Conditions
   ```

4. **Submit Form**
   - Click "Submit Access Request"
   - ✓ Success page shows with Request ID
   - Copy the Request ID (save it)

5. **Go Back to Login**
   - Click "Go to Login" or back button

---

### PART 2: Approve Request (Super Admin) (2 min)

1. **Login as Super Admin**
   - Account Type: **Manufacturer**
   - Role: **Super Admin**
   - Email: `superadmin@manufacturer.com`
   - Password: `password`

2. **Navigate to Approval Requests**
   - Click "Services" in header
   - Select "Approval Requests" from dropdown
   - Wait for page to load

3. **Find & Expand Your Request**
   - Look for "John Smith" in the list
   - Click anywhere on the request row to expand
   - See request details

4. **Click "Review & Approve/Reject"**
   - Button at bottom of expanded details

5. **Fill Approval Form** (Copy & Paste)
   ```
   Manufacturer Details: Verified all documents and contact details
   Preferred Username: john_smith_dealer_001
   Initial Password: Temporary@123456
   Confirm Password: Temporary@123456
   ```

6. **Click "Approve & Send Email"**
   - ✓ Green button becomes "Processing..."
   - ✓ Toast notification: "Request approved! Email sent to dealer"

7. **Verify Email Was Sent**
   - Open browser console (F12)
   - Run: `JSON.parse(localStorage.getItem('sentEmails')).pop()`
   - See the approval email with credentials

---

### PART 3: Login with New Credentials (1 min)

1. **Logout from Super Admin**
   - Click profile/settings (if available)
   - Or clear session: Close tab and reopen login

2. **Go to Login Page**
   - URL: `http://localhost:8080/login`

3. **Login with Approved Credentials**
   - Account Type: **Dealer** (toggle button)
   - Role: **Service Head/Service Manager** (from dropdown)
   - Email/Username: `john_smith_dealer_001` (use the username you created)
   - Password: `Temporary@123456`

4. **Click Login**
   - ✓ Success! Redirected to Homepage
   - ✓ See only "Event Registration" in navigation (based on role)

---

## ✅ Verification Checklist

- [ ] Dealer form accepts all inputs
- [ ] Validation works (try invalid KVPS, email, mobile)
- [ ] Request ID generated and displayed
- [ ] Super Admin can see pending requests
- [ ] Approval form appears correctly
- [ ] Passwords must match
- [ ] Email notification shows in console
- [ ] New user can login with provided credentials
- [ ] Role-based navigation is correct

---

## 🧪 Additional Tests

### Test Invalid Inputs

Try submitting with invalid data:

```
❌ KVPS: "1234" (4 digits) → Error: "must be exactly 5 digits"
❌ KVPS: "abcde" (letters) → Error: "must be exactly 5 digits"
❌ Email: "invalid@" → Error: "valid email address"
❌ Mobile: "123" (3 digits) → Error: "at least 10 digits"
✓ Leave Terms unchecked → Error: "agree to terms"
```

### Test Rejection Flow

1. Submit another request
2. As Super Admin, expand request
3. Click "Review & Approve/Reject"
4. Click "Reject Request" (red button)
5. Enter reason: "Incomplete information"
6. Click "Confirm Rejection"
7. ✓ Request status changes to "rejected"
8. ✓ Rejection email sent

### Test With Different Roles

Repeat the flow with each role:
1. **Warranty Manager** - Should see only "Survey"
2. **Master Technician** - Should see "Survey" + "Dealer PCC"
3. Different navigation per role

---

## 📊 View Data in Console

### See All Access Requests
```javascript
JSON.parse(localStorage.getItem('dealerAccessRequests'))
```

### See Approved Users
```javascript
JSON.parse(localStorage.getItem('approvedDealerUsers'))
```

### See All Sent Emails
```javascript
JSON.parse(localStorage.getItem('sentEmails'))
```

### See Last Approval Email
```javascript
JSON.parse(localStorage.getItem('sentEmails')).pop()
```

### See Request by ID
```javascript
const requests = JSON.parse(localStorage.getItem('dealerAccessRequests'));
const request = requests.find(r => r.id === 'YOUR_REQUEST_ID');
console.log(request);
```

---

## 🔑 Test Credentials

### For Initial Testing (Before Any Approvals)

**Dealer Account:**
```
Account Type: Dealer
Role: Service Head/Service Manager
Email/Username: dealer@vw.com
Password: password
```

**Super Admin Account:**
```
Account Type: Manufacturer
Role: Super Admin
Email/Username: superadmin@manufacturer.com
Password: password
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Access Request page 404 | Restart dev server with `pnpm run dev` |
| Approval page says "no permission" | Must login as Super Admin first |
| Email not showing in console | Refresh page (F5) or use `location.reload()` |
| Request ID not visible | Check page scrolled to top of success message |
| Password mismatch error | Ensure both password fields are identical |
| Login fails with new credentials | Check username/email spelling (case-sensitive) |

---

## 📱 Responsive Test

The forms are responsive. Try:
- Desktop view (1920x1080)
- Tablet view (768x1024)
- Mobile view (375x667)

All inputs should be visible and usable.

---

## ⏱️ Performance

- Access Request page loads: < 1 second
- Form validation: Instant
- Approval interface: < 2 seconds
- Email service: Instant (localStorage)
- Login with new credentials: < 2 seconds

---

## 🎓 Learning Points

This implementation demonstrates:

1. **Form Validation** - Input validation with specific rules
2. **Access Control** - Role-based route protection
3. **State Management** - localStorage for persistence
4. **Email Notifications** - Sending structured email content
5. **Multi-step Workflows** - Request → Approval → Login
6. **User Creation** - Dynamic user account generation
7. **UI/UX** - Expandable lists, modal forms, success screens
8. **TypeScript** - Type-safe data structures
9. **React Patterns** - Hooks, context, routing
10. **Error Handling** - Validation and error messages

---

## 🚀 Next: Backend Integration

To use a real backend:

1. Replace localStorage calls with API endpoints
2. Implement `/api/v1/dealer/access-requests` POST
3. Implement `/api/v1/admin/access-requests/:id/approve` POST
4. Integrate real email service (SendGrid, AWS SES)
5. Add password hashing (bcrypt)
6. Add database persistence (PostgreSQL, MongoDB)
7. Add authentication tokens (JWT)

See `DEALER_ACCESS_SYSTEM.md` for API endpoint specification.

