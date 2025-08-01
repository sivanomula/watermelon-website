# Gmail App Password Setup Guide

## 🔐 How to Generate Gmail App Password

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click on "2-Step Verification"
4. Follow the steps to enable 2-Step Verification

### Step 2: Generate App Password
1. Go back to Security settings
2. Under "2-Step Verification", click on "App passwords"
3. Select "Mail" as the app
4. Select "Other (Custom name)" as device
5. Enter "Watermelon Website" as the name
6. Click "Generate"
7. **Copy the 16-character password** (it will look like: xxxx xxxx xxxx xxxx)

### Step 3: Update .env File
Replace your current password in the .env file:
```
EMAIL_PASS=your-16-character-app-password
```

**Important**: 
- Use the 16-character app password, NOT your regular Gmail password
- Remove spaces from the app password when adding to .env file
- The app password will only be shown once, so copy it immediately

### Step 4: Restart Server
After updating the .env file, restart the server:
```bash
npm start
```

## 🔍 Troubleshooting

### If you still get authentication errors:
1. Make sure 2-Factor Authentication is enabled
2. Make sure you're using the app password, not your regular password
3. Make sure there are no spaces in the app password in .env file
4. Try generating a new app password if the current one doesn't work

### Alternative: Use Gmail OAuth2
If app passwords don't work, we can switch to OAuth2 authentication which is more secure. 