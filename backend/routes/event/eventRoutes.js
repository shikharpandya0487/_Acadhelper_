import express from 'express'
import { createEvent, deleteEvent, getAllEvents, updateEvent } from '../../controllers/event/eventController.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
const router=express.Router();

router.get("/get-all-event",authMiddleware,getAllEvents)
router.post('/create-event',authMiddleware,createEvent)
router.patch('/update-event',authMiddleware,updateEvent)
router.delete('/delete-event',authMiddleware,deleteEvent)

export default router;