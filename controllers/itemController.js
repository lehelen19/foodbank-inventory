const async = require('async');
const Item = require('../models/item');

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
exports.item_create_get = function (req, res) {
  res.send('Not implemented: item create GET');
};

// Handle item create on POST
exports.item_create_post = function (req, res) {
  res.send('not implemented: item create POST');
};

// Display item delete form on GET
exports.item_delete_get = function (req, res) {
  res.send('Not implemented: item delete GET');
};

// Display item delete form on POST
exports.item_delete_post = function (req, res) {
  res.send('Not implemented: item delete POST');
};

// Display item update form on GET
exports.item_update_get = function (req, res) {
  res.send('Not implemented: item update GET');
};

// Display item update form on POST
exports.item_update_post = function (req, res) {
  res.send('Not implemented: item update POST');
};
