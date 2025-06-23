const express = require("express");
const router = express.Router();
const lapReportController =  require("../Controllers/LabController");
const auth = require("../middleware/auth");
const upload = require("../middleware/uploadLapReport");

router.post("/create", auth, upload.single("resultFile"), lapReportController.createLapReport);
router.get("/lab-reports/by-name/:name", auth, lapReportController.getLabReportsByPatientName);

module.exports = router;