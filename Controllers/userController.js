const User = require("../models/User")

const allUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const filter = {};

        if (req.query.role) {
            filter.role = req.query.role;
        }

        if (req.query.status) {
            filter.status = req.query.status;
        }

        const countUser = await User.countDocuments(filter);
        const users = await User.find(filter).skip(skip).limit(limit);

        if (!users.length) {
            return res.json({ message: "There is no user matching the criteria..." });
        }

        res.status(200).json({
            message: "Users fetched successfully",
            data: users,
            pagination: {
                page,
                limit,
                totalUsers: countUser,
                totalPages: Math.ceil(countUser / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Fetching users failed", error: error.message });
    }
};

const deleteUser = async (req , res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id)
        if(!user) {
            res.status(201).json({message : "There is No User Like This ID"})
        }
        const deleteUser = await User.findByIdAndDelete(id);
        res.status(200).json({message : "User Deleted Sucssfully" , data : deleteUser})
    } catch (error) {
        res.status(500).json({ message: "Fetching users failed", error: error.message });
    }
}
module.exports = {
    allUsers,
    deleteUser
}