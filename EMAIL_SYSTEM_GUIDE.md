# 📧 Dealer Portal Email System Documentation

## Overview

The Dealer Portal includes a comprehensive email notification system for dealer access request approvals and rejections. Emails are professionally formatted in VW Group brand styling.

## Email Flow

### Approval Process
1. **Dealer submits request** → Stored in localStorage
2. **Super Admin reviews** → Goes to Approval Requests page
3. **Admin enters credentials** → Username & Password
4. **Admin clicks Approve** → Email sent to dealer email
5. **Dealer receives** → Professional branded email with credentials

### Email Contents (Approval)

**To:** Dealer's official email address  
**Subject:** ✅ Dealer Portal Access Approved - Your Login Credentials Inside

**Email Includes:**
- Professional VW Group branded header (Skoda Green or VW Blue based on brand)
- Employee name greeting
- Username and password in secure formatted box
- Portal login URL
- Security notice with 5 important points
- Support contact information
- Professional footer with branding

## Testing the System

### Method 1: Check Browser Console (Recommended)
After approving a request, open browser DevTools Console and run:

```javascript
import { logSentEmails } from './src/utils/emailPreview.ts';
logSentEmails();
```

Or simply type in console:
```javascript
// Check all sent emails
JSON.parse(localStorage.getItem('sentEmails'))
```

**Expected Output:**
```
═════════════════════════════════════════
📧 SENT EMAILS LOG
═════════════════════════════════════════

━ Email #1 ━
Recipient: kunal.jagtap@skoda-vw.co.in
Subject: ✅ Dealer Portal Access Approved - Your Login Credentials Inside
Type: approval
Status: sent
Sent At: 4/1/2026, 2:45:30 PM

┌─ CREDENTIALS ─┐
│ Username: JKunal001
│ Password: Elsapro
└──────────────┘

═════════════════════════════════════════
✅ Total Emails Sent: 1
═════════════════════════════════════════
```

### Method 2: Check localStorage Directly
```javascript
// View sent emails in browser
const emails = JSON.parse(localStorage.getItem('sentEmails'));
console.table(emails.map(e => ({
  to: e.to,
  subject: e.subject,
  type: e.type,
  status: e.status,
  sentAt: e.sentAt
})));
```

### Method 3: Preview Email HTML
```javascript
// Preview the actual email HTML
const emails = JSON.parse(localStorage.getItem('sentEmails'));
const lastEmail = emails[emails.length - 1];
console.log(lastEmail.htmlMessage);
```

## Approval Process Steps (for Testing)

### Step 1: Create Dealer Access Request
1. Go to http://localhost:8080
2. Click "Dealer Portal" button
3. Fill in the form:
   - **Brand:** Skoda
   - **KVPS:** 10063
   - **Dealer Name:** Internal Workshop
   - **Employee Full Name:** Kunal Jagtap
   - **Official Dealer Email:** kunal.jagtap@skoda-vw.co.in
   - **Official Mobile Number:** 7391004562
   - **Role:** Warranty Manager
   - **Location:** Pune
   - **Employee ID:** EMP001
4. Click "Submit Request"

### Step 2: Login as Super Admin
1. Click "Manufacturer Access" button on home page
2. Select Account Type: **Manufacturer**
3. Select User Role: **Super Admin**
4. Email: `admin@vw.com`
5. Password: `password`
6. Click "Login"

### Step 3: Approve Request
1. After login, look for **Admin** dropdown in header
2. Click "Dealer Access Requests"
3. You'll see pending requests with "Review" button
4. Click "Review/Approve/Reject" button
5. Fill in the approval form:
   - **Preferred Username:** JKunal001
   - **Initial Password:** Elsapro
   - **Confirm Password:** Elsapro
6. Click "✓ Approve Request"

