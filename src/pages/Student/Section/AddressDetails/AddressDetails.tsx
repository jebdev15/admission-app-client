import { ArrowBack, Place } from '@mui/icons-material'
import { Box, Button, CircularProgress, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'
import React from 'react'
import regions from './AddressJson/regions.json'
import provinces from './AddressJson/provinces.json'
import cities from './AddressJson/cities.json'
import barangays from './AddressJson/barangays.json'
import { AddressDetailsType } from './type'

const initialAddressDetails: AddressDetailsType['addressDetails'] = {
    region: '',
    regionCode: '',
    regionName: '',
    regionRegionName: '',
    province: '',
    provinceCode: '',
    provinceName: '',
    city: '',
    cityCode: '',
    cityName: '',
    barangay: '',
    barangayCode: '',
    barangayName: '',
    street: '',
    isSameAsHomeAddress: '',
    currentAddressRegionCode: '',
    currentAddressRegionName: '',
    currentAddressRegionRegionName: '',
    currentAddressProvinceCode: '',
    currentAddressProvinceName: '',
    currentAddressCityCode: '',
    currentAddressCityName: '',
    currentAddressBarangayCode: '',
    currentAddressBarangayName: '',
}
const AddressDetails = () => {
    // React.useEffect(() => {
        //     console.log({regions, filteredProvinces, filteredCities, filteredBarangays})
        // }, [regions, filteredProvinces, filteredCities, filteredBarangays])
        const [addressDetails, setAddressDetails] = React.useState<AddressDetailsType['addressDetails']>(initialAddressDetails)
        const handleChangeRegion = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value } = event.target
            if(provinceCode) {
                setAddressDetails((prevState: AddressDetailsType['addressDetails']) => ({
                    ...prevState,
                    [name]: value,
                    provinceCode: '',
                }))
            } else if(cityCode) {
                setAddressDetails((prevState: AddressDetailsType['addressDetails']) => ({
                    ...prevState,
                    [name]: value,
                    provinceCode: '',
                    cityCode: '',
                }))
            } else if(barangayCode) {
                setAddressDetails((prevState: AddressDetailsType['addressDetails']) => ({
                    ...prevState,
                    [name]: value,
                    provinceCode: '',
                    cityCode: '',
                    barangayCode: '',
                }))
            } else {
                setAddressDetails((prevState: AddressDetailsType['addressDetails']) => ({
                    ...prevState,
                    [name]: value,
                }))
            }
    }
    const handleChangeProvince = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        setAddressDetails((prevState: AddressDetailsType['addressDetails']) => ({
            ...prevState,
            [name]: value,
            cityCode: '',
            barangayCode: '',
        }))
    }
    const handleChangeCity = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target    
        setAddressDetails((prevState: AddressDetailsType['addressDetails']) => ({
            ...prevState,
            [name]: value,
            barangayCode: '',
        }))
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        setAddressDetails((prevState: AddressDetailsType['addressDetails']) => ({
            ...prevState,
            [name]: value
        }))
    }
    const {
        regionCode,
        provinceCode,
        cityCode,
        barangayCode,
        street
    } = addressDetails
    const filteredProvinces = provinces.filter((province) => province.regionCode === regionCode)
    const filteredCities = cities.filter((city) => city.provinceCode === provinceCode)
    const filteredBarangays = barangays.filter((barangay) => barangay.cityCode === cityCode)
    
    const regionName = regions.find((region) => region.code === regionCode)?.name
    const regionRegionName = regions.find((region) => region.code === regionCode)?.regionName
    const provinceName = filteredProvinces.find((province) => province.code === provinceCode)?.name
    const cityName = filteredCities.find((city) => city.code === cityCode)?.name
    const barangayName = filteredBarangays.find((barangay) => barangay.code === barangayCode)?.name
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
                      <IconButton aria-label="" onClick={() => context.setFilledOutForm({ ...context.filledOutForm, personalInformation: false })}>
                          <ArrowBack />
                      </IconButton>
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
                    >
                      <Place />
                      <Typography variant="body1" color="initial">Address Details</Typography>
                      <FormControl fullWidth>
                            <InputLabel id="label-select-region">Region</InputLabel>
                            <Select
                                labelId="label-select-region"
                                id="select-region"
                                name="regionCode"
                                value={regionCode}
                                onChange={handleChangeRegion}
                                required
                            >
                            <MenuItem value=""></MenuItem>
                            {regions.length > 0 && regions.map((region) => (
                                <MenuItem key={region.code} value={region.code}>{`${region.regionName}(${region.name})`}</MenuItem>
                            ))}
                            </Select>
                            <TextField name="regionName" value={regionName} />
                            <TextField name="regionRegionName" value={regionRegionName} />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-province">Province</InputLabel>
                            <Select
                                labelId="label-select-province"
                                id="select-provinceCode"
                                name="provinceCode"
                                value={provinceCode}
                                onChange={handleChangeProvince}
                                required
                            >
                            <MenuItem value=""></MenuItem>
                            {filteredProvinces.length > 0 && filteredProvinces.map((province) => (
                                <MenuItem key={province.code} value={province.code}>{province.name}</MenuItem>
                            ))}
                            </Select>
                            <TextField name="provinceName" value={provinceCode ? provinceName : ''} />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-city">City</InputLabel>
                            <Select
                                labelId="label-select-city"
                                id="select-city"
                                name="cityCode"
                                value={cityCode}
                                onChange={handleChangeCity}
                                required
                            >
                            <MenuItem value=""></MenuItem>
                            {filteredCities.length > 0 && filteredCities.map((city) => (
                                <MenuItem key={city.code} value={city.code}>{city.name}</MenuItem>
                            ))}
                            </Select>
                            <TextField name="cityName" value={cityCode ? cityName : ''} />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-barangay">Barangay</InputLabel>
                            <Select
                                labelId="label-select-barangay"
                                id="select-barangay"
                                name="barangayCode"
                                value={barangayCode}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value=""></MenuItem>
                                {filteredBarangays.length > 0 && filteredBarangays.map((barangay: any) => (
                                    <MenuItem key={barangay.code} value={barangay.code}>{barangay.name}</MenuItem>
                                ))}
                            </Select>
                            <TextField name="barangayName" value={barangayCode ? barangayName : ''} />
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField
                                id="textfield-street"
                                label="Street"
                                name="barangayCode"
                                value={street}
                                onChange={handleChange}
                            />
                        </FormControl>
                        {/* <FormControl fullWidth>
                            <InputLabel id="label-select-isSameAsHomeAddress">Current Address</InputLabel>
                            <Select
                                labelId="label-select-isSameAsHomeAddress"
                                id="select-isSameAsHomeAddress"
                                name="isSameAsHomeAddress"
                                value={isSameAsHomeAddress}
                                onChange={handleChange}
                                required
                            >
                            <MenuItem value=""></MenuItem>
                            <MenuItem value="Same as Home Address">Same as Home Address</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>
                        { isSameAsHomeAddress === 'Other' && (
                            <>
                            <FormControl fullWidth>
                                <InputLabel id="label-select-currentAddressRegionCode">Region</InputLabel>
                                <Select
                                    labelId="label-select-currentAddressRegionCode"
                                    id="select-currentAddressRegionCode"
                                    name="currentAddressRegionCode"
                                    value={currentAddressRegionCode}
                                    onChange={handleChange}
                                    required
                                >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="label-select-currentAddressProvince">Province</InputLabel>
                                <Select
                                    labelId="label-select-currentAddressProvince"
                                    id="select-currentAddressProvince"
                                    name="currentAddressProvinceCode"
                                    value={currentAddressProvinceCode}
                                    onChange={handleChange}
                                    required
                                >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="label-select-currentAddressCityCode">City</InputLabel>
                                <Select
                                    labelId="label-select-currentAddressCityCode"
                                    id="select-currentAddressCityCode"
                                    name="currentAddressCityCode"
                                    value={currentAddressCityCode}
                                    onChange={handleChange}
                                    required
                                >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="label-select-currentAddressBarangayCode">Barangay</InputLabel>
                                <Select
                                    labelId="label-select-currentAddressBarangayCode"
                                    id="select-currentAddressBarangayCode"
                                    name="currentAddressBarangayCode"
                                    value={currentAddressBarangayCode}
                                    onChange={handleChange}
                                    required
                                >
                                    <MenuItem value=""></MenuItem>
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                </Select>
                            </FormControl>
                            </>
                        )} */}
                        <FormControl fullWidth>
                            <Button 
                                type='submit'
                                variant="contained" 
                                color="primary" 
                                fullWidth
                            >
                                Next
                            </Button>
                        </FormControl>
                      </Box>
                  </Paper>
              </Box>
          </React.Suspense>
    )
}

export default React.memo(AddressDetails)