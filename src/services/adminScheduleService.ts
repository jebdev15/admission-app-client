import axios from '../api/index';

export const adminScheduleService = {
    getAllSchedules: async (token: string) => {
        const response = await axios.get('/admin/schedules/all', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    getScheduleById: async (scheduleId: string, token: string) => {
        const response = await axios.get(`/admin/schedules/${scheduleId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
};
