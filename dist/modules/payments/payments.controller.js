"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const stripe_1 = __importDefault(require("stripe"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const course_model_1 = require("../course/course.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const enrollment_model_1 = require("../enrollment/enrollment.model");
// Ensure STRIPE_SECRET_KEY exists
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined in .env");
}
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const createPaymentIntent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    const { plan } = req.body;
    let amount = 0;
    if (plan === "MONTHLY")
        amount = 10;
    if (plan === "YEARLY")
        amount = 100;
    if (amount <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid plan selected");
    }
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe uses cents
        currency: "usd",
        payment_method_types: ["card"],
        metadata: {
            userId: decodedToken.userId,
            plan: plan || "SUBSCRIPTION",
        },
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Payment intent created successfully",
        data: {
            clientSecret: paymentIntent.client_secret,
        },
    });
});
const createCoursePaymentIntent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    const { courseId } = req.body;
    const course = await course_model_1.Course.findById(courseId);
    if (!course) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Course not found");
    }
    const amount = course.price;
    if (amount <= 0) {
        // Handle free courses later if needed
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Course is free or price is invalid");
    }
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "usd",
        payment_method_types: ["card"],
        metadata: {
            userId: decodedToken.userId,
            courseId: courseId,
            type: "COURSE_ENROLLMENT"
        },
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Course payment intent created successfully",
        data: {
            clientSecret: paymentIntent.client_secret,
            price: amount
        },
    });
});
const confirmCourseEnrollment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    const { paymentIntentId, courseId } = req.body;
    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Payment not successful");
    }
    if (paymentIntent.metadata.courseId !== courseId || paymentIntent.metadata.userId !== decodedToken.userId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Payment metadata mismatch");
    }
    // Create Enrollment
    const enrollment = await enrollment_model_1.Enrollment.create({
        userId: decodedToken.userId,
        courseId: courseId,
        status: 'APPROVED',
        paymentStatus: 'PAID',
        transactionId: paymentIntentId,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Enrolled in course successfully",
        data: enrollment,
    });
});
exports.PaymentControllers = {
    createPaymentIntent,
    createCoursePaymentIntent,
    confirmCourseEnrollment
};
