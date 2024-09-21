const express = require('express');
const {
    register,
    login,
    getUser
} = require('../controllers/auth');

const router = express.Router();

// Protect routes from unauthorized access
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);

router.get('/user', protect, getUser);

module.exports = router;