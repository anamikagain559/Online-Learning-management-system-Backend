import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Course } from "./course.model";
import { ICourse } from "./course.interface";

const createCourse = async (
  payload: ICourse,
  decodedToken: JwtPayload
) => {
  return await Course.create({
    ...payload,
    user: decodedToken.userId,
    isActive: true,
  });
};

const getAllCourses = async () => {
  return await Course.find({
    $or: [{ isActive: true }, { isActive: { $exists: false } }],
  })
    .populate("user", "name email role")
    .populate("categoryId")
    .populate("instructorId", "name email picture")
    .sort({ createdAt: -1 });
};

const getMyCourses = async (decodedToken: JwtPayload) => {
  return await Course.find({ user: decodedToken.userId })
    .populate("categoryId")
    .populate("instructorId", "name email picture");
};

const getSingleCourse = async (id: string) => {
  const course = await Course.findById(id)
    .populate("user", "name email")
    .populate("categoryId")
    .populate("instructorId", "name email picture");

  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found");
  }

  return course;
};

const updateCourse = async (
  id: string,
  payload: Partial<ICourse>,
  decodedToken: JwtPayload
) => {
  const course = await Course.findById(id);

  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found");
  }

  // Admins can update any course, instructors can update their own
  if (decodedToken.role !== 'ADMIN' && course.user.toString() !== decodedToken.userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can update only your own course"
    );
  }

  const updated = await Course.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true }
  );

  return updated;
};

const deleteCourse = async (
  id: string,
  decodedToken: JwtPayload & { userId: string; role: string }
) => {
  const course = await Course.findById(id);

  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found");
  }

  if (decodedToken.role !== "ADMIN" && course.user.toString() !== decodedToken.userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can delete only your own course"
    );
  }

  await Course.findByIdAndDelete(id);
  return null;
};

const matchCourses = async (query: any, decoded: JwtPayload) => {
  const { category, categoryId, startDate, endDate, courseLevel, minPrice, maxPrice } = query;

  const baseFilter: any = {
    $or: [{ isActive: true }, { isActive: { $exists: false } }],
  };

  const andConditions: any[] = [baseFilter];

  if (category && category.trim() !== "") {
    andConditions.push({
      category: { $regex: category.trim(), $options: "i" },
    });
  }

  if (categoryId && categoryId !== "") {
      andConditions.push({ categoryId });
  }

  if (startDate && endDate && startDate !== "" && endDate !== "") {
    andConditions.push({
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) },
    });
  }

  if (courseLevel && courseLevel !== "" && courseLevel !== "ALL") {
    andConditions.push({
      courseLevel: courseLevel.toUpperCase(),
    });
  }

  if (minPrice && minPrice !== "") {
    andConditions.push({
      price: { $gte: Number(minPrice) },
    });
  }
  if (maxPrice && maxPrice !== "") {
    andConditions.push({
      price: { $lte: Number(maxPrice) },
    });
  }

  const finalQuery = andConditions.length > 1 ? { $and: andConditions } : baseFilter;

  return Course.find(finalQuery)
    .populate("user", "name email picture bio")
    .populate("categoryId")
    .populate("instructorId", "name email picture")
    .sort({ startDate: 1 });
};

export const CourseServices = {
  createCourse,
  getAllCourses,
  getMyCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  matchCourses,
};