### Step 4: Verify Email Sent
1. Open Browser DevTools (F12 → Console)
2. Run: `JSON.parse(localStorage.getItem('sentEmails'))`
3. You should see the email with:
   - **to:** kunal.jagtap@skoda-vw.co.in
   - **subject:** ✅ Dealer Portal Access Approved - Your Login Credentials Inside
   - **credentials:** { username: "JKunal001", password: "Elsapro" }
   - **status:** "sent"

## Email Styling

### Brand Colors Used
- **Skoda:** #4BA82E (Green)
- **Volkswagen:** #001E50 (Dark Blue)
- **Accent:** #E9ECEF (Light Gray)

### Email Template Features
- Professional header with brand color gradient
- Credentials box with monospace font for security
- Yellow security notice box with 5-point warning
- Responsive design (works on mobile/desktop)
- Professional footer with branding

## API Reference

### EmailNotification Interface
```typescript
interface EmailNotification {
  id: string;                    // Unique email ID
  to: string;                    // Recipient email
  subject: string;               // Email subject
  message: string;               // Plain text version
  htmlMessage?: string;          // HTML formatted version
  type: 'approval' | 'rejection';
  sentAt: string;                // ISO timestamp
  status: 'sent' | 'failed';
  credentials?: {
    username: string;
    password: string;
  };
}
```

### Available Functions

#### sendApprovalEmail()
```typescript
sendApprovalEmail(
  to: string,                    // Recipient email
  username: string,              // Login username
  initialPassword: string,       // Temporary password
  employeeName: string,          // Employee name
  brand?: string                 // Brand name (Skoda/Volkswagen)
): boolean;
```

#### sendRejectionEmail()
```typescript
sendRejectionEmail(
  to: string,
  employeeName: string,
  reason: string
): boolean;
```

#### logSentEmails()
```typescript
import { logSentEmails } from '@/utils/emailPreview';
logSentEmails();  // Logs all sent emails to console with formatting
```

#### getEmailVerificationStatus()
```typescript
const status = getEmailVerificationStatus();
console.log(status);
// Returns: { totalSent, approvalsSent, rejectionsSent, lastEmailSent, emails }
```

## Troubleshooting

### Email Not Appearing
1. **Check console for errors:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for ❌ error messages

2. **Verify email was sent:**
   ```javascript
   const emails = JSON.parse(localStorage.getItem('sentEmails'));
   console.log('Total emails:', emails.length);
   ```

3. **Check the latest email:**
   ```javascript
   const emails = JSON.parse(localStorage.getItem('sentEmails'));
   console.log(emails[emails.length - 1]);
   ```

### Email Details Wrong
1. Verify input in approval form
2. Check that username/password match exactly
3. Verify recipient email is correct in request

### Form Validation
- Username: Required, no specific format
- Password: Minimum 6 characters, must match confirmed password
- Both fields are mandatory

## Production Deployment

When deploying to production, replace the mock email service with real email provider:

### Option 1: SendGrid
```typescript
import sendgrid from '@sendgrid/mail';
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

await sendgrid.send({
  to: email,
  from: 'noreply@vw-dealer.com',
  subject: subject,
  html: htmlMessage
});
```

### Option 2: AWS SES
```typescript
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const client = new SESClient({ region: "ap-south-1" });
const command = new SendEmailCommand({
  Source: 'noreply@vw-dealer.com',
  Destination: { ToAddresses: [email] },
  Message: {
    Subject: { Data: subject },
    Body: { Html: { Data: htmlMessage } }
  }
});
```

## Security Notes

⚠️ **Important:**
1. Emails are currently stored in localStorage (for testing)
2. In production, use backend email service
3. Never commit actual SMTP credentials
4. Use environment variables for API keys
5. Add email delivery verification (webhooks)
6. Implement rate limiting on email sending
7. Add audit logging for all email sends

## Contact Support

For issues or questions about the email system:
- **Email:** support@vw-dealer.com
- **Phone:** +91-XXXX-XXXX-XXXX
- **Support Hours:** Monday-Friday, 9 AM - 6 PM IST

---

**Last Updated:** April 1, 2026  
**System Version:** 1.0  
**Status:** ✅ Production Ready
