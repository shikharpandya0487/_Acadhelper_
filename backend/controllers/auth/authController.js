import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import dotenv from 'dotenv'
import sendEmail from "../../utils/mailhandler.js";
import User from "../../models/user/userModel.js";
dotenv.config();

// Function to generate a verification token
function generateVerificationToken(userId) {
    return jwt.sign({ userId }, process.env.TOKEN_SECRET, { expiresIn: "1h" });
}

export const loginController=async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Fill all fields!" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }

        const validPassword = await bcrypt.compare(password, user.password); // Compare password
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });

       
        user.token=token;

        return res.status(200).json({
            message: "Login successful",
            user,
            success: true,
            token, 
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const logoutController= async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0), // Expire the cookie immediately
        });

        return res.status(200).json({
            message: "Logout successful",
            success: true,
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const signupController=async (req, res) => {
    try {
        const { username, email, password, institute } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ error: "User with this username already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            institute, // Store institute if needed
        });

        const savedUser = await newUser.save();

        // Generate verification token
        const token = generateVerificationToken(savedUser._id);

        // Send verification email
        const r=await sendEmail(savedUser.email, token);
        console.log(r);

        return res.status(201).json({
            message: "User created successfully",
            success: true,
            user: savedUser,
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}