import axios from '../api/index';
import cacheService from '../utils/cacheService';

// Cache configuration
const CACHE_TTL = {
    REPORTS: 1 * 60 * 1000, // 1 minute for reports (data changes frequently)
};

export const adminReportService = {
    getScheduledExamReport: async (token: string, forceRefresh = false) => {
        const cacheKey = 'admin-report-scheduled-exam';
        
        if (!forceRefresh) {
            const cached = cacheService.get<{ success: boolean; data: unknown }>(cacheKey);
            if (cached) {
                return cached.data;
            }
        }

        const response = await axios.get('/admin/reports/scheduled-exam-report', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        cacheService.set(cacheKey, response.data, CACHE_TTL.REPORTS);
        return response.data;
    },

    getSlotsSummary: async (token: string, forceRefresh = false) => {
        const cacheKey = 'admin-report-slots-summary';
        
        if (!forceRefresh) {
            const cached = cacheService.get<{ success: boolean; data: unknown }>(cacheKey);
            if (cached) {
                return cached.data;
            }
        }

        const response = await axios.get('/admin/reports/slots-summary', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        cacheService.set(cacheKey, response.data, CACHE_TTL.REPORTS);
        return response.data;
    },

    getStatisticsSummary: async (token: string, forceRefresh = false) => {
        const cacheKey = 'admin-report-statistics';
        
        if (!forceRefresh) {
            const cached = cacheService.get<{ success: boolean; data: unknown }>(cacheKey);
            if (cached) {
                return cached.data;
            }
        }

        const response = await axios.get('/admin/reports/statistics-summary', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        cacheService.set(cacheKey, response.data, CACHE_TTL.REPORTS);
        return response.data;
    },

    /**
     * Clear all report-related caches
     */
    clearReportCache: () => {
        cacheService.clearPattern('admin-report-');
    }
};
