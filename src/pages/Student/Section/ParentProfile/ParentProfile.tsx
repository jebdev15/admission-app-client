import { ArrowBack, Person, Place } from '@mui/icons-material'
import { Box, Button, CircularProgress, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography, FormLabel, FormHelperText } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React from 'react'
import { HomeContext } from '../../Home/HomeContext'

const ParentProfile = () => {
    const context = React.useContext(HomeContext)
    const {
        streetAndBarangay,
        city,
        province,
        isSameAsHomeAddress,
        currentAddressStreetAndBarangay,
        currentAddressCity,
        currentAddressProvince,
        handleChange,
        submitForm
    } = context.addressDetails
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
                      <IconButton aria-label="" onClick={() => context.setFilledOutForm({ ...context.filledOutForm, addressDetails: false })}>
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
                      <Typography variant="body1" color="initial">Parent Profile</Typography>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-province">Province</InputLabel>
                            <Select
                                labelId="label-select-province"
                                id="select-province"
                                name="province"
                                value={province}
                                onChange={handleChange}
                                required
                            >
                            <MenuItem value=""></MenuItem>
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-city">City</InputLabel>
                            <Select
                                labelId="label-select-city"
                                id="select-city"
                                name="city"
                                value={city}
                                onChange={handleChange}
                                required
                            >
                            <MenuItem value=""></MenuItem>
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-streetAndBarangay">Street and Barangay</InputLabel>
                            <Select
                                labelId="label-select-streetAndBarangay"
                                id="select-streetAndBarangay"
                                name="streetAndBarangay"
                                value={streetAndBarangay}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
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
                                <InputLabel id="label-select-currentAddressProvince">Province</InputLabel>
                                <Select
                                    labelId="label-select-currentAddressProvince"
                                    id="select-currentAddressProvince"
                                    name="currentAddressProvince"
                                    value={currentAddressProvince}
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
                                <InputLabel id="label-select-currentAddressStreetAndBarangay">Street and Barangay</InputLabel>
                                <Select
                                    labelId="label-select-currentAddressStreetAndBarangay"
                                    id="select-currentAddressStreetAndBarangay"
                                    name="currentAddressStreetAndBarangay"
                                    value={currentAddressStreetAndBarangay}
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

export default React.memo(ParentProfile)