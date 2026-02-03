import axiosInstance from "@api/index"
import cacheService from "../utils/cacheService"

// Types
export interface ScheduleData {
    schedule_id: number;
    campus: string;
    schedule_date: string;
    schedule_time_start: string;
    schedule_time_end: string;
    slots_remaining: number;
}

export interface SlotsRemainingResponse {
    total_slots_remaining: number;
    slots_remaining: { [campus: string]: number }[];
    error: string | null;
}

// Cache configuration
const CACHE_TTL = {
    SCHEDULES: 2 * 60 * 1000, // 2 minutes
    SLOTS: 1 * 60 * 1000, // 1 minute
    APPLICANT_INFO: 5 * 60 * 1000, // 5 minutes
}

export const SchedulesService = {
    /**
     * Get applicant initial info with caching
     */
    getApplicantInitialInfo: async (uuid: string) => {
        const cacheKey = `applicant-info-${uuid}`;
        const cached = cacheService.get<{ data: unknown }>(cacheKey);
        
        if (cached) {
            return cached.data;
        }

        const { data } = await axiosInstance.get(`/applicants/${uuid}/initial-info`)
        
        // Cache the result
        cacheService.set(cacheKey, { data }, CACHE_TTL.APPLICANT_INFO);
        
        return { data, fromCache: false }
    },

    /**
     * Get schedules by UUID with caching
     */
    getSchedules: async (uuid: string | undefined, forceRefresh = false): Promise<{ data: ScheduleData[], fromCache: boolean }> => {
        if (!uuid) {
            return { data: [], fromCache: false };
        }

        const cacheKey = `schedules-${uuid}`;
        
        // Check cache if not forcing refresh
        if (!forceRefresh) {
            const cached = cacheService.get<ScheduleData[]>(cacheKey);
            if (cached) {
                return { data: cached.data, fromCache: true };
            }
        }

        // Fetch from API
        const { data } = await axiosInstance.get(`/schedules/${uuid}`);
        
        // Cache the result
        cacheService.set(cacheKey, data, CACHE_TTL.SCHEDULES);
        
        return { data, fromCache: false };
    },

    /**
     * Get schedules by campus name with caching
     */
    getSchedulesByCampus: async (campus: string, forceRefresh = false): Promise<{ data: ScheduleData[], fromCache: boolean }> => {
        const cacheKey = `schedules-campus-${campus}`;
        
        // Check cache if not forcing refresh
        if (!forceRefresh) {
            const cached = cacheService.get<ScheduleData[]>(cacheKey);
            if (cached) {
                return { data: cached.data, fromCache: true };
            }
        }

        // Fetch from API
        const { data } = await axiosInstance.get(`/schedules/campus/${campus}`);
        
        // Cache the result
        cacheService.set(cacheKey, data, CACHE_TTL.SCHEDULES);
        
        return { data, fromCache: false };
    },

    /**
     * Get slots remaining with caching
     */
    getSlotsRemaining: async (forceRefresh = false): Promise<{ data: SlotsRemainingResponse, fromCache: boolean }> => {
        const cacheKey = 'slots-remaining';
        
        // Check cache if not forcing refresh
        if (!forceRefresh) {
            const cached = cacheService.get<SlotsRemainingResponse>(cacheKey);
            if (cached) {
                return { data: cached.data, fromCache: true };
            }
        }

        // Fetch from API
        const { data } = await axiosInstance.get('/schedules/slots');
        
        // Cache the result with shorter TTL since slots change frequently
        cacheService.set(cacheKey, data, CACHE_TTL.SLOTS);
        
        return { data, fromCache: false };
    },

    /**
     * Update applicant schedule ID
     * Clears relevant caches after update
     */
    updateApplicantScheduleId: async (formData: FormData) => {
        const { data, status } = await axiosInstance.put('/applicants/schedule', formData)
        
        // Clear schedule-related caches after update
        cacheService.clearPattern('schedules-');
        cacheService.clearPattern('slots-');
        
        return { data, status }
    },

    /**
     * Clear all schedule-related caches
     */
    clearScheduleCache: () => {
        cacheService.clearPattern('schedules-');
        cacheService.clearPattern('slots-');
        cacheService.clearPattern('applicant-info-');
    }
}