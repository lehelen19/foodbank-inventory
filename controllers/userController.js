const async = require('async');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Display User create form on GET
exports.sign_up_get = function (req, res, next) {
  res.render('signup_form');
};

// Handle User create on POST
exports.sign_up_post = [
  // Validate and sanitize fields
  body('username', 'Username required').trim()
    .isLength({ min: 5 }).withMessage('Username must be at least 5 characters')
    .isAlphanumeric()
    .withMessage('Username characters must only be alphanumeric')
    .escape(),
  body('password', 'Password required').trim()
    .isLength({ min: 5 }).withMessage('Password must be at least 5 characters')
    .escape(),
  body('secret', 'Secret required').escape(),

  // Process request
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If errors, render signup form again
      res.render('signup_form', { errors: errors.array() });
    } else if (req.body.secret !== 'foodbanksrock') {
      // If secret key is incorrect, render signup form again
      res.render('signup_form');
    } else {
      // Hash the password
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) { return next(err); }
        // Create and store new user upon success of hashing password
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        }).save((err) => {
          if (err) { return next(err); }
          // Upon success
          res.redirect('/');
        });
      });
    }
  },
];

// Display User login form on GET
exports.log_in_get = function (req, res, next) {
  res.render('login_form');
};

// Handle User login form on POST
exports.log_in_post = [
  passport.authenticate('local', { failureRedirect: '/' }),
  function (req, res, next) {
    res.redirect('/');
  },
];

// Handle User logout form on GET
exports.log_out_get = function (req, res, next) {
  req.logout((err) => {
    if (err) { return next(err); }
  });
  // Success
  res.redirect('/');
};
