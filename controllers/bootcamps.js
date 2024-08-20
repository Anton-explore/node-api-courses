const ErrorResponse = require('../utils/errorResponse') 
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

const Bootcamp = require('../models/Bootcamp');

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    let query; 
    let queryStr = JSON.stringify(req.query);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Bootcamp.find(JSON.parse(queryStr));

    // try {
    // const bootcamps = await Bootcamp.find();
    const bootcamps = await query;

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
    // } catch (err) {
    //     next(err);
    //     // res.status(400).json({ success: false, error: `${err}`})
    // }
});

// @desc Get one bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id: ${req.params.id} is not found`, 404));
        // return res.status(400).json({ success: false, err: 'Database doesn\'t include this bootcamp'})
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
    const bootcamp = await Bootcamp.create(req.body);
    // console.log(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp
    })
})

// @desc Edit one bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.editBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id: ${req.params.id} is not found`, 404));
        // return res.status(400).json({ success: false, err: 'Database doesn\'t include this bootcamp'})
    }
    res.status(200).json({
        success: true,
        data: bootcamp
    })
})

// @desc Delete one bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const deletedBootcamp = await Bootcamp.findById(req.params.id);
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id: ${req.params.id} is not found`, 404));
        // return res.status(400).json({ success: false, err: 'Database doesn\'t include this bootcamp'})
    }
    res.status(200).json({
        success: true,
        data: deletedBootcamp
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