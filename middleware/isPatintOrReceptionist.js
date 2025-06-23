const isPatintOrReceptionist = (req, res, next) => {
    const allowedRoles = ["receptionist", "patient"];
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
            message: "Access denied. Only receptionist or patient allowed.",
        });
    }
    next();
};

module.exports = isPatintOrReceptionist;
