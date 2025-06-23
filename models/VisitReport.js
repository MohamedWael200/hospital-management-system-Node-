const mongoose = require("mongoose");

const visitReportSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
    diagnosis: { type: String },
    notes: { type: String },
    pdfReportPath: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("VisitReport", visitReportSchema);
