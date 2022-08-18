const express = require('express');

const router = express.Router();

// Require controller module
const userController = require('../controllers/userController');

// User Routes //

// GET request for signing up
router.get('/sign-up', userController.sign_up_get);

// POST request for signing up
router.post('/sign-up', userController.sign_up_post);

// GET request for logging in
router.get('/log-in', userController.log_in_get);

// POST request for logging in
router.post('/log-in', userController.log_in_post);

// GET request for logging out
router.get('/log-out', userController.log_out_get);

module.exports = router;
