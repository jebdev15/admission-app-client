import axiosInstance from "@api/index"

export interface InitialApplicantInfo {
    first_name: string;
    last_name: string;
    date_of_birth: string;
}

export const PersonalInformationService = {
    getPersonalInformation: async (uuid: string) => {
        const { data } = await axiosInstance.get(`/personal-information/${uuid}`)
        return { data } 
    },
    getInitialApplicantInfo: async (uuid: string): Promise<InitialApplicantInfo | null> => {
        try {
            const { data } = await axiosInstance.get(`/applicants/${uuid}/initial-info`)
            return data
        } catch (error) {
            console.error('Error fetching initial applicant info:', error)
            return null
        }
    }
}