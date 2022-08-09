#! /usr/bin/env node

console.log('This script populates test categories and food items for the food inventory database.');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const async = require('async');
const mongoose = require('mongoose');
const Category = require('./models/category');
const Item = require('./models/item');

const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const categories = [];
const items = [];

function categoryCreate(name, description, cb) {
  const category = new Category({ name, description });

  category.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Category: ${category}`);
    categories.push(category);
    cb(null, category);
  });
}

function itemCreate(name, description, category, quantity, cb) {
  const itemDetail = { name, category, quantity };
  if (description) itemDetail.description = description;

  const item = new Item(itemDetail);
  item.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New item: ${item}`);
    items.push(item);
    cb(null, item);
  });
}

// Create categories, manufacturers and parts

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate('Produce', 'fruits and veggies', callback);
      },
      function (callback) {
        categoryCreate('Dairy', 'milk, eggs, cheeses, yogurt, butter', callback);
      },
      function (callback) {
        categoryCreate('Meat', 'poultry, beef, pork, lunch meats', callback);
      },
      function (callback) {
        categoryCreate('Grains', 'cereals, pastas, breads, flour', callback);
      },
    ],
    // optional callback
    cb,
  );
}

function createItems(cb) {
  async.parallel(
    [
      function (callback) {
        itemCreate('avocado', 'imported from California', categories[0], 2, callback);
      },
      function (callback) {
        itemCreate('jug of milk', '2% reduced fat', categories[1], 3, callback);
      },
      function (callback) {
        itemCreate('chicken thighs', '1lb package', categories[2], 2, callback);
      },
      function (callback) {
        itemCreate('wheat bread', 'a whole loaf!', categories[3], 5, callback);
      },
    ],
    // optional callback
    cb,
  );
}
async.series(
  [
    createCategories,
    createItems,
  ],
  // Optional callback
  (err, results) => {
    if (err) {
      console.log(`FINAL ERR: ${err}`);
    } else {
      console.log(`Food items: ${items}`);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  },
);
