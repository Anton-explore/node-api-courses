const ErrorResponse = require('../utils/errorResponse') 
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    // try {
    const bootcamps = await Bootcamp.find();
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