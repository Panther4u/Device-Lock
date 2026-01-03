const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const EMI = require('../models/EMI');

// GET /sync - Device Heartbeat & Status Check
router.get('/sync', async (req, res) => {
    try {
        const { imei } = req.query;
        if (!imei) {
            return res.status(400).json({ message: 'IMEI is required' });
        }

        // 1. Find Device by IMEI
        const device = await Device.findOne({ imei1: imei });
        if (!device) {
            return res.status(404).json({ message: 'Device not registered' });
        }

        // 2. Find associated EMI details
        const emi = await EMI.findOne({ deviceId: device.id });

        // 3. Construct Layout/Lock Payload
        // Using hardcoded support number as per previous context (8876655444)
        const response = {
            locked: device.status === 'locked',
            lockTitle: device.status === 'locked' ? 'Device Locked by Admin' : 'Device Unlocked',
            lockMessage: device.status === 'locked'
                ? 'Your EMI payment is overdue. Please contact support to unlock.'
                : 'Device is active.',
            supportPhone: '8876655444',
            financeName: emi ? emi.financeCompany : 'Finance Provider',
            nextDueDate: emi ? emi.nextDueDate : null,
            amountDue: emi ? emi.emiMonthly : 0,
            lastSync: new Date()
        };

        // 4. Update device lastSyncAt
        device.lastSyncAt = new Date();
        await device.save();

        res.json(response);

    } catch (err) {
        console.error('Sync Error:', err);
        res.status(500).json({ message: err.message });
    }
});

// GET all devices
router.get('/', async (req, res) => {
    try {
        const devices = await Device.find();
        res.json(devices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET devices by Customer ID
router.get('/customer/:customerId', async (req, res) => {
    try {
        const devices = await Device.find({ customerId: req.params.customerId });
        res.json(devices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET device by ID
router.get('/:id', async (req, res) => {
    try {
        const device = await Device.findOne({ id: req.params.id });
        if (device) {
            res.json(device);
        } else {
            res.status(404).json({ message: 'Device not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new device
router.post('/', async (req, res) => {
    const device = new Device(req.body);
    try {
        const newDevice = await device.save();
        res.status(201).json(newDevice);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH device status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const device = await Device.findOneAndUpdate(
            { id: req.params.id },
            { status: status },
            { new: true }
        );

        if (device) {
            res.json(device);
        } else {
            res.status(404).json({ message: 'Device not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
