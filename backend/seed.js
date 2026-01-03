const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Customer = require('./models/Customer');
const Device = require('./models/Device');
const EMI = require('./models/EMI');
const fs = require('fs');
const path = require('path');

// Read data
const dataPath = path.join(__dirname, 'data', 'db.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Customer.deleteMany({});
        await Device.deleteMany({});
        await EMI.deleteMany({});

        console.log('Data cleared...');

        // Insert new data
        await Customer.insertMany(data.customers);
        await Device.insertMany(data.devices);
        await EMI.insertMany(data.emis); // Note: db.json might have 'emis', model is 'EMI' collection will be 'emis'

        console.log('Data imported!');
        process.exit();
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

seedData();
