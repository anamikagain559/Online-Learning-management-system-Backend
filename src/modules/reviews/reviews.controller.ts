import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/AppError";
import { Review } from "./reviews.model";
import { Course } from "../course/course.model";

/**
 * CREATE REVIEW
 * Only logged-in users can create a review for a travel plan
 */
const createReview = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const { course, rating, comment } = req.body;

  if (!course) {
    throw new AppError(httpStatus.BAD_REQUEST, "Course ID is required");
  }

  if (!rating || rating < 1 || rating > 5) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rating must be between 1 and 5"
    );
  }

  // 🔐 Find course to get owner (instructor)
  const plan = await Course.findById(course).select("user");

  if (!plan) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found");
  }

  // ❌ Prevent reviewing own course
  if (plan.user.toString() === decodedToken.userId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You cannot review your own course"
    );
  }

  // ❌ Prevent duplicate review
  const alreadyReviewed = await Review.findOne({
    course,
    reviewer: decodedToken.userId,
  });

  if (alreadyReviewed) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already reviewed this course"
    );
  }

  const review = await Review.create({
    reviewer: decodedToken.userId, // logged-in user
    reviewee: plan.user,           // instructor
    course,
    rating,
    comment,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: review,
  });
});

/**
 * GET REVIEWS BY COURSE
 * Public endpoint
 */
const getReviewsByCourse = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;

  if (!courseId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Course ID is required");
  }

  const reviews = await Review.find({ course: courseId })
    .populate("reviewer", "name email")
    .sort({ createdAt: -1 });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reviews retrieved successfully",
    data: reviews,
  });
});

/**
 * UPDATE OWN REVIEW
 */
const updateReview = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const { id } = req.params;

  const review = await Review.findOneAndUpdate(
    { _id: id, reviewer: decodedToken.userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!review) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Review not found or you are not authorized to update it"
    );
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review updated successfully",
    data: review,
  });
});

/**
 * DELETE OWN REVIEW
 */
const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const { id } = req.params;

  const review = await Review.findOneAndDelete({
    _id: id,
    reviewer: decodedToken.userId,
  });

  if (!review) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Review not found or you are not authorized to delete it"
    );
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review deleted successfully",
    data: null,
  });
});

export const ReviewControllers = {
  createReview,
  getReviewsByCourse,
  updateReview,
  deleteReview,
};
