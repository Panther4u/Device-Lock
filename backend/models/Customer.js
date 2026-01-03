const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Keeping custom ID for now to match frontend
    name: { type: String, required: true },
    phone: { type: String, required: true },
    aadhaar: { type: String },
    address: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);
