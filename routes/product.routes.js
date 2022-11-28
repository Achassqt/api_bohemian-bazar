const express = require("express");
const router = express.Router();
const productCtrl = require("../controllers/product.controller");
const multerProduct = require("../middleware/multer-product.middleware");
const { checkUser } = require("../middleware/auth.middleware");

router.post("/", checkUser, multerProduct, productCtrl.uploadProduct);
router.get("/", productCtrl.getProducts);
router.delete("/:id", checkUser, productCtrl.deleteProduct);
router.put("/:id", checkUser, multerProduct, productCtrl.updateProduct);

module.exports = router;
