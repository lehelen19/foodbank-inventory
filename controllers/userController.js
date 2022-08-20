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
exports.sign_up_post = function (req, res, next) {
  // Create a new User object
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
};

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
