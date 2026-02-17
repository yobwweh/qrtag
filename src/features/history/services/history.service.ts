import { ActivityLog } from "../models/history.model";

const STORAGE_KEY = 'qrtag_activity_logs';

export const HistoryService = {
    /**
     * Enregistre une nouvelle activité
     */
    async logActivity(log: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<void> {
        try {
            const newLog: ActivityLog = {
                ...log,
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date()
            };

            const logs = await this.getRecentActivity();
            const updatedLogs = [newLog, ...logs].slice(0, 50); // Garder les 50 derniers

            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
        } catch (err) {
            console.error("Failed to log activity:", err);
        }
    },

    /**
     * Récupère les activités récentes
     */
    async getRecentActivity(): Promise<ActivityLog[]> {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        try {
            const parsed = JSON.parse(stored);
            return parsed.map((l: any) => ({
                ...l,
                timestamp: new Date(l.timestamp)
            }));
        } catch {
            return [];
        }
    }
};
