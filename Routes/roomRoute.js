const express = require("express");
const router = express.Router();
const roomController =  require("../Controllers/RoomController");
const auth = require("../middleware/auth");
const isReceptionist = require("../middleware/isReceptionist");

router.post("/create" ,auth  , isReceptionist ,roomController.createRoom)
router.get("/rooms" , isReceptionist ,roomController.GetAllRoom)
router.patch("/rooms/assign", auth, isReceptionist ,roomController.assignPatientToRoom);

module.exports = router;