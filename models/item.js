/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItemSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    quantity: { type: Number, required: true },
  },
);

// Virtual for Item URL
ItemSchema
  .virtual('url')
  .get(function () {
    return `/catalog/item/${this._id}`; // Maybe use category name instead
  });

module.exports = mongoose.model('Item', ItemSchema);
