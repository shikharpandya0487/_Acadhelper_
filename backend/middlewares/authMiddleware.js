import jwt from "jsonwebtoken";  
import dotenv from "dotenv";
import User from '../models/user/userModel.js'


dotenv.config();

const authMiddleware = async (req, res, next) => {
    try {
        let token;

        // Check if authorization header is present
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        // console.log(req.headers.authorization.split(" ")[1]);

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        // console.log(token) 

        // Verify the token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        // console.log(user);

        if (!user) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        // Attach user object to request
        req.user = user;
        // console.log(req.user);
        next();

    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
};


export default authMiddleware

