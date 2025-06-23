const isARD = (req, res, next) => {
    const allowedRoles = ["receptionist", "admin", "doctor"];
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
            message: "Access denied. Only receptionist, admin, or doctor allowed.",
        });
    }
    next();
};

module.exports = isARD;
