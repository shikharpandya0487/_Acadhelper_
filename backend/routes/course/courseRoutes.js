import express from 'express'
import { createCourse, deleteCourse, getCourseById, getCourses, getEnrolledUsersCourse, getOneCourse, joinCourse, kickUser, makeAdmin, removeAdmin } from '../../controllers/course/courseController.js'
import authMiddleware from '../../middlewares/authMiddleware.js'
const router=express.Router()
 
router.get('/',authMiddleware,getCourseById)
router.get('/get-one',authMiddleware,getOneCourse);
router.delete('/',authMiddleware,deleteCourse)
router.post('/createcourse',authMiddleware,createCourse)
router.get('/get-enrolled',authMiddleware,getEnrolledUsersCourse)
router.get('/getCourses',authMiddleware,getCourses)
router.delete('/kick-user',authMiddleware,kickUser)
router.post('/makeadmin',authMiddleware,makeAdmin)
router.post('/removeadmin',authMiddleware,removeAdmin)
router.post('/',authMiddleware,joinCourse)

export default router 