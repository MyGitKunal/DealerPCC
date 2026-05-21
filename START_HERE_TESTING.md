# START HERE - Complete System Testing Guide

## 🎯 What's Ready to Test

Your complete dealer access request and approval system is now fully implemented and running:

- ✅ Dealer Registration Form at `/access-request`
- ✅ Super Admin Approval Interface at `/approval-requests`
- ✅ Email Notification System (Mock)
- ✅ Automatic User Account Creation
- ✅ Login Integration with New Credentials
- ✅ Role-Based Navigation

---

## 🚀 Quick Start (Copy & Paste Everything)

### 1. Access the Application
```
Open Browser: http://localhost:8080/login
```

---

### 2. Test Dealer Registration

Click **"Sign Up"** link below the login form.

Copy and paste this form data:
```
Brand: Volkswagen
KVPS: 12345
Dealer Name: Test Dealer Ltd
Employee Full Name: John Smith
Official Dealer Email: john.smith@dealer.com
Official Mobile Number: 9876543210
Role: Service Head/Service Manager
Location / branch: New York Branch
Employee ID: EMP001
✓ Check: Agreement to terms
```

Click **"Submit Access Request"** button.

✅ Expected Result: Success page with Request ID displayed (save this ID)

---

### 3. Verify Request Storage

Open Browser Developer Tools (F12 → Console).

Run this command:
```javascript
JSON.parse(localStorage.getItem('dealerAccessRequests'))
```

✅ Expected: Array with your request object, status: "pending"

---

### 4. Login as Super Admin

Go back to: http://localhost:8080/login

Toggle: **Account Type** → **Manufacturer**  
Select: **Role** → **Super Admin**  
Enter: **Email** → `superadmin@manufacturer.com`  
Enter: **Password** → `password`

Click **Login** button.

✅ Expected: Redirected to HomePage

---

### 5. Access Approval Interface

Click the **"Services"** dropdown in the header.

Select **"Approval Requests"** (new option added).

✅ Expected: Page shows your pending request with "John Smith"

---

### 6. Approve the Request

**Click on the request row** to expand it.

You'll see:
- Dealer name: "Test Dealer Ltd"
- Email: "john.smith@dealer.com"
- Workshop Code: "12345"
- Location: "New York Branch"

Click **"Review & Approve/Reject"** button.

---

### 7. Fill Approval Form

Copy and paste these values:

**Manufacturer Details:**
```
Verified all documents, contact information, and business registration. Employee confirmed as authorized representative.
```

**Preferred Username:** `john_smith_dealer_001`

**Initial Password:** `Temporary@123456`

**Confirm Password:** `Temporary@123456`

Click **"Approve & Send Email"** (Green button).

✅ Expected: Toast notification: "Request approved! Email sent to dealer"

---

### 8. Verify Email Was Sent

Open Browser Developer Tools Console (F12).

Run this command:
```javascript
JSON.parse(localStorage.getItem('sentEmails')).pop()
```

✅ Expected: Approval email object with:
- `to: "john.smith@dealer.com"`
- `username: "john_smith_dealer_001"`
- `password: "Temporary@123456"`

---

### 9. Login with New Credentials

Logout (refresh page or new tab) and go to: http://localhost:8080/login

**Account Type:** Toggle to **Dealer**  
**Role:** **Service Head/Service Manager** (from dropdown)  
**Email/Username:** `john_smith_dealer_001`  
**Password:** `Temporary@123456`

Click **Login** button.

✅ Expected: Redirected to HomePage

✅ Expected: In header, you see **"Services"** dropdown with only **"Event Registration"** option

---

## 🧪 Advanced Tests

### Test Invalid KVPS

Go to `/access-request`

Try these invalid values in KVPS field:
- `123` (too short)
- `123456` (too long)  
- `abcde` (letters)
- `12.45` (decimal)

✅ Expected: Error message: "Dealer Workshop Code (KVPS) must be exactly 5 digits"

---

### Test Invalid Email

In email field, try:
- `notanemail`
- `@nodomain`
- `user@`

✅ Expected: Error message: "Please enter a valid email address"

---

### Test Invalid Mobile

In mobile field, try:
- `123`
- `12345` (only 5 digits)

✅ Expected: Error message: "Please enter a valid mobile number with at least 10 digits"

---

### Test Terms Agreement

Try submitting form without checking the Terms checkbox.

✅ Expected: Error message: "Please agree to the terms and conditions"

---

### Test Rejection Flow

As Super Admin, when approving a different request:

Instead of filling approval form, click **"Reject Request"** (red button).

Enter rejection reason:
```
Employee name does not match dealer registration records
```

Click **"Confirm Rejection"** button.

✅ Expected: Request status changes to "rejected"

✅ Expected: Rejection email sent

Verify with:
```javascript
JSON.parse(localStorage.getItem('sentEmails')).pop()
```

---

## 📊 View All Data

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

### Find Request by ID
```javascript
const id = 'your_request_id_here';
const requests = JSON.parse(localStorage.getItem('dealerAccessRequests'));
requests.find(r => r.id === id);
```

### Get Last Email
```javascript
JSON.parse(localStorage.getItem('sentEmails')).pop();
```

---

## ✅ Complete Verification Checklist

After following the steps above, verify:

- [ ] Access request form loaded at `/access-request`
- [ ] Form accepted all 9 dealer fields
- [ ] Request stored successfully
- [ ] Request ID generated and displayed
- [ ] Super Admin can access `/approval-requests`
- [ ] Pending request appeared in approval list
- [ ] Request can be expanded to show details
- [ ] Approval form appears with correct fields
- [ ] Username can be set
- [ ] Passwords must match validation works
- [ ] Email was logged in system
- [ ] New user login successful
- [ ] Only "Event Registration" service visible
- [ ] Validation errors work for all fields
- [ ] Rejection flow sends email
- [ ] All data persists in localStorage

---

## 🐛 If Something Goes Wrong

### Issue: Approval page shows "You do not have permission"
**Solution:** Make sure you're logged in as Super Admin (manufacturer account, super_admin role)

### Issue: Request not appearing in approval list
**Solution:** 
- Refresh page (F5)
- Check request is actually pending: `JSON.parse(localStorage.getItem('dealerAccessRequests'))`
- Make sure you're logged in as Super Admin

### Issue: Email not showing in console
**Solution:**
- Run exact command: `JSON.parse(localStorage.getItem('sentEmails')).pop()`
- Refresh page first (F5)
- Make sure approval was actually successful

### Issue: New login fails
**Solution:**
- Check username spelling (case-sensitive): `john_smith_dealer_001`
- Check password: `Temporary@123456` (exactly as entered)
- Verify in console: `JSON.parse(localStorage.getItem('approvedDealerUsers'))`

### Issue: Form validation doesn't work
**Solution:**
- Try different invalid values
- Example: KVPS `1234` should error (only 4 digits)
- Browser console might show validation errors

---

## 🎓 What You Should See at Each Step

### After Dealer Registration Submission
```
✓ Success page appears
✓ Shows message: "Your access request has been submitted successfully!"
✓ Request ID displayed (something like: req_1711846400123_abc123def)
✓ Buttons to "Go to Login" or "Back to Home"
```

### After Super Admin Approval
```
✓ Toast notification at top: "Request approved! Email sent to dealer"
✓ Request removed from "Approval Requests" list (because it's no longer pending)
✓ Email appears in console when you check localStorage
```

### After New User Login
```
✓ Redirected to Homepage
✓ Header shows "Services" dropdown
✓ Dropdown contains only "Event Registration" (matching the role)
✓ Navigation shows this is "Dealer" account
✓ Can see all homepage content
```

---

## 📱 Test on Different Screen Sizes

The forms are responsive. Try these:

1. **Desktop** (1920×1080)
   - Full 2-column form layout
   - All fields clearly visible

2. **Tablet** (768×1024)
   - Form adjusts to 1 column
   - All fields still accessible

3. **Mobile** (375×667)
   - Stack layout
   - Scrollable form
   - Touch-friendly buttons

---

## 🎯 Success Criteria

You'll know everything works when:

✅ Can fill and submit dealer form  
✅ Request stores with unique ID  
✅ Super Admin can approve it  
✅ Email generates automatically  
✅ New user can login with provided credentials  
✅ Validation prevents bad data  
✅ Rejection sends notification  
✅ Role determines navigation correctly  

---

## 📝 Test Scenarios to Try

**Scenario 1: Happy Path (Already Done Above)**
- Submit form → Approve → Get email → Login with new creds

**Scenario 2: Rejection Flow**
- Submit form → Reject with reason → Check rejection email

**Scenario 3: Multiple Registrations**
- Submit 3 different requests → Approve only 2 → Check data

**Scenario 4: Validation Testing**
- Try every invalid input type → See all error messages

**Scenario 5: Access Control**
- Try accessing `/approval-requests` without being Super Admin → Should fail
- Try as Super Admin → Should work

---

## 💡 Key Points to Remember

1. **Two Separate Routes:**
   - Dealers use: `/access-request` (public, no login needed)
   - Super Admin uses: `/approval-requests` (protected, needs Super Admin login)

2. **Two User Types:**
   - Dealer account: Can only register and login after approval
   - Manufacturer account: Only Super Admin can approve requests

3. **Two Forms:**
   - Dealer form: Collects dealer information
   - Approval form: Collects username and password for the dealer

4. **Three localStorage Keys:**
   - `dealerAccessRequests` - All requests
   - `approvedDealerUsers` - Created users
   - `sentEmails` - Email log

---

## 🚀 After Testing

Once you're satisfied the system works:

1. **Document Issues:** Record any errors you find
2. **Test Edge Cases:** Try unusual inputs
3. **Check Performance:** Note load times
4. **Plan Backend Integration:** When ready to use real API

---

## 📞 Need Help?

Check the documentation files:
- `DEALER_ACCESS_SYSTEM.md` - Complete technical docs
- `QUICK_TEST.md` - Quick reference guide
- `IMPLEMENTATION_COMPLETE.md` - Full system overview

---

## ✨ System Features Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Dealer Form | ✅ | All 9 fields with validation |
| Request Storage | ✅ | localStorage with unique IDs |
| Super Admin Approval | ✅ | Protected, role-based |
| Email Notifications | ✅ | Mock service, logged |
| User Account Creation | ✅ | Auto-generated on approval |
| Login Integration | ✅ | New credentials work |
| Role-Based Access | ✅ | Services match role |
| Error Handling | ✅ | Validation & toast messages |
| Mobile Responsive | ✅ | Works on all screen sizes |

---

**Status:** ✅ Ready for Testing  
**Build:** ✅ Successful (2467 modules, 10.57s)  
**Server:** ✅ Running on localhost:8080  
**Errors:** ✅ None

Start testing now at: **http://localhost:8080/access-request**

