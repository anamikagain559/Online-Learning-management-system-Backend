"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuddyRequestControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const buddyRequest_service_1 = require("./buddyRequest.service");
const sendBuddyRequest = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.userId;
    const result = await buddyRequest_service_1.BuddyRequestServices.sendBuddyRequest({
        ...req.body,
        userId,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: 'Buddy request sent successfully',
        data: result,
    });
});
const getRequestsForTrip = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.userId;
    const { tripId } = req.params;
    const result = await buddyRequest_service_1.BuddyRequestServices.getRequestsForTrip(tripId, userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Requests retrieved successfully',
        data: result,
    });
});
const respondToRequest = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.userId;
    const role = req.user.role;
    const { requestId } = req.params;
    const { status } = req.body;
    const result = await buddyRequest_service_1.BuddyRequestServices.respondToRequest(requestId, userId, role, status);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: `Request ${status.toLowerCase()} successfully`,
        data: result,
    });
});
const getPlanBuddies = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { tripId } = req.params;
    const result = await buddyRequest_service_1.BuddyRequestServices.getPlanBuddies(tripId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Buddies retrieved successfully',
        data: result,
    });
});
const getAllBuddyRequests = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await buddyRequest_service_1.BuddyRequestServices.getAllBuddyRequests();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'All buddy requests retrieved successfully',
        data: result,
    });
});
const deleteBuddyRequest = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { requestId } = req.params;
    await buddyRequest_service_1.BuddyRequestServices.deleteBuddyRequest(requestId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Request deleted successfully',
        data: null,
    });
});
exports.BuddyRequestControllers = {
    sendBuddyRequest,
    getRequestsForTrip,
    respondToRequest,
    getPlanBuddies,
    getAllBuddyRequests,
    deleteBuddyRequest,
};
