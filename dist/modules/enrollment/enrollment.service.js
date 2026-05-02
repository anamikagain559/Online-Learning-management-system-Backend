"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentServices = void 0;
const enrollment_model_1 = require("./enrollment.model");
const course_model_1 = require("../course/course.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_interface_1 = require("../user/user.interface");
const sendEnrollmentRequest = async (payload) => {
    const course = await course_model_1.Course.findById(payload.courseId);
    if (!course) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Course not found');
    }
    if (course.user.toString() === payload.userId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'You cannot enroll in your own course');
    }
    const result = await enrollment_model_1.Enrollment.create(payload);
    return result;
};
const getEnrollmentsForCourse = async (courseId, userId) => {
    const course = await course_model_1.Course.findById(courseId);
    if (!course) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Course not found');
    }
    if (course.user.toString() !== userId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'Only the instructor can see enrollments');
    }
    return await enrollment_model_1.Enrollment.find({ courseId }).populate('userId', 'name email picture bio');
};
const respondToEnrollment = async (enrollmentId, userId, role, status) => {
    const enrollment = await enrollment_model_1.Enrollment.findById(enrollmentId).populate('courseId');
    if (!enrollment) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Enrollment not found');
    }
    const course = enrollment.courseId;
    if (course.user.toString() !== userId && role !== user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'Only the instructor or an admin can respond to enrollments');
    }
    enrollment.status = status;
    await enrollment.save();
    return enrollment;
};
const getCourseStudents = async (courseId) => {
    return await enrollment_model_1.Enrollment.find({ courseId, status: 'APPROVED' }).populate('userId', 'name email picture bio');
};
const getAllEnrollments = async () => {
    return await enrollment_model_1.Enrollment.find()
        .populate('userId', 'name email picture')
        .populate('courseId', 'category startDate endDate priceRange user')
        .sort({ createdAt: -1 });
};
const deleteEnrollment = async (enrollmentId) => {
    const enrollment = await enrollment_model_1.Enrollment.findById(enrollmentId);
    if (!enrollment) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Enrollment not found');
    }
    await enrollment_model_1.Enrollment.findByIdAndDelete(enrollmentId);
    return null;
};
exports.EnrollmentServices = {
    sendEnrollmentRequest,
    getEnrollmentsForCourse,
    respondToEnrollment,
    getCourseStudents,
    getAllEnrollments,
    deleteEnrollment,
};
