import axiosInstance from "@api/index"

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
    fromCache?: boolean;
}

export interface CacheStats {
    success: boolean;
    cacheHits: number;
    cacheMisses: number;
    coalescedRequests: number;
    totalRequests: number;
    hitRate: string;
}

// Request deduplication for client-side
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pendingRequests = new Map<string, Promise<any>>();

/**
 * Create a deduplicated request
 * Multiple simultaneous requests for the same data will share a single API call
 */
const deduplicatedRequest = async <T>(key: string, requestFn: () => Promise<T>): Promise<T> => {
    // Check if there's already a pending request for this key
    if (pendingRequests.has(key)) {
        return pendingRequests.get(key) as Promise<T>;
    }

    // Create new request promise
    const requestPromise = requestFn().finally(() => {
        // Clean up after request completes
        pendingRequests.delete(key);
    });

    pendingRequests.set(key, requestPromise);
    return requestPromise;
};

export const SchedulesService = {
    /**
     * Get applicant initial info
     */
    getApplicantInitialInfo: async (uuid: string) => {
        const { data } = await axiosInstance.get(`/applicants/${uuid}/initial-info`)
        return { data }
    },

    /**
     * Get schedules by UUID - with request deduplication
     * Multiple components calling this simultaneously will share a single request
     */
    getSchedules: async (uuid: string | undefined): Promise<{ data: ScheduleData[], fromCache: boolean }> => {
        if (!uuid) {
            return { data: [], fromCache: false };
        }

        return deduplicatedRequest(`schedules:${uuid}`, async () => {
            const response = await axiosInstance.get(`/schedules/${uuid}`);
            const fromCache = response.headers['x-cache'] === 'HIT';
            return { data: response.data, fromCache };
        });
    },

    /**
     * Get schedules by campus name - with request deduplication
     */
    getSchedulesByCampus: async (campus: string): Promise<{ data: ScheduleData[], fromCache: boolean }> => {
        return deduplicatedRequest(`schedules:campus:${campus}`, async () => {
            const response = await axiosInstance.get(`/schedules/campus/${campus}`);
            const fromCache = response.headers['x-cache'] === 'HIT';
            return { data: response.data, fromCache };
        });
    },

    /**
     * Get slots remaining - with request deduplication
     */
    getSlotsRemaining: async (): Promise<{ data: SlotsRemainingResponse, fromCache: boolean }> => {
        return deduplicatedRequest('slots:all', async () => {
            const response = await axiosInstance.get('/schedules/slots');
            const fromCache = response.headers['x-cache'] === 'HIT';
            return { data: response.data, fromCache };
        });
    },

    /**
     * Update applicant schedule ID
     */
    updateApplicantScheduleId: async (formData: FormData) => {
        const { data, status } = await axiosInstance.put('/applicants/schedule', formData)
        return { data, status }
    },

    /**
     * Get cache statistics (for admin/monitoring)
     */
    getCacheStats: async (): Promise<{ data: CacheStats }> => {
        const { data } = await axiosInstance.get('/schedules/cache/stats');
        return { data };
    }
}