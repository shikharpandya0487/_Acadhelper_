import User from "../../models/user/userModel.js";

export const getAllUsersAfterFilter=async (req, res) => {
    try {
        const { filter } = req.query;
       
        // console.log(filter)
        const users = await User.find({ institute: filter });

        return res.status(200).json({ 
            success: true, 
            message: "Users found successfully", 
            users 
        });
    } catch (error) {
        console.error("Error while fetching users", error);
        return res.status(500).json({ 
            message: "Error while fetching users", 
            error: error.message 
        });
    }
}

export const getUserByUsername= async (req, res) => {
    try {
   

        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: "User with given username not found" });
        }

        return res.status(200).json({ success: true, message: "User found successfully", user });
    } catch (error) {
        console.error("Error while fetching the user by username", error);
        return res.status(500).json({ message: "Error while fetching the user by username", error: error.message });
    }
}

export const getAllEventsOfUser= async (req, res) => {
    try {

        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        } 

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const events = user.events;
        console.log("User Events:", events);

        return res.status(200).json({ message: "Successfully fetched the events", events });
    } catch (error) {
        console.error("Error while fetching events of user", error);
        return res.status(500).json({ message: "Error while fetching the events of the user", error: error.message });
    }
}

export const updateUsername=async (req, res) => {
    try {

        const { username, userId } = req.body;
        if (!username || !userId) {
            return res.status(400).json({ message: "Username and userId are required" });
        }

        const user = await User.findByIdAndUpdate(userId, { username }, { new: true });

        if (!user) {
            return res.status(500).json({ message: "Error while updating the username" });
        }

        return res.status(200).json({ message: "Successfully updated the user", user });
    } catch (error) {
        console.error("Error while updating the username:", error);
        return res.status(500).json({
            message: "Error while updating the username",
            error: error.message,
        });
    }
}

export const getUserById=async (req, res) => {
    try {
     
        
        const { userId } = req.query;
        console.log("User ID:", userId);

        if (!userId) {
            return res.status(404).json({
                success: false,
                message: "Id not defined",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user.",
            error: error.message,
        });
    }
}

export const getAllUsers=async (req, res) => {
    try {
                
        const users = await User.find();

        return res.status(200).json({ 
            success: true, 
            message: "Users found successfully", 
            users 
        });

    } catch (error) {
        console.error("Error while fetching users", error);
        return res.status(500).json({ 
            message: "Error while fetching users", 
            error: error.message 
        });
    }
}

