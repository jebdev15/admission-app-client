import { Place } from '@mui/icons-material'
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import React from 'react'
import regions from './AddressJson/regions.json'
import provinces from './AddressJson/provinces.json'
import cities from './AddressJson/cities-municipalities.json'
import barangays from './AddressJson/barangays.json'
import { AddressDetailsType, AddressItem } from './type'
import axiosInstance from '../../../../api'
import { useNavigate, useParams } from 'react-router'
import { LoadingButton } from '@mui/lab'
// Define types for better type safety

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
    const { uuid } = useParams<{uuid: string | undefined}>()
    const [addressDetails, setAddressDetails] = React.useState<AddressDetailsType>(initialAddressDetails)
    const [loading, setLoading] = React.useState<boolean>(false)
    const handleChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target
        setAddressDetails((prevState) => {
            const updatedState = { ...prevState, [name]: value };
    
            // Field-specific resets
            if (name === 'region_code') {
                updatedState.province_code = '';
                updatedState.city_code = '';
                updatedState.barangay_code = '';
            } else if (name === 'province_code') {
                updatedState.city_code = '';
                updatedState.barangay_code = '';
            } else if (name === 'city_code') {
                updatedState.barangay_code = '';
            } else if (name === 'current_address_region_code') {
                updatedState.current_address_province_code = '';
                updatedState.current_address_city_code = '';
                updatedState.current_address_barangay_code = '';
            } else if (name === 'current_address_province_code') {
                updatedState.current_address_city_code = '';
                updatedState.current_address_barangay_code = '';
            } else if (name === 'current_address_city_code') {
                updatedState.current_address_barangay_code = '';
            }
            console.log(name,value)
            return updatedState;
        });
    }
    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        setAddressDetails((prevState: AddressDetailsType) => ({
            ...prevState,
            [name]: value
        }))
    }
    const homeAddress = {
        regions,
        provinces,
        cities,
        barangays
    }
    const currentAddress = {
        regions,
        provinces,
        cities,
        barangays
    }
    
    const filteredProvinces = homeAddress.provinces.filter((province) => province.regionCode === addressDetails.region_code)
    const filteredCities = homeAddress.cities.filter((city) => city.provinceCode === addressDetails.province_code)
    // const filteredBarangays = homeAddress.barangays.filter((barangay: { cityCode: string; }) => barangay.cityCode === addressDetails.city_code)
    const filteredBarangays = homeAddress.barangays.filter((barangay: { cityCode: string | boolean; municipalityCode: string | boolean }) => {
        if (barangay.municipalityCode === false) {
          return barangay.cityCode === addressDetails.city_code;
        } else {
          return barangay.municipalityCode === addressDetails.city_code;
        }
      }
    );
    
    const filteredCurrentAddressProvinces = currentAddress.provinces.filter((province) => province.regionCode === addressDetails.current_address_region_code)
    const filteredCurrentAddressCities = currentAddress.cities.filter((city) => city.provinceCode === addressDetails.current_address_province_code)
    // const filteredCurrentAddressBarangays = currentAddress.barangays.filter((barangay: { cityCode: string; }) => barangay.cityCode === addressDetails.current_address_city_code)
    const filteredCurrentAddressBarangays = currentAddress.barangays.filter(
        (barangay: { cityCode: string | boolean; municipalityCode: string | boolean }) => {
          if (barangay.municipalityCode === false) {
            return barangay.cityCode === addressDetails.current_address_city_code;
          } else {
            return barangay.municipalityCode === addressDetails.current_address_city_code;
          }
        }
      );
      
    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const confirmation = window.confirm('Are you sure to proceed to next form? You can\'t edit your Address Details after proceeding.');
        if(!confirmation) return
        setLoading(true)

        // Helper function to find a name by code
        const findNameByCode = <T extends AddressItem>(
            list: T[],
            code: string,
            key: keyof T = 'name'
        ): string => {
            return list.find(item => item.code === code)?.[key] as string || '';
        };

        // Extract values using the helper function
        const region_name = findNameByCode(homeAddress.regions, addressDetails.region_code, 'name');
        const region_region_name = findNameByCode(homeAddress.regions, addressDetails.region_code, 'regionName');
        const province_name = findNameByCode(filteredProvinces, addressDetails.province_code);
        const city_name = findNameByCode(filteredCities, addressDetails.city_code);
        const barangay_name = findNameByCode(filteredBarangays, addressDetails.barangay_code);

        // Current address fields (use same logic if they are similar to above)
        const current_address_region_name = findNameByCode(currentAddress.regions, addressDetails.current_address_region_code, 'name');
        const current_address_region_region_name = findNameByCode(currentAddress.regions, addressDetails.current_address_region_code, 'regionName');
        const current_address_province_name = findNameByCode(filteredCurrentAddressProvinces, addressDetails.current_address_province_code);
        const current_address_city_name = findNameByCode(filteredCurrentAddressCities, addressDetails.current_address_city_code);
        const current_address_barangay_name = findNameByCode(filteredCurrentAddressBarangays, addressDetails.current_address_barangay_code);

        const formData = new FormData(event.currentTarget as HTMLFormElement)
        formData.append('region_name', region_name)
        formData.append('region_region_name', region_region_name)
        formData.append('province_name', province_name)
        formData.append('city_name', city_name)
        formData.append('barangay_name', barangay_name)
        formData.append('current_address_region_name', current_address_region_name)
        formData.append('current_address_region_region_name', current_address_region_region_name)
        formData.append('current_address_province_name', current_address_province_name)
        formData.append('current_address_city_name', current_address_city_name)
        formData.append('current_address_barangay_name', current_address_barangay_name)
        formData.append('uuid', uuid ?? '')
        const { data, status } = await axiosInstance.post('/address-details/create', formData)
        console.log(data, status)
        if([200, 201, 204].includes(status)) setTimeout(() => navigate('.'), 1000)
    } 
    const disableButton = !addressDetails.region_code || !addressDetails.province_code || !addressDetails.city_code || !addressDetails.barangay_code || !addressDetails.street || !addressDetails.is_same_as_home_address
    return (
      <React.Suspense fallback={<CircularProgress />}>
              <Box
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    padding: {xs: 0, sm: 2},
                    gap: 1,
                }}
            >
                  <Paper sx={{ width: "100%", maxWidth: "1000px", borderRadius: {xs: 0, sm:2}}}>
                    <Box
                        component="form"
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            justifyContent: 'center', 
                            alignItems: 'center',
                            padding: {xs: 2, sm: 4},
                            gap: 3,
                            width: '100%',
                        }}
                        onSubmit={submitForm}
                    >
                      <Box sx={{display: 'flex', flexDirection: {xs: 'column-reverse', sm: 'row'}, rowGap: 2, alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                        <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, columnGap: 1, alignItems: 'center'}}>
                          <Place sx={{ color: 'primary.main', fontSize: '3rem' }} />
                          <Typography variant="h6" color="primary">Address Details</Typography>
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 0, alignItems: {xs: 'center', sm: 'flex-end'}}}>
                          <Typography variant="body1" color='textSecondary' sx={{fontWeight: 'bold'}}>CHMSU Admission Portal</Typography>
                          <Typography variant="body1" color='textSecondary' sx={{fontWeight: 'bold'}}>Academic Year 2025 - 2026</Typography>
                        </Box>
                      </Box>
                      <Grid container rowSpacing={3} columnSpacing={2} sx={{ width: '100%' }}>
                      <Typography variant="h6" color="initial" textAlign={{xs: 'center', sm: 'left'}} sx={{ width: '100%', mt: 1 }}>Home Address</Typography>
                      <Grid size={{ xs: 12 }}>
                          <FormControl fullWidth>
                                <InputLabel id="label-select-region">Region</InputLabel>
                                <Select
                                    labelId="label-select-region"
                                    id="select-region"
                                    name="region_code"
                                    value={addressDetails.region_code}
                                    onChange={handleChange}
                                    label="Region"
                                    required
                                    sx={{ borderRadius: 2 }}
                                    inputProps={{sx: {whiteSpace: "normal !important"}}}
                                >
                                <MenuItem value="" sx={{whiteSpace: "normal"}}></MenuItem>
                                {homeAddress.regions.length > 0 && homeAddress.regions.map((region) => (
                                    <MenuItem key={region.code} value={region.code} sx={{whiteSpace: "normal"}}>{`${region.regionName}(${region.name})`}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                      </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel id="label-select-province">Province</InputLabel>
                                <Select
                                    labelId="label-select-province"
                                    id="select-provinceCode"
                                    name="province_code"
                                    value={addressDetails.province_code}
                                    onChange={handleChange}
                                    label="Province"
                                    required={filteredProvinces.length > 0}
                                    sx={{ borderRadius: 2 }}
                                    inputProps={{sx: {whiteSpace: "normal !important"}}}
                                >
                                <MenuItem value="" sx={{whiteSpace: "normal"}}></MenuItem>
                                {filteredProvinces.length > 0 && filteredProvinces.map((province) => (
                                    <MenuItem key={province.code} value={province.code} sx={{whiteSpace: "normal"}}>{province.name}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel id="label-select-city">City/Municipality</InputLabel>
                                <Select
                                    labelId="label-select-city"
                                    id="select-city"
                                    name="city_code"
                                    value={addressDetails.city_code}
                                    onChange={handleChange}
                                    label="City"
                                    required={filteredCities.length > 0}
                                    sx={{ borderRadius: 2 }}
                                    inputProps={{sx: {whiteSpace: "normal !important"}}}
                                >
                                <MenuItem value="" sx={{whiteSpace: "normal"}}></MenuItem>
                                {filteredCities.length > 0 && filteredCities.map((city) => (
                                    <MenuItem key={city.code} value={city.code} sx={{whiteSpace: "normal"}}>{city.name}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel id="label-select-barangay">Barangay</InputLabel>
                                <Select
                                    labelId="label-select-barangay"
                                    id="select-barangay"
                                    name="barangay_code"
                                    value={addressDetails.barangay_code}
                                    onChange={handleChange}
                                    label="Barangay"
                                    required={filteredBarangays.length > 0}
                                    sx={{ borderRadius: 2 }}
                                    inputProps={{sx: {whiteSpace: "normal !important"}}}
                                >
                                    <MenuItem value="" sx={{whiteSpace: "normal"}}></MenuItem>
                                    {filteredBarangays.length > 0 && filteredBarangays.map((barangay: { code: string; name: string; }) => (
                                        <MenuItem key={barangay.code} value={barangay.code} sx={{whiteSpace: "normal"}}>{barangay.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <TextField
                                    id="textfield-street"
                                    label="Street"
                                    name="street"
                                    value={addressDetails.street}
                                    onChange={handleChangeInput}
                                    sx={{ '& .MuiInputBase-root': { borderRadius: 2 }}}
                                />
                            </FormControl>
                        </Grid>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-isSameAsHomeAddress">Current Address</InputLabel>
                            <Select
                                labelId="label-select-isSameAsHomeAddress"
                                label="Current Address"
                                id="select-isSameAsHomeAddress"
                                name="is_same_as_home_address"
                                value={addressDetails.is_same_as_home_address}
                                onChange={handleChange}
                                required
                                sx={{ borderRadius: 2 }}
                            >
                            <MenuItem value=""></MenuItem>
                            <MenuItem value="Same as Home Address">Same as Home Address</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>
                        { addressDetails.is_same_as_home_address === 'Other' && (
                            <>
                                <Typography variant="h6" color="initial" textAlign={{xs: 'center', sm: 'left'}} sx={{ width: '100%', mt: 3 }}>Current Address</Typography>
                                <FormControl fullWidth>
                                    <InputLabel id="label-select-current_address_region_code">Region</InputLabel>
                                    <Select
                                        labelId="label-select-current_address_region_code"
                                        label="Region"
                                        id="select-current_address_region_code"
                                        name="current_address_region_code"
                                        value={addressDetails.current_address_region_code}
                                        onChange={handleChange}
                                        required
                                            sx={{ borderRadius: 2 }}
                                    >
                                    <MenuItem value=""></MenuItem>
                                    {currentAddress.regions.length > 0 && currentAddress.regions.map((region) => (
                                        <MenuItem key={region.code} value={region.code}>{`${region.regionName}(${region.name})`}</MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <FormControl fullWidth>
                                    <InputLabel id="label-select-current_address_province_code">Province</InputLabel>
                                    <Select
                                        labelId="label-select-current_address_province_code"
                                        label="Province"
                                        id="select-current_address_province_code"
                                        name="current_address_province_code"
                                        value={addressDetails.current_address_province_code}
                                        onChange={handleChange}
                                        required={filteredCurrentAddressProvinces.length > 0}
                                            sx={{ borderRadius: 2 }}
                                    >
                                    <MenuItem value=""></MenuItem>
                                    {filteredCurrentAddressProvinces.length > 0 && filteredCurrentAddressProvinces.map((province) => (
                                        <MenuItem key={province.code} value={province.code}>{province.name}</MenuItem>
                                    ))}
                                    </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <FormControl fullWidth>
                                        <InputLabel id="label-select-current_address_city_code">City/Municipality</InputLabel>
                                        <Select
                                            labelId="label-select-current_address_city_code"
                                            label="City"
                                            id="select-current_address_city_code"
                                            name="current_address_city_code"
                                            value={addressDetails.current_address_city_code}
                                            onChange={handleChange}
                                            required={filteredCurrentAddressCities.length > 0}
                                            sx={{ borderRadius: 2 }}
                                        >
                                        <MenuItem value=""></MenuItem>
                                        {filteredCurrentAddressCities.length > 0 && filteredCurrentAddressCities.map((city) => (
                                            <MenuItem key={city.code} value={city.code}>{city.name}</MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <FormControl fullWidth>
                                        <InputLabel id="label-select-current_address_barangay_code">Barangay</InputLabel>
                                        <Select
                                            labelId="label-select-current_address_barangay_code"
                                            label="Barangay"
                                            id="select-current_address_barangay_code"
                                            name="current_address_barangay_code"
                                            value={addressDetails.current_address_barangay_code}
                                            onChange={handleChange}
                                            required={filteredCurrentAddressBarangays.length > 0}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            <MenuItem value=""></MenuItem>
                                            {filteredCurrentAddressBarangays.length > 0 && filteredCurrentAddressBarangays.map((barangay: { code: string; name: string; }) => (
                                                <MenuItem key={barangay.code} value={barangay.code}>{barangay.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <FormControl fullWidth>
                                        <TextField
                                            id="textfield-street"
                                            label="Street"
                                            name="current_address_street"
                                            value={addressDetails.current_address_street}
                                            onChange={handleChangeInput}
                                            sx={{ '& .MuiInputBase-root': { borderRadius: 2 }}}
                                        />
                                    </FormControl>
                                </Grid>
                            </>
                        )}
                        <FormControl fullWidth>
                            <LoadingButton
                                    type="submit" // Assigning the type property
                                    variant="contained"
                                    color="primary"
                                    loading={loading}
                                    disabled={disableButton}
                                sx={{ py: 1.75, pt: 2, color: "white", borderRadius: 2 }}
                                >
                                  {loading ? 'Submitting...' : 'Next'}
                            </LoadingButton>
                        </FormControl>
                      </Grid>
                      </Box>
                  </Paper>
              </Box>
          </React.Suspense>
    )
}

export default React.memo(AddressDetails)