const path = require('path');
const ErrorResponse = require('../utils/errorResponse') 
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

const Bootcamp = require('../models/Bootcamp');

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc Get one bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id).populate('courses');

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id: ${req.params.id} is not found`, 404));
    }
    res.status(200).json({
        success: true,
        data: bootcamp
    })
});

// @desc Create one bootcamp
// @route POST /api/v1/bootcamps
// @access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    // Add user
    req.body.user = req.user.id;

    // Check for published bootcamps
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

    // If user is not admin, can add only one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user with ID ${req.user.id} already publish a bootcamp`, 400));
    }

    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        data: bootcamp
    })
})

// @desc Edit one bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.editBootcamp = asyncHandler(async (req, res, next) => {
    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id: ${req.params.id} is not found`, 404));
    }

    // Check bootcamp ownership
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.params.id} is not authorize to edit this bootcamp`, 401)
        );
    }

    bootcamp = await Bootcamp.findByIdAndUpdate( 
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    )

    res.status(200).json({
        success: true,
        data: bootcamp
    })
})

// @desc Delete one bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id of ${req.params.id} not found`, 404));
    }

    // Check bootcamp ownership
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.params.id} is not authorize to delete this bootcamp`, 401)
        );
    }

    await bootcamp.deleteOne();
    // await Course.deleteMany( { bootcamp: bootcamp._id });

    res.status(200).json({
        success: true,
        data: bootcamp
    })
})

// @desc Get bootcamps within a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance/:unit
// @access Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance, unit } = req.params;

    // Get lat/long from geocoder
    const loc = await geocoder.geocode(zipcode);
    console.log(loc);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Earth radius = 3963 miles / 6378 km
    const radius = unit === 'ml' ? distance / 3963 : distance / 6378;
    
    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius]}}
    })

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })

})

// @desc Upload photo for bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id of ${req.params.id} not found`, 404));
    }

    // Check bootcamp ownership
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.params.id} is not authorize to add photo to this bootcamp`, 401)
        );
    }

    if (!req.files) {
        return next(new ErrorResponse('Please upload a file', 400));
    }

    const file = req.files.file;

    // Check that the file is photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse('Please upload an image file', 400));
    }

    // Check file size
    if (file.size > process.env.MAX_FILE_LIMIT) {
        return next(new ErrorResponse(
            `Please upload an image less then ${process.env.MAX_FILE_LIMIT / 1000000} MB`,
            400
        ));
    }

    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse('Problem with file upload', 500));
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
        
        res.status(200).json({
            success: true,
            data: file.name
        })
    });


})