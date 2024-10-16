import { ArrowBack, Person } from '@mui/icons-material'
import { Box, Button, CircularProgress, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React from 'react'
import { HomeContext } from '../../Home/HomeContext'

const PersonalInformation = () => {
    const context = React.useContext(HomeContext)
    const {
      firstName,
      middleName,
      lastName,
      mobileNumber,
      lrn,
      dateOfBirth,
      gender,
      civilStatus,
      religion,
      otherReligion,
      soloParent,
      isIndigenousGroup,
      indigenousGroup,
      schoolLastAttended,
      typeOfSchool,
      hasScholarshipOrFinancialAid,
      scholarshipOrFinancialAid,
      handleChange,
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
                          onSubmit={submitForm}
                    >
                      <Person />
                      <Typography variant="body1" color="initial">Personal Information</Typography>
                          <FormControl fullWidth>
                                <TextField
                                    id='email'
                                    name="email"
                                    label="Email Address"
                                    type="email"
                                    value="test@gmail.com"
                                    onChange={handleChange}
                                    disabled
                                />
                          </FormControl>
                          <FormControl fullWidth>
                              <TextField
                                    name="firstName"
                                    label="First Name"
                                    type="text"
                                    value={firstName}
                                    onChange={handleChange}
                                    required
                              />
                          </FormControl>
                          <FormControl fullWidth>
                              <TextField
                                    name="middleName"
                                    label="Middle Name"
                                    type="text"
                                    value={middleName}
                                    onChange={handleChange}
                              />
                          </FormControl>
                          <FormControl fullWidth>
                              <TextField
                                    name="lastName"
                                    label="Last Name"
                                    type="text"
                                    value={lastName}
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
                                    name="mobileNumber"
                                    label="Mobile Number(09123456789)"
                                    type="number"
                                    value={mobileNumber}
                                    onChange={handleChange}
                                    required
                              />
                          </FormControl>
                          <FormControl fullWidth>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker 
                                    label="Date of Birth" 
                                    name="dateOfBirth" 
                                    onChange={(newDate) => handleChange({ target: { name: 'dateOfBirth', value: newDate }})} 
                                    value={dateOfBirth} 
                                />
                              </LocalizationProvider>
                          </FormControl>
                          <FormControl fullWidth>
                            <InputLabel id="label-select-sex">Sex</InputLabel>
                              <Select
                                labelId="label-select-sex"
                                id="select-sex"
                                name="gender"
                                value={gender}
                                onChange={handleChange}
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
                                name="civilStatus"
                                value={civilStatus}
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                    name="otherReligion"
                                    label="Please specify"
                                    type="text"
                                    value={otherReligion}
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
                                name="soloParent"
                                value={soloParent}
                                onChange={handleChange}
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
                                name="isIndigenousGroup"
                                value={isIndigenousGroup}
                                onChange={handleChange}
                                required
                              >
                                  <MenuItem value=""></MenuItem>
                                  <MenuItem value='Yes'>Yes</MenuItem>
                                  <MenuItem value='No'>No</MenuItem>
                              </Select>
                          </FormControl>
                          {isIndigenousGroup === 'Yes' && (
                          <FormControl fullWidth>
                            <TextField
                                name="indigenousGroup"
                                label="If Yes, please specify"
                                type="text"
                                value={indigenousGroup}
                                onChange={handleChange}
                                required
                              />
                          </FormControl>
                          )}
                          <FormControl fullWidth>
                            <TextField
                                name="schoolLastAttended"
                                label="School Last Attended"
                                type="text"
                                value={schoolLastAttended}
                                onChange={handleChange}
                                required
                              />
                          </FormControl>
                          <FormControl fullWidth>
                            <InputLabel id="label-select-typeOfSchool">Type of School</InputLabel>
                              <Select
                                labelId="label-select-typeOfSchool"
                                id="select-typeOfSchool"
                                name="typeOfSchool"
                                value={typeOfSchool}
                                type='text'
                                onChange={handleChange}
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
                                name="hasScholarshipOrFinancialAid"
                                type='text'
                                value={hasScholarshipOrFinancialAid}
                                onChange={handleChange}
                                required
                              >
                                  <MenuItem value=""></MenuItem>
                                  <MenuItem value='Yes'>Yes</MenuItem>
                                  <MenuItem value='No'>No</MenuItem>
                              </Select>
                          </FormControl>
                          {hasScholarshipOrFinancialAid === 'Yes' && (
                            <FormControl fullWidth>
                                <TextField
                                    name="scholarshipOrFinancialAid"
                                    label="If Yes, please specify"
                                    type="text"
                                    value={scholarshipOrFinancialAid}
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