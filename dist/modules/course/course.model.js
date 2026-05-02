"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = require("mongoose");
const courseSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    categoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    instructorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    courseLevel: {
        type: String,
        enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
        required: true,
    },
    description: {
        type: String,
        maxlength: 500,
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
    image: {
        type: String,
        maxlength: 500,
    },
}, { timestamps: true });
exports.Course = (0, mongoose_1.model)("Course", courseSchema);
