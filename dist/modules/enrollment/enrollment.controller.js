"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const enrollment_service_1 = require("./enrollment.service");
const sendEnrollmentRequest = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.userId;
    const result = await enrollment_service_1.EnrollmentServices.sendEnrollmentRequest({
        ...req.body,
        userId,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: 'Enrollment request sent successfully',
        data: result,
    });
});
const getEnrollmentsForCourse = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.userId;
    const { courseId } = req.params;
    const result = await enrollment_service_1.EnrollmentServices.getEnrollmentsForCourse(courseId, userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Enrollments retrieved successfully',
        data: result,
    });
});
const respondToEnrollment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.userId;
    const role = req.user.role;
    const { enrollmentId } = req.params;
    const { status } = req.body;
    const result = await enrollment_service_1.EnrollmentServices.respondToEnrollment(enrollmentId, userId, role, status);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: `Enrollment ${status.toLowerCase()} successfully`,
        data: result,
    });
});
const getCourseStudents = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { courseId } = req.params;
    const result = await enrollment_service_1.EnrollmentServices.getCourseStudents(courseId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Students retrieved successfully',
        data: result,
    });
});
const getAllEnrollments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await enrollment_service_1.EnrollmentServices.getAllEnrollments();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'All enrollments retrieved successfully',
        data: result,
    });
});
const deleteEnrollment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { enrollmentId } = req.params;
    await enrollment_service_1.EnrollmentServices.deleteEnrollment(enrollmentId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Enrollment deleted successfully',
        data: null,
    });
});
exports.EnrollmentControllers = {
    sendEnrollmentRequest,
    getEnrollmentsForCourse,
    respondToEnrollment,
    getCourseStudents,
    getAllEnrollments,
    deleteEnrollment,
};
