const async = require('async');
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
      res.render('category_list', { title: 'Category List', category_list: listCategories });
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
exports.category_create_get = function (req, res) {
  res.send('Not implemented: Category create GET');
};

// Handle Category create on POST
exports.category_create_post = function (req, res) {
  res.send('not implemented: Category create POST');
};

// Display Category delete form on GET
exports.category_delete_get = function (req, res) {
  res.send('Not implemented: Category delete GET');
};

// Display Category delete form on POST
exports.category_delete_post = function (req, res) {
  res.send('Not implemented: Category delete POST');
};

// Display Category update form on GET
exports.category_update_get = function (req, res) {
  res.send('Not implemented: Category update GET');
};

// Display Category update form on POST
exports.category_update_post = function (req, res) {
  res.send('Not implemented: Category update POST');
};
