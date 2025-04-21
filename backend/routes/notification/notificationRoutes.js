import express from 'express'
import authMiddleware from '../../middlewares/authMiddleware.js';
import { deleteNotification } from '../../controllers/notification/notificationController.js';
const router=express.Router();

router.delete('/',authMiddleware,deleteNotification)

export default router