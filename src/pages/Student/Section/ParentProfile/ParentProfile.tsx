import { School, Work } from '@mui/icons-material'
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import React from 'react'
import { ParentProfileType } from './type'
import { useNavigate, useParams } from 'react-router'
import { ParentProfileService } from '../../../../services/parentProfileService'
import { LoadingButton } from '@mui/lab'

const initialParentProfile: ParentProfileType = {
    father_highest_educational_attainment: '',
    father_occupation: '',
    mother_highest_educational_attainment: '',
    mother_occupation: '',
    is_living_with_guardian: '',
} 

const ParentProfile = () => {
    const navigate = useNavigate()
    const { uuid } = useParams<{uuid: string | undefined}>()
    const [parentProfile, setParentProfile] = React.useState<ParentProfileType>(initialParentProfile)
    const [loading, setLoading] = React.useState<boolean>(false)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setParentProfile((prevState: ParentProfileType) => ({...prevState, [event?.target.name]: event?.target.value }))
    const handleChangeSelect = (event: SelectChangeEvent<string>) => setParentProfile((prevState: ParentProfileType) => ({...prevState, [event?.target.name]: event?.target.value }))
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const confirmation = window.confirm('Are you sure to proceed to next form? You can\'t edit your parent profile after proceeding.');
        if(!confirmation) return
        setLoading(true)
        const formData = new FormData(event.currentTarget)
        formData.append('uuid', uuid ?? '')
        const { data, status } = await ParentProfileService.saveParentProfile(formData)
        if(status) {
            setLoading(false)
            if([200, 201, 204].includes(status)) setTimeout(() => navigate('.'), 1000)
        }
        console.log(data, status)
    }
    const disableButton = !parentProfile.father_highest_educational_attainment || !parentProfile.father_occupation || !parentProfile.mother_highest_educational_attainment || !parentProfile.mother_occupation || !parentProfile.is_living_with_guardian
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
                          <Work sx={{ color: 'primary.main', fontSize: '3rem' }} />
                          <Typography variant="h6" color="primary">Parent Profile</Typography>
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 0, alignItems: {xs: 'center', sm: 'flex-end'}}}>
                          <Typography variant="body1" color='textSecondary' sx={{fontWeight: 'bold'}}>CHMSU Admission Portal</Typography>
                          <Typography variant="body1" color='textSecondary' sx={{fontWeight: 'bold'}}>Academic Year 2025 - 2026</Typography>
                        </Box>
                      </Box>

                        <Grid container size={12} rowSpacing={3} columnSpacing={2} sx={{width: "100%"}}>
                            <FormControl fullWidth>
                                <InputLabel id="label-select-father_highest_educational_attainment">Father's highest educational attainment</InputLabel>
                                <Select
                                    labelId="label-select-father_highest_educational_attainment"
                                    label="Father's highest educational attainment"
                                    id="select-father_highest_educational_attainment"
                                    name="father_highest_educational_attainment"
                                    value={parentProfile.father_highest_educational_attainment}
                                    onChange={handleChangeSelect}
                                    required
                                    sx={{ borderRadius: 2 }}
                                >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="Post Graduate">Post Graduate</MenuItem>
                                <MenuItem value="College">College</MenuItem>
                                <MenuItem value="High School">High School</MenuItem>
                                <MenuItem value="Elementary">Elementary</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <TextField
                                    id="father_occupation"
                                    name="father_occupation"
                                    label="Father's occupation"
                                    value={parentProfile.father_occupation}
                                    onChange={handleChange}
                                    required
                                    sx={{ '& .MuiInputBase-root': { borderRadius: 2 }}}
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="label-select-mother_highest_educational_attainment">Mother's highest educational attainment</InputLabel>
                                <Select
                                    labelId="label-select-mother_highest_educational_attainment"
                                    label="Mother's highest educational attainment"
                                    id="select-mother_highest_educational_attainment"
                                    name="mother_highest_educational_attainment"
                                    value={parentProfile.mother_highest_educational_attainment}
                                    onChange={handleChangeSelect}
                                    required
                                    sx={{ borderRadius: 2 }}
                                >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="Post Graduate">Post Graduate</MenuItem>
                                <MenuItem value="College">College</MenuItem>
                                <MenuItem value="High School">High School</MenuItem>
                                <MenuItem value="Elementary">Elementary</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <TextField
                                    id="mother_occupation"
                                    name="mother_occupation"
                                    label="Mother's occupation"
                                    value={parentProfile.mother_occupation}
                                    onChange={handleChange}
                                    required
                                    sx={{ '& .MuiInputBase-root': { borderRadius: 2 }}}
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="label-select-withGuardian">Are you living with a guardian?</InputLabel>
                                <Select
                                    labelId="label-select-is_living_with_guardian"
                                    label="Are you living with a guardian?"
                                    id="select-is_living_with_guardian"
                                    name="is_living_with_guardian"
                                    value={parentProfile.is_living_with_guardian}
                                    onChange={handleChangeSelect}
                                    required
                                    sx={{ borderRadius: 2 }}
                                >
                                    <MenuItem value=""></MenuItem>
                                    <MenuItem value="Yes">Yes</MenuItem>
                                    <MenuItem value="No">No</MenuItem>
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

export default React.memo(ParentProfile)