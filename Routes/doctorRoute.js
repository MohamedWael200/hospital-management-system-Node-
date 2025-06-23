const express = require("express");
const router = express.Router();
const doctorController =  require("../Controllers/DoctorControllers");
const auth = require("../middleware/auth");
const isDoctor = require("../middleware/isDoctor");

router.post("/create" ,auth , isDoctor , doctorController.createDoctor)
router.get("/doctors" , doctorController.getAllDoctors)
router.patch("/update/:id", auth, isDoctor, doctorController.updateDoctor);

module.exports = router;