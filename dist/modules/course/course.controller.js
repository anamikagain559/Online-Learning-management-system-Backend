"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const course_service_1 = require("./course.service");
const course_model_1 = require("./course.model");
const createCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await course_service_1.CourseServices.createCourse(req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Course created successfully",
        data: result,
    });
});
const getAllCourses = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const result = await course_service_1.CourseServices.getAllCourses();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Courses retrieved successfully",
        data: result,
    });
});
const getMyCourses = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await course_service_1.CourseServices.getMyCourses(req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "My courses retrieved successfully",
        data: result,
    });
});
const getSingleCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await course_service_1.CourseServices.getSingleCourse(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Course retrieved successfully",
        data: result,
    });
});
const updateCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await course_service_1.CourseServices.updateCourse(req.params.id, req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Course updated successfully",
        data: result,
    });
});
const deleteCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await course_service_1.CourseServices.deleteCourse(req.params.id, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Course deleted successfully",
        data: null,
    });
});
const matchCourses = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const query = {
        category: req.query.category?.toString(),
        startDate: req.query.startDate?.toString(),
        endDate: req.query.endDate?.toString(),
        courseLevel: req.query.courseLevel?.toString(),
        minPrice: req.query.minPrice?.toString(),
        maxPrice: req.query.maxPrice?.toString(),
    };
    const result = await course_service_1.CourseServices.matchCourses(query, req.user);
    return (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Matching courses retrieved successfully",
        data: result,
    });
});
const getPublicCourses = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { category, startDate, endDate, courseLevel } = req.query;
    const query = { isPublic: true };
    if (category)
        query["category"] = category;
    if (courseLevel)
        query["courseLevel"] = courseLevel;
    if (startDate && endDate) {
        query.startDate = { $gte: new Date(startDate) };
        query.endDate = { $lte: new Date(endDate) };
    }
    const publicCourses = await course_model_1.Course.find(query)
        .populate("user", "name email")
        .sort({ startDate: 1 });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Public courses retrieved successfully",
        data: publicCourses,
    });
});
exports.CourseControllers = {
    createCourse,
    getAllCourses,
    getMyCourses,
    getSingleCourse,
    updateCourse,
    deleteCourse,
    matchCourses,
    getPublicCourses,
};
