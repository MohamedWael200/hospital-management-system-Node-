const Invoice = require("../models/Invoice");
const User = require("../models/User");
const Patient = require("../models/Patient");
const createInvoice = async (req, res) => {
    try {
        const { patientId, services } = req.body;

        if (!patientId || !services || !Array.isArray(services) || services.length === 0) {
            return res.status(400).json({ message: "Patient ID and services are required" });
        }

        const totalAmount = services.reduce((sum, s) => sum + (s.cost || 0), 0);

        const newInvoice = new Invoice({
            patientId,
            services,
            totalAmount,
            createdBy: req.user.id, // المفروض تكون محميّة بـ isAccountant
        });

        await newInvoice.save();

        res.status(200).json({
            message: "Invoice created successfully",
            data: newInvoice,
        });
    } catch (error) {
        console.error("Create Invoice Error:", error);
        res.status(500).json({
            message: "Failed to create invoice",
            error: error.message,
        });
    }
};


const getInvoicesByPatientName = async (req, res) => {
    try {
        const { name } = req.query;

        // 1. دور على الـ user اللي اسمه = name
        const user = await User.findOne({ name, role: "patient" });
        if (!user) {
            return res.status(404).json({ message: "No patient found with this name" });
        }

        // 2. دور على الـ patient اللي مرتبط بـ userId ده
        const patient = await Patient.findOne({ userId: user._id });
        if (!patient) {
            return res.status(404).json({ message: "No patient record linked to this user" });
        }

        // 3. دور على الفواتير
        const invoices = await Invoice.find({ patientId: patient.userId });

        if (!invoices.length) {
            return res.status(404).json({ message: "No invoices found for this patient" });
        }

        res.status(200).json({
            message: `Invoices for patient "${name}" fetched successfully.`,
            data: invoices,
        });
    } catch (error) {
        console.error("Error fetching invoices by name:", error);
        res.status(500).json({
            message: "Failed to fetch invoices",
            error: error.message,
        });
    }
};


const payInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        const invoice = await Invoice.findById(id);
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        if (invoice.paid) {
            return res.status(400).json({ message: "Invoice is already paid" });
        }

        invoice.paid = true;
        await invoice.save();

        res.status(200).json({ message: "Invoice paid successfully", data: invoice });
    } catch (error) {
        res.status(500).json({
            message: "Failed to pay invoice",
            error: error.message,
        });
    }
};

module.exports = {
    createInvoice,
    getInvoicesByPatientName,
    payInvoice
}