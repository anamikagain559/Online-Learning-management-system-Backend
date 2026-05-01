import { Enrollment } from './enrollment.model';
import { IEnrollment } from './enrollment.interface';
import { Course } from '../course/course.model';
import AppError from '../../errorHelpers/AppError';
import httpStatus from 'http-status-codes';
import { Role } from '../user/user.interface';

const sendEnrollmentRequest = async (payload: Partial<IEnrollment>) => {
    const course = await Course.findById(payload.courseId);
    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
    }

    if (course.user.toString() === payload.userId) {
        throw new AppError(httpStatus.BAD_REQUEST, 'You cannot enroll in your own course');
    }

    const result = await Enrollment.create(payload);
    return result;
};

const getEnrollmentsForCourse = async (courseId: string, userId: string) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
    }

    if (course.user.toString() !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, 'Only the instructor can see enrollments');
    }

    return await Enrollment.find({ courseId }).populate('userId', 'name email picture bio');
};

const respondToEnrollment = async (enrollmentId: string, userId: string, role: string, status: 'APPROVED' | 'REJECTED') => {
    const enrollment = await Enrollment.findById(enrollmentId).populate('courseId');
    if (!enrollment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Enrollment not found');
    }

    const course = enrollment.courseId as any;

    if (course.user.toString() !== userId && role !== Role.ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, 'Only the instructor or an admin can respond to enrollments');
    }

    enrollment.status = status;
    await enrollment.save();
    return enrollment;
};

const getCourseStudents = async (courseId: string) => {
    return await Enrollment.find({ courseId, status: 'APPROVED' }).populate('userId', 'name email picture bio');
};

const getAllEnrollments = async () => {
    return await Enrollment.find()
        .populate('userId', 'name email picture')
        .populate('courseId', 'category startDate endDate priceRange user')
        .sort({ createdAt: -1 });
};

const deleteEnrollment = async (enrollmentId: string) => {
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Enrollment not found');
    }

    await Enrollment.findByIdAndDelete(enrollmentId);
    return null;
};

export const EnrollmentServices = {
    sendEnrollmentRequest,
    getEnrollmentsForCourse,
    respondToEnrollment,
    getCourseStudents,
    getAllEnrollments,
    deleteEnrollment,
};
