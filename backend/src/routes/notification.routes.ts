import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { 
  getNotifications, 
  markAsRead, 
  acceptInvitation, 
  declineInvitation 
} from '../controllers/notification.controller';

const router = Router();

router.get('/', authenticate, getNotifications);
router.put('/:id/read', authenticate, markAsRead);
router.post('/:id/accept', authenticate, acceptInvitation);
router.post('/:id/decline', authenticate, declineInvitation);

export default router;
