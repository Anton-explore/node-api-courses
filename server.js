const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load environments
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps')

// Initialize app
const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

// use error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 6000;

const server = app.listen(
    PORT,
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
    .yellow.bold
));

// Handle promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error in promise: ${err.message}`.red);
    // Close server end exit
    server.close(() => process.exit(1));
});