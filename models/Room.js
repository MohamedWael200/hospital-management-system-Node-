const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true },
    type: { type: String, enum: ["ICU", "Normal"], required: true },
    status: { type: String, enum: ["available", "occupied"], default: "available" },
    currentPatientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);
