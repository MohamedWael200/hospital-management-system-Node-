const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor")
const validator = require("validator");
const sanitize = require("sanitize-html");


const createAppointment = async (req, res) => {
    try {
        const statusOfAppointment = ["pending", "confirmed", "completed", "cancelled"];
        const { status, date, doctorId, patientId } = req.body;

        if (!status || !date || !doctorId || !patientId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!validator.isISO8601(date)) {
            return res.status(400).json({
                message: "Invalid date format. Use ISO format like 2025-06-01 or 2025-06-01T14:00:00Z",
            });
        }

        if (!statusOfAppointment.includes(status)) {
            return res.status(400).json({
                message: "Invalid status. It must be one of: pending, confirmed, completed, cancelled",
            });
        }

        const newAppointment = new Appointment({
            status: sanitize(status),
            date: sanitize(date),
            doctorId: sanitize(doctorId),
            patientId: sanitize(patientId),
        });

        await newAppointment.save();

        return res.status(200).json({
            message: "Appointment created successfully",
            data: newAppointment,
        });
    } catch (error) {
        res.status(500).json({
            message: "Creating appointment failed",
            error: error.message,
        });
    }
};

const GetAllAppointment = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        let filter = {};

        // لو دكتور → رجّع مواعيده بس
        if (req.user.role === "doctor") {
            // دور على doctorId المرتبط بـ req.user.id
            const doctor = await Doctor.findOne({ userId: req.user.id });
            if (!doctor) {
                return res.status(404).json({ message: "Doctor profile not found" });
            }
            filter.doctorId = doctor._id;
        }

        const appointments = await Appointment.find(filter)
            .sort({ date: 1 }) // ترتيب حسب التاريخ تصاعدي
            .skip(skip)
            .limit(limit)
            .populate("patientId", "-password")
            .populate("doctorId", "-password");

        const totalAppointments = await Appointment.countDocuments(filter);

        res.status(200).json({
            message: "Appointments fetched successfully",
            data: appointments,
            pagination: {
                total: totalAppointments,
                page: page,
                pages: Math.ceil(totalAppointments / limit),
            },
        });
    } catch (error) {
        console.error("GetAllAppointment Error:", error);
        res.status(500).json({
            message: "Fetching appointments failed",
            error: error.message,
        });
    }
};


const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["pending", "confirmed", "completed", "cancelled"];

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        if (!validStatuses.includes(status.trim().toLowerCase())) {
            return res.status(400).json({
                message: "Invalid status. Must be one of: pending, confirmed, completed, cancelled",
            });
        }

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        appointment.status = status.trim().toLowerCase();
        await appointment.save();

        res.status(200).json({
            message: "Appointment status updated successfully",
            data: appointment,
        });
    } catch (error) {
        console.error("Update Appointment Status Error:", error);
        res.status(500).json({
            message: "Failed to update appointment status",
            error: error.message,
        });
    }
};
module.exports = {
    createAppointment,
    GetAllAppointment,
    updateAppointmentStatus,
}