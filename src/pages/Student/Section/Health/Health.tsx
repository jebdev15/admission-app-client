import { ArrowBack, Place } from '@mui/icons-material'
import { Box, Button, CircularProgress, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'
import React from 'react'
import { HomeContext } from '../../Home/HomeContext'

const Health = () => {
    const context = React.useContext(HomeContext)
    const {
        isPWD,
        pwdIdNumber,
        isSPED,
        specifySPED,
        hasSiblingsStudyingInCHMSU,
        hasRelativesWorkingInCHMSU,
        handleChange,
        submitForm
    } = context.health
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
                      <IconButton aria-label="" onClick={() => context.setFilledOutForm({ ...context.filledOutForm, homeAndFamilyBackground: false })}>
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
                      <Typography variant="body1" color="initial">Health</Typography>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-isPWD">Do you have a disability (PWD)</InputLabel>
                            <Select
                                labelId="label-select-isPWD"
                                id="select-isPWD"
                                name="isPWD"
                                value={isPWD}
                                onChange={handleChange}
                                required
                            >
                            <MenuItem value=""></MenuItem>
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                            </Select>
                        </FormControl>
                            <FormControl fullWidth>
                                <TextField 
                                    id="input-pwdIdNumber"
                                    name="pwdIdNumber"
                                    label="if Yes, Please enter your PWD ID number"
                                    value={pwdIdNumber}
                                    onChange={handleChange}
                                />
                            </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-isSPED">Do you have a special educational need(s)</InputLabel>
                            <Select
                                labelId="label-select-isSPED"
                                id="select-isSPED"
                                name="isSPED"
                                value={isSPED}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField 
                                id="input-specifySPED"
                                name="specifySPED"
                                label="If yes, please specify"
                                value={specifySPED}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-hasSiblingsStudyingInCHMSU">Do you have siblings studying in CHMSU?</InputLabel>
                            <Select
                                labelId="label-select-hasSiblingsStudyingInCHMSU"
                                id="select-hasSiblingsStudyingInCHMSU"
                                name="hasSiblingsStudyingInCHMSU"
                                value={hasSiblingsStudyingInCHMSU}
                                onChange={handleChange}
                                required
                            >
                            <MenuItem value=""></MenuItem>
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-hasRelativesWorkingInCHMSU">Do you have relatives working in CHMSU?</InputLabel>
                            <Select
                                labelId="label-select-hasRelativesWorkingInCHMSU"
                                id="select-hasRelativesWorkingInCHMSU"
                                name="hasRelativesWorkingInCHMSU"
                                value={hasRelativesWorkingInCHMSU}
                                onChange={handleChange}
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

export default React.memo(Health)