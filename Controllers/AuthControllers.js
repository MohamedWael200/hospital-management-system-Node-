const User = require("../models/User");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Otp = require("../models/Otp");
const sanitize = require("sanitize-html");
const sendEmail = require("../utils/SendEmail");

const register = async (req , res) => {
    try {
        const {name , email , password , role} = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashPassword,
            role,
            profileImage: req.file ? req.file.path : "", // ← ده هيخزن مسار الصورة
            isVerified: false,
        });

        await newUser.save();

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        await new Otp({ email, code: otpCode }).save();

        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
            <h2 style="color: #2c3e50; text-align: center; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
                Hospital Management System - Account Verification
            </h2>
            
            <p style="font-size: 16px; color: #333;">
                Hello <strong>${sanitize(name)}</strong>,
            </p>

            <p style="font-size: 15px; color: #555; margin-top: 10px;">
                Your account has been created successfully with the following login details:
            </p>

            <ul style="list-style: none; padding: 0; font-size: 15px; color: #333; margin-top: 15px;">
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Password:</strong> ${password}</li>
            </ul>

            <p style="font-size: 15px; color: #555; margin-top: 20px;">
                To activate your account, please use the following verification code:
            </p>

            <div style="background-color: #ffffff; border-radius: 6px; padding: 15px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; color: #2c3e50; border: 1px dashed #3498db;">
                ${otpCode}
            </div>

            <p style="font-size: 14px; color: #777;">
                This code will expire in 10 minutes. Please do not share it with anyone.
            </p>

            <div style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999;">
                <p>If you didn't request this account, please ignore this email.</p>
                <p>© ${new Date().getFullYear()} Hospital Management System. All rights reserved.</p>
            </div>
        </div>
        `;

        await sendEmail(email, "Your Verification Code", "", html);

        return res.status(200).json({
            message: "User registered successfully. Please verify your email.",
            data: newUser,
        });

    }  catch (error) {
        console.log("Register Error:", error);
        res
            .status(500)
            .json({ message: "Registration failed", error: error.message });
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(500).json({ message: "No email Such As This Email" });
        }

        if (!user.isVerified) {
            return res
                .status(403)
                .json({ message: "Account not verified. Please verify via OTP." });
        }

        const mathPassword = await bcrypt.compare(password, user.password);

        if (!mathPassword) {
            return res.status(400).json({ message: "Password is incorrect" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            {}
        );

        return res
            .status(200)
            .json({ message: "Login successful", token, data: user });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
};

const verifyToken = async (req, res) => {
    try {
        const { email, code } = req.body;

        const otpRecord = await Otp.findOne({ email, code });

        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // ✅ تفعيل الحساب
        await User.updateOne({ email }, { $set: { isVerified: true } });
        await Otp.deleteMany({ email }); // نحذف الـ OTP بعد التفعيل

        return res.status(200).json({ message: "Email verified successfully" });
    } catch (err) {
        res
            .status(500)
            .json({ message: "Registration failed", error: err.message });
    }
};


const updatePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        // تحقق من الإدخالات
        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // تحقق من صحة الإيميل
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // تحقق من الباسورد القديم
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        // تشفير الباسورد الجديد وتحديثه
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Update Password Error:", error);
        res.status(500).json({ message: "Password update failed", error: error.message });
    }
};


module.exports = {
    register,
    login,
    verifyToken,
    updatePassword,
}