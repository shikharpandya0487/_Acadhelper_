import User from "../../models/user/userModel.js";
import jwt  from "jsonwebtoken"
import dotenv from 'dotenv'
dotenv.config();


export const verifyEmail=async (req, res) => {
    try {
        
        const { token } = req.query;
        if (!token) {
            return res.status(400).json({ error: "Token is missing" });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(decoded.userId);

        console.log("User is ",user.username)

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        // Mark user as verified
        user.isEmailVerified = true;
        await user.save();

        return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        return res.status(400).json({ error: "Invalid or expired token" });
    }
}