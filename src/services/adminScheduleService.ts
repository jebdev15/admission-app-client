import axios from '../api/index';
import cacheService from '../utils/cacheService';

// Cache configuration
const CACHE_TTL = {
    SCHEDULES: 2 * 60 * 1000, // 2 minutes for schedule list
};

export const adminScheduleService = {
    getAllSchedules: async (token: string, forceRefresh = false) => {
        const cacheKey = 'admin-schedules-all';
        
        if (!forceRefresh) {
            const cached = cacheService.get<{ success: boolean; data: unknown }>(cacheKey);
            if (cached) {
                return cached.data;
            }
        }

        const response = await axios.get('/admin/schedules/all', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        cacheService.set(cacheKey, response.data, CACHE_TTL.SCHEDULES);
        return response.data;
    },

    getScheduleById: async (scheduleId: string, token: string, forceRefresh = false) => {
        const cacheKey = `admin-schedule-${scheduleId}`;
        
        if (!forceRefresh) {
            const cached = cacheService.get<{ success: boolean; data: unknown }>(cacheKey);
            if (cached) {
                return cached.data;
            }
        }

        const response = await axios.get(`/admin/schedules/${scheduleId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        cacheService.set(cacheKey, response.data, CACHE_TTL.SCHEDULES);
        return response.data;
    },

    /**
     * Export schedules for CSV with selected columns only
     * Does not use cache as this is a one-time export operation
     */
    exportSchedulesForCSV: async (token: string) => {
        const response = await axios.get('/admin/schedules/export-csv', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    /**
     * Clear all schedule-related caches
     */
    clearScheduleCache: () => {
        cacheService.clearPattern('admin-schedule');
    }
};
