import axios from '../api/index';
import cacheService from '../utils/cacheService';

// Cache configuration
const CACHE_TTL = {
    APPLICANTS: 2 * 60 * 1000, // 2 minutes for applicant list
};

export const adminApplicantService = {
    getAllApplicantsWithDetails: async (token: string, page: number = 0, pageSize: number = 10, forceRefresh = false) => {
        const cacheKey = `admin-applicants-page-${page}-size-${pageSize}`;
        
        // Check cache if not forcing refresh
        if (!forceRefresh) {
            const cached = cacheService.get<{ success: boolean; data: unknown[]; pagination: unknown }>(cacheKey);
            if (cached) {
                return { ...cached.data, fromCache: true };
            }
        }

        // Fetch from API with pagination parameters
        const response = await axios.get('/admin/applicants-management/all', {
            params: { page, pageSize },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        // Cache the result
        cacheService.set(cacheKey, response.data, CACHE_TTL.APPLICANTS);
        
        return { ...response.data, fromCache: false };
    },

    /**
     * Get all applicants without pagination for export purposes
     */
    getAllApplicantsForExport: async (token: string) => {
        // Don't cache this as it's not frequently called and should always be fresh
        const response = await axios.get('/admin/applicants-management/all', {
            params: { page: 0, pageSize: 999999 }, // Large number to get all records
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        return response.data;
    },

    /**
     * Export applicants with selected columns only for CSV
     * Returns optimized data with only essential columns
     */
    exportApplicantsForCSV: async (token: string) => {
        const response = await axios.get('/admin/applicants-management/export-csv', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        return response.data;
    },

    updateExamPassedStatus: async (uuid: string, examPassed: boolean, token: string) => {
        const response = await axios.put(
            `/admin/applicants-management/exam-passed/${uuid}`,
            { examPassed },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        
        // Clear applicants cache after update
        cacheService.clearPattern('admin-applicants-');
        
        return response.data;
    },

    updateEnrolledStatus: async (uuid: string, enrolled: boolean, token: string) => {
        const response = await axios.put(
            `/admin/applicants-management/enrolled/${uuid}`,
            { enrolled },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        
        // Clear applicants cache after update
        cacheService.clearPattern('admin-applicants-');
        
        return response.data;
    },

    /**
     * Clear all applicant-related caches
     */
    clearApplicantCache: () => {
        cacheService.clearPattern('admin-applicants-');
    }
};
