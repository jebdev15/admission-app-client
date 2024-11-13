import axiosInstance from "../api"

export const HealthService = {
    getHealth: async (uuid: string) => {
        const { data } = await axiosInstance.get(`/health/${uuid}`)
        return { data }
    },
    saveHealth: async (formData: FormData) => {
        const { data, status } = await axiosInstance.post('/health/create', formData)
        return { data, status }
    }
}