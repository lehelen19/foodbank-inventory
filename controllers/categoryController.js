/* eslint-disable camelcase */
const async = require('async');
const { body, validationResult } = require('express-validator');
const Category = require('../models/category');
const Item = require('../models/item');

// Display site home page
exports.index = function (req, res) {
  async.parallel({
    category_names(callback) {
      Category.find({}, { name: 1 }, callback);
    },
  }, (err, results) => {
    res.render('index', { title: 'Food Bank Inventory Home', error: err, data: results });
  });
};

// Display list of all Categories.
exports.category_list = function (req, res, next) {
  Category.find()
    .sort([['name', 'ascending']])
    .exec((err, listCategories) => {
      if (err) { return next(err); }
      // Success: render
      res.render('category_list', { title: 'Available Categories', category_list: listCategories });
    });
};

// Display detail page for a specific category
exports.category_detail = function (req, res, next) {
  async.parallel({
    category(callback) {
      Category.findById(req.params.id)
        .exec(callback);
    },
    category_items(callback) {
      Item.find({ category: req.params.id })
        .exec(callback);
    },
  }, (err, results) => {
    if (err) { return next(err); } // Error in API usage
    if (results.category == null) {
      // No results for specified category
      const error = new Error('Category not found');
      error.status = 404;
      return next(error);
    }
    // Successful, so render
    res.render('category_detail', {
      title: 'Category Detail',
      category: results.category,
      category_items: results.category_items,
    });
  });
};

// Display Category create form on GET
exports.category_create_get = function (req, res, next) {
  res.render('category_form', { title: 'Create category' });
};

// Handle Category create on POST
exports.category_create_post = [
  // Validate and sanitize fields
  body('name', 'Category name required').trim().isLength({ min: 1 }).escape()
    .withMessage('Category name must be specified')
    .isAlphanumeric()
    .withMessage('Category name must only contain alphanumeric characters'),
  body('description').trim().isLength({ min: 1, max: 100 }).escape()
    .withMessage('Category description must be specified'),
  (req, res, next) => {
    // Extract validation errors from a request
    const errors = validationResult(req);

    // Create a new Category object with escaped and trimmed data
    const category = new Category({ name: req.body.name, description: req.body.description });

    if (!errors.isEmpty()) {
      // Errors present; render form again with sanitized values/error messages
      res.render('category_form', {
        title: 'Create category',
        category,
        errors: errors.array(),
      });
    } else {
      // Form data is valid (client-side)
      // Check if Category with same name already exists
      Category.findOne({ name: req.body.name }).exec((err, found_category) => {
        if (err) { return next(err); }
        if (found_category) {
          res.redirect(found_category.url);
        } else {
          category.save((error) => {
            if (error) { return next(error); }
            // Successfully save new category; redirect to its detail page
            res.redirect(category.url);
          });
        }
      });
    }
  },
];

// Display Category delete form on GET
exports.category_delete_get = function (req, res, next) {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_items(callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) { return next(err); }
      if (results.category == null) { res.redirect('/catalog/categories'); }
      // Success
      res.render('category_delete', {
        title: 'Delete Category',
        category: results.category,
        category_items: results.category_items,
      });
    },
  );
};

// Display Category delete form on POST
exports.category_delete_post = function (req, res, next) {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.body.categoryid).exec(callback);
      },
      category_items(callback) {
        Item.find({ category: req.body.categoryid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) { return next(err); }
      // Success
      if (results.category_items.length > 0) {
        // Category still contains items. Render the same way as GET route
        res.render('category_delete', {
          title: 'Delete Category',
          category: results.category,
          category_items: results.category_items,
        });
      }
      // Category has no items. Delete object and redirect to list of categories
      Category.findByIdAndRemove(req.body.categoryid, (err) => {
        if (err) { return next(err); }
        // Object has been deleted
        res.redirect('/catalog/categories');
      });
    },
  );
};

// Display Category update form on GET
exports.category_update_get = function (req, res) {
  res.send('Not implemented: Category update GET');
};

// Display Category update form on POST
exports.category_update_post = function (req, res) {
  res.send('Not implemented: Category update POST');
};
