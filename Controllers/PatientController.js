const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

const createPatient = async (req , res) => {
    try {
        const { medicalHistory , allergies , bloodType , userId} = req.body;

        if (!medicalHistory || !allergies || !bloodType) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newPatient = new Patient({
            medicalHistory ,
            allergies,
            bloodType,
            userId,
        })

        await newPatient.save();
        return res.status(200).json({ message: "Patient file created successfully" , data :  newPatient });

    } catch (error) {
        res.status(500).json({ message: "Fetching users failed", error: error.message });
    }
}


const getAllPatients = async (req , res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;
        const TotalPatients = await Patient.countDocuments();
        const patients = await Patient.find().populate('userId' ,"-password");

        res.status(200).json({
            message: "Patients fetched successfully",
            data: patients,
            paination : {
                "Total Product" : TotalPatients,
                "Page" : page
            }
        });

    } catch (err) {
        console.error("Error in allProducts:", err.message);
        return res
            .status(500)
            .json({ message: "Failed to fetch products", error: err.message });
    }
}


const getOnePatients = async (req , res) => {
    try {
        const id = req.params.id;
        const patients = await Patient.findById(id).populate('userId' ,"-password");

        if (!patients) {
            res.status(201).json({
                message: "There is no patient with this ID",
                data: patients,
            });
        }
        res.status(200).json({
            message: "Patients fetched successfully",
            data: patients,
        });

    } catch (err) {
        console.error("Error in allProducts:", err.message);
        return res
            .status(500)
            .json({ message: "Failed to fetch products", error: err.message });
    }
}

const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { medicalHistory, allergies, bloodType } = req.body;

        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // تحديث فقط الحقول اللي موجودة
        if (medicalHistory !== undefined) patient.medicalHistory = medicalHistory;
        if (allergies !== undefined) patient.allergies = allergies;
        if (bloodType !== undefined) patient.bloodType = bloodType;

        await patient.save();

        return res.status(200).json({
            message: "Patient updated successfully",
            data: patient,
        });
    } catch (error) {
        console.error("Update Patient Error:", error);
        res.status(500).json({
            message: "Updating patient failed",
            error: error.message,
        });
    }
};

module.exports = {
    createPatient,
    getAllPatients,
    getOnePatients,
    updatePatient,
}