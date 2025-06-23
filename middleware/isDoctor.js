const isDoctor = (req , res , next) => {
    if(req.user.role != "doctor") {
        return res.status(403).json({ message: "Access denied. doctor only." });

    }
    next();
};
module.exports = isDoctor