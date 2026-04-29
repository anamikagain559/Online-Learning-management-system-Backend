"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const message_service_1 = require("./message.service");
const getMessagesByTripId = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { tripId } = req.params;
    const result = await message_service_1.MessageService.getMessagesByTripId(tripId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Messages retrieved successfully',
        data: result,
    });
});
const getDirectMessages = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user1, user2 } = req.params;
    const result = await message_service_1.MessageService.getDirectMessages(user1, user2);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Direct messages retrieved successfully',
        data: result,
    });
});
exports.MessageController = {
    getMessagesByTripId,
    getDirectMessages,
};
