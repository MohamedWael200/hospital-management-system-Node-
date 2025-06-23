const express = require("express");
const router = express.Router();
const authController =  require("../Controllers/AuthControllers");
const upload = require("../middleware/multer");

router.post("/register" ,upload.single("image") , authController.register)
router.post("/login"   , authController.login)
router.post("/verfyOtp",  authController.verifyToken);
router.patch("/update-password", authController.updatePassword);
module.exports = router