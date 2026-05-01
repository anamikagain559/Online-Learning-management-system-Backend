import { Router } from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { Role } from '../user/user.interface';
import { EnrollmentControllers } from './enrollment.controller';

const router = Router();

router.post(
    '/',
    checkAuth(Role.USER, Role.ADMIN),
    EnrollmentControllers.sendEnrollmentRequest
);

router.get(
    '/course/:courseId',
    checkAuth(Role.USER, Role.ADMIN),
    EnrollmentControllers.getEnrollmentsForCourse
);

router.patch(
    '/:enrollmentId/respond',
    checkAuth(Role.USER, Role.ADMIN),
    EnrollmentControllers.respondToEnrollment
);

router.get(
    '/students/:courseId',
    EnrollmentControllers.getCourseStudents
);

router.get(
    '/all',
    checkAuth(Role.ADMIN),
    EnrollmentControllers.getAllEnrollments
);

router.delete(
    '/:enrollmentId',
    checkAuth(Role.ADMIN),
    EnrollmentControllers.deleteEnrollment
);

export const EnrollmentRoutes = router;
