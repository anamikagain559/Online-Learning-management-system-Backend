export type EnrollmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface IEnrollment {
    userId: string;
    courseId: string;
    status: EnrollmentStatus;
    paymentStatus: 'PAID' | 'UNPAID';
    transactionId?: string;
    message?: string;
}
