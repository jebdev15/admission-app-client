import { Place } from '@mui/icons-material'
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import React from 'react'
import regions from './AddressJson/regions.json'
import provinces from './AddressJson/provinces.json'
import cities from './AddressJson/cities.json'
import barangays from './AddressJson/barangays.json'
import { AddressDetailsType } from './type'
import axiosInstance from '../../../../api'
import { useNavigate, useParams } from 'react-router'
import { AddressDetailsService } from '../../../../services/addressDetailsService'
import { LoadingButton } from '@mui/lab'

const initialAddressDetails: AddressDetailsType = {
    region: '',
    region_code: '',
    region_name: '',
    regione_region_name: '',
    province: '',
    province_code: '',
    province_name: '',
    city: '',
    city_code: '',
    city_name: '',
    barangay: '',
    barangay_code: '',
    barangay_name: '',
    street: '',
    is_same_as_home_address: '',
    current_address_region_code: '',
    current_address_region_name: '',
    current_address_region_region_name: '',
    current_address_province_code: '',
    current_address_province_name: '',
    current_address_city_code: '',
    current_address_city_name: '',
    current_address_barangay_code: '',
    current_address_barangay_name: '',
    current_address_street: '',
}
const AddressDetails = () => {
    const navigate = useNavigate()
    const { uuid } = useParams<{uuid: string}>()
    const [addressDetails, setAddressDetails] = React.useState<AddressDetailsType>(initialAddressDetails)
    const [loading, setLoading] = React.useState<boolean>(false)
    const handleChangeRegion = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target
        if(addressDetails.province_code) {
            setAddressDetails((prevState: AddressDetailsType) => ({
                ...prevState,
                [name]: value,
                provinceCode: '',
            }))
        } else if(addressDetails.city_code) {
            setAddressDetails((prevState: AddressDetailsType) => ({
                ...prevState,
                [name]: value,
                provinceCode: '',
                cityCode: '',
            }))
        } else if(addressDetails.barangay_code) {
            setAddressDetails((prevState: AddressDetailsType) => ({
                ...prevState,
                [name]: value,
                provinceCode: '',
                cityCode: '',
                barangayCode: '',
            }))
        } else {
            setAddressDetails((prevState: AddressDetailsType) => ({
                ...prevState,
                [name]: value,
            }))
        }
    }
    const handleChangeProvince = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target
        setAddressDetails((prevState: AddressDetailsType) => ({
            ...prevState,
            [name]: value,
            city_code: '',
            barangay_code: '',
        }))
    }
    const handleChangeCity = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target    
        setAddressDetails((prevState: AddressDetailsType) => ({
            ...prevState,
            [name]: value,
            barangayCode: '',
        }))
    }
    const handleChangeBarangay = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target    
        setAddressDetails((prevState: AddressDetailsType) => ({
            ...prevState,
            [name]: value,
        }))
    }
    const handleChangeSelect = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target    
        setAddressDetails((prevState: AddressDetailsType) => ({
            ...prevState,
            [name]: value,
        }))
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        setAddressDetails((prevState: AddressDetailsType) => ({
            ...prevState,
            [name]: value
        }))
    }
    const handleChangeCurrentAddressRegion = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target
        if(addressDetails.current_address_province_code) {
            setAddressDetails((prevState: AddressDetailsType) => ({
                ...prevState,
                [name]: value,
                provinceCode: '',
            }))
        } else if(addressDetails.current_address_city_code) {
            setAddressDetails((prevState: AddressDetailsType) => ({
                ...prevState,
                [name]: value,
                provinceCode: '',
                cityCode: '',
            }))
        } else if(addressDetails.current_address_barangay_code) {
            setAddressDetails((prevState: AddressDetailsType) => ({
                ...prevState,
                [name]: value,
                provinceCode: '',
                cityCode: '',
                barangayCode: '',
            }))
        } else {
            setAddressDetails((prevState: AddressDetailsType) => ({
                ...prevState,
                [name]: value,
            }))
        }
    }
    const handleChangeCurrentAddressProvince = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target
        setAddressDetails((prevState: AddressDetailsType) => ({
            ...prevState,
            [name]: value,
            city_code: '',
            barangay_code: '',
        }))
    }
    const handleChangeCurrentAddressCity = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target    
        setAddressDetails((prevState: AddressDetailsType) => ({
            ...prevState,
            [name]: value,
            barangayCode: '',
        }))
    }
    const handleChangeCurrentAddressBarangay = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target    
        setAddressDetails((prevState: AddressDetailsType) => ({
            ...prevState,
            [name]: value,
        }))
    }
    const handleChangeCurrentAddress = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        setAddressDetails((prevState: AddressDetailsType) => ({
            ...prevState,
            [name]: value
        }))
    }
    const homeAddressRegions = regions
    const filteredProvinces = provinces.filter((province) => province.regionCode === addressDetails.region_code)
    const filteredCities = cities.filter((city) => city.provinceCode === addressDetails.province_code)
    const filteredBarangays = barangays.filter((barangay) => barangay.cityCode === addressDetails.city_code)
    
    const currentAddressRegions = regions
    const filteredCurrentAddressProvinces = provinces.filter((province) => province.regionCode === addressDetails.region_code)
    const filteredCurrentAddressCities = cities.filter((city) => city.provinceCode === addressDetails.province_code)
    const filteredCurrentAddressBarangays = barangays.filter((barangay) => barangay.cityCode === addressDetails.city_code)

    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const confirmation = window.confirm('Are you sure to proceed to next form? You can\'t edit your Address Details after proceeding.');
        if(!confirmation) return
        setLoading(true)
        const regionName = regions.find((region) => region.code === addressDetails.region_code)?.name
        const regionRegionName = regions.find((region) => region.code === addressDetails.region_code)?.regionName
        const provinceName = filteredProvinces.find((province) => province.code === addressDetails.province_code)?.name
        const cityName = filteredCities.find((city) => city.code === addressDetails.city_code)?.name
        const barangayName = filteredBarangays.find((barangay) => barangay.code === addressDetails.barangay_code)?.name
        const formData = new FormData(event.currentTarget)
        formData.append('region_name', regionName)
        formData.append('region_region_name', regionRegionName)
        formData.append('province_name', provinceName)
        formData.append('city_name', cityName)
        formData.append('barangay_name', barangayName)
        formData.append('uuid', uuid ?? '')
        const { data, status } = await axiosInstance.post('/address-details/create', formData)
        console.log(data, status)
        if([200, 201, 204].includes(status)) setTimeout(() => navigate('.'), 1000)
    } 
    const getAddressDetails = async (uuid: string) => {
        const { data } = await AddressDetailsService.getAddressDetails(uuid)
        if(data.length > 0) {
            setAddressDetails(data[0])
        }
    }
    React.useEffect(() => {
        getAddressDetails(uuid)
    },[uuid])
    const disableButton = !addressDetails.region_code || !addressDetails.province_code || !addressDetails.city_code || !addressDetails.barangay_code || !addressDetails.street || !addressDetails.is_same_as_home_address
    return (
      <React.Suspense fallback={<CircularProgress />}>
              <Box
                  sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      height: '100%',
                      padding: '1rem',
                      width: { xs: '320px', md: '678px'},
                      gap: 1
                  }}
              >
                  <Paper>
                      <Box
                          component="form"
                          sx={{ 
                              display: 'flex', 
                              flexDirection: 'column',
                              justifyContent: 'center', 
                              alignItems: 'center', 
                              width: { xs: '320px', md: '678px'},
                              padding: '1rem',
                              gap: 1
                          }}
                          onSubmit={submitForm}
                    >
                      <Place />
                      <Typography variant="body1" color="initial">Address Details</Typography>
                      <FormControl fullWidth>
                            <InputLabel id="label-select-region">Region</InputLabel>
                            <Select
                                labelId="label-select-region"
                                id="select-region"
                                name="region_code"
                                value={addressDetails.region_code}
                                onChange={handleChangeRegion}
                                required
                            >
                            <MenuItem value=""></MenuItem>
                            {homeAddressRegions.length > 0 && homeAddressRegions.map((region) => (
                                <MenuItem key={region.code} value={region.code}>{`${region.regionName}(${region.name})`}</MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-province">Province</InputLabel>
                            <Select
                                labelId="label-select-province"
                                id="select-provinceCode"
                                name="province_code"
                                value={addressDetails.province_code}
                                onChange={handleChangeProvince}
                                required
                            >
                            <MenuItem value=""></MenuItem>
                            {filteredProvinces.length > 0 && filteredProvinces.map((province) => (
                                <MenuItem key={province.code} value={province.code}>{province.name}</MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-city">City</InputLabel>
                            <Select
                                labelId="label-select-city"
                                id="select-city"
                                name="city_code"
                                value={addressDetails.city_code}
                                onChange={handleChangeCity}
                                required
                            >
                            <MenuItem value=""></MenuItem>
                            {filteredCities.length > 0 && filteredCities.map((city) => (
                                <MenuItem key={city.code} value={city.code}>{city.name}</MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-barangay">Barangay</InputLabel>
                            <Select
                                labelId="label-select-barangay"
                                id="select-barangay"
                                name="barangay_code"
                                value={addressDetails.barangay_code}
                                onChange={handleChangeBarangay}
                                required
                            >
                                <MenuItem value=""></MenuItem>
                                {filteredBarangays.length > 0 && filteredBarangays.map((barangay) => (
                                    <MenuItem key={barangay.code} value={barangay.code}>{barangay.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField
                                id="textfield-street"
                                label="Street"
                                name="street"
                                value={addressDetails.street}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-isSameAsHomeAddress">Current Address</InputLabel>
                            <Select
                                labelId="label-select-isSameAsHomeAddress"
                                id="select-isSameAsHomeAddress"
                                name="is_same_as_home_address"
                                value={addressDetails.is_same_as_home_address}
                                onChange={handleChangeSelect}
                                required
                            >
                            <MenuItem value=""></MenuItem>
                            <MenuItem value="Same as Home Address">Same as Home Address</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>
                        { addressDetails.is_same_as_home_address === 'Other' && (
                            <>
                            <FormControl fullWidth>
                                <InputLabel id="label-select-current_address_region_code">Region</InputLabel>
                                <Select
                                    labelId="label-select-current_address_region_code"
                                    id="select-current_address_region_code"
                                    name="current_address_region_code"
                                    value={addressDetails.current_address_region_code}
                                    onChange={handleChangeCurrentAddressRegion}
                                    required
                                >
                                <MenuItem value=""></MenuItem>
                                {currentAddressRegions.length > 0 && currentAddressRegions.map((region) => (
                                    <MenuItem key={region.code} value={region.code}>{`${region.regionName}(${region.name})`}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                            <InputLabel id="label-select-current_address_province_code">Province</InputLabel>
                            <Select
                                labelId="label-select-current_address_province_code"
                                id="select-current_address_province_code"
                                name="current_address_province_code"
                                value={addressDetails.current_address_province_code}
                                onChange={handleChangeCurrentAddressProvince}
                                required
                            >
                            <MenuItem value=""></MenuItem>
                            {filteredCurrentAddressProvinces.length > 0 && filteredCurrentAddressProvinces.map((province) => (
                                <MenuItem key={province.code} value={province.code}>{province.name}</MenuItem>
                            ))}
                            </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="label-select-current_address_city_code">City</InputLabel>
                                <Select
                                    labelId="label-select-current_address_city_code"
                                    id="select-current_address_city_code"
                                    name="current_address_city_code"
                                    value={addressDetails.current_address_city_code}
                                    onChange={handleChangeCurrentAddressCity}
                                    required
                                >
                                <MenuItem value=""></MenuItem>
                                {filteredCurrentAddressCities.length > 0 && filteredCurrentAddressCities.map((city) => (
                                    <MenuItem key={city.code} value={city.code}>{city.name}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="label-select-current_address_barangay_code">Barangay</InputLabel>
                                <Select
                                    labelId="label-select-current_address_barangay_code"
                                    id="select-current_address_barangay_code"
                                    name="current_address_barangay_code"
                                    value={addressDetails.current_address_barangay_code}
                                    onChange={handleChangeCurrentAddressBarangay}
                                    required
                                >
                                    <MenuItem value=""></MenuItem>
                                    {filteredCurrentAddressBarangays.length > 0 && filteredCurrentAddressBarangays.map((barangay) => (
                                        <MenuItem key={barangay.code} value={barangay.code}>{barangay.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <TextField
                                    id="textfield-street"
                                    label="Street"
                                    name="current_address_street"
                                    value={addressDetails.current_address_street}
                                    onChange={handleChangeCurrentAddress}
                                />
                            </FormControl>
                            </>
                        )}
                        <FormControl fullWidth>
                            {/* <Button 
                                type='submit'
                                variant="contained" 
                                color="primary" 
                                fullWidth
                            >
                                Next
                            </Button> */}
                            <LoadingButton
                                    type="submit" // Assigning the type property
                                    variant="contained"
                                    color="primary"
                                    loading={loading}
                                    disabled={disableButton}
                                >
                                  {loading ? 'Submitting...' : 'Submit'}
                            </LoadingButton>
                        </FormControl>
                      </Box>
                  </Paper>
              </Box>
          </React.Suspense>
    )
}

export default React.memo(AddressDetails)