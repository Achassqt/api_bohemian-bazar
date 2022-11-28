const mongoose = require("mongoose");

const carouselImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
  },
});

module.exports = mongoose.model("CarouselImage", carouselImageSchema);
