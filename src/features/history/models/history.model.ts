export interface ActivityLog {
    id: string;
    tagId: string;
    action: 'INJECTION' | 'RESET' | 'UPDATE' | 'SCAN';
    timestamp: Date;
    details: string;
    reference?: string | null;
}
