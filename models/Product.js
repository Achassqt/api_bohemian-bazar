const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  display: {
    type: String,
    default: "false",
  },
});

module.exports = mongoose.model("Product", productSchema);
