import { ArrowBack, House, People, Place } from '@mui/icons-material'
import { Box, Button, CircularProgress, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Typography, FormLabel, FormHelperText, TextField } from '@mui/material'
import React from 'react'
import { HomeContext } from '../../Home/HomeContext'

const HomeAndFamilyBackground = () => {
    const context = React.useContext(HomeContext)
    const {
        noOfSiblingsGainfullyEmployed,
        whoFinancesYourSchooling,
        isFourPsBeneficiary,
        fourPsIdNumber,
        isFirstGenStudent,
        houseHoldMonthlyIncome,
        natureOfResidence,
        handleChange,
        submitForm
    } = context.homeAndFamilyBackground
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
                    <IconButton aria-label="" onClick={() => context.setFilledOutForm({ ...context.filledOutForm, parentProfile: false })}>
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
                        <Box>
                            <House />
                            <People />
                        </Box>
                        <Typography variant="body1" color="initial">Home and Family Background</Typography>
                        <FormControl fullWidth>
                            <TextField
                                name="noOfSiblingsGainfullyEmployed"
                                type='number'
                                label="Number of Siblings gainfully employed"
                                value={noOfSiblingsGainfullyEmployed}
                                onChange={handleChange}
                                required
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-whoFinancesYourSchooling">Are you living with a Guardian</InputLabel>
                            <Select
                                labelId="label-select-whoFinancesYourSchooling"
                                id="select-whoFinancesYourSchooling"
                                name="whoFinancesYourSchooling"
                                value={whoFinancesYourSchooling}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-isFourPsBeneficiary">Are you a 4P's Beneficiary?</InputLabel>
                            <Select
                                labelId="label-select-isFourPsBeneficiary"
                                id="select-isFourPsBeneficiary"
                                name="isFourPsBeneficiary"
                                value={isFourPsBeneficiary}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-houseHoldMonthlyIncome">Household Monthly Income</InputLabel>
                            <Select
                                labelId="label-select-houseHoldMonthlyIncome"
                                id="select-houseHoldMonthlyIncome"
                                name="houseHoldMonthlyIncome"
                                value={houseHoldMonthlyIncome}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="Less than Php 10,957">Less than Php 10,957</MenuItem>
                                <MenuItem value="Php 10,958 - Php 21,193">Php 10,958 - Php 21,193</MenuItem>
                                <MenuItem value="Php 21,194 - Php 43,823">Php 21,194 - Php 43,823</MenuItem>
                                <MenuItem value="Php 43,824 - Php 76,668">Php 43,824 - Php 76,668</MenuItem>
                                <MenuItem value="Php 76,669 - Php 131,483">Php 76,669 - Php 131,483</MenuItem>
                                <MenuItem value="Php 131,484 - Php 219,139">Php 131,484 - Php 219,139</MenuItem>
                                <MenuItem value="Php 219,140 and above">Php 219,140 and above</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-natureOfResidence">Nature of residence while attending school</InputLabel>
                            <Select
                                labelId="label-select-natureOfResidence"
                                id="select-natureOfResidence"
                                name="natureOfResidence"
                                value={natureOfResidence}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="Family Home">Family Home</MenuItem>
                                <MenuItem value="Rented Apartment">Rented Apartment</MenuItem>
                                <MenuItem value="Boarding House">Boarding House</MenuItem>
                                <MenuItem value="Dorm">Dorm</MenuItem>
                                <MenuItem value="Rented Room">Rented Room</MenuItem>
                                <MenuItem value="House of Married Sibling">House of Married Sibling</MenuItem>
                                <MenuItem value="Relative's House">Relative's House</MenuItem>
                            </Select>
                        </FormControl>
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

export default React.memo(HomeAndFamilyBackground)