"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../modules/middlewares/checkAuth");
const validateRequest_1 = require("../middlewares/validateRequest");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const user_interface_1 = require("./user.interface");
const router = (0, express_1.Router)();
/* ================= AUTH & PROFILE ================= */
// Register
router.post("/register", (0, validateRequest_1.validateRequest)(user_validation_1.createUserZodSchema), user_controller_1.UserControllers.createUser);
// Logged-in user profile
router.get("/me", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.STUDENT, user_interface_1.Role.INSTRUCTOR, user_interface_1.Role.USER), user_controller_1.UserControllers.getMe);
// Update profile
router.patch("/update-my-profile", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.STUDENT, user_interface_1.Role.INSTRUCTOR, user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(user_validation_1.updateUserZodSchema), user_controller_1.UserControllers.updateMyProfile);
/* ================= ADMIN ROUTES ================= */
router.get("/instructors", user_controller_1.UserControllers.getInstructors);
// Get all users (ADMIN only)
router.get("/all-users", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.STUDENT, user_interface_1.Role.INSTRUCTOR, user_interface_1.Role.USER), user_controller_1.UserControllers.getAllUsers);
// Block / Unblock user (ADMIN only)
router.patch("/block-unblock/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), user_controller_1.UserControllers.blockOrUnblockUser);
// Update any user by ID
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.STUDENT, user_interface_1.Role.INSTRUCTOR, user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(user_validation_1.updateUserZodSchema), user_controller_1.UserControllers.updateUser);
// Get user by ID
router.get("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.STUDENT, user_interface_1.Role.INSTRUCTOR, user_interface_1.Role.USER), user_controller_1.UserControllers.getUserById);
exports.UserRoutes = router;
