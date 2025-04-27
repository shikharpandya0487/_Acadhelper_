import express from 'express';
import authMiddleware from '../../middlewares/authMiddleware.js';
import { 
    addMemberToTeam, addTeamTask, createTeam, deleteTeam, deleteTeamTask, editTeam, 
    getAllTeamMembers, getTeamDetails, leaveTeam, teamEdit, teamInvitation, teamTaskComplete,  
} from '../../controllers/team/teamController.js';

const router = express.Router();

router.get('/', authMiddleware, getAllTeamMembers);
router.post('/', authMiddleware, createTeam);
router.post('/invitation', authMiddleware, teamInvitation);  
router.post('/tasks', authMiddleware, addTeamTask);
router.put('/tasks', authMiddleware, teamTaskComplete);
router.delete('/tasks', authMiddleware, deleteTeamTask);

router.get('/info/:teamId', authMiddleware, getTeamDetails);
router.patch('/edit-team/:teamId', authMiddleware, editTeam);
router.put('/edit-team/:teamId', authMiddleware, teamEdit);
router.post('/add-member/:teamId', authMiddleware, addMemberToTeam);
router.delete('/leave/:teamId', authMiddleware, leaveTeam);
router.delete('/delete/:teamId', authMiddleware, deleteTeam);

export default router;
 