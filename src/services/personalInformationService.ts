import axiosInstance from "@api/index"

export const PersonalInformationService = {
    getPersonalInformation: async (uuid: string) => {
        const { data } = await axiosInstance.get(`/personal-information/${uuid}`)
        return { data } 
    }
}