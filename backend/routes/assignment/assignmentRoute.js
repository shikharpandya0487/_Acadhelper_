import express from "express";
import { deleteAssignment, editAssignment, getAssignmentByCourse, getAssignmentById, getPendingAssignmentOfUser, uploadAssignment } from "../../controllers/assignment/assignmentController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = express.Router();

// GET Assignments by Course ID
router.get('/getassignmentById',authMiddleware,getAssignmentById);
router.post('/upload-assignment',authMiddleware,uploadAssignment);
router.patch('/editassignment',authMiddleware,editAssignment);
router.delete('/delete-assignment',authMiddleware,deleteAssignment);
router.get('/getpendingassignments-of-user',authMiddleware,getPendingAssignmentOfUser);
router.get('/getassignmentsbycourse/:CourseId',authMiddleware,getAssignmentByCourse);


export default router;
