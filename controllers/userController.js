const async = require('async');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');

// Display sign up form
exports.sign_up_get = function (req, res, next) {
  res.render('signup_form');
};

exports.sign_up_post = function (req, res, next) {
  // Create a new User object
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  }).save((err) => {
    if (err) { return next(err); }
    // Upon success
    res.redirect('/');
  });
};
