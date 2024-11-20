import axiosInstance from "../api"

export const AddressDetailsService = {
    getAddressDetails: async (uuid: string | undefined) => {
        const { data } = await axiosInstance.get(`/address-details/${uuid}`)
        return { data }
    }
}