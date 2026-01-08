/**
 * Submission Service
 * Handles queued form submissions with batch processing support
 */

import axiosInstance from "@api/index";

export interface ImageData {
    photoBase64: string;
    fileName: string;
}

export interface SubmissionData {
    uuid: string;
    personalInformation?: {
        first_name: string;
        middle_name?: string;
        last_name: string;
        suffix?: string;
        lrn: string;
        date_of_birth?: string;
        place_of_birth?: string;
        gender?: string;
        civil_status?: string;
        nationality?: string;
        religion?: string;
        other_religion?: string;
        mobile_no?: string;
        student_type?: string;
        strand?: string;
        track?: string;
        is_solo_parent?: string;
        is_indigenous_group?: string;
        indigenous_group?: string;
        school_last_attended?: string;
        type_of_school?: string;
        has_scholarship_or_financial_aid?: string;
        scholarship_or_financial_aid?: string;
    };
    addressDetails?: {
        region?: string;
        province?: string;
        city_municipality?: string;
        barangay?: string;
        street?: string;
        is_same_as_home_address?: string;
        current_address_region?: string;
        current_address_province?: string;
        current_address_city_municipality?: string;
        current_address_barangay?: string;
        current_address_street?: string;
    };
    parentProfile?: {
        father_highest_educational_attainment?: string;
        father_occupation?: string;
        mother_highest_educational_attainment?: string;
        mother_occupation?: string;
        is_living_with_guardian?: string;
    };
    homeAndFamilyBackground?: {
        no_of_siblings_gainfully_employed?: number;
        who_finances_your_schooling?: string;
        is_four_ps_beneficiary?: string;
        four_ps_id_no?: string;
        is_first_gen_student?: string;
        household_monthly_income?: string;
        nature_of_residence?: string;
    };
    health?: {
        is_pwd?: string;
        pwd_id_no?: string;
        is_sped?: string;
        specify_sped?: string;
        has_siblings_studying_in_chmsu?: string;
        has_relatives_studying_in_chmsu?: string;
    };
    schedule?: {
        schedule_date: string;
        schedule_time: string;
    };
    image?: ImageData | null;
}

export interface QueueResponse {
    success: boolean;
    message: string;
    jobId?: string;
    position?: number;
    estimatedWaitTime?: number;
    uuid?: string;
    error?: string;
}

export interface JobStatus {
    success: boolean;
    jobId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    position?: number;
    createdAt?: string;
    result?: {
        success: boolean;
        message: string;
        uuid: string;
    };
    error?: string;
}

export interface QueueStats {
    success: boolean;
    queueLength: number;
    processing: boolean;
    processedCount: number;
    failedCount: number;
    batchSize: number;
    maxQueueSize: number;
    uptime: number;
}

/**
 * SubmissionService - handles queued and direct form submissions
 */
export const SubmissionService = {
    /**
     * Submit complete application form with queue support
     * Used for high-traffic scenarios
     */
    submitApplicationQueued: async (data: SubmissionData): Promise<QueueResponse> => {
        try {
            const response = await axiosInstance.post('/submissions/submit', data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                return error.response.data;
            }
            throw error;
        }
    },

    /**
     * Submit complete application form directly
     * Used for lower-traffic scenarios
     */
    submitApplicationDirect: async (data: SubmissionData): Promise<QueueResponse> => {
        try {
            const response = await axiosInstance.post('/submissions/submit-direct', data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                return error.response.data;
            }
            throw error;
        }
    },

    /**
     * Get job status by job ID
     */
    getJobStatus: async (jobId: string): Promise<JobStatus> => {
        try {
            const response = await axiosInstance.get(`/submissions/job/${jobId}`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                return error.response.data;
            }
            throw error;
        }
    },

    /**
     * Get current queue statistics
     */
    getQueueStats: async (): Promise<QueueStats> => {
        try {
            const response = await axiosInstance.get('/submissions/queue/stats');
            return response.data;
        } catch (error: any) {
            if (error.response) {
                return error.response.data;
            }
            throw error;
        }
    },

    /**
     * Poll for job completion with timeout
     * @param jobId - The job ID to poll
     * @param maxAttempts - Maximum polling attempts
     * @param intervalMs - Polling interval in milliseconds
     */
    pollJobCompletion: async (
        jobId: string, 
        maxAttempts: number = 60, 
        intervalMs: number = 2000,
        onStatusUpdate?: (status: JobStatus) => void
    ): Promise<JobStatus> => {
        let attempts = 0;

        return new Promise((resolve, reject) => {
            const poll = async () => {
                try {
                    attempts++;
                    const status = await SubmissionService.getJobStatus(jobId);
                    
                    if (onStatusUpdate) {
                        onStatusUpdate(status);
                    }

                    if (status.status === 'completed' || status.status === 'failed') {
                        resolve(status);
                        return;
                    }

                    if (attempts >= maxAttempts) {
                        reject(new Error('Polling timeout - job may still be processing'));
                        return;
                    }

                    setTimeout(poll, intervalMs);
                } catch (error) {
                    if (attempts >= maxAttempts) {
                        reject(error);
                        return;
                    }
                    setTimeout(poll, intervalMs);
                }
            };

            poll();
        });
    },

    /**
     * Submit registration and poll for result
     * Combines enqueue and polling into single operation
     */
    submitAndWait: async (
        data: SubmissionData,
        onStatusUpdate?: (status: JobStatus | QueueResponse) => void
    ): Promise<JobStatus> => {
        // First, submit to queue
        const queueResponse = await SubmissionService.submitApplicationQueued(data);
        
        if (!queueResponse.success || !queueResponse.jobId) {
            throw new Error(queueResponse.message || 'Failed to queue submission');
        }

        if (onStatusUpdate) {
            onStatusUpdate(queueResponse);
        }

        // Then poll for completion
        return await SubmissionService.pollJobCompletion(
            queueResponse.jobId,
            120, // 2 minute timeout (120 * 2s = 240s)
            2000,
            onStatusUpdate
        );
    }
};

export default SubmissionService;
