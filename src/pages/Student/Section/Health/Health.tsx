import { Place } from '@mui/icons-material'
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import React from 'react'
import { HealthType } from './type'
import axiosInstance from '../../../../api'
import { useNavigate, useParams } from 'react-router'
import { HealthService } from '../../../../services/healthService'

const initialHealth: HealthType = {
    is_pwd: '',
    pwd_id_no: '',
    is_sped: '',
    specify_sped: '',
    has_siblings_studying_in_chmsu: '',
    has_relatives_studying_in_chmsu: '',
}
const Health = () => {
    const navigate = useNavigate()
    const { uuid } = useParams<{uuid: string | undefined}>()
    const [health, setHealth] = React.useState(initialHealth)
    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setHealth((prevState: HealthType) => ({ ...prevState, [name]: value }))
    }
    const handleChangeSelect = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target
        setHealth((prevState: HealthType) => ({ ...prevState, [name]: value }))
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        formData.append('uuid', uuid ?? '')
        const { data, status } = await HealthService.saveHealth(formData)
        console.log(data, status)
        if([200, 201, 204].includes(status)) setTimeout(() => navigate('.'), 1000)
    }
    React.useEffect(() => {
        const getHealth = async (uuid: string) => {
            const { data } = await HealthService.getHealth(uuid)
            if(data.length > 0) {
                setHealth(data[0])
            }
        }
        getHealth(uuid)
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
                      {/* <IconButton aria-label="" onClick={() => context.setFilledOutForm({ ...context.filledOutForm, homeAndFamilyBackground: false })}>
                          <ArrowBack />
                      </IconButton> */}
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
                      <Place />
                      <Typography variant="body1" color="initial">Health</Typography>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-is_pwd">Do you have a disability (PWD)</InputLabel>
                            <Select
                                labelId="label-select-is_pwd"
                                id="select-is_pwd"
                                name="is_pwd"
                                value={health.is_pwd}
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
                                id="input-pwd_id_no"
                                name="pwd_id_no"
                                label="if Yes, Please enter your PWD ID number"
                                value={health.pwd_id_no}
                                onChange={handleChangeInput}
                                required={health.is_pwd === 'Yes'}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-is_sped">Do you have a special educational need(s)</InputLabel>
                            <Select
                                labelId="label-select-is_sped"
                                id="select-is_sped"
                                name="is_sped"
                                value={health.is_sped}
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
                                id="input-specify_sped"
                                name="specify_sped"
                                label="If yes, please specify"
                                value={health.specify_sped}
                                onChange={handleChangeInput}
                                required={health.is_sped === 'Yes'}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-has_siblings_studying_in_chmsu">Do you have siblings studying in CHMSU?</InputLabel>
                            <Select
                                labelId="label-select-has_siblings_studying_in_chmsu"
                                id="select-has_siblings_studying_in_chmsu"
                                name="has_siblings_studying_in_chmsu"
                                value={health.has_siblings_studying_in_chmsu}
                                onChange={handleChangeSelect}
                                required
                            >
                            <MenuItem value=""></MenuItem>
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-has_relatives_studying_in_chmsu">Do you have relatives working in CHMSU?</InputLabel>
                            <Select
                                labelId="label-select-has_relatives_studying_in_chmsu"
                                id="select-has_relatives_studying_in_chmsu"
                                name="has_relatives_studying_in_chmsu"
                                value={health.has_relatives_studying_in_chmsu}
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

export default React.memo(Health)