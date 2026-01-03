const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    customerId: { type: String, required: true, ref: 'Customer' }, // Reference by custom ID
    deviceName: { type: String, required: true },
    modelName: { type: String },
    imei1: { type: String, required: true },
    imei2: { type: String },
    status: { type: String, enum: ['locked', 'unlocked', 'pending'], default: 'pending' },
    lastSyncAt: { type: Date },
    registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Device', deviceSchema);
