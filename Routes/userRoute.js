const express = require("express");
const router = express.Router();
const userController =  require("../Controllers/userController");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.get("/users" ,auth , isAdmin , userController.allUsers)
router.delete('/delete/:id' , auth , isAdmin , userController.deleteUser)

module.exports = router;