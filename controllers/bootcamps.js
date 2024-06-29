const Bootcamp = require('../models/Bootcamp');

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        })
    } catch(err) {
        res.status(400).json({ success: false, error: `${err}`})
    }
}

// @desc Get one bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
            return res.status(400).json({ success: false, err: 'Database doesn\'t include this bootcamp'})
        }
        res.status(200).json({
            success: true,
            data: bootcamp
        })
    } catch (err) {
        next(err);
        // res.status(400).json({ success: false, error: `${err}`})
    }
}

// @desc Create one bootcamp
// @route POST /api/v1/bootcamps
// @access Private
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        // console.log(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        })
    } catch(err) {
        res.status(400).json({ success: false, error: `${err}`})
    }
    
}

// @desc Edit one bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.editBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!bootcamp) {
            return res.status(400).json({ success: false, err: 'Database doesn\'t include this bootcamp'})
        }
        res.status(200).json({
            success: true,
            data: bootcamp
        })
    } catch(err) {
        res.status(400).json({ success: false, error: `${err}`})
    }
}

// @desc Delete one bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const deletedBootcamp = await Bootcamp.findById(req.params.id);
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        if (!bootcamp) {
            return res.status(400).json({ success: false, err: 'Database doesn\'t include this bootcamp'})
        }
        res.status(200).json({
            success: true,
            data: deletedBootcamp
        })
    } catch(err) {
        res.status(400).json({ success: false, error: `${err}`})
    }
}