
const express = require('express');
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    editBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

// Add other resource routers
const courseRouter = require('./courses');

const router = express.Router();

// Re-route into other resource router
router.use('/:bootcampId/courses', courseRouter);


router.route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(createBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(editBootcamp)
    .delete(deleteBootcamp);

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

router.route('/:id/photo')
    .put(bootcampPhotoUpload);


module.exports = router;