import { Schema, model } from 'mongoose';
import { IBuddyRequest } from './buddyRequest.interface';

const buddyRequestSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        tripId: {
            type: Schema.Types.ObjectId,
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
    },
    {
        timestamps: true,
    }
);

// Ensure a user can only send one request per trip
buddyRequestSchema.index({ userId: 1, tripId: 1 }, { unique: true });

export const BuddyRequest = model<IBuddyRequest>('BuddyRequest', buddyRequestSchema);
