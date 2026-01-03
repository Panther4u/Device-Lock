const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

const readData = () => {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        return { customers: [], devices: [], emis: [], payments: [] }; // Default schema
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error('Error writing to database:', error);
        return false;
    }
};

module.exports = { readData, writeData };
