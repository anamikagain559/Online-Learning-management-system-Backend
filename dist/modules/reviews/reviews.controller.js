"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const reviews_model_1 = require("./reviews.model");
const course_model_1 = require("../course/course.model");
/**
 * CREATE REVIEW
 * Only logged-in users can create a review for a travel plan
 */
const createReview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    const { course, rating, comment } = req.body;
    if (!course) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Course ID is required");
    }
    if (!rating || rating < 1 || rating > 5) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Rating must be between 1 and 5");
    }
    // 🔐 Find course to get owner (instructor)
    const plan = await course_model_1.Course.findById(course).select("user");
    if (!plan) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Course not found");
    }
    // ❌ Prevent reviewing own course
    if (plan.user.toString() === decodedToken.userId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You cannot review your own course");
    }
    // ❌ Prevent duplicate review
    const alreadyReviewed = await reviews_model_1.Review.findOne({
        course,
        reviewer: decodedToken.userId,
    });
    if (alreadyReviewed) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You have already reviewed this course");
    }
    const review = await reviews_model_1.Review.create({
        reviewer: decodedToken.userId, // logged-in user
        reviewee: plan.user, // instructor
        course,
        rating,
        comment,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Review created successfully",
        data: review,
    });
});
/**
 * GET REVIEWS BY COURSE
 * Public endpoint
 */
const getReviewsByCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { courseId } = req.params;
    if (!courseId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Course ID is required");
    }
    const reviews = await reviews_model_1.Review.find({ course: courseId })
        .populate("reviewer", "name email")
        .sort({ createdAt: -1 });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Reviews retrieved successfully",
        data: reviews,
    });
});
/**
 * UPDATE OWN REVIEW
 */
const updateReview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    const { id } = req.params;
    const review = await reviews_model_1.Review.findOneAndUpdate({ _id: id, reviewer: decodedToken.userId }, req.body, { new: true, runValidators: true });
    if (!review) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Review not found or you are not authorized to update it");
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Review updated successfully",
        data: review,
    });
});
/**
 * DELETE OWN REVIEW
 */
const deleteReview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    const { id } = req.params;
    const review = await reviews_model_1.Review.findOneAndDelete({
        _id: id,
        reviewer: decodedToken.userId,
    });
    if (!review) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Review not found or you are not authorized to delete it");
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Review deleted successfully",
        data: null,
    });
});
exports.ReviewControllers = {
    createReview,
    getReviewsByCourse,
    updateReview,
    deleteReview,
};
