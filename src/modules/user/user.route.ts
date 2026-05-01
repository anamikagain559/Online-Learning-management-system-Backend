import { Router } from "express";
import { checkAuth } from "../../modules/middlewares/checkAuth";
import { validateRequest } from "../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { Role } from "./user.interface";

const router = Router();

/* ================= AUTH & PROFILE ================= */

// Register
router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);

// Logged-in user profile
router.get(
  "/me",
  checkAuth(Role.ADMIN, Role.STUDENT, Role.INSTRUCTOR, Role.USER),
  UserControllers.getMe
);

// Update profile
router.patch(
  "/update-my-profile",
  checkAuth(Role.ADMIN, Role.STUDENT, Role.INSTRUCTOR, Role.USER),
  validateRequest(updateUserZodSchema),
  UserControllers.updateMyProfile
);

/* ================= ADMIN ROUTES ================= */

router.get(
  "/instructors",
  UserControllers.getInstructors
);

// Get all users (ADMIN only)
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.STUDENT, Role.INSTRUCTOR, Role.USER),
  UserControllers.getAllUsers
);

// Block / Unblock user (ADMIN only)
router.patch(
  "/block-unblock/:id",
  checkAuth(Role.ADMIN),
  UserControllers.blockOrUnblockUser
);

// Update any user by ID
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.STUDENT, Role.INSTRUCTOR, Role.USER),
  validateRequest(updateUserZodSchema),
  UserControllers.updateUser
);

// Get user by ID
router.get(
  "/:id", 
  checkAuth(Role.ADMIN, Role.STUDENT, Role.INSTRUCTOR, Role.USER), 
  UserControllers.getUserById
);

export const UserRoutes = router;
