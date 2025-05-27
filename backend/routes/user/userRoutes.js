import express from 'express'
import authMiddleware from '../../middlewares/authMiddleware.js';
import { getAllEventsOfUser, getAllUsers, getAllUsersAfterFilter, getUserById, getUserByUsername, updateUsername } from '../../controllers/user/userController.js';
const router=express.Router();

router.get("/filter",authMiddleware,getAllUsersAfterFilter)
router.get("/find_user",authMiddleware,getUserByUsername)
router.get('/getAllUsers',authMiddleware,getAllUsers)
router.get('/get-events',authMiddleware,getAllEventsOfUser)
router.get('/',authMiddleware,getUserById)

router.patch('/',authMiddleware,updateUsername)

export default router 