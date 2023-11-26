const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },  
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: true },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
  });

  const Product = mongoose.model('Product', productSchema);

  module.exports = Product;
