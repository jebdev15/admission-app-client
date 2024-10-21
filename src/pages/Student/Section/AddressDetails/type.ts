export interface AddressDetailsType {
    addressDetails: {
        region: string
        regionCode: string
        regionName: string
        regionRegionName: string
        province: string
        provinceCode: string
        provinceName: string
        city: string
        cityCode: string
        cityName: string
        barangay: string
        barangayCode: string
        barangayName: string
        street: string
        isSameAsHomeAddress: string
        currentAddressRegionCode: string
        currentAddressRegionName: string
        currentAddressRegionRegionName: string
        currentAddressProvinceCode: string
        currentAddressProvinceName: string
        currentAddressCityCode: string
        currentAddressCityName: string
        currentAddressBarangayCode: string
        currentAddressBarangayName: string
        handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
        submitForm: (event: React.FormEvent<HTMLFormElement>) => void
    }
}