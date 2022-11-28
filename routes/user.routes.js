const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth.controller");

router.post("/signup", authCtrl.signup);
router.post("/login", authCtrl.login);
router.get("/logout", authCtrl.logout);
// router.get("/", authCtrl.getUsers);

module.exports = router;
