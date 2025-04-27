import express from 'express'
import authMiddleware from '../../middlewares/authMiddleware.js';
import { addTask, deleteTask, getTaskOfUser, updateTask } from '../../controllers/task/taskController.js';
const router=express.Router();

router.get('/',authMiddleware,getTaskOfUser);
router.post('/',authMiddleware,addTask)
router.patch('/',authMiddleware,updateTask)
router.delete('/',authMiddleware,deleteTask)

export default router
