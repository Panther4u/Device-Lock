const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Customer = require('./models/Customer');
const Device = require('./models/Device');
const EMI = require('./models/EMI');

const wipeData = async () => {
    try {
        await connectDB();
        console.log('Connected to DB...');

        await Customer.deleteMany({});
        console.log('Customers deleted.');

        await Device.deleteMany({});
        console.log('Devices deleted.');

        await EMI.deleteMany({});
        console.log('EMIs deleted.');

        console.log('All backend data cleared successfully.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

wipeData();
