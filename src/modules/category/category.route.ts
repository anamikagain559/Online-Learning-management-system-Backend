import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { CategoryControllers } from "./category.controller";

const router = Router();

router.post(
  "/",
  checkAuth(Role.ADMIN),
  CategoryControllers.createCategory
);

router.get(
  "/",
  CategoryControllers.getAllCategories
);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  CategoryControllers.updateCategory
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN),
  CategoryControllers.deleteCategory
);

export const CategoryRoutes = router;
