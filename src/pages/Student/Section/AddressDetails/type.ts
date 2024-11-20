export interface AddressDetailsType {
    region: string
    region_code: string
    region_name: string
    regione_region_name: string
    province: string
    province_code: string
    province_name: string
    city: string
    city_code: string
    city_name: string
    barangay: string
    barangay_code: string
    barangay_name: string
    street: string,
    is_same_as_home_address: string
    current_address_region_code: string
    current_address_region_name: string
    current_address_region_region_name: string
    current_address_province_code: string
    current_address_province_name: string
    current_address_city_code: string
    current_address_city_name: string
    current_address_barangay_code: string
    current_address_barangay_name: string
    current_address_street: string
}
export interface AddressItem {
    code: string;
    name?: string;
    regionName?: string;
}