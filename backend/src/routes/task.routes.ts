import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { updateTask, deleteTask, moveTask } from '../controllers/task.controller';

const router = Router();

router.put('/:id', authenticate, updateTask);
router.delete('/:id', authenticate, deleteTask);
router.put('/:id/move', authenticate, moveTask);

export default router;
