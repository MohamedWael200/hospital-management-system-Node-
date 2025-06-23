const express = require("express");
const router = express.Router();
const patientController =  require("../Controllers/PatientController");
const auth = require("../middleware/auth");
const isReceptionist = require("../middleware/isReceptionist");
const isARD = require("../middleware/isARD");

router.post("/create" ,auth , isReceptionist , patientController.createPatient)
router.get("/patients" ,auth , isARD, patientController.getAllPatients)
router.get("/patients/:id" ,auth , isARD, patientController.getOnePatients)
router.patch("/patients/:id", auth, isReceptionist, patientController.updatePatient);

module.exports = router;