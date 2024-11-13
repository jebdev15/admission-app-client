import axiosInstance from "../api"

export const AddressDetailsService = {
    getAddressDetails: async (uuid: string) => {
        const { data } = await axiosInstance.get(`/address-details/${uuid}`)
        return { data }
    }
}