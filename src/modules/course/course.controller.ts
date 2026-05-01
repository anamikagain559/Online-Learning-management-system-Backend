import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CourseServices } from "./course.service";
import { Course } from "./course.model";

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseServices.createCourse(
    req.body,
    req.user as JwtPayload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Course created successfully",
    data: result,
  });
});

const getAllCourses = catchAsync(async (_req, res) => {
  const result = await CourseServices.getAllCourses();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Courses retrieved successfully",
    data: result,
  });
});

const getMyCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getMyCourses(
    req.user as JwtPayload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My courses retrieved successfully",
    data: result,
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.getSingleCourse(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Course retrieved successfully",
    data: result,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.updateCourse(
    req.params.id,
    req.body,
    req.user as JwtPayload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Course updated successfully",
    data: result,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  await CourseServices.deleteCourse(
    req.params.id,
    req.user as JwtPayload & { userId: string; role: string }
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Course deleted successfully",
    data: null,
  });
});

const matchCourses = catchAsync(async (req: Request, res: Response) => {
  const query = {
    category: req.query.category?.toString(),
    startDate: req.query.startDate?.toString(),
    endDate: req.query.endDate?.toString(),
    courseLevel: req.query.courseLevel?.toString(),
    minPrice: req.query.minPrice?.toString(),
    maxPrice: req.query.maxPrice?.toString(),
  };

  const result = await CourseServices.matchCourses(
    query,
    req.user as JwtPayload
  );

  return sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Matching courses retrieved successfully",
    data: result,
  });
});

const getPublicCourses = catchAsync(async (req: Request, res: Response) => {
  const { category, startDate, endDate, courseLevel } = req.query;

  const query: any = { isPublic: true };

  if (category) query["category"] = category;
  if (courseLevel) query["courseLevel"] = courseLevel;

  if (startDate && endDate) {
    query.startDate = { $gte: new Date(startDate as string) };
    query.endDate = { $lte: new Date(endDate as string) };
  }

  const publicCourses = await Course.find(query)
    .populate("user", "name email")
    .sort({ startDate: 1 });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Public courses retrieved successfully",
    data: publicCourses,
  });
});

export const CourseControllers = {
  createCourse,
  getAllCourses,
  getMyCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  matchCourses,
  getPublicCourses,
};
