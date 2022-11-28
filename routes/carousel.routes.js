const express = require("express");
const router = express.Router();
const carouselImgCtrl = require("../controllers/carouselImage.controller");
const multerCarousel = require("../middleware/multer-carouselImage.middleware");
const { checkUser } = require("../middleware/auth.middleware");

router.post("/", multerCarousel, checkUser, carouselImgCtrl.uploadImage);
router.get("/", carouselImgCtrl.getImages);
router.delete("/:id", checkUser, carouselImgCtrl.deleteImage);

module.exports = router;
