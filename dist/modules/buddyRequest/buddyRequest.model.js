"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuddyRequest = void 0;
const mongoose_1 = require("mongoose");
const buddyRequestSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tripId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'TravelPlan',
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING',
    },
    message: {
        type: String,
    },
}, {
    timestamps: true,
});
// Ensure a user can only send one request per trip
buddyRequestSchema.index({ userId: 1, tripId: 1 }, { unique: true });
exports.BuddyRequest = (0, mongoose_1.model)('BuddyRequest', buddyRequestSchema);
