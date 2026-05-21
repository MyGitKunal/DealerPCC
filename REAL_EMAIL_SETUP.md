# Real Email Sending Setup Guide

## Overview
This guide explains how to set up the real email sending system for dealer approval notifications.

## Quick Start (Gmail - Easiest Method)

### Step 1: Enable Gmail App Passwords
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication (if not already enabled)
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select "Mail" and "Windows Computer"
5. Google will generate a 16-character app password
6. Copy this password (format: `xxxx xxxx xxxx xxxx`)

### Step 2: Configure Backend .env File
Edit `backend/.env` and add:

```env
# Email Configuration - Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

**Example:**
```env
EMAIL_USER=dealer-admin@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### Step 3: Start Backend Server

From the `backend/` directory:
```bash
npm install
npm run build
npm start
```

Or for development:
```bash
npm run dev
```

The backend should log:
```
✅ Email service initialized
```

### Step 4: Test Email Connection

```bash
curl http://localhost:3001/api/v1/email/test
```

Expected response:
```json
{
  "success": true,
  "message": "✅ Email service is connected and ready"
}
```

### Step 5: Approve a Dealer Request

1. Go to frontend: http://localhost:8080
2. Login as Super Admin (admin@vw.com / password)
3. Navigate to: Admin → Dealer Access Requests
4. Find a pending request and click "Review/Approve/Reject"
5. Enter credentials and click "Approve Request"
6. The email will be IMMEDIATELY SENT to the dealer

### Step 6: Verify Email Delivery

1. **Check recipient inbox** - The email should arrive within 30 seconds
2. **Monitor backend logs** - Look for:
   ```
   ✅ Approval email sent successfully
   📧 Email Info: { messageId: "...", to: "...", timestamp: "..." }
   ```

## Alternative SMTP Providers

### SendGrid (Enterprise-Ready)

1. **Create SendGrid Account:**
   - Sign up at [SendGrid](https://sendgrid.com)
   - Go to Settings → API Keys
   - Create a new API key

2. **Configure .env:**
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASSWORD=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Test:**
   ```bash
   curl http://localhost:3001/api/v1/email/test
   ```

### AWS SES (Production-Grade)

1. **Set up AWS SES:**
   - Go to AWS Console → SES
   - Verify sender email identity
   - Get SMTP credentials

2. **Configure .env:**
   ```env
   SMTP_HOST=email-smtp.region.amazonaws.com
   SMTP_PORT=587
   EMAIL_USER=AKIAIOSFODNN7EXAMPLE
   EMAIL_PASSWORD=your-ses-password
   ```

### Office365/Outlook

1. **Configure .env:**
   ```env
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   EMAIL_USER=your-email@outlook.com
   EMAIL_PASSWORD=your-password
   ```

## Email API Endpoints

### Send Approval Email

**POST** `/api/v1/email/send-approval`

**Request Body:**
```json
{
  "to": "dealer@example.com",
  "username": "JKunal001",
  "password": "Elsapro",
  "employeeName": "Kunal Jagtap",
  "brand": "Skoda"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "✅ Approval email sent successfully",
  "data": {
    "recipient": "dealer@example.com",
    "username": "JKunal001",
    "timestamp": "2026-01-23T10:30:45.123Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "❌ Failed to send approval email",
  "error": "SMTP connection failed"
}
```

### Send Rejection Email

**POST** `/api/v1/email/send-rejection`

**Request Body:**
```json
{
  "to": "dealer@example.com",
  "employeeName": "Kunal Jagtap",
  "reason": "Dealer code not verified",
  "brand": "Skoda"
}
```

### Test Email Connection

**GET** `/api/v1/email/test`

**Success Response:**
```json
{
  "success": true,
  "message": "✅ Email service is connected and ready"
}
```

## Email Template Features

The approval email includes:

- **Brand-Specific Colors:**
  - Skoda: #4BA82E (Green)
  - Volkswagen: #001E50 (Navy Blue)

- **Responsive Design:**
  - Works on desktop, tablet, and mobile
  - Professional VW Group branding

- **Credentials Box:**
  - Username and password in monospace font
  - Visual highlighting for easy copy

- **Security Notice:**
  - 5 security best practices
  - Warning colors for emphasis

- **Professional Footer:**
  - Brand name
  - Auto-generated footer
  - Timestamp included

## Troubleshooting

### "SMTP connection failed"
- Check SMTP_HOST and SMTP_PORT are correct
- Verify EMAIL_USER and EMAIL_PASSWORD
- For Gmail: Ensure app password (not regular password)
- For Gmail: Ensure 2FA is enabled

### "Email not received after 1 minute"
- Check spam/junk folder
- Verify recipient email address
- Check backend logs for errors
- Try with different SMTP provider

### "backend/src/utils/emailService.ts not found"
- Run `npm install` in backend directory
- Ensure all files were created successfully

### "Cannot find module 'nodemailer'"
- Run `npm install nodemailer @types/nodemailer` in backend
- Verify package.json has dependencies

## Production Deployment

### Before Going Live:

1. **Use Professional Email:**
   - Don't use personal Gmail
   - Use company domain email
   - Set up proper sender identity

2. **Configure Monitoring:**
   - Enable email delivery logs
   - Set up alerts for failed emails
   - Archive sent emails for audit trail

3. **Security:**
   - Store SMTP credentials in secure vault
   - Use environment variables for all secrets
   - Never commit .env file to git

4. **Testing:**
   - Send test emails to staging environment
   - Verify all email templates render correctly
   - Test with various email clients (Gmail, Outlook, etc.)

## Testing Checklist

- [ ] Backend server running on port 3001
- [ ] Email service initialized (check logs)
- [ ] Email test endpoint returns success
- [ ] SMTP credentials configured in .env
- [ ] Test approval email sent successfully
- [ ] Email arrived in inbox within 30 seconds
- [ ] Email displays with correct brand colors
- [ ] Credentials are visible in email body
- [ ] Security notice displays properly
- [ ] Reply functionality works (optional)
- [ ] Rejection email works correctly
- [ ] Multiple emails can be sent without errors

## Email Content Example

```
Subject: ✅ Dealer Portal Access Approved - Your Login Credentials Inside

From: dealer-admin@gmail.com
To: kunal.jagtap@skoda-vw.co.in

[Email Header with Skoda Green (#4BA82E)]

Dear Kunal Jagtap,

Congratulations! Your access request to the Dealer Portal has been successfully 
approved by the Manufacturer.

Your portal access is now active. Below are your login credentials:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Username: JKunal001
Temporary Password: Elsapro
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Login Button]

Security Alert - Please Read Carefully
⚠ Change your password immediately after your first login
⚠ Keep these credentials strictly confidential
⚠ Do not share this email with anyone
⚠ Contact support immediately if you don't recognize this request
⚠ Access logs are maintained for security purposes

If you have any questions or need technical assistance, please contact the 
Dealer Support Team at support@vw-dealer.com

---
Skoda | Dealer Portal
© 2026 Skoda Group. All rights reserved.
```

## Next Steps

1. ✅ Backend email service is configured
2. ✅ Frontend automatically sends to backend API
3. ✅ Dealer receives real email on approval
4. Next: Configure email retention and logging
5. Next: Set up email delivery webhooks (optional)
6. Next: Production deployment to cloud

## Support

For issues with:
- **Gmail Setup:** Check [Google Support](https://support.google.com/accounts/answer/185833)
- **SendGrid Setup:** Check [SendGrid Docs](https://docs.sendgrid.com/for-developers/sending-email/integrating-with-the-smtp-api)
- **AWS SES Setup:** Check [AWS SES Docs](https://docs.aws.amazon.com/ses/)
- **Email Templates:** Check HTML rendering in different email clients

