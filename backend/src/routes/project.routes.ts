import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { 
  getProjects, 
  createProject, 
  getProject, 
  getProjectBoards,
  getProjectMembers,
  inviteMember,
  removeMember
} from '../controllers/project.controller';

const router = Router();

router.get('/', authenticate, getProjects);
router.post('/', authenticate, createProject);
router.get('/:id/boards', authenticate, getProjectBoards);
router.get('/:id/members', authenticate, getProjectMembers);
router.post('/:id/members', authenticate, inviteMember);
router.delete('/:id/members/:memberId', authenticate, removeMember);
router.get('/:id', authenticate, getProject);

export default router;
