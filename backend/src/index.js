const express = require('express');
const dotenv = require('dotenv');
const smsRoutes = require('./routes/smsRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000; // Backend runs on 4000 to avoid conflict with React 3000

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth/sms', smsRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Start Server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Backend server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
