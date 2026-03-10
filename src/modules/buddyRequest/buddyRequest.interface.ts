export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface IBuddyRequest {
    userId: string;
    tripId: string;
    status: RequestStatus;
    message?: string;
}
