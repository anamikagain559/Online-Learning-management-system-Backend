"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enrollment = void 0;
const mongoose_1 = require("mongoose");
const enrollmentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING',
    },
    paymentStatus: {
        type: String,
        enum: ['PAID', 'UNPAID'],
        default: 'UNPAID',
    },
    transactionId: {
        type: String,
    },
    message: {
        type: String,
    },
}, {
    timestamps: true,
});
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });
exports.Enrollment = (0, mongoose_1.model)('Enrollment', enrollmentSchema);
