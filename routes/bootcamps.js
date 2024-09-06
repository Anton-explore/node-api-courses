
const express = require('express');
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    editBootcamp,
    deleteBootcamp,
    getBootcampsInRadius
} = require('../controllers/bootcamps');

// Add other resource routers
const courseRouter = require('./courses');

const router = express.Router();

// Re-route into other resource router
router.use('/:bootcampId/courses', courseRouter);


router.route('/')
    .get(getBootcamps)
    .post(createBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(editBootcamp)
    .delete(deleteBootcamp);

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

module.exports = router;