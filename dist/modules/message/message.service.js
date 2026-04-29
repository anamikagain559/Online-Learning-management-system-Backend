"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const message_model_1 = require("./message.model");
const createMessage = async (payload) => {
    const result = await message_model_1.Message.create(payload);
    return result;
};
const getMessagesByTripId = async (tripId) => {
    const result = await message_model_1.Message.find({ tripId })
        .populate('sender', 'name picture')
        .sort({ createdAt: 1 });
    return result;
};
const getDirectMessages = async (user1, user2) => {
    const result = await message_model_1.Message.find({
        $or: [
            { sender: user1, receiver: user2 },
            { sender: user2, receiver: user1 },
        ],
    })
        .populate('sender', 'name picture')
        .sort({ createdAt: 1 });
    return result;
};
exports.MessageService = {
    createMessage,
    getMessagesByTripId,
    getDirectMessages,
};
