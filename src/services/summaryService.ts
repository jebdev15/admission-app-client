import axiosInstance from "../api"

export const SummaryService = {
    getApplicantInitialInfo: async (uuid) => {
        const { data } = await axiosInstance.get(`/applicants/${uuid}/initial-info`)
        return { data }
    },
    getApplicantSummary: async (uuid) => {
        const { data } = await axiosInstance.get(`/applicants/${uuid}/summary`)
        return { data }
    },
}