# ⚡ Quick Start - Real Email Sending

## 🎯 What's New?

Your dealer portal now sends **REAL emails** when requests are approved! No more mock/localStorage-only emails.

## ⏱️ 5-Minute Setup

### Step 1: Get Gmail App Password (2 min)
```
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)
```

### Step 2: Update backend/.env (1 min)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

### Step 3: Build Backend (1 min)
```bash
cd backend
npm install
npm run build
npm start
```

**You'll see:**
```
✅ Email service initialized
🚀 Server running on port 3001
```

### Step 4: Test (1 min)
```bash
curl http://localhost:3001/api/v1/email/test
```

**Expected Response:**
```json
{"success": true, "message": "✅ Email service is connected and ready"}
```

## 🎪 Try It!

1. **Start the app:**
   ```bash
   # Frontend (from project root)
   node serve-dist.js
   
   # Backend (from backend/ in new terminal)
   npm start
   ```

2. **Go to:** http://localhost:8080

3. **Fill dealer access form:**
   - Brand: Skoda
   - Dealer Code: KVPS 10063
   - Dealer Name: Skoda Dealer
   - Employee Name: John Doe
   - **Email: YOUR_TEST_EMAIL@gmail.com** ← Use your real email!
   - Mobile: 1234567890

4. **Login as Super Admin:**
   - Email: admin@vw.com
   - Password: password

5. **Approve request:**
   - Admin → Dealer Access Requests
   - Click "Review/Approve/Reject"
   - Enter username and password
   - Click "Approve Request"

6. **Check your email inbox:**
   - **Real email arrives within 30 seconds!** 📧
   - Contains: Username, password, security notice
   - Professional VW Group branding

## 📧 What the Email Looks Like

```
From: your-email@gmail.com
To: YOUR_TEST_EMAIL@gmail.com
Subject: ✅ Dealer Portal Access Approved - Your Login Credentials Inside

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SKODA | Dealer Portal
              Access Approved
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear John Doe,

Congratulations! Your access has been approved.

Username: JOHN001
Password: SecurePass123

[Professional HTML Email with VW Branding]
```

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Email not arriving | Check spam folder, verify email in .env |
| "SMTP Connection Failed" | Use app password (not regular Gmail password) |
| Backend won't start | Run `npm install` first |
| Port 3001 in use | Change PORT in backend/.env |

## 📚 Full Documentation

See these files for detailed info:
- `REAL_EMAIL_SETUP.md` - Complete setup guide
- `REAL_EMAIL_IMPLEMENTATION.md` - Technical details
- `backend/.env.example` - Configuration template

## ✅ You're All Set!

The system is ready to send real emails to dealers. Just configure the Gmail app password and start!

---

**Questions?** Check the documentation files for detailed troubleshooting and alternative SMTP providers.
