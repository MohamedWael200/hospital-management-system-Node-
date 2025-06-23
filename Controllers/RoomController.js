const Room = require("../models/Room");

const GetAllRoom = async (req , res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const room = await Room.find();
        const TotalRoom = await Room.countDocuments();

        if (!room) {
            res.status(201).json({message : "No Room Yet"})
        }

        res.status(200).json({
            message: "room fetched successfully",
            data: room,
            paination : {
                "Total Product" : TotalRoom,
                "Page" : page
            }
        });

    }  catch (err) {
        console.error("Error in allProducts:", err.message);
        return res
            .status(500)
            .json({ message: "Failed to fetch products", error: err.message });
    }
}

const createRoom = async (req, res) => {
    try {
        const statusOfRoom = ["available", "occupied"];
        const typeOfRoom = ["ICU", "Normal"];
        const { roomNumber, type, status, currentPatientId } = req.body;

        if (!roomNumber || !type || !status) {
            return res.status(400).json({ message: "roomNumber, type, and status are required" });
        }

        if (!statusOfRoom.includes(status)) {
            return res.status(400).json({
                message: "Invalid status. It must be one of: available, occupied",
            });
        }

        if (!typeOfRoom.includes(type)) {
            return res.status(400).json({
                message: "Invalid type. It must be one of: ICU, Normal",
            });
        }

        const roomData = {
            roomNumber,
            type,
            status,
        };

        // لو تم إرسال مريض، اضيفه (خيارياً)
        if (currentPatientId && status === "occupied") {
            roomData.currentPatientId = currentPatientId;
        }

        const newRoom = new Room(roomData);
        await newRoom.save();

        return res.status(200).json({ message: "Room created successfully", data: newRoom });
    } catch (err) {
        console.error("Error in createRoom:", err.message);
        return res.status(500).json({ message: "Failed to create room", error: err.message });
    }
};


const assignPatientToRoom = async (req, res) => {
    try {
        const { roomNumber, patientId } = req.body;

        if (!roomNumber || !patientId) {
            return res.status(400).json({ message: "roomNumber and patientId are required" });
        }

        const room = await Room.findOne({ roomNumber });

        if (!room) return res.status(404).json({ message: "Room not found with this number" });

        if (room.status === "occupied") {
            return res.status(400).json({ message: "Room is already occupied" });
        }

        room.currentPatientId = patientId;
        room.status = "occupied";
        await room.save();

        res.status(200).json({ message: "Patient assigned to room successfully", data: room });
    } catch (error) {
        res.status(500).json({ message: "Failed to assign patient to room", error: error.message });
    }
};


module.exports = {
    GetAllRoom,
    assignPatientToRoom,
    createRoom,
}