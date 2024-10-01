const path = require('path');
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('./middleware/xss-sanitizer');
const rateLimiter = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors')
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

const setupSwagger = require('./swagger');

// Load environments
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

// Initialize app
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Set XSS filter
app.use(xss);

// Rate limiting
const limiter = rateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100  // max attempts
});

app.use(limiter);

// Prevent HTTP parameters pollution
app.use(hpp());


// Define CORS
const allowedOrigins = ['http://localhost:5173'];
function allowOrigin(origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
}
const corsOptions = {
    origin: allowOrigin,
    credentials: true,
    optionsSuccessStatus: 200
}
// Apply cors
app.use(cors(corsOptions));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// CORS preflight
// app.options('*', cors())

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

// use swagger to generate docs
setupSwagger(app);

// use error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

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