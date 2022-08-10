const Category = require('../models/category');

// Display site home page
exports.index = function (req, res) {
  res.send('not implemented: Site Home Page');
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
exports.category_detail = function (req, res) {
  res.send('Not implemented: Category Detail + req.params.id');
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
