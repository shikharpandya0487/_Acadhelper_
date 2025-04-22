import express from 'express'
import authMiddleware from '../../middlewares/authMiddleware.js';
import { approveAllSubmissionAssignment, approveAllSubmissionChallenge, approveASubmission, bonusPoints, createSubmission, deductPoints, disapproveSubmission, editSubmission, getAllSubmissions, getSubmissionByAssignment, getSubmissionByAssignmentAndUser, getSubmissionByChallenge, getSubmissionByChallengeAndUser, getSubmissionByCourseAndUser, getSubmissionById, removeSubmission } from '../../controllers/submission/submissionController.js';
const router=express.Router();

router.post('/',authMiddleware,createSubmission)
router.get('/',authMiddleware,getSubmissionById)  
router.patch('/approve-a-submission',authMiddleware,approveASubmission)
router.patch('/approve-all-submission-assignment',authMiddleware,approveAllSubmissionAssignment)
router.patch('/approve-all-submission-challenge',authMiddleware,approveAllSubmissionChallenge)
router.patch('/edit-submission',authMiddleware,editSubmission)
router.patch('/deduct-points',authMiddleware,deductPoints)
router.patch('/bonus-points',authMiddleware,bonusPoints)
router.patch('/disapprove-submission',authMiddleware,disapproveSubmission)
router.get('/get-all-submissions',authMiddleware,getAllSubmissions)
router.get('/getsubmissionbyassignment',authMiddleware,getSubmissionByAssignment)
router.get('/getsubmissionbychallenge',authMiddleware,getSubmissionByChallenge)
router.get('/getsubmissionbyassignmentanduser',authMiddleware,getSubmissionByAssignmentAndUser)
router.get('/getsubmissionbychallengeanduser',authMiddleware,getSubmissionByChallengeAndUser)
router.get('/getsubmissionbycourseanduser',authMiddleware,getSubmissionByCourseAndUser)
router.patch('/remove-submission',authMiddleware,removeSubmission);
 
export default router;