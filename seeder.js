const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Load models
const Bootcamp = require('./models/Bootcamp');

// Connect to DB
const uri = process.env.MONGO_URI;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
mongoose.connect(uri, clientOptions);

// Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));

// Import into DB
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);

        console.log('Data imported'.green.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
}

// Delete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();

        console.log('Data deleted'.red.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
}

if (process.argv[2] === '-import' ) {
    importData();
} else if (process.argv[2] === '-delete') {
    deleteData();
}
