import axiosInstance from "../api"

export const PersonalInformationService = {
    getPersonalInformation: async (uuid: string) => {
        const { data } = await axiosInstance.get(`/personal-information/${uuid}`)
        return { data } 
    }
}