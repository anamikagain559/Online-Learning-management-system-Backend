import { Router } from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { Role } from '../user/user.interface';
import { BuddyRequestControllers } from './buddyRequest.controller';

const router = Router();

router.post(
    '/',
    checkAuth(Role.USER, Role.ADMIN),
    BuddyRequestControllers.sendBuddyRequest
);

router.get(
    '/trip/:tripId',
    checkAuth(Role.USER, Role.ADMIN),
    BuddyRequestControllers.getRequestsForTrip
);

router.patch(
    '/:requestId/respond',
    checkAuth(Role.USER, Role.ADMIN),
    BuddyRequestControllers.respondToRequest
);

router.get(
    '/buddies/:tripId',
    BuddyRequestControllers.getPlanBuddies
);

router.get(
    '/all',
    checkAuth(Role.ADMIN),
    BuddyRequestControllers.getAllBuddyRequests
);

router.delete(
    '/:requestId',
    checkAuth(Role.ADMIN),
    BuddyRequestControllers.deleteBuddyRequest
);

export const BuddyRequestRoutes = router;
