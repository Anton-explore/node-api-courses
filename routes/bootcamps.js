
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
// Add other resource routers
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
// Protect routes from unauthorized access
const { protect, authorize } = require('../middleware/auth');


// Re-route into other resource router
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), editBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

router.route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);


module.exports = router;