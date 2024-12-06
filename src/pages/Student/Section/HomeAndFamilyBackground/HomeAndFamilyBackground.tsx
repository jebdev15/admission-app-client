import { House } from '@mui/icons-material'
import { Box, CircularProgress, FormControl,  InputLabel, MenuItem, Paper, Select, Typography, TextField, SelectChangeEvent } from '@mui/material'
import Grid from '@mui/material/Grid2'
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
    const disableButton = !homeAndFamilyBackground.who_finances_your_schooling || !homeAndFamilyBackground.is_four_ps_beneficiary || !homeAndFamilyBackground.is_first_gen_student || !homeAndFamilyBackground.household_monthly_income || !homeAndFamilyBackground.nature_of_residence
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
                        onSubmit={handleSubmit}
                    >

                        <Box sx={{display: 'flex', flexDirection: {xs: 'column-reverse', sm: 'row'}, rowGap: 2, alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                        <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, columnGap: 1, alignItems: 'center'}}>
                          <House sx={{ color: 'primary.main', fontSize: '3rem' }} />
                          <Typography variant="h6" color="primary">Home and Family Background</Typography>
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 0, alignItems: {xs: 'center', sm: 'flex-end'}}}>
                          <Typography variant="body1" color='textSecondary' sx={{fontWeight: 'bold'}}>CHMSU Admission Portal</Typography>
                          <Typography variant="body1" color='textSecondary' sx={{fontWeight: 'bold'}}>Academic Year 2025 - 2026</Typography>
                        </Box>
                      </Box>

                        <Grid container size={12} rowSpacing={3} columnSpacing={2} sx={{width: "100%"}}>
                            <Grid size={{xs: 12, sm: 12, md: 6}}>
                                <FormControl fullWidth>
                                    <TextField
                                        sx={{ '& .MuiInputBase-root': { borderRadius: 2 }}}
                                        name="no_of_siblings_gainfully_employed"
                                        type='number'
                                        label="Number of siblings gainfully employed"
                                        value={homeAndFamilyBackground.no_of_siblings_gainfully_employed}
                                        onChange={handleChangeInputNOSGE}
                                        required
                                    />
                                </FormControl>
                            </Grid>
                            <Grid size={{xs: 12, sm: 12, md: 6}}>
                                <FormControl fullWidth>
                                    <InputLabel id="label-select-who_finances_your_schooling">Who finances your schooling?</InputLabel>
                                    <Select
                                        labelId="label-select-who_finances_your_schooling"
                                        label="Who finances your schooling?"
                                        id="select-who_finances_your_schooling"
                                        name="who_finances_your_schooling"
                                        value={homeAndFamilyBackground.who_finances_your_schooling}
                                        onChange={handleChangeSelect}
                                        required
                                        sx={{ borderRadius: 2 }}
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
                            </Grid>
                            <Grid container size={12}>
                                <Grid size={"grow"}>
                                    <FormControl fullWidth>
                                        <InputLabel id="label-select-isFourPsBeneficiary">Are you a 4Ps beneficiary?</InputLabel>
                                        <Select
                                            labelId="label-select-is_four_ps_beneficiary"
                                            label="Are you a 4Ps beneficiary?"
                                            id="select-is_four_ps_beneficiary"
                                            name="is_four_ps_beneficiary"
                                            value={homeAndFamilyBackground.is_four_ps_beneficiary}
                                            onChange={handleChangeSelect}
                                            required
                                            sx={{ borderRadius: 2 }}
                                        >
                                            <MenuItem value=""></MenuItem>
                                            <MenuItem value="Yes">Yes</MenuItem>
                                            <MenuItem value="No">No</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                    <Grid size={{xs: 12, sm: 12, md: 6}}>
                                        <FormControl fullWidth>
                                            <TextField
                                                id="select-four_ps_id_no"
                                                name="four_ps_id_no"
                                                label="If yes, please enter your 4Ps identification number"
                                                value={homeAndFamilyBackground.four_ps_id_no}
                                                onChange={handleChangeInput}
                                                variant="standard"
                                                // sx={{ '& .MuiInputBase-root': { borderRadius: 2 }, mt: {xs: -2, sm: 0} }}
                                                sx={{ '& .MuiInputBase-root': { borderRadius: 2 }, mt: {xs: -2, sm: -2, md: 0}, mb: {xs: 2, sm: 2, md: 0}, mx: {xs: 2, sm: 2, md: 0} }}
                                            />
                                        </FormControl>
                                    </Grid>
                            </Grid>
                            <Grid size={{xs: 12, sm: 12, md: 7}}>
                                <FormControl fullWidth>
                                    <InputLabel id="label-select-isFirstGenStudent">Are you the first person in your family to attend college?</InputLabel>
                                    <Select
                                        labelId="label-select-is_first_gen_student"
                                        label="Are you the first person in your family to attend college?"
                                        id="select-is_first_gen_student"
                                        name="is_first_gen_student"
                                        value={homeAndFamilyBackground.is_first_gen_student}
                                        onChange={handleChangeSelect}
                                        required
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value=""></MenuItem>
                                        <MenuItem value="Yes">Yes</MenuItem>
                                        <MenuItem value="No">No</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{xs: 12, sm: 12, md: 5}}>
                                <FormControl fullWidth>
                                    <InputLabel id="label-select-household_monthly_income">Household monthly income</InputLabel>
                                    <Select
                                        labelId="label-select-household_monthly_income"
                                        label="Household monthly income"
                                        id="select-household_monthly_income"
                                        name="household_monthly_income"
                                        value={homeAndFamilyBackground.household_monthly_income}
                                        onChange={handleChangeSelect}
                                        required
                                        sx={{ borderRadius: 2 }}
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
                            </Grid>
                            <FormControl fullWidth>
                                <InputLabel id="label-select-nature_of_residence">Nature of residence while attending school</InputLabel>
                                <Select
                                    labelId="label-select-nature_of_residence"
                                    label="Nature of residence while attending school"
                                    id="select-nature_of_residence"
                                    name="nature_of_residence"
                                    value={homeAndFamilyBackground.nature_of_residence}
                                    onChange={handleChangeSelect}
                                    required
                                    sx={{ borderRadius: 2 }}
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

export default React.memo(HomeAndFamilyBackground)