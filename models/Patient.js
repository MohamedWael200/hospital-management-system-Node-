const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    medicalHistory: { type: String },
    allergies: { type: String },
    bloodType: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Patient", patientSchema);
