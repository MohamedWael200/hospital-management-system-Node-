const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/labs/");
    },
    filename: function (req, file, cb) {
        const uniqueName = `lab-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    // نسمح فقط بـ PDF أو صور
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF, JPEG, or PNG files are allowed"));
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
