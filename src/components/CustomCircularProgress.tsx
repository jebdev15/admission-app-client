import { Box, CircularProgress } from '@mui/material'
import React from 'react'

const CustomCircularProgress:React.FC = () => {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // Full viewport height
    }}>
        <CircularProgress />
    </Box>
  )
}

export default CustomCircularProgress