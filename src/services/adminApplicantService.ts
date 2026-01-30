import axios from '../api/index';

export const adminApplicantService = {
    getAllApplicantsWithDetails: async (token: string) => {
        const response = await axios.get('/admin/applicants-management/all', {
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
        return response.data;
    }
};
