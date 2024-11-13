import { ArrowBack, School, Work } from '@mui/icons-material'
import { Box, Button, CircularProgress, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import React from 'react'
import { ParentProfileType } from './type'
import { useNavigate, useParams } from 'react-router'
import { HomeContext } from '../../Home/HomeContext'
import { ParentProfileService } from '../../../../services/parentProfileService'

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
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setParentProfile((prevState: ParentProfileType) => ({...prevState, [event?.target.name]: event?.target.value }))
    const handleChangeSelect = (event: SelectChangeEvent<string>) => setParentProfile((prevState: ParentProfileType) => ({...prevState, [event?.target.name]: event?.target.value }))
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        formData.append('uuid', uuid ?? '')
        const { data, status } = await ParentProfileService.saveParentProfile(formData)
        console.log(data, status)
        if([200, 201, 204].includes(status)) setTimeout(() => navigate('.'), 1000)
    }
    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        formData.append('uuid', uuid ?? '')
        const { data, status } = await ParentProfileService.saveParentProfile(formData)
        console.log(data, status)
        if([200, 201, 204].includes(status)) setTimeout(() => navigate('.'), 1000)
    }
    const getParentProfile = async (uuid: string) => {
        const { data } = await ParentProfileService.getParentProfile(uuid)
        if(data.length > 0) {
            setParentProfile(data[0])
        }
    }
    const { setFilledOutForm } = React.useContext(HomeContext)
    React.useEffect(() => {
        getParentProfile(uuid)
    }, [uuid])
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
                      <IconButton aria-label="" onClick={() => setFilledOutForm((prevState) => ({ ...prevState, address_detail_status: 0 }) )}>
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
                            onSubmit={handleSubmit}
                    >
                        <Box>
                            <School />
                            <Work />
                        </Box>
                      <Typography variant="body1" color="initial">Parent Profile</Typography>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-father_highest_educational_attainment">Father's Highest Educational Attainment</InputLabel>
                            <Select
                                labelId="label-select-father_highest_educational_attainment"
                                id="select-father_highest_educational_attainment"
                                name="father_highest_educational_attainment"
                                value={parentProfile.father_highest_educational_attainment}
                                onChange={handleChangeSelect}
                                required
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
                                label="Father's Occupation"
                                value={parentProfile.father_occupation}
                                onChange={handleChange}
                                required
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-mother_highest_educational_attainment">Mother's Highest Educational Attainment</InputLabel>
                            <Select
                                labelId="label-select-mother_highest_educational_attainment"
                                id="select-mother_highest_educational_attainment"
                                name="mother_highest_educational_attainment"
                                value={parentProfile.mother_highest_educational_attainment}
                                onChange={handleChangeSelect}
                                required
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
                                label="Mother's Occupation"
                                value={parentProfile.mother_occupation}
                                onChange={handleChange}
                                required
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-withGuardian">Are you living with a Guardian</InputLabel>
                            <Select
                                labelId="label-select-is_living_with_guardian"
                                id="select-is_living_with_guardian"
                                name="is_living_with_guardian"
                                value={parentProfile.is_living_with_guardian}
                                onChange={handleChangeSelect}
                                required
                            >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
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

export default React.memo(ParentProfile)