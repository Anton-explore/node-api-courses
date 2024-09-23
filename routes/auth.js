const express = require('express');
const {
    register,
    login,
    getUser,
    passwordRecover,
    resetPassword,
    updateUser,
    updatePassword,
    logout
} = require('../controllers/auth');

const router = express.Router();

// Protect routes from unauthorized access
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

router.get('/user', protect, getUser);
router.put('/update-user', protect, updateUser);
router.put('/update-password', protect, updatePassword);

router.post('/recover', passwordRecover);
router.put('/reset/:resettoken', resetPassword);

module.exports = router;