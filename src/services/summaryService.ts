import axiosInstance from "../api"

export const SummaryService = {
    getApplicantSummary: async (uuid: string | undefined, signal: AbortSignal) => {
        const { data } = await axiosInstance.get(`/applicants/${uuid}/summary`, { signal })
        return { data }
    },
    getApplicantImage: async (uuid: string | undefined, signal: AbortSignal) => {
        const { data } = await axiosInstance.get(`/images/${uuid}`, { signal })
        return { data }
    }
}