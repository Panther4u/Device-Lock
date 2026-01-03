const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    id: { type: String, required: true },
    amount: { type: Number, required: true },
    paidAt: { type: Date, default: Date.now },
    status: { type: String },
    transactionId: { type: String }
});

const emiSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    customerId: { type: String, required: true },
    deviceId: { type: String, required: true },
    financeCompany: { type: String },
    mobileAmount: { type: Number, required: true },
    totalEmiAmount: { type: Number, required: true },
    emiMonthly: { type: Number, required: true },
    emiStartDate: { type: Date },
    emiEndDate: { type: Date },
    paidEmis: { type: Number, default: 0 },
    totalEmis: { type: Number, required: true },
    nextDueDate: { type: Date },
    status: { type: String, enum: ['active', 'overdue', 'defaulted', 'completed'], default: 'active' },
    payments: [paymentSchema]
});

module.exports = mongoose.model('EMI', emiSchema);
