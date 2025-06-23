const isReceptionist = (req , res , next) => {
    if(req.user.role != "receptionist") {
        return res.status(403).json({ message: "Access denied. receptionist only." });

    }
    next();
};
module.exports = isReceptionist