import axiosInstance from "../api"

export const SchedulesService = {
    getApplicantInitialInfo: async (uuid) => {
        const { data } = await axiosInstance.get(`/applicants/${uuid}/initial-info`)
        return { data }
    },
    getSchedules: async () => {
        const { data } = await axiosInstance.get('/schedules')
        return { data }
    },
    saveSchedule: async (formData: FormData) => {
        const { data } = await axiosInstance.get('/schedules/create', formData)
        return { data }
    }
}