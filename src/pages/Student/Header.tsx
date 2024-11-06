// import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import chmsuLogo from '../../assets/chmsu.png';


export default function ButtonAppBar() {
  return (
    <Box sx={{ 
        display: {xs: 'colum', md: 'flex'}, 
        alignContent: 'center', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        paddingY: 1, 
        paddingX: 5, 
        flexGrow: 1, 
        borderBottom: 3, 
        borderColor: 'primary.main',
        width: '100%', 
        height: "clamp(80px, 100%, 120px)"
      }}>
        <Box sx={{ display: 'flex', alignContent: 'center', alignItems: 'center' }}>
          <img src={chmsuLogo} alt="CHMSU Logo" width={50} height={50} />
          <Typography variant="h6" component="div" color='primary'>
              CARLOS HILADO MEMORIAL STATE UNIVERSITY
          </Typography>
        </Box>
        <Typography variant="h6" component="div" color='primary'>
            A.Y 2025-2026
        </Typography>
    </Box>
  );
}