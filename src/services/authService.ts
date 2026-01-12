import axiosInstance from "@api/index";

// Polling configuration
const POLL_INTERVAL = 1000; // 1 second
const MAX_POLL_ATTEMPTS = 60; // Max 60 seconds of polling

export interface RegistrationData {
    email: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    campus_to_enroll: string;
    campus_to_take_exam: string;
    college_description: string;
    course_description: string;
}

export interface QueuedRegistrationResponse {
    success: boolean;
    message: string;
    jobId?: string;
    position?: number;
    estimatedWaitTime?: number;
}

export interface JobStatusResponse {
    success: boolean;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    message: string;
    position?: number;
    estimatedWaitTime?: number;
    uuid?: string;
    hasBeenSaved?: boolean;
}

export const AuthService = {
    getDailyReservationLimit: async () => {
        try {
            const { data, status } = await axiosInstance.get('/daily-reservation-limit/get-all');
            return { data, status }
        } catch (error) {
            console.error('Error fetching daily reservation limit:', error);
            throw error;
        }
    },
    getNoOfSlotsRemaingByCampus: async () => {
        try {
            const { data, status } = await axiosInstance.get('/schedules/slots');
            return { data, status }
        } catch (error) {
            console.error('Error fetching no of slots remaining:', error);
            throw error;
        }
    },
    checkIfDailyReservationIsClosed: async () => {
        try {
            const { data, status } = await axiosInstance.get('/daily-reservation-limit/closed');
            return { data, status }
        } catch (error) {
            console.error('Error fetching daily reservation limit:', error);
            throw error;
        }
    },

    /**
     * Queue-based registration (recommended for high traffic)
     * Returns a job ID that can be polled for status
     */
    registerQueued: async (registrationData: RegistrationData): Promise<QueuedRegistrationResponse> => {
        try {
            const { data } = await axiosInstance.post('/auth/register-queued', registrationData);
            return data;
        } catch (error: any) {
            console.error('Error queueing registration:', error);
            throw error;
        }
    },

    /**
     * Get job status for queued registration
     */
    getJobStatus: async (jobId: string): Promise<JobStatusResponse> => {
        try {
            const { data } = await axiosInstance.get(`/auth/register/status/${jobId}`);
            return data;
        } catch (error: any) {
            console.error('Error getting job status:', error);
            throw error;
        }
    },

    /**
     * Register with automatic polling
     * Queues the registration and polls until complete or failed
     */
    registerWithPolling: async (
        registrationData: RegistrationData,
        onStatusUpdate?: (status: JobStatusResponse) => void
    ): Promise<JobStatusResponse> => {
        // Step 1: Queue the registration
        const queueResponse = await AuthService.registerQueued(registrationData);
        
        if (!queueResponse.success || !queueResponse.jobId) {
            return {
                success: false,
                status: 'failed',
                message: queueResponse.message || 'Failed to queue registration'
            };
        }

        const jobId = queueResponse.jobId;
        
        // Initial status update
        if (onStatusUpdate) {
            onStatusUpdate({
                success: true,
                status: 'pending',
                message: `Registration queued. Position: ${queueResponse.position}`,
                position: queueResponse.position,
                estimatedWaitTime: queueResponse.estimatedWaitTime
            });
        }

        // Step 2: Poll for status
        return new Promise((resolve) => {
            let attempts = 0;
            
            const poll = async () => {
                attempts++;
                
                try {
                    const status = await AuthService.getJobStatus(jobId);
                    
                    // Notify status update
                    if (onStatusUpdate) {
                        onStatusUpdate(status);
                    }

                    // Check if completed or failed
                    if (status.status === 'completed' || status.status === 'failed') {
                        resolve(status);
                        return;
                    }

                    // Continue polling if not done
                    if (attempts < MAX_POLL_ATTEMPTS) {
                        setTimeout(poll, POLL_INTERVAL);
                    } else {
                        // Timeout - but job may still complete
                        resolve({
                            success: false,
                            status: 'pending',
                            message: 'Registration is taking longer than expected. Please check your email in a few minutes.'
                        });
                    }
                } catch (error) {
                    // On error, retry a few times before giving up
                    if (attempts < MAX_POLL_ATTEMPTS) {
                        setTimeout(poll, POLL_INTERVAL * 2); // Wait longer on error
                    } else {
                        resolve({
                            success: false,
                            status: 'failed',
                            message: 'Unable to verify registration status. Please check your email.'
                        });
                    }
                }
            };

            // Start polling
            poll();
        });
    },

    /**
     * Get queue statistics
     */
    getQueueStats: async () => {
        try {
            const { data } = await axiosInstance.get('/auth/register/queue/stats');
            return data;
        } catch (error) {
            console.error('Error getting queue stats:', error);
            throw error;
        }
    },

    /**
     * Direct registration (fallback for low traffic)
     */
    registerDirect: async (registrationData: RegistrationData) => {
        try {
            const { data, status } = await axiosInstance.post('/auth/register', registrationData);
            return { data, status };
        } catch (error) {
            console.error('Error during direct registration:', error);
            throw error;
        }
    }
}