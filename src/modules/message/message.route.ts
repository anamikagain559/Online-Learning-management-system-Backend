import express from 'express';
import { MessageController } from './message.controller';
import { checkAuth } from '../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const router = express.Router();

router.get(
    '/trip/:tripId',
    checkAuth(Role.USER, Role.ADMIN),
    MessageController.getMessagesByTripId
);

router.get(
    '/direct/:user1/:user2',
    checkAuth(Role.USER, Role.ADMIN),
    MessageController.getDirectMessages
);

export const MessageRoutes = router;
