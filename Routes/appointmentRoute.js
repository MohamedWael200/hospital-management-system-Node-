const express = require("express");
const router = express.Router();
const appointmentController =  require("../Controllers/AppointmentController");
const auth = require("../middleware/auth");
const isPatintOrReceptionist = require("../middleware/isPatintOrReceptionist");

router.post("/create" , auth , isPatintOrReceptionist ,  appointmentController.createAppointment)
router.get("/Appointments" , auth , appointmentController.GetAllAppointment)
router.patch("/update/:id", auth, appointmentController.updateAppointmentStatus);

module.exports = router;