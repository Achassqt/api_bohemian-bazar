const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  display: {
    type: String,
    default: "false",
  },
  price: {
    type: Number,
    required: true,
  },
  sizes: [
    {
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  quantity: {
    type: Number,
  },
});

module.exports = mongoose.model("Product", productSchema);
