import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { EnrollmentServices } from './enrollment.service';
import { JwtPayload } from 'jsonwebtoken';

const sendEnrollmentRequest = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    const result = await EnrollmentServices.sendEnrollmentRequest({
        ...req.body,
        userId,
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Enrollment request sent successfully',
        data: result,
    });
});

const getEnrollmentsForCourse = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    const { courseId } = req.params;
    const result = await EnrollmentServices.getEnrollmentsForCourse(courseId, userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Enrollments retrieved successfully',
        data: result,
    });
});

const respondToEnrollment = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    const role = (req.user as JwtPayload).role;
    const { enrollmentId } = req.params;
    const { status } = req.body;
    const result = await EnrollmentServices.respondToEnrollment(enrollmentId, userId, role, status);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: `Enrollment ${status.toLowerCase()} successfully`,
        data: result,
    });
});

const getCourseStudents = catchAsync(async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const result = await EnrollmentServices.getCourseStudents(courseId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Students retrieved successfully',
        data: result,
    });
});

const getAllEnrollments = catchAsync(async (req: Request, res: Response) => {
    const result = await EnrollmentServices.getAllEnrollments();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'All enrollments retrieved successfully',
        data: result,
    });
});

const deleteEnrollment = catchAsync(async (req: Request, res: Response) => {
    const { enrollmentId } = req.params;
    await EnrollmentServices.deleteEnrollment(enrollmentId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Enrollment deleted successfully',
        data: null,
    });
});

export const EnrollmentControllers = {
    sendEnrollmentRequest,
    getEnrollmentsForCourse,
    respondToEnrollment,
    getCourseStudents,
    getAllEnrollments,
    deleteEnrollment,
};
