const express = require('express');
const router = express.Router();
const EMI = require('../models/EMI');

// GET all EMIs
router.get('/', async (req, res) => {
    try {
        const emis = await EMI.find();
        res.json(emis);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET EMI details by Customer ID
router.get('/customer/:customerId', async (req, res) => {
    try {
        const emis = await EMI.find({ customerId: req.params.customerId });
        res.json(emis);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET EMI details by Device ID
router.get('/device/:deviceId', async (req, res) => {
    try {
        const emi = await EMI.findOne({ deviceId: req.params.deviceId });
        if (emi) {
            res.json(emi);
        } else {
            res.status(404).json({ message: 'EMI details not found for this device' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new EMI record
router.post('/', async (req, res) => {
    const emi = new EMI(req.body);
    try {
        const newEMI = await emi.save();
        res.status(201).json(newEMI);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET payments for an EMI ID
router.get('/:emiId/payments', async (req, res) => {
    try {
        const emi = await EMI.findOne({ id: req.params.emiId });
        if (emi) {
            res.json(emi.payments);
        } else {
            res.status(404).json({ message: 'EMI not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new payment
router.post('/:emiId/payments', async (req, res) => {
    try {
        const emi = await EMI.findOne({ id: req.params.emiId });
        if (!emi) {
            return res.status(404).json({ message: 'EMI not found' });
        }

        const newPayment = req.body;
        // Basic validation or ID generation for payment could happen here if not provided
        // Mongoose subdocuments usually get an _id automatically, but we are using custom schema without _id option set to false?
        // Actually the schema has 'id' field required.

        emi.payments.push(newPayment);
        emi.paidEmis += 1; // Increment paid count

        await emi.save();
        res.status(201).json(newPayment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
