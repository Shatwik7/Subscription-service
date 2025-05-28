export class ReadSubscriptionDto {
    id: number;
    userId: number;
    planId: number;
    status: 'active' | 'inactive' | 'cancelled' | 'expired';
    startDate: Date;
    endDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}