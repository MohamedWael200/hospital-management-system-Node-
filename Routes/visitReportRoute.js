const express = require("express");
const router = express.Router();
const VisitReportController =  require("../Controllers/VisitReportController");
const auth = require("../middleware/auth");
const isDoctor = require("../middleware/isDoctor");

router.post("/create" ,auth , isDoctor , VisitReportController.createVisitReport)
router.get("/report/:id", auth, isDoctor, VisitReportController.getOneVisitReport);

module.exports = router;