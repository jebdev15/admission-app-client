import { House, People } from '@mui/icons-material'
import { Box, CircularProgress, FormControl,  InputLabel, MenuItem, Paper, Select, Typography, TextField, SelectChangeEvent } from '@mui/material'
import React from 'react'
import { HomeAndFamilyBackgroundType } from './type'
import { useNavigate, useParams } from 'react-router'
import { HomeAndFamilyBackgroundService } from '../../../../services/homeAndFamilyBackgroundService'
import { LoadingButton } from '@mui/lab'

const initialHomeAndFamilyBackground: HomeAndFamilyBackgroundType = {
    no_of_siblings_gainfully_employed: 0,
    who_finances_your_schooling: '',
    is_four_ps_beneficiary: '',
    four_ps_id_no: '',
    is_first_gen_student: '',
    household_monthly_income: '',
    nature_of_residence: '',
}
const HomeAndFamilyBackground = () => {
    const navigate = useNavigate()
    const { uuid } = useParams<{uuid: string | undefined}>()    
    const [homeAndFamilyBackground, setHomeAndFamilyBackground] = React.useState<HomeAndFamilyBackgroundType>(initialHomeAndFamilyBackground)
    const [loading, setLoading] = React.useState<boolean>(false)
    const handleChangeInputNOSGE = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setHomeAndFamilyBackground((prevState: HomeAndFamilyBackgroundType) => ({ ...prevState, [name]: parseInt(value) }))
    }
    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setHomeAndFamilyBackground((prevState: HomeAndFamilyBackgroundType) => ({ ...prevState, [name]: value }))
    }
    const handleChangeSelect = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target
        setHomeAndFamilyBackground((prevState: HomeAndFamilyBackgroundType) => ({ ...prevState, [name]: value }))
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const confirmation = window.confirm('Are you sure to proceed to next form? You can\'t edit your home and family background after proceeding.');
        if(!confirmation) return
        setLoading(true)
        const formData = new FormData(event.currentTarget)
        formData.append('uuid', uuid ?? '')
        const { data, status } = await HomeAndFamilyBackgroundService.saveHomeAndFamilyBackground(formData)
        console.log(data, status)
        if(status) {
            setLoading(false)
            if([200, 201, 204].includes(status)) navigate('.')
        }
    }
    const disableButton = !homeAndFamilyBackground.no_of_siblings_gainfully_employed || !homeAndFamilyBackground.who_finances_your_schooling || !homeAndFamilyBackground.is_four_ps_beneficiary || !homeAndFamilyBackground.is_first_gen_student || !homeAndFamilyBackground.household_monthly_income || !homeAndFamilyBackground.nature_of_residence
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
                          onSubmit={handleSubmit}
                    >
                        <Box>
                            <House />
                            <People />
                        </Box>
                        <Typography variant="body1" color="initial">Home and Family Background</Typography>
                        <FormControl fullWidth>
                            <TextField
                                name="no_of_siblings_gainfully_employed"
                                type='number'
                                label="Number of Siblings gainfully employed"
                                value={homeAndFamilyBackground.no_of_siblings_gainfully_employed}
                                onChange={handleChangeInputNOSGE}
                                required
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-who_finances_your_schooling">Who finances your schooling?</InputLabel>
                            <Select
                                labelId="label-select-who_finances_your_schooling"
                                id="select-who_finances_your_schooling"
                                name="who_finances_your_schooling"
                                value={homeAndFamilyBackground.who_finances_your_schooling}
                                onChange={handleChangeSelect}
                                required
                            >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="Parents">Parents</MenuItem>
                                <MenuItem value="Spouse">Spouse</MenuItem>
                                <MenuItem value="Sibling(s)">Sibling(s)</MenuItem>
                                <MenuItem value="Relative">Relative</MenuItem>
                                <MenuItem value="Scholarship">Scholarship</MenuItem>
                                <MenuItem value="Self-supporting / working student">Self-supporting / working student</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-isFourPsBeneficiary">Are you a 4P's Beneficiary?</InputLabel>
                            <Select
                                labelId="label-select-is_four_ps_beneficiary"
                                id="select-is_four_ps_beneficiary"
                                name="is_four_ps_beneficiary"
                                value={homeAndFamilyBackground.is_four_ps_beneficiary}
                                onChange={handleChangeSelect}
                                required
                            >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField
                                id="select-four_ps_id_no"
                                name="four_ps_id_no"
                                label="If Yes, Please enter your 4P's ID Number"
                                value={homeAndFamilyBackground.four_ps_id_no}
                                onChange={handleChangeInput}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-isFirstGenStudent">Are you the First person in your family to enter college?</InputLabel>
                            <Select
                                labelId="label-select-is_first_gen_student"
                                id="select-is_first_gen_student"
                                name="is_first_gen_student"
                                value={homeAndFamilyBackground.is_first_gen_student}
                                onChange={handleChangeSelect}
                                required
                            >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-household_monthly_income">Household Monthly Income</InputLabel>
                            <Select
                                labelId="label-select-household_monthly_income"
                                id="select-household_monthly_income"
                                name="household_monthly_income"
                                value={homeAndFamilyBackground.household_monthly_income}
                                onChange={handleChangeSelect}
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
                            <InputLabel id="label-select-nature_of_residence">Nature of residence while attending school</InputLabel>
                            <Select
                                labelId="label-select-nature_of_residence"
                                id="select-nature_of_residence"
                                name="nature_of_residence"
                                value={homeAndFamilyBackground.nature_of_residence}
                                onChange={handleChangeSelect}
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
                            <LoadingButton
                                type="submit" // Assigning the type property
                                variant="contained"
                                color="primary"
                                loading={loading}
                                disabled={disableButton}
                            >
                                {loading ? 'Submitting...' : 'Next'}
                            </LoadingButton>
                        </FormControl>
                    </Box>
                </Paper>
            </Box>
        </React.Suspense>
    )
}

export default React.memo(HomeAndFamilyBackground)