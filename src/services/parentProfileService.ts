import axiosInstance from "../api"

export const ParentProfileService = {
    getParentProfile: async (uuid: string) => {
        const { data } = await axiosInstance.get(`/parent-profiles/${uuid}`)
        return { data }
    },
    saveParentProfile: async (formData: FormData) => {
        const { data, status } = await axiosInstance.post('/parent-profiles/create', formData)
        return { data, status }
    },
    updateParentProfile: async (formData: FormData) => {
        const { data } = await axiosInstance.put('/parent-profiles/update', formData)
        return { data }
    }
}