import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { BuddyRequestServices } from './buddyRequest.service';
import { JwtPayload } from 'jsonwebtoken';

const sendBuddyRequest = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    const result = await BuddyRequestServices.sendBuddyRequest({
        ...req.body,
        userId,
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Buddy request sent successfully',
        data: result,
    });
});

const getRequestsForTrip = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    const { tripId } = req.params;
    const result = await BuddyRequestServices.getRequestsForTrip(tripId, userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Requests retrieved successfully',
        data: result,
    });
});

const respondToRequest = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    const role = (req.user as JwtPayload).role;
    const { requestId } = req.params;
    const { status } = req.body;
    const result = await BuddyRequestServices.respondToRequest(requestId, userId, role, status);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: `Request ${status.toLowerCase()} successfully`,
        data: result,
    });
});

const getPlanBuddies = catchAsync(async (req: Request, res: Response) => {
    const { tripId } = req.params;
    const result = await BuddyRequestServices.getPlanBuddies(tripId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Buddies retrieved successfully',
        data: result,
    });
});

const getAllBuddyRequests = catchAsync(async (req: Request, res: Response) => {
    const result = await BuddyRequestServices.getAllBuddyRequests();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'All buddy requests retrieved successfully',
        data: result,
    });
});

const deleteBuddyRequest = catchAsync(async (req: Request, res: Response) => {
    const { requestId } = req.params;
    await BuddyRequestServices.deleteBuddyRequest(requestId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Request deleted successfully',
        data: null,
    });
});

export const BuddyRequestControllers = {
    sendBuddyRequest,
    getRequestsForTrip,
    respondToRequest,
    getPlanBuddies,
    getAllBuddyRequests,
    deleteBuddyRequest,
};
