"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    reviewer: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reviewee: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    course: {
        type: mongoose_1.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    comment: {
        type: String,
        trim: true,
    },
}, { timestamps: true });
reviewSchema.index({ reviewer: 1, course: 1 }, { unique: true });
exports.Review = (0, mongoose_1.model)("Review", reviewSchema);
