const express = require('express');
const dotenv = require('dotenv');

// Load environments
dotenv.config({ path: './config/config.env' });

// Initialize app
const app = express();

const PORT = process.env.PORT || 6000;

app.listen(
    PORT,
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
));