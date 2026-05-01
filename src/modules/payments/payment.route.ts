import { Router } from "express";
import { checkAuth } from "../../modules/middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { PaymentControllers } from "../payments/payments.controller";

const router = Router();

router.post(
  "/create-intent",
  checkAuth(Role.STUDENT, Role.ADMIN, Role.USER),
  PaymentControllers.createPaymentIntent
);

router.post(
  "/create-course-intent",
  checkAuth(Role.STUDENT, Role.ADMIN, Role.USER),
  PaymentControllers.createCoursePaymentIntent
);

router.post(
  "/confirm-enrollment",
  checkAuth(Role.STUDENT, Role.ADMIN, Role.USER),
  PaymentControllers.confirmCourseEnrollment
);

export const paymentsRoutes = router;
