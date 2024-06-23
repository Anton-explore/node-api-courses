
const express = require('express');
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    editBootcamp,
    deleteBootcamp
} = require('../controllers/bootcamps')

const router = express.Router();

router.route('/')
    .get(getBootcamps)
    .post(createBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(editBootcamp)
    .delete(deleteBootcamp);

module.exports = router;