import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import Stripe from "stripe";
import { JwtPayload } from "jsonwebtoken";
import { Payment } from "./payments.model";
import httpStatus from "http-status-codes";
import { Course } from "../course/course.model";
import AppError from "../../errorHelpers/AppError";
import { Enrollment } from "../enrollment/enrollment.model";

// Ensure STRIPE_SECRET_KEY exists
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in .env");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const { plan } = req.body;

  let amount = 0;
  if (plan === "MONTHLY") amount = 10;
  if (plan === "YEARLY") amount = 100;

  if (amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid plan selected");
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

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment intent created successfully",
    data: {
      clientSecret: paymentIntent.client_secret,
    },
  });
});

const createCoursePaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const { courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, "Course not found");
  }

  const amount = course.price;
  if (amount <= 0) {
      // Handle free courses later if needed
      throw new AppError(httpStatus.BAD_REQUEST, "Course is free or price is invalid");
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

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Course payment intent created successfully",
    data: {
      clientSecret: paymentIntent.client_secret,
      price: amount
    },
  });
});

const confirmCourseEnrollment = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const { paymentIntentId, courseId } = req.body;

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
        throw new AppError(httpStatus.BAD_REQUEST, "Payment not successful");
    }

    if (paymentIntent.metadata.courseId !== courseId || paymentIntent.metadata.userId !== decodedToken.userId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Payment metadata mismatch");
    }

    // Create Enrollment
    const enrollment = await Enrollment.create({
        userId: decodedToken.userId,
        courseId: courseId,
        status: 'APPROVED',
        paymentStatus: 'PAID',
        transactionId: paymentIntentId,
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Enrolled in course successfully",
        data: enrollment,
    });
});

export const PaymentControllers = {
  createPaymentIntent,
  createCoursePaymentIntent,
  confirmCourseEnrollment
};