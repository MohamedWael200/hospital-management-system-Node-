const express = require("express");
const router = express.Router();
const NotificationsController =  require("../Controllers/NotificationController");
const auth = require("../middleware/auth");
const isDoctor = require("../middleware/isDoctor");

router.get("/notifications", auth , NotificationsController.getMyNotifications)
router.patch("/notifications/:id/read", auth, NotificationsController.markAsRead);

module.exports = router;