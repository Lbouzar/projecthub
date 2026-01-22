import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getColumnTasks, createTask } from '../controllers/column.controller';

const router = Router();

router.get('/:id/tasks', authenticate, getColumnTasks);
router.post('/:id/tasks', authenticate, createTask);

export default router;
