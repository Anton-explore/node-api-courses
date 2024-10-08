const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse') 
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');

const User = require('../models/User');

// @desc Register user
// @route POST /api/v1/auth/register
// @access Public
exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;

	// Create user
	const user = await User.create({
			name,
			email,
			password,
			role
	});

	sendTokenResponse(user, 200, res);
});



// @desc Login user
// @route POST /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// Validate email, password
	if (!email || !password) {
			return next(new ErrorResponse('Please provide email and password', 400));
	}
	// Check user
	const user = await User.findOne({ email }).select('+password');

	if (!user) {
			return next(new ErrorResponse('Invalid credential', 401));
	}

	// Check password matches
	const isMatch = await user.matchPassword(password);

	if (!isMatch) {
			return next(new ErrorResponse('Invalid credential', 401));
	}

	sendTokenResponse(user, 200, res);
});


// @desc Get current logged in user
// @route POST /api/v1/auth/user
// @access Private
exports.getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);
	
	if (!user) {
		return next(new ErrorResponse(`No user with such id: ${req.params.id}`), 404);
	}

	res.status(200).json({
		success: true,
		data: user
	})
});

// @desc Logout user / clear token data 
// @route GET /api/v1/auth/logout
// @access Private
exports.logout = asyncHandler(async (req, res, next) => {
	res.cookie('token', 'none', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true
	});

	res.status(200).json({
		success: true,
		data: {}
	})
});

// @desc Update user data
// @route PUT /api/v1/auth/update-user
// @access Private
exports.updateUser = asyncHandler(async (req, res, next) => {
	const fieldsToUpdate = {
		name: req.body.name,
		email: req.body.email
	}

	const user = await User.findByIdAndUpdate(
		req.user.id,
		fieldsToUpdate,
		{
			new: true,
			runValidators: true
		}
	);

	res.status(200).json({
			success: true,
			data: user
	})
});

// @desc Update password
// @route PUT /api/v1/auth/update-password
// @access Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password');

	// Check current password
	if (!(await user.matchPassword(req.body.currentPassword))) {
		return next(new ErrorResponse('Password is incorrect', 401));
	}

	user.password = req.body.newPassword;
	await user.save();

	sendTokenResponse(user, 200, res);
});

// @desc Forgot password
// @route POST /api/v1/auth/recover
// @access Public
exports.passwordRecover = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	console.log(user);

	if (!user) {
			return next(new ErrorResponse('There is no user with that email', 404));
	}

	// Get reset token
	const resetToken = user.getResetPassToken();

	await user.save({ validateBeforeSave: false });

	// Create reset URL
	const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset/${resetToken}`

	const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

	try {
			await sendEmail({
					email: user.email,
					subject: 'Password reset token',
					message
			});

			res.status(200).json({ success: true, data: 'Email sent' });
	} catch (err) {
			console.log(err);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });

		return next(new ErrorResponse('Email could not be sent', 500));
	}
});

// @desc Reset password
// @route PUT /api/v1/auth/reset/:resettoken
// @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
	// Get hashed token
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.resettoken)
		.digest('hex');
	
	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() }
	});

	if (!user) {
		return next(new ErrorResponse('InvalidToken', 400));
	}

	// Set new password
	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;
	await user.save();

	sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response 
const sendTokenResponse = (user, statusCode, res) => {
	// Create token
	const token = user.getSignedJwtToken();

	// Create cookie
	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE*24*60*60*1000
		),
		httpOnly: true
	}

	if (process.env.NODE_ENV === 'production') {
		options.secure = true
	}

	res.status(statusCode)
		.cookie('token', token, options)
		.json({
				success: true,
				token
		});
}
