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
  description: {
    type: String,
    required: true,
  },
  display: {
    type: Boolean,
    default: "false",
  },
  ranking: {
    type: Number,
    required: false,
  },
  rankingInList: {
    type: Number,
    required: false,
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

productSchema.pre("save", function (next) {
  if (!this.display) {
    this.ranking = undefined;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
