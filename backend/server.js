import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./db/connectDb.js";
import userRoutes from './routes/user/userRoutes.js'
import verifyRoutes from './routes/verify/verifyRoutes.js'
import authRoutes from './routes/auth/authRoutes.js'
import eventRoutes from './routes/event/eventRoutes.js'
import assignmentRoutes from './routes/assignment/assignmentRoute.js'
import submissionRoutes from './routes/submission/submissionRoutes.js'
import notificationRoutes from './routes/notification/notificationRoutes.js'
import taskRoutes from './routes/task/taskRoutes.js'
import teamRoutes from './routes/team/teamRoutes.js'
import challengeRoutes from './routes/challenge/challengeRoutes.js'
import courseRoutes from './routes/course/courseRoutes.js'

dotenv.config();
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
  }));
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use('/api/user',userRoutes);
app.use('/api/verify',verifyRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/event',eventRoutes);
app.use('/api/assignment',assignmentRoutes);
app.use('/api/submission',submissionRoutes);
app.use('/api/notification',notificationRoutes);
app.use('/api/challenge',challengeRoutes);
app.use("/api/task",taskRoutes);
app.use('/api/team',teamRoutes);
app.use('/api/course',courseRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!", error: err.message });
});

await connectDb();
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}/`);
});
