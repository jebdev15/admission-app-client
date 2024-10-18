import { ArrowBack, Place } from '@mui/icons-material'
import { Box, Button, CircularProgress, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material'
import React from 'react'
import { HomeContext } from '../../Home/HomeContext'
import regions from './AddressJson/regions.json'
import provinces from './AddressJson/provinces.json'
import cities from './AddressJson/cities.json'
import barangays from './AddressJson/barangays.json'

const AddressDetails = () => {
    const context = React.useContext(HomeContext)
    const {
        regionCode,
        provinceCode,
        cityCode,
        barangayCode,
        isSameAsHomeAddress,
        currentAddressRegionCode,
        currentAddressProvinceCode,
        currentAddressCityCode,
        currentAddressBarangayCode,
        handleChange,
        submitForm
    } = context.addressDetails
    const filteredProvinces = provinces.filter((province) => province.regionCode === regionCode)
    const filteredCities = cities.filter((city) => city.provinceCode === provinceCode)
    const filteredBarangays = barangays.filter((barangay) => barangay.cityCode === cityCode)
    React.useEffect(() => {
        console.log({regions, filteredProvinces, filteredCities, filteredBarangays})
    }, [regions, filteredProvinces, filteredCities, filteredBarangays])
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
                          onSubmit={submitForm}
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
                                onChange={handleChange}
                                required
                            >
                            <MenuItem value=""></MenuItem>
                            {regions.length > 0 && regions.map((region) => (
                                <MenuItem key={region.code} value={region.code}>{`${region.regionName}(${region.name})`}</MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-province">Province</InputLabel>
                            <Select
                                labelId="label-select-province"
                                id="select-provinceCode"
                                name="provinceCode"
                                value={provinceCode}
                                onChange={handleChange}
                                required
                            >
                            <MenuItem value=""></MenuItem>
                            {filteredProvinces.length > 0 && filteredProvinces.map((province) => (
                                <MenuItem key={province.code} value={province}>{province.name}</MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-city">City</InputLabel>
                            <Select
                                labelId="label-select-city"
                                id="select-city"
                                name="cityCode"
                                value={cityCode}
                                onChange={handleChange}
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
                        </FormControl>
                        <FormControl fullWidth>
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
                                <InputLabel id="label-select-currentAddressCity">City</InputLabel>
                                <Select
                                    labelId="label-select-currentAddressCity"
                                    id="select-currentAddressCity"
                                    name="currentAddressCity"
                                    value={currentAddressCity}
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
                        )}
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