/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true, maxLength: 100 },
  },
);

// Virtual for Category URL
CategorySchema
  .virtual('url')
  .get(function () {
    return `/${this._id}`; // Change to name?
  });

module.exports = mongoose.model('Category', CategorySchema);
