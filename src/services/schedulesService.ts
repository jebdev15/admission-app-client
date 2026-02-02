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
}

export const SchedulesService = {
    /**
     * Get applicant initial info
     */
    getApplicantInitialInfo: async (uuid: string) => {
        const { data } = await axiosInstance.get(`/applicants/${uuid}/initial-info`)
        return { data }
    },

    /**
     * Get schedules by UUID
     */
    getSchedules: async (uuid: string | undefined): Promise<{ data: ScheduleData[] }> => {
        if (!uuid) {
            return { data: [] };
        }
        const { data } = await axiosInstance.get(`/schedules/${uuid}`);
        return { data };
    },

    /**
     * Get schedules by campus name
     */
    getSchedulesByCampus: async (campus: string): Promise<{ data: ScheduleData[] }> => {
        const { data } = await axiosInstance.get(`/schedules/campus/${campus}`);
        return { data };
    },

    /**
     * Get slots remaining
     */
    getSlotsRemaining: async (): Promise<{ data: SlotsRemainingResponse }> => {
        const { data } = await axiosInstance.get('/schedules/slots');
        return { data };
    },

    /**
     * Update applicant schedule ID
     */
    updateApplicantScheduleId: async (formData: FormData) => {
        const { data, status } = await axiosInstance.put('/applicants/schedule', formData)
        return { data, status }
    }
}