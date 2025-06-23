const express = require("express");
const router = express.Router();
const invoiceController =  require("../Controllers/InvoiceController");
const auth = require("../middleware/auth");
const isDoctor = require("../middleware/isDoctor");

router.post("/create", auth, invoiceController.createInvoice);
router.get("/invoices", auth, invoiceController.getInvoicesByPatientName);
router.patch("/invoices/:id/pay", auth, invoiceController.payInvoice);


module.exports = router;