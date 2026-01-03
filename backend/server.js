const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
const customerRoutes = require('./routes/customers');
const deviceRoutes = require('./routes/devices');
const emiRoutes = require('./routes/emi');

// Models for Reset
const Customer = require('./models/Customer');
const Device = require('./models/Device');
const EMI = require('./models/EMI');

app.use('/api/customers', customerRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/emi', emiRoutes);

// Reset Database Route
app.delete('/api/reset', async (req, res) => {
    try {
        await Customer.deleteMany({});
        await Device.deleteMany({});
        await EMI.deleteMany({});
        res.json({ message: 'Database reset successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running with MongoDB' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
