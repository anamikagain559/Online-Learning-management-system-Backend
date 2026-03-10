import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { MessageService } from './message.service';

const getMessagesByTripId = catchAsync(async (req: Request, res: Response) => {
    const { tripId } = req.params;
    const result = await MessageService.getMessagesByTripId(tripId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Messages retrieved successfully',
        data: result,
    });
});

const getDirectMessages = catchAsync(async (req: Request, res: Response) => {
    const { user1, user2 } = req.params;
    const result = await MessageService.getDirectMessages(user1, user2);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Direct messages retrieved successfully',
        data: result,
    });
});

export const MessageController = {
    getMessagesByTripId,
    getDirectMessages,
};
