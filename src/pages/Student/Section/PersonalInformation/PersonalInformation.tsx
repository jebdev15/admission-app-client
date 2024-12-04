import { Person } from '@mui/icons-material'
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { PersonalInformationType } from './type'
import { useNavigate, useParams } from 'react-router'
import axiosInstance from '../../../../api'
import { LoadingButton } from '@mui/lab'
// import { PersonalInformationService } from '../../../../services/personalInformationService'

const PersonalInformation = () => {
  const navigate = useNavigate()
  const { uuid } = useParams<{uuid: string | undefined}>()
    const [personalInformation, setPersonalInformation] = React.useState<PersonalInformationType>({
      first_name: '',
      middle_name: '',
      last_name: '',
      mobile_no: '',
      lrn: '',
      date_of_birth: dayjs('2000-01-01'),  // Set a default date as a `dayjs` object,
      gender: '',
      civil_status: '',
      religion: '',
      other_religion: '',
      is_solo_parent: '',
      is_indigenous_group: '',
      indigenous_group: '',
      school_last_attended: '',
      type_of_school: '',
      has_scholarship_or_financial_aid: '',
      scholarship_or_financial_aid: '',
  })
  const disableButton = !personalInformation.first_name || !personalInformation.last_name || !personalInformation.mobile_no || !personalInformation.lrn || !personalInformation.date_of_birth || !personalInformation.gender || !personalInformation.civil_status || !personalInformation.religion || !personalInformation.is_solo_parent || !personalInformation.is_indigenous_group || !personalInformation.school_last_attended || !personalInformation.type_of_school || !personalInformation.has_scholarship_or_financial_aid
  const [loading, setLoading] = React.useState<boolean>(false)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => setPersonalInformation((prevState: PersonalInformationType) => ({...prevState, [event?.target.name]: event?.target.value }))
  const handleChangeSelect = (event: SelectChangeEvent<string>) => setPersonalInformation((prevState: PersonalInformationType) => ({...prevState, [event?.target.name]: event?.target.value }))
  const handleChangeDate = (newValue: Dayjs | null) => setPersonalInformation((prevState: PersonalInformationType) => ({ ...prevState, date_of_birth: newValue ?? dayjs() }))  // Update date_of_birth in `dayjs` format
  // const [isNewData, setIsNewData] = React.useState<boolean>(true)
  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          const confirmation = window.confirm('Are you sure to proceed to next form? You can\'t edit your personal information after proceeding.');
          if(!confirmation) return
          setLoading(true)
          const formData = new FormData(event.currentTarget)
          formData.append('uuid', uuid ?? '')
          const { data, status } = await axiosInstance.post('/personal-information/create', formData)
          if(data) {
            setLoading(false)
            if([200, 201, 204].includes(status)) setTimeout(() => navigate('.'), 1000)
          }
  }
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
                  
                {/* <Paper sx={{ width: {xs: '100%', sm: '500px', md: '60%'}, maxWidth: "1000px", borderRadius: 2}}> */}
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
                          <Person sx={{ color: 'primary.main', fontSize: '3rem' }} />
                          <Typography variant="h6" color="primary">Personal Information</Typography>
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 0, alignItems: {xs: 'center', sm: 'flex-end'}}}>
                          <Typography variant="body1" color='textSecondary' sx={{fontWeight: 'bold'}}>CHMSU Admission Portal</Typography>
                          <Typography variant="body1" color='textSecondary' sx={{fontWeight: 'bold'}}>Academic Year 2025 - 2026</Typography>
                        </Box>
                      </Box>
                          <Grid container spacing={2} rowSpacing={3} margin='dense' sx={{ width: '100%' }}>
                              <Grid size={{xs: 12, sm: 4}}>
                                  <FormControl fullWidth>
                                      <TextField
                                          name="first_name"
                                          label="First Name"
                                          placeholder='e.g. John'
                                          type="text"
                                          value={personalInformation.first_name}
                                          onChange={handleChange}
                                          required
                                          sx={{ '& .MuiInputBase-root': { borderRadius: 2 }}}
                                      />
                                  </FormControl>
                              </Grid>
                              <Grid size={{xs: 12, sm: 4}}>
                                  <FormControl fullWidth>
                                      <TextField
                                          name="middle_name"
                                          label="Middle Name"
                                          placeholder='e.g. Doe'
                                          type="text"
                                          value={personalInformation.middle_name}
                                          onChange={handleChange}
                                          sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                                      />
                                  </FormControl>
                              </Grid>
                              <Grid size={{xs: 12, sm: 4}}>
                                  <FormControl fullWidth>
                                      <TextField
                                          name="last_name"
                                          label="Last Name"
                                          placeholder='e.g. Smith'
                                          type="text"
                                          value={personalInformation.last_name}
                                          onChange={handleChange}
                                          required
                                          sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                                      />
                                  </FormControl>
                              </Grid>
                            <Grid size={{xs: 12, sm: 7, md: 6}}>
                              <FormControl fullWidth>
                                  <TextField
                                        name="lrn"
                                        label="Learner's Reference Number"
                                        type="text"
                                        value={personalInformation.lrn}
                                        onChange={handleChange}
                                        required
                                        sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                                  />
                              </FormControl>
                            </Grid>
                            <Grid size={{xs: 12, sm: 5, md: 6}}>
                              <FormControl fullWidth>
                                  <TextField
                                        name="mobile_no"
                                        label="Mobile Number"
                                        placeholder='e.g. 09123456789'
                                        type="number"
                                        value={personalInformation.mobile_no}
                                        onChange={handleChange}
                                        required
                                        sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                                  />
                              </FormControl>
                            </Grid>
                            <Grid size={{xs: 6, sm: 4, md: 4}}>
                              <FormControl fullWidth>
                                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker name="date_of_birth" label="Date of Birth" value={personalInformation.date_of_birth ? dayjs(personalInformation.date_of_birth) : null} onChange={handleChangeDate} format="YYYY-MM-DD" sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}/>
                                  </LocalizationProvider>
                              </FormControl>
                            </Grid>
                            <Grid size={{xs: 6, sm: 3, md: 4}}>
                              <FormControl fullWidth>
                                <InputLabel id="label-select-sex">Sex</InputLabel>
                                  <Select
                                    labelId="label-select-sex"
                                    label="Sex"
                                    id="select-sex"
                                    name="gender"
                                    value={personalInformation.gender}
                                    onChange={handleChangeSelect}
                                    required
                                    sx={{ borderRadius: 2 }}
                                  >
                                      <MenuItem value=""></MenuItem>
                                      <MenuItem value="Male">Male</MenuItem>
                                      <MenuItem value="Female">Female</MenuItem>
                                  </Select>
                              </FormControl>
                            </Grid>
                            <Grid size={{xs: 12, sm: 5, md: 4}}>
                              <FormControl fullWidth>
                                <InputLabel id="label-select-civilStatus">Civil Status</InputLabel>
                                  <Select
                                    labelId="label-select-civilStatus"
                                    label="Civil Status"
                                    id="select-civilStatus"
                                    name="civil_status"
                                    value={personalInformation.civil_status}
                                    onChange={handleChangeSelect}
                                    required
                                    sx={{ borderRadius: 2 }}
                                  >
                                      <MenuItem value=""></MenuItem>
                                      <MenuItem value="Single">Single</MenuItem>
                                      <MenuItem value="Married">Married</MenuItem>
                                  </Select>
                              </FormControl>
                            </Grid>
                          <Grid container size={12}>
                            <Grid size={"grow"}>
                              <FormControl fullWidth>
                                <InputLabel id="label-select-religion">Religion</InputLabel>
                                  <Select
                                    labelId="label-select-religion"
                                    label="Religion"
                                    id="select-religion"
                                    name="religion"
                                    value={personalInformation.religion}
                                    onChange={handleChangeSelect}
                                    required
                                    sx={{ borderRadius: 2 }}
                                  >
                                      <MenuItem value=""></MenuItem>
                                      <MenuItem value="Roman Catholic">Roman Catholic</MenuItem>
                                      <MenuItem value="Iglesia ni Cristo">Iglesia ni Cristo</MenuItem>
                                      <MenuItem value="Seventh Day Adventist">Seventh Day Adventist</MenuItem>
                                      <MenuItem value="Latter Day Saints(Mormon)">Latter Day Saints(Mormon)</MenuItem>
                                      <MenuItem value="Protestant">Protestant</MenuItem>
                                      <MenuItem value="Jehovah's Witness">Jehovah's Witness</MenuItem>
                                      <MenuItem value="Islam">Islam</MenuItem>
                                      <MenuItem value="Others">Others</MenuItem>
                                  </Select>
                              </FormControl>
                            </Grid>
                            {personalInformation.religion === 'Others' && (
                              <Grid size={{xs: 12, sm: 6}}>
                                <FormControl fullWidth>
                                    <TextField
                                        name="other_religion"
                                        label="Specify religion"
                                        type="text"
                                        value={personalInformation.other_religion}
                                        onChange={handleChange}
                                        variant='standard'
                                        required
                                        sx={{ '& .MuiInputBase-root': { borderRadius: 2 }, mt: {xs: -2, sm: 0} }}
                                    />
                                </FormControl>
                              </Grid>
                            )}
                          </Grid>
                          <Grid container size={12}>
                            <Grid size={{xs: 12, sm: 12, md: 2}}>
                              <FormControl fullWidth>
                                <InputLabel id="label-select-soloParent">Solo Parent</InputLabel>
                                  <Select
                                    labelId="label-select-soloParent"
                                    label="Solo Parent"
                                    id="select-soloParent"
                                    name="is_solo_parent"
                                    value={personalInformation.is_solo_parent}
                                    onChange={handleChangeSelect}
                                    required
                                    sx={{ borderRadius: 2 }}
                                  >
                                      <MenuItem value=""></MenuItem>
                                      <MenuItem value='Yes'>Yes</MenuItem>
                                      <MenuItem value='No'>No</MenuItem>
                                  </Select>
                              </FormControl>
                            </Grid>
                            <Grid size={{xs: 12, sm: "grow", md: "grow"}}>
                              <FormControl fullWidth>
                                <InputLabel id="label-select-isIndigenousGroup">Are you part of an Indigenous Group?</InputLabel>
                                  <Select
                                    labelId="label-select-isIndigenousGroup"
                                    label="Are you part of an Indigenous Group?"
                                    id="select-isIndigenousGroup"
                                    name="is_indigenous_group"
                                    value={personalInformation.is_indigenous_group}
                                    onChange={handleChangeSelect}
                                    required
                                    sx={{ borderRadius: 2 }}
                                  >
                                      <MenuItem value=""></MenuItem>
                                      <MenuItem value='Yes'>Yes</MenuItem>
                                      <MenuItem value='No'>No</MenuItem>
                                  </Select>
                              </FormControl>
                            </Grid>
                            {personalInformation.is_indigenous_group === 'Yes' && (
                            <Grid size={{xs: 12, sm:6, md: 6}}>
                              <FormControl fullWidth>
                                <TextField
                                    name="indigenous_group"
                                    label="Specify indgenous group"
                                    type="text"
                                    value={personalInformation.indigenous_group}
                                    onChange={handleChange}
                                    required
                                    variant='standard'
                                    sx={{ '& .MuiInputBase-root': { borderRadius: 2 }, mt: {xs: -2, sm: 0} }}
                                  />
                              </FormControl>
                            </Grid>
                            )}
                          </Grid>
                          <Grid size={{xs: 12, sm: 9, md: 8}}>
                            <FormControl fullWidth>
                              <TextField
                                  name="school_last_attended"
                                  label="School Last Attended"
                                  type="text"
                                  value={personalInformation.school_last_attended}
                                  onChange={handleChange}
                                  required
                                  sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                                />
                            </FormControl>
                          </Grid>
                          <Grid size={{xs: 12, sm: 3, md: 4}}>
                            <FormControl fullWidth>
                              <InputLabel id="label-select-typeOfSchool">Type of School</InputLabel>
                                <Select
                                  labelId="label-select-typeOfSchool"
                                  label="Type of School"
                                  id="select-typeOfSchool"
                                  name="type_of_school"
                                  value={personalInformation.type_of_school}
                                  type='text'
                                  onChange={handleChangeSelect}
                                  required
                                  sx={{ borderRadius: 2 }}
                                >
                                    <MenuItem value=""></MenuItem>
                                    <MenuItem value='Public'>Public</MenuItem>
                                    <MenuItem value='Private'>Private</MenuItem>
                                </Select>
                            </FormControl>
                          </Grid>
                          <Grid container size={12}>
                            <Grid size={{xs: 12, sm: 12, md: "grow"}}>
                              <FormControl fullWidth>
                                <InputLabel id="label-select-hasScholarshipOrFinancialAid">Do you have an existing Scholarship/Financial Aid?</InputLabel>
                                  <Select
                                    labelId="label-select-hasScholarshipOrFinancialAid"
                                    label="Do you have an existing Scholarship/Financial Aid?"
                                    id="select-hasScholarshipOrFinancialAid"
                                    name="has_scholarship_or_financial_aid"
                                    type='text'
                                    value={personalInformation.has_scholarship_or_financial_aid}
                                    onChange={handleChangeSelect}
                                    required
                                    sx={{ borderRadius: 2 }}
                                  >
                                      <MenuItem value=""></MenuItem>
                                      <MenuItem value='Yes'>Yes</MenuItem>
                                      <MenuItem value='No'>No</MenuItem>
                                  </Select>
                              </FormControl>
                            </Grid>
                            {personalInformation.has_scholarship_or_financial_aid === 'Yes' && (
                              <Grid size={{xs: 12, sm: 12, md: "grow"}}>
                                <FormControl fullWidth>
                                    <TextField
                                        name="scholarship_or_financial_aid"
                                        label="Specify Scholarship/Financial Aid"
                                        type="text"
                                        value={personalInformation.scholarship_or_financial_aid}
                                        onChange={handleChange}
                                        required
                                        variant='standard'
                                        sx={{ '& .MuiInputBase-root': { borderRadius: 2 }, mt: {sm: -2, md: 0} }}
                                    />
                                </FormControl>
                              </Grid>
                            )}
                          </Grid>
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

export default React.memo(PersonalInformation)