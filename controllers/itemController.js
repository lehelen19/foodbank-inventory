const Item = require('../models/item');

// Display list of all Categories.
exports.item_list = function (req, res, next) {
  Item.find()
    .sort([['name', 'ascending']])
    .exec((err, listItems) => {
      if (err) { return next(err); }
      // Success: render
      res.render('item_list', { title: 'Item List', item_list: listItems });
    });
};

// Display detail page for a specific item
exports.item_detail = function (req, res) {
  res.send('Not implemented: item Detail + req.params.id');
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
