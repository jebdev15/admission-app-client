import React from 'react'
import { AccountCircle, Lock as LockIcon, Person } from '@mui/icons-material'
import { Box, FormControl, InputAdornment, Paper, TextField, Typography, Button } from '@mui/material'

const Register = () => {
  return (
    <Box
        sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100dvh',
            padding: '1rem',
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
                    minWidth: '500px',
                    padding: '1rem',
                    gap: 1
                }}
            >
            <Person />
            <Typography variant="body1" color="initial">Log In</Typography>
                <FormControl fullWidth>
                    <TextField
                        name="email"
                        label="Email Address"
                        type="email"
                        variant="standard"
                        slotProps={{ 
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                </FormControl>
                <FormControl fullWidth>
                    <TextField
                        name="password"
                        label="Password"
                        variant="standard"
                        slotProps={{ 
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                </FormControl>
                <Button type='submit' variant="contained" color="primary" fullWidth>
                  Log in
                </Button>
            </Box>
        </Paper>
    </Box>
  )
}

export default Register