import axiosInstance from "../api"

export const HomeAndFamilyBackgroundService = {
    getHomeAndFamilyBackground: async (uuid: string) => {
        const { data } = await axiosInstance.get(`/home-and-family-backgrounds/${uuid}`)
        return { data }
    },
    saveHomeAndFamilyBackground: async (formData: FormData) => {
        const { data, status } = await axiosInstance.post('/home-and-family-backgrounds/create', formData)
        return { data, status }
    },
    updateHomeAndFamilyBackground: async (formData: FormData) => {
        const { data, status } = await axiosInstance.put('/home-and-family-backgrounds/update', formData)
        return { data, status }
    },
}