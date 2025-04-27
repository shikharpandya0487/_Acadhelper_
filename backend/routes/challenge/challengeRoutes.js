import express from 'express'
import authMiddleware from '../../middlewares/authMiddleware.js'
import { addChallenge, challengeByCourse, challengeByFreq, deleteChallenge, editChallenge, getAllChallengeOfCourse, getChallengeById, updateChallenge, uploadChallenge } from '../../controllers/challenge/challengeController.js';
const router=express.Router();

router.post('/addchallenge',authMiddleware,addChallenge)
router.delete('/deletechallenge',authMiddleware,deleteChallenge);
router.post('/editchallenge',authMiddleware,editChallenge)
router.get('/get-all-challenges',authMiddleware,getAllChallengeOfCourse)
router.get('/getchallengebycourse',authMiddleware,challengeByCourse);
router.post('/get-challengeByFreq',authMiddleware,challengeByFreq)
router.get("/getchallengeById",authMiddleware,getChallengeById)
router.post('/uploadchallenge',authMiddleware,uploadChallenge)
router.patch('/updatechallenge',authMiddleware,updateChallenge)


export default router;