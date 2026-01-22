import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getBoard, getBoardColumns } from '../controllers/board.controller';

const router = Router();

router.get('/:id', authenticate, getBoard);
router.get('/:id/columns', authenticate, getBoardColumns);

export default router;
