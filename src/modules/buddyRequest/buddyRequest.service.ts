import { BuddyRequest } from './buddyRequest.model';
import { IBuddyRequest } from './buddyRequest.interface';
import { TravelPlan } from '../travelPlan/travelPlan.model';
import AppError from '../../errorHelpers/AppError';
import httpStatus from 'http-status-codes';

const sendBuddyRequest = async (payload: Partial<IBuddyRequest>) => {
    const trip = await TravelPlan.findById(payload.tripId);
    if (!trip) {
        throw new AppError(httpStatus.NOT_FOUND, 'Travel plan not found');
    }

    if (trip.user.toString() === payload.userId) {
        throw new AppError(httpStatus.BAD_REQUEST, 'You cannot join your own travel plan');
    }

    const result = await BuddyRequest.create(payload);
    return result;
};

const getRequestsForTrip = async (tripId: string, userId: string) => {
    const trip = await TravelPlan.findById(tripId);
    if (!trip) {
        throw new AppError(httpStatus.NOT_FOUND, 'Travel plan not found');
    }

    if (trip.user.toString() !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, 'Only the host can see join requests');
    }

    return await BuddyRequest.find({ tripId }).populate('userId', 'name email picture bio');
};

const respondToRequest = async (requestId: string, userId: string, role: string, status: 'APPROVED' | 'REJECTED') => {
    const request = await BuddyRequest.findById(requestId).populate('tripId');
    if (!request) {
        throw new AppError(httpStatus.NOT_FOUND, 'Request not found');
    }

    const trip = request.tripId as any;

    // Check if the user is the host OR an Admin
    if (trip.user.toString() !== userId && role !== 'admin') {
        throw new AppError(httpStatus.FORBIDDEN, 'Only the host or an admin can respond to requests');
    }

    request.status = status;
    await request.save();
    return request;
};

const getPlanBuddies = async (tripId: string) => {
    return await BuddyRequest.find({ tripId, status: 'APPROVED' }).populate('userId', 'name email picture bio');
};

const getAllBuddyRequests = async () => {
    return await BuddyRequest.find()
        .populate('userId', 'name email picture')
        .populate('tripId', 'destination startDate endDate budgetRange user')
        .sort({ createdAt: -1 });
};

const deleteBuddyRequest = async (requestId: string) => {
    const request = await BuddyRequest.findById(requestId);
    if (!request) {
        throw new AppError(httpStatus.NOT_FOUND, 'Request not found');
    }

    await BuddyRequest.findByIdAndDelete(requestId);
    return null;
};

export const BuddyRequestServices = {
    sendBuddyRequest,
    getRequestsForTrip,
    respondToRequest,
    getPlanBuddies,
    getAllBuddyRequests,
    deleteBuddyRequest,
};
