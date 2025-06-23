const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    specialization: { type: String, required: true },
    availabilitySchedule: [{ day: String, from: String, to: String }],
    bio: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema);
