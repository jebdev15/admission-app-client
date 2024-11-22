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
        borderBottom: 3, 
        borderColor: 'primary.main',
        width: '100%', 
        // height: {xs: 'auto', md: '100px'}
        height: 'auto'
      }}>
        <Box sx={{ display: 'flex', flexDirection: {xs: 'column', md: 'row'}, alignContent: 'center', alignItems: 'center' }}>
          <img src={chmsuLogo} alt="CHMSU Logo" width={50} height={50} />
          <Typography variant={"h6"} component="div" color='primary' textAlign={'center'}>
              CARLOS HILADO MEMORIAL STATE UNIVERSITY
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6" color="primary" textAlign={'center'}>ADMISSION SYSTEM</Typography>
          <Typography variant="body1" component="div" color='primary' textAlign={'center'}>
              A.Y 2025-2026
          </Typography>
        </Box>
    </Box>
  );
}