import { Message } from './message.model';
import { IMessage } from './message.interface';

const createMessage = async (payload: IMessage) => {
    const result = await Message.create(payload);
    return result;
};

const getMessagesByTripId = async (tripId: string) => {
    const result = await Message.find({ tripId })
        .populate('sender', 'name picture')
        .sort({ createdAt: 1 });
    return result;
};

const getDirectMessages = async (user1: string, user2: string) => {
    const result = await Message.find({
        $or: [
            { sender: user1, receiver: user2 },
            { sender: user2, receiver: user1 },
        ],
    })
        .populate('sender', 'name picture')
        .sort({ createdAt: 1 });
    return result;
};

export const MessageService = {
    createMessage,
    getMessagesByTripId,
    getDirectMessages,
};
