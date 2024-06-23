
// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Show bootcamps'
    })
}

// @desc Get one bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Show bootcamp with id: ${req.params.id}`
    })
}

// @desc Create one bootcamp
// @route POST /api/v1/bootcamps
// @access Private
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Create new bootcamp'
    })
}

// @desc Edit one bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.editBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Edit bootcamp with id: ${req.params.id}`
    })
}

// @desc Delete one bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Delete bootcamp with id: ${req.params.id}`
    })
}