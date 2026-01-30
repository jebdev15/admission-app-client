import axios from '../api/index';

export const adminReportService = {
    getScheduledExamReport: async (token: string) => {
        const response = await axios.get('/admin/reports/scheduled-exam-report', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    getSlotsSummary: async (token: string) => {
        const response = await axios.get('/admin/reports/slots-summary', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },

    getStatisticsSummary: async (token: string) => {
        const response = await axios.get('/admin/reports/statistics-summary', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
};
