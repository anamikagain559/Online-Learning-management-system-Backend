"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuddyRequestServices = void 0;
const buddyRequest_model_1 = require("./buddyRequest.model");
const travelPlan_model_1 = require("../travelPlan/travelPlan.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendBuddyRequest = async (payload) => {
    const trip = await travelPlan_model_1.TravelPlan.findById(payload.tripId);
    if (!trip) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Travel plan not found');
    }
    if (trip.user.toString() === payload.userId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'You cannot join your own travel plan');
    }
    const result = await buddyRequest_model_1.BuddyRequest.create(payload);
    return result;
};
const getRequestsForTrip = async (tripId, userId) => {
    const trip = await travelPlan_model_1.TravelPlan.findById(tripId);
    if (!trip) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Travel plan not found');
    }
    if (trip.user.toString() !== userId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'Only the host can see join requests');
    }
    return await buddyRequest_model_1.BuddyRequest.find({ tripId }).populate('userId', 'name email picture bio');
};
const respondToRequest = async (requestId, userId, role, status) => {
    const request = await buddyRequest_model_1.BuddyRequest.findById(requestId).populate('tripId');
    if (!request) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Request not found');
    }
    const trip = request.tripId;
    // Check if the user is the host OR an Admin
    if (trip.user.toString() !== userId && role !== 'admin') {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'Only the host or an admin can respond to requests');
    }
    request.status = status;
    await request.save();
    return request;
};
const getPlanBuddies = async (tripId) => {
    return await buddyRequest_model_1.BuddyRequest.find({ tripId, status: 'APPROVED' }).populate('userId', 'name email picture bio');
};
const getAllBuddyRequests = async () => {
    return await buddyRequest_model_1.BuddyRequest.find()
        .populate('userId', 'name email picture')
        .populate('tripId', 'destination startDate endDate budgetRange user')
        .sort({ createdAt: -1 });
};
const deleteBuddyRequest = async (requestId) => {
    const request = await buddyRequest_model_1.BuddyRequest.findById(requestId);
    if (!request) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Request not found');
    }
    await buddyRequest_model_1.BuddyRequest.findByIdAndDelete(requestId);
    return null;
};
exports.BuddyRequestServices = {
    sendBuddyRequest,
    getRequestsForTrip,
    respondToRequest,
    getPlanBuddies,
    getAllBuddyRequests,
    deleteBuddyRequest,
};
