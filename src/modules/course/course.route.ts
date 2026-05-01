import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { CourseControllers } from "./course.controller";

const router = Router();

router.post(
  "/",
  checkAuth(Role.INSTRUCTOR, Role.ADMIN),
  CourseControllers.createCourse
);
router.get(
  "/match",
  checkAuth(Role.INSTRUCTOR, Role.ADMIN),
  CourseControllers.matchCourses
);
router.get("/", CourseControllers.getAllCourses);

router.get(
  "/my-courses",
  checkAuth(Role.INSTRUCTOR, Role.ADMIN),
  CourseControllers.getMyCourses
);
router.get("/public", CourseControllers.getPublicCourses);
router.get("/:id", CourseControllers.getSingleCourse);

router.patch(
  "/:id",
  checkAuth(Role.INSTRUCTOR, Role.ADMIN),
  CourseControllers.updateCourse
);

router.delete(
  "/:id",
  checkAuth(Role.INSTRUCTOR, Role.ADMIN),
  CourseControllers.deleteCourse
);

export const CourseRoutes = router;
