import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();

export const connectDb = async () => {
    try {
       
        if (mongoose.connection.readyState === 1) {
            console.log("MongoDB connection already exists");
            return;
        }

        const response=await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected successfully",mongoose.connection.readyState);
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
    }
};


