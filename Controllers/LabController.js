const Lap = require("../models/LabReport");
const User = require("../models/User");
const Patient = require("../models/Patient");
const createLapReport = async (req, res) => {
    try {
        const { patientId, testName } = req.body;

        if (!patientId || !testName || !req.file) {
            return res.status(400).json({ message: "Patient, test name and file are required" });
        }

        const filePath = req.file.path.replace(/\\/g, "/"); // لتفادي مشكلة المسارات في Windows

        const newLapReport = new Lap({
            patientId,
            testName,
            resultFile: filePath,
            uploadedBy: req.user.id,
            date: Date.now(),
        });

        await newLapReport.save();

        return res.status(200).json({
            message: "Lab Report uploaded successfully",
            data: {
                ...newLapReport._doc,
                resultFile: `http://localhost:3000/${filePath}`,
            },
        });
    } catch (error) {
        console.error("Create Lab Report Error:", error);
        res.status(500).json({
            message: "Creating lab report failed",
            error: error.message,
        });
    }
};

const getLabReportsByPatientName = async (req, res) => {
    try {
        const { name } = req.params;

        // 1. دور على المستخدم اللي اسمه مطابق و Role = patient
        const user = await User.findOne({ name: name, role: "patient" });
        if (!user) {
            return res.status(404).json({ message: "No user found with this name" });
        }

        // 2. دور على ملف المريض المرتبط بالـ user
        const patient = await Patient.findOne({ userId: user._id });
        if (!patient) {
            return res.status(404).json({ message: "No patient record found for this user" });
        }

        // 3. دور على تقارير المعمل الخاصة بالمريض
        const reports = await Lap.find({ patientId: patient.userId });

        // 4. تأكد فيه تقارير
        if (!reports.length) {
            return res.status(404).json({ message: "No lab reports found for this patient" });
        }

        // 5. رجع البيانات مع تعديل المسارات
        const baseURL = "http://localhost:3000";
        const updatedReports = reports.map(report => ({
            ...report._doc,
            resultFile: `${baseURL}/${report.resultFile.replace(/\\/g, "/")}`,
        }));

        return res.status(200).json({
            message: `Lab reports for patient "${name}" fetched successfully.`,
            data: updatedReports,
        });

    } catch (error) {
        console.error("Get Lab Reports By Name Error:", error);
        res.status(500).json({
            message: "Failed to fetch lab reports by name",
            error: error.message,
        });
    }
};
module.exports = {
    createLapReport,
    getLabReportsByPatientName
};
