import { Place } from '@mui/icons-material'
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import React from 'react'
import { HealthType } from './type'
import { useNavigate, useParams } from 'react-router'
import { HealthService } from '../../../../services/healthService'
import { LoadingButton } from '@mui/lab'

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
    const [loading, setLoading] = React.useState<boolean>(false)
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
        const confirmation = window.confirm('Are you sure to proceed to next form? You can\'t edit your health after proceeding.');
        if(!confirmation) return
        setLoading(true)
        const formData = new FormData(event.currentTarget)
        formData.append('uuid', uuid ?? '')
        const { data, status } = await HealthService.saveHealth(formData)
        console.log(data, status)
        if(status) {
            if([200, 201, 204].includes(status)) {
                navigate('.')
            } 
            setLoading(false)
        }
    }
    const disableButton = !health.is_pwd || !health.is_sped || !health.has_siblings_studying_in_chmsu || !health.has_relatives_studying_in_chmsu
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
                            padding: {xs: 2, sm: 4},
                            gap: 1,
                            width: '100%',
                        }}
                          onSubmit={handleSubmit}
                    >
                      <Place sx={{ color: 'primary.main', fontSize: 50, mb: -1.5}}/>
                      <Typography variant="body1" color="primary" sx={{ mb: 3 }}>Health</Typography>
                        <Grid container rowSpacing={3} columnSpacing={2} width={'100%'}>
                            <Grid size={{xs: 12, md: 6}}>
                                <FormControl fullWidth>
                                    <InputLabel id="label-select-is_pwd">Do you have a disability (PWD)</InputLabel>
                                    <Select
                                        labelId="label-select-is_pwd"
                                        label="Do you have a disability (PWD)"
                                        id="select-is_pwd"
                                        name="is_pwd"
                                        value={health.is_pwd}
                                        onChange={handleChangeSelect}
                                        required
                                        sx={{borderRadius: 2 }}
                                    >
                                    <MenuItem value=""></MenuItem>
                                    <MenuItem value="Yes">Yes</MenuItem>
                                    <MenuItem value="No">No</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{xs: 12, md: 6}}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="input-pwd_id_no"
                                        name="pwd_id_no"
                                        label="if yes, please enter your PWD ID number"
                                        value={health.pwd_id_no}
                                        onChange={handleChangeInput}
                                        required={health.is_pwd === 'Yes'}
                                        variant='standard'
                                        sx={{ '& .MuiInputBase-root': { borderRadius: 2 }, mt: {xs: -2, sm: -2, md: 0}, mb: {xs: 2, sm: 2, md: 0}, mx: {xs: 2, sm: 2, md: 0} }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid size={{xs: 12, md: 6}}>
                                <FormControl fullWidth>
                                    <InputLabel id="label-select-is_sped">Do you have a special educational need(s)</InputLabel>
                                    <Select
                                        labelId="label-select-is_sped"
                                        label="Do you have a special educational need(s)"
                                        id="select-is_sped"
                                        name="is_sped"
                                        value={health.is_sped}
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
                            <Grid size={{xs: 12, md: 6}}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="input-specify_sped"
                                        name="specify_sped"
                                        label="If yes, please specify"
                                        value={health.specify_sped}
                                        onChange={handleChangeInput}
                                        required={health.is_sped === 'Yes'}
                                        variant='standard'
                                        sx={{ '& .MuiInputBase-root': { borderRadius: 2 }, mt: {xs: -2, sm: -2, md: 0}, mb: {xs: 2, sm: 2, md: 0}, mx: {xs: 2, sm: 2, md: 0} }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid size={{xs: 12, md: 6}}>
                                <FormControl fullWidth>
                                    <InputLabel id="label-select-has_siblings_studying_in_chmsu">Do you have siblings studying in CHMSU?</InputLabel>
                                    <Select
                                        labelId="label-select-has_siblings_studying_in_chmsu"
                                        label="Do you have siblings studying in CHMSU?"
                                        id="select-has_siblings_studying_in_chmsu"
                                        name="has_siblings_studying_in_chmsu"
                                        value={health.has_siblings_studying_in_chmsu}
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
                            <Grid size={{xs: 12, md: 6}}>
                                <FormControl fullWidth>
                                    <InputLabel id="label-select-has_relatives_studying_in_chmsu">Do you have relatives working in CHMSU?</InputLabel>
                                    <Select
                                        labelId="label-select-has_relatives_studying_in_chmsu"
                                        label="Do you have relatives working in CHMSU?"
                                        id="select-has_relatives_studying_in_chmsu"
                                        name="has_relatives_studying_in_chmsu"
                                        value={health.has_relatives_studying_in_chmsu}
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
                            <FormControl fullWidth>
                                <LoadingButton
                                    type="submit"
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

export default React.memo(Health)