# Setup Guide for Watermelon Website Demo Form

This guide will help you set up the demo form functionality to capture user details and send them via email and WhatsApp.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Email Settings

#### Option A: Using Gmail (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. **Create `.env` file**:
   ```bash
   cp env.example .env
   ```
4. **Update `.env` file**:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-digit-app-password
   PORT=3000
   ```

#### Option B: Using Other Email Services

Update the email configuration in `server.js`:
```javascript
const transporter = nodemailer.createTransporter({
    service: 'outlook', // or 'yahoo', 'hotmail', etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
```

### 3. Start the Server
```bash
npm start
```

The website will be available at `http://localhost:3000`

## 📧 Email Configuration Details

### Gmail Setup
1. **Security Settings**:
   - Enable 2-Factor Authentication
   - Generate App Password (not your regular password)
   - Use the 16-character app password in `.env`

2. **Email Recipients**:
   - Update `info@watermelon.com` in `server.js` with your actual email
   - The system will send emails to both the company email and a copy to your Gmail

### Email Template
The system sends a formatted HTML email with:
- Contact information (name, email, phone)
- Company and position details
- Preferred demo time
- Additional requirements
- Timestamp and source information

## 📱 WhatsApp Integration

### Automatic WhatsApp Message
When users submit the form:
1. **Email is sent** to your configured email address
2. **WhatsApp opens** with a pre-filled message containing all user details
3. **Message format** includes:
   - Contact information
   - Company details
   - Demo preferences
   - Timestamp
   - Formatted for easy reading

### WhatsApp Number
- **Default**: +91 73794 32316
- **Update**: Change the number in `script.js` line with `wa.me/917379432316`

## 🔧 Customization

### Update Company Information
Edit these files:
- `server.js`: Email recipients and company details
- `script.js`: WhatsApp number and message format
- `index.html`: Contact information in the website

### Email Template Customization
Modify the `emailContent` variable in `server.js`:
```javascript
const emailContent = `
            <h2>🚀 New Demo Request - Watermelon Website</h2>
    // ... customize the HTML content
`;
```

### WhatsApp Message Format
Update the `createWhatsAppMessage` function in `script.js`:
```javascript
function createWhatsAppMessage(data) {
    return `🚀 *New Demo Request - Watermelon Website*
    // ... customize the message format
`;
}
```

## 🛠️ Development

### Running in Development Mode
```bash
npm run dev
```

### Testing the Form
1. Open `http://localhost:3000`
2. Click any "Start Demo" button
3. Fill out the form
4. Submit to test email and WhatsApp functionality

### Debugging
- Check browser console for JavaScript errors
- Check server console for email sending logs
- Verify `.env` file configuration

## 📊 Form Data Storage

### Local Storage Backup
All form submissions are stored in browser localStorage as backup:
- **Location**: Browser's localStorage
- **Key**: `demoRequests`
- **Format**: JSON array of all submissions

### Access Stored Data
```javascript
// In browser console
const requests = JSON.parse(localStorage.getItem('demoRequests') || '[]');
console.log(requests);
```

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` file to version control
- Use strong, unique app passwords
- Regularly rotate email app passwords

### Data Privacy
- Form data is only stored locally (localStorage)
- Email data is sent securely via SMTP
- No data is stored on the server

### Rate Limiting
Consider adding rate limiting for production:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // limit each IP to 5 requests per windowMs
});

app.use('/api/demo-request', limiter);
```

## 🚀 Production Deployment

### Environment Setup
1. **Set production environment variables**
2. **Use production email service** (SendGrid, Mailgun, etc.)
3. **Enable HTTPS** for secure form submission
4. **Set up monitoring** for email delivery

### Recommended Email Services for Production
- **SendGrid**: High deliverability, good for business
- **Mailgun**: Developer-friendly, good API
- **AWS SES**: Cost-effective for high volume

### Example SendGrid Configuration
```javascript
const transporter = nodemailer.createTransporter({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
    }
});
```

## 📞 Support

For issues or questions:
- **Email**: info@watermelon.com
- **Phone**: +91 73794 32316
- **WhatsApp**: +91 73794 32316

## 🔄 Updates

### Version History
- **v1.0**: Initial implementation with email and WhatsApp
- **v1.1**: Added form validation and success modal
- **v1.2**: Added localStorage backup and error handling

### Future Enhancements
- [ ] SMS notifications
- [ ] CRM integration
- [ ] Analytics tracking
- [ ] Multi-language support
- [ ] Advanced form validation 