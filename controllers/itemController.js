const async = require('async');
const { body, validationResult } = require('express-validator');
const Item = require('../models/item');
const Category = require('../models/category');

// Display list of all Items
exports.item_list = function (req, res, next) {
  Item.find()
    .sort([['name', 'ascending']])
    .populate('category')
    .exec((err, listItems) => {
      if (err) { return next(err); }
      // Success: render
      res.render('item_list', { title: 'Available Food Items', item_list: listItems });
    });
};

// Display detail page for a specific item
exports.item_detail = function (req, res, next) {
  async.parallel({
    item(callback) {
      Item.findById(req.params.id)
        .populate('category')
        .exec(callback);
    },
  }, (err, results) => {
    if (err) { return next(err); }
    if (results.item == null) {
      const error = new Error('Item not found');
      error.status = 404;
      return next(error);
    }
    res.render('item_detail', { title: 'Food Item Detail', item: results.item });
  });
};

// Display item create form on GET
exports.item_create_get = function (req, res, next) {
  // Get categories for adding to our food items
  async.parallel({
    categories(callback) {
      Category.find(callback);
    },
  }, (err, results) => {
    if (err) { return next(err); }
    res.render('item_form', { title: 'Create Food Item', categories: results.categories });
  });
};

// Handle item create on POST
exports.item_create_post = [
  // Validate and sanitize fields
  body('name', 'Food item name must not be empty').trim().isLength({ min: 1 }).escape(),
  body('category', 'Category must not be empty').trim().isLength({ min: 1 }).escape(),
  body('quantity', 'Quantity must not be empty').trim().isLength({ min: 1 }).isNumeric()
    .escape(),
  body('description').trim().escape(),

  // Process request after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);
    // Create an Item with escaped and trimmed data
    const item = new Item({
      name: req.body.name,
      category: req.body.category,
      quantity: req.body.quantity,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // If there are errors, render the form again with sanitized values and error messages
      // Get all categories for form
      async.parallel(
        {
          categories(callback) {
            Category.find(callback);
          },
        },
        (err, results) => {
          if (err) { return next(err); }

          res.render('item_form', {
            title: 'Create a Food Item',
            categories: results.categories,
            errors: errors.array(),
          });
        },
      );
    }
    // Form data is valid
    item.save((err) => {
      if (err) { return next(err); }
      res.redirect(item.url);
    });
  },
];

// Display item delete form on GET
exports.item_delete_get = function (req, res, next) {
  Item.findById(req.params.id).populate('category')
    .exec((err, item) => {
      if (err) { return next(err); }
      if (item == null) {
        res.redirect('/catalog/items');
      }
      // Render form upon found item
      res.render('item_delete', { title: `Delete ${item.name}`, item });
    });
};

// Display item delete form on POST
exports.item_delete_post = function (req, res, next) {
  Item.findByIdAndRemove(req.body.itemid, (err) => {
    if (err) { return next(err); }
    // Success
    res.redirect('/catalog/items');
  });
};

// Display item update form on GET
exports.item_update_get = function (req, res) {
  res.send('Not implemented: item update GET');
};

// Display item update form on POST
exports.item_update_post = function (req, res) {
  res.send('Not implemented: item update POST');
};
