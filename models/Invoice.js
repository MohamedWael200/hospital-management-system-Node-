const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    services: [
        {
            name: { type: String },
            cost: { type: Number }
        }
    ],
    totalAmount: { type: Number, required: true },
    paid: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // accountant
}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
