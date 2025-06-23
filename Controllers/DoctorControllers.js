const Doctor = require("../models/Doctor");

const createDoctor = async (req , res) => {
    try {
        const { specialization , availabilitySchedule , bio } = req.body;

        if (!specialization || !availabilitySchedule || !bio) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newDoctor = new Doctor({
            specialization ,
            availabilitySchedule,
            bio,
            userId : req.user.id
        })

        await newDoctor.save();
        return res.status(200).json({ message: "Doctor Created Successfully" , data :  newDoctor });

    } catch (error) {
        res.status(500).json({ message: "Fetching users failed", error: error.message });
    }
}

const getAllDoctors = async (req , res) => {
    try {
        const page = req.query.page || 1;
        const limt = req.query.limit || 5;
        const skip = (page - 1) * limt;
        const TotalDoctors = await Doctor.countDocuments();
        const doctors = await Doctor.find().populate('userId' ,"-password");

        res.status(200).json({
            message: "Doctors fetched successfully",
            data: doctors,
            paination : {
                "Total Product" : TotalDoctors,
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

const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { specialization, availabilitySchedule, bio } = req.body;

        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // تحديث الحقول فقط إذا كانت موجودة في الطلب
        if (specialization !== undefined) doctor.specialization = specialization;
        if (availabilitySchedule !== undefined) doctor.availabilitySchedule = availabilitySchedule;
        if (bio !== undefined) doctor.bio = bio;

        await doctor.save();

        return res.status(200).json({
            message: "Doctor updated successfully",
            data: doctor,
        });
    } catch (error) {
        console.error("Update Doctor Error:", error);
        res
            .status(500)
            .json({ message: "Updating doctor failed", error: error.message });
    }
};

module.exports = {
    createDoctor,
    getAllDoctors,
    updateDoctor,
}