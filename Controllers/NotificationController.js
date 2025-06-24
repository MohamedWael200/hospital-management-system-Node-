const Notification = require("../models/Notification");

const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ receiverId: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Notifications fetched successfully",
            data: notifications,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch notifications",
            error: error.message,
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, receiverId: req.user.id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json({
            message: "Notification marked as read",
            data: notification,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to mark notification as read",
            error: error.message,
        });
    }
};


module.exports = {
    getMyNotifications,
    markAsRead
}