"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const course_model_1 = require("./course.model");
const createCourse = async (payload, decodedToken) => {
    return await course_model_1.Course.create({
        ...payload,
        user: decodedToken.userId,
        isActive: true,
    });
};
const getAllCourses = async () => {
    return await course_model_1.Course.find({
        $or: [{ isActive: true }, { isActive: { $exists: false } }],
    })
        .populate("user", "name email role")
        .populate("categoryId")
        .populate("instructorId", "name email picture")
        .sort({ createdAt: -1 });
};
const getMyCourses = async (decodedToken) => {
    return await course_model_1.Course.find({ user: decodedToken.userId })
        .populate("categoryId")
        .populate("instructorId", "name email picture");
};
const getSingleCourse = async (id) => {
    const course = await course_model_1.Course.findById(id)
        .populate("user", "name email")
        .populate("categoryId")
        .populate("instructorId", "name email picture");
    if (!course) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Course not found");
    }
    return course;
};
const updateCourse = async (id, payload, decodedToken) => {
    const course = await course_model_1.Course.findById(id);
    if (!course) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Course not found");
    }
    // Admins can update any course, instructors can update their own
    if (decodedToken.role !== 'ADMIN' && course.user.toString() !== decodedToken.userId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You can update only your own course");
    }
    const updated = await course_model_1.Course.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    return updated;
};
const deleteCourse = async (id, decodedToken) => {
    const course = await course_model_1.Course.findById(id);
    if (!course) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Course not found");
    }
    if (decodedToken.role !== "ADMIN" && course.user.toString() !== decodedToken.userId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You can delete only your own course");
    }
    await course_model_1.Course.findByIdAndDelete(id);
    return null;
};
const matchCourses = async (query, decoded) => {
    const { category, categoryId, startDate, endDate, courseLevel, minPrice, maxPrice } = query;
    const baseFilter = {
        $or: [{ isActive: true }, { isActive: { $exists: false } }],
    };
    const andConditions = [baseFilter];
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
    return course_model_1.Course.find(finalQuery)
        .populate("user", "name email picture bio")
        .populate("categoryId")
        .populate("instructorId", "name email picture")
        .sort({ startDate: 1 });
};
exports.CourseServices = {
    createCourse,
    getAllCourses,
    getMyCourses,
    getSingleCourse,
    updateCourse,
    deleteCourse,
    matchCourses,
};
