import axiosInstance from "@api/index";

/**
 * System Status Types
 */
export interface SlotsByCampus {
    [campus: string]: number;
}

export interface ExamVenue {
    name: string;
    available: boolean;
}

export interface SystemMessages {
    holiday?: string;
    lastDay?: string;
    slotsFull?: string;
    outsideHours?: string;
    maintenance?: string;
    error?: string;
}

export interface BusinessHours {
    start: string;
    end: string;
    timezone: string;
}

export interface SystemStatus {
    // Main availability flag
    isAvailable: boolean;
    
    // Individual status flags
    withinBusinessHours: boolean;
    areSlotsFull: boolean;
    isHolidayBreak: boolean;
    isLastDayOfRegistration: boolean;
    maintenanceMode: boolean;
    serverBusy: boolean;
    
    // Messages for different states
    messages: SystemMessages;
    
    // Business hours config
    businessHours: BusinessHours;
    
    // Available exam venues
    examVenues: ExamVenue[];
    
    // Metadata
    checkedAt: string;
    fromCache: boolean;
    error?: string;
}

export interface AvailabilityCheck {
    available: boolean;
    reason?: string;
    slotsRemaining?: number;
}

// Cache for system status to reduce API calls
let cachedStatus: SystemStatus | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 30000; // 30 seconds client-side cache (matches backend)

// Pending request for deduplication
let pendingRequest: Promise<SystemStatus> | null = null;

/**
 * System Config Service
 * Fetches system status from backend with client-side caching
 */
export const SystemConfigService = {
    /**
     * Get full system status
     * Used by landing page to check if registration is available
     * Implements client-side caching and request deduplication
     */
    getSystemStatus: async (forceRefresh = false): Promise<SystemStatus> => {
        const now = Date.now();
        
        // Return cached status if still valid and not forcing refresh
        if (!forceRefresh && cachedStatus && (now - cacheTimestamp) < CACHE_TTL) {
            return { ...cachedStatus, fromCache: true };
        }

        // If there's already a pending request, return it (deduplication)
        if (pendingRequest) {
            return pendingRequest;
        }

        // Create new request
        pendingRequest = axiosInstance.get('/system/status')
            .then(response => {
                cachedStatus = response.data;
                cacheTimestamp = Date.now();
                return response.data;
            })
            .finally(() => {
                pendingRequest = null;
            });

        return pendingRequest;
    },

    /**
     * Quick availability check for a specific campus
     */
    checkAvailability: async (campus?: string): Promise<AvailabilityCheck> => {
        try {
            const params = campus ? { campus } : {};
            const { data } = await axiosInstance.get('/system/availability', { params });
            return data;
        } catch (error) {
            console.error('Error checking availability:', error);
            return { available: false, reason: 'Failed to check availability' };
        }
    },

    /**
     * Clear client-side cache (force next request to fetch fresh data)
     */
    clearCache: () => {
        cachedStatus = null;
        cacheTimestamp = 0;
    },

    /**
     * Check if system is available (quick check using cached data)
     */
    isSystemAvailable: async (): Promise<boolean> => {
        try {
            const status = await SystemConfigService.getSystemStatus();
            return status.isAvailable;
        } catch {
            return false;
        }
    },

    /**
     * Get unavailability reason from status
     */
    getUnavailabilityReason: (status: SystemStatus): string => {
        if (status.maintenanceMode) return status.messages.maintenance || 'System under maintenance';
        if (status.isHolidayBreak) return status.messages.holiday || 'Holiday break';
        if (!status.withinBusinessHours) return status.messages.outsideHours || 'Outside business hours';
        if (status.areSlotsFull) return status.messages.slotsFull || 'No slots available';
        return 'Registration is currently unavailable';
    }
};

export default SystemConfigService;
