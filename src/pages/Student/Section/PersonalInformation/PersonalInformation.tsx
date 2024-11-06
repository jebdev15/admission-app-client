import { Person } from '@mui/icons-material'
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React from 'react'
import { HomeContext } from '../../Home/HomeContext'
import dayjs from 'dayjs'

const PersonalInformation = () => {
    const context = React.useContext(HomeContext)
    const {
      first_name,
      middle_name,
      last_name,
      mobile_no,
      lrn,
      date_of_birth,
      gender,
      civil_status,
      religion,
      other_religion,
      is_solo_parent,
      is_indigenous_group,
      indigenous_group,
      school_last_attended,
      type_of_school,
      has_scholarship_or_financial_aid,
      scholarship_or_financial_aid,
      handleChange,
      handleChangeSelect,
      handleChangeDate,
      submitForm
    } = context.personalInformation
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
                      width: { xs: '100%', md: '678px'},
                      gap: 1
                  }}
              >
                  <Paper sx={{ width: { xs: '100%', md: '678px'}, }}>
                      <Box
                          component="form"
                          sx={{ 
                              display: 'flex', 
                              flexDirection: 'column',
                              justifyContent: 'center', 
                              alignItems: 'center', 
                              padding: '1rem',
                              gap: 1
                          }}
                          onSubmit={submitForm}
                    >
                      <Person />
                      <Typography variant="body1" color="initial">Personal Information</Typography>
                          <FormControl fullWidth>
                              <TextField
                                    name="first_name"
                                    label="First Name"
                                    type="text"
                                    value={first_name}
                                    onChange={handleChange}
                                    required
                              />
                          </FormControl>
                          <FormControl fullWidth>
                              <TextField
                                    name="middle_name"
                                    label="Middle Name"
                                    type="text"
                                    value={middle_name}
                                    onChange={handleChange}
                              />
                          </FormControl>
                          <FormControl fullWidth>
                              <TextField
                                    name="last_name"
                                    label="Last Name"
                                    type="text"
                                    value={last_name}
                                    onChange={handleChange}
                                    required
                              />
                          </FormControl>
                          <FormControl fullWidth>
                              <TextField
                                    name="lrn"
                                    label="Learner's Reference Number"
                                    type="text"
                                    value={lrn}
                                    onChange={handleChange}
                                    required
                              />
                          </FormControl>
                          <FormControl fullWidth>
                              <TextField
                                    name="mobile_no"
                                    label="Mobile Number(09123456789)"
                                    type="number"
                                    value={mobile_no}
                                    onChange={handleChange}
                                    required
                              />
                          </FormControl>
                          <FormControl fullWidth>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker name="date_of_birth" label="Date of Birth" value={date_of_birth ? dayjs(date_of_birth) : null} onChange={handleChangeDate} format="YYYY-MM-DD"/>
                              </LocalizationProvider>
                          </FormControl>
                          <FormControl fullWidth>
                            <InputLabel id="label-select-sex">Sex</InputLabel>
                              <Select
                                labelId="label-select-sex"
                                id="select-sex"
                                name="gender"
                                value={gender}
                                onChange={handleChangeSelect}
                                required
                              >
                                  <MenuItem value=""></MenuItem>
                                  <MenuItem value="Male">Male</MenuItem>
                                  <MenuItem value="Female">Female</MenuItem>
                              </Select>
                          </FormControl>
                          <FormControl fullWidth>
                            <InputLabel id="label-select-civilStatus">Civil Status</InputLabel>
                              <Select
                                labelId="label-select-civilStatus"
                                id="select-civilStatus"
                                name="civil_status"
                                value={civil_status}
                                onChange={handleChangeSelect}
                                required
                              >
                                  <MenuItem value=""></MenuItem>
                                  <MenuItem value="Single">Single</MenuItem>
                                  <MenuItem value="Married">Married</MenuItem>
                              </Select>
                          </FormControl>
                          <FormControl fullWidth>
                            <InputLabel id="label-select-religion">Religion</InputLabel>
                              <Select
                                labelId="label-select-religion"
                                id="select-religion"
                                name="religion"
                                value={religion}
                                onChange={handleChangeSelect}
                                required
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
                          {religion === 'Others' && (
                            <FormControl fullWidth>
                                <TextField
                                    name="other_religion"
                                    label="Please specify"
                                    type="text"
                                    value={other_religion}
                                    onChange={handleChange}
                                    required
                                />
                            </FormControl>
                          )}
                          <FormControl fullWidth>
                            <InputLabel id="label-select-soloParent">Solo Parent</InputLabel>
                              <Select
                                labelId="label-select-soloParent"
                                id="select-soloParent"
                                name="is_solo_parent"
                                value={is_solo_parent}
                                onChange={handleChangeSelect}
                                required
                              >
                                  <MenuItem value=""></MenuItem>
                                  <MenuItem value='Yes'>Yes</MenuItem>
                                  <MenuItem value='No'>No</MenuItem>
                              </Select>
                          </FormControl>
                          <FormControl fullWidth>
                            <InputLabel id="label-select-isIndigenousGroup">Are you part of an Indigenous Group?</InputLabel>
                              <Select
                                labelId="label-select-isIndigenousGroup"
                                id="select-isIndigenousGroup"
                                name="is_indigenous_group"
                                value={is_indigenous_group}
                                onChange={handleChangeSelect}
                                required
                              >
                                  <MenuItem value=""></MenuItem>
                                  <MenuItem value='Yes'>Yes</MenuItem>
                                  <MenuItem value='No'>No</MenuItem>
                              </Select>
                          </FormControl>
                          {is_indigenous_group === 'Yes' && (
                          <FormControl fullWidth>
                            <TextField
                                name="indigenous_group"
                                label="If Yes, please specify"
                                type="text"
                                value={indigenous_group}
                                onChange={handleChange}
                                required
                              />
                          </FormControl>
                          )}
                          <FormControl fullWidth>
                            <TextField
                                name="school_last_attended"
                                label="School Last Attended"
                                type="text"
                                value={school_last_attended}
                                onChange={handleChange}
                                required
                              />
                          </FormControl>
                          <FormControl fullWidth>
                            <InputLabel id="label-select-typeOfSchool">Type of School</InputLabel>
                              <Select
                                labelId="label-select-typeOfSchool"
                                id="select-typeOfSchool"
                                name="type_of_school"
                                value={type_of_school}
                                type='text'
                                onChange={handleChangeSelect}
                                required
                              >
                                  <MenuItem value=""></MenuItem>
                                  <MenuItem value='Public'>Public</MenuItem>
                                  <MenuItem value='Private'>Private</MenuItem>
                              </Select>
                          </FormControl>
                          <FormControl fullWidth>
                            <InputLabel id="label-select-hasScholarshipOrFinancialAid">Do you have an existing Scholarship/Financial Aid?</InputLabel>
                              <Select
                                labelId="label-select-hasScholarshipOrFinancialAid"
                                id="select-hasScholarshipOrFinancialAid"
                                name="has_scholarship_or_financial_aid"
                                type='text'
                                value={has_scholarship_or_financial_aid}
                                onChange={handleChangeSelect}
                                required
                              >
                                  <MenuItem value=""></MenuItem>
                                  <MenuItem value='Yes'>Yes</MenuItem>
                                  <MenuItem value='No'>No</MenuItem>
                              </Select>
                          </FormControl>
                          {has_scholarship_or_financial_aid === 'Yes' && (
                            <FormControl fullWidth>
                                <TextField
                                    name="scholar_or_financial_aid"
                                    label="If Yes, please specify"
                                    type="text"
                                    value={scholarship_or_financial_aid}
                                    onChange={handleChange}
                                    required
                                />
                            </FormControl>
                          )}
                          <FormControl fullWidth>
                          <Button 
                          type='submit'
                          variant="contained" 
                          color="primary" 
                          fullWidth>
                              Next
                          </Button>
                          </FormControl>
                      </Box>
                  </Paper>
              </Box>
          </React.Suspense>
    )
}

export default React.memo(PersonalInformation)