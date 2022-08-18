const express = require('express');

const router = express.Router();

// Require controller module
const userController = require('../controllers/userController');

// User Routes //

// GET request for signing up
router.get('/sign-up', userController.sign_up_get);

// POST request for signing up
router.post('/sign-up', userController.sign_up_post);

module.exports = router;
