import { ArrowBack, School, Work } from '@mui/icons-material'
import { Box, Button, CircularProgress, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'
import React from 'react'
import { HomeContext } from '../../Home/HomeContext'

const ParentProfile = () => {
    const context = React.useContext(HomeContext)
    const {
        fatherHEA,
        fatherOccupation,
        motherHEA,
        motherOccupation,
        livingWithGuardian,
        handleChange,
        submitForm
    } = context.parentProfile
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
                        <Box>
                            <School />
                            <Work />
                        </Box>
                      <Typography variant="body1" color="initial">Parent Profile</Typography>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-fatherHEA">Father's Highest Educational Attainment</InputLabel>
                            <Select
                                labelId="label-select-fatherHEA"
                                id="select-fatherHEA"
                                name="fatherHEA"
                                value={fatherHEA}
                                onChange={handleChange}
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
                                id="fatherOccupation"
                                name="fatherOccupation"
                                label="Father's Occupation"
                                value={fatherOccupation}
                                onChange={handleChange}
                                required
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-motherHEA">Mother's Highest Educational Attainment</InputLabel>
                            <Select
                                labelId="label-select-motherHEA"
                                id="select-motherHEA"
                                name="motherHEA"
                                value={motherHEA}
                                onChange={handleChange}
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
                                id="motherOccupation"
                                name="motherOccupation"
                                label="Mother's Occupation"
                                value={motherOccupation}
                                onChange={handleChange}
                                required
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-withGuardian">Are you living with a Guardian</InputLabel>
                            <Select
                                labelId="label-select-livingWithGuardian"
                                id="select-livingWithGuardian"
                                name="livingWithGuardian"
                                value={livingWithGuardian}
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

export default React.memo(ParentProfile)