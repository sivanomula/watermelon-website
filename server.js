const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// WhatsApp Client
const whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// WhatsApp QR Code
whatsappClient.on('qr', (qr) => {
    console.log('📱 WhatsApp QR Code:');
    qrcode.generate(qr, { small: true });
    console.log('Scan this QR code with your WhatsApp to connect');
});

whatsappClient.on('ready', () => {
    console.log('✅ WhatsApp client is ready!');
});

whatsappClient.on('authenticated', () => {
    console.log('🔐 WhatsApp authenticated successfully');
});

whatsappClient.on('auth_failure', (msg) => {
    console.log('❌ WhatsApp authentication failed:', msg);
});

// Initialize WhatsApp
whatsappClient.initialize();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Demo form submission endpoint
app.post('/api/demo-request', async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            company,
            position,
            message,
            preferredTime,
            timestamp,
            source
        } = req.body;

        // Validate required fields
        if (!name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and phone are required'
            });
        }

        // Email content
        const emailContent = `
            <h2>🚀 New Demo Request - Watermelon Website</h2>
            
            <h3>👤 Contact Information:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Company:</strong> ${company || 'Not specified'}</p>
            <p><strong>Position:</strong> ${position || 'Not specified'}</p>
            
            <h3>⏰ Demo Preferences:</h3>
            <p><strong>Preferred Time:</strong> ${preferredTime || 'Not specified'}</p>
            
            <h3>💬 Additional Requirements:</h3>
            <p>${message || 'No additional requirements specified'}</p>
            
            <h3>📅 Request Details:</h3>
            <p><strong>Requested on:</strong> ${new Date(timestamp).toLocaleString('en-IN')}</p>
            <p><strong>Source:</strong> ${source}</p>
            
            <hr>
            <p><em>Please respond to this demo request within 24 hours.</em></p>
        `;

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
                          to: process.env.COMPANY_EMAIL || 'info@watermelon.com', // Use environment variable
            cc: process.env.EMAIL_USER || 'your-email@gmail.com', // Send copy to yourself
            subject: `🚀 New Demo Request from ${name} - Watermelon Website`,
            html: emailContent,
            replyTo: email
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Send WhatsApp message
        try {
            const whatsappMessage = createWhatsAppMessage({
                name,
                email,
                phone,
                company,
                position,
                message,
                preferredTime,
                timestamp,
                source
            });

            // Send to your WhatsApp number
            const whatsappNumber = process.env.WHATSAPP_NUMBER || '918147768993';
            const chatId = `${whatsappNumber}@c.us`;
            
            await whatsappClient.sendMessage(chatId, whatsappMessage);
            console.log(`📱 WhatsApp message sent to ${whatsappNumber}`);
        } catch (whatsappError) {
            console.error('WhatsApp sending failed:', whatsappError);
            // Continue even if WhatsApp fails
        }

        // Log the request
        console.log(`Demo request received from ${name} (${email}) at ${new Date().toISOString()}`);

        res.json({
            success: true,
            message: 'Demo request submitted successfully!'
        });

    } catch (error) {
        console.error('Error processing demo request:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.'
        });
    }
});

// Create WhatsApp message
function createWhatsAppMessage(data) {
    return `🚀 *New Demo Request - Watermelon Website*

👤 *Name:* ${data.name}
📧 *Email:* ${data.email}
📱 *Phone:* ${data.phone}
🏢 *Company:* ${data.company || 'Not specified'}
💼 *Position:* ${data.position || 'Not specified'}
⏰ *Preferred Time:* ${data.preferredTime || 'Not specified'}

💬 *Additional Requirements:*
${data.message || 'No additional requirements specified'}

📅 *Requested on:* ${new Date(data.timestamp).toLocaleString('en-IN')}
🌐 *Source:* Watermelon Website Demo Form

---
Please respond to this demo request within 24 hours.`;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Watermelon Demo Request API'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Email notifications will be sent to: ${process.env.COMPANY_EMAIL || 'info@watermelon.com'}`);
    console.log(`📱 WhatsApp: +91 ${process.env.WHATSAPP_NUMBER || '8147768993'}`);
});

module.exports = app; 