const mongoose = require("mongoose");

const labReportSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    testName: { type: String, required: true },
    resultFile: { type: String, required: true }, // file path
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // lab staff
    date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("LabReport", labReportSchema);
