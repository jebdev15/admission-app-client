// import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import chmsuLogo from '../../assets/chmsu.png';
import './header.css'

export default function ButtonAppBar() {
  return (
    <Box sx={{ 
        display: {xs: 'flex', md: 'flex'}, 
        alignContent: 'center', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        paddingY: 1, 
        paddingX: 5, 
        borderBottom: 3, 
        borderColor: 'primary.main',
        width: '100%', 
        // height: {xs: 'auto', md: '100px'}
        height: 'auto',
        backgroundColor: '#fff'
      }} className='headerContent'>
        <Box sx={{ display: 'flex', flexDirection: {xs: 'row', md: 'row'}, alignContent: 'center', alignItems: 'center' }}>
          <img src={chmsuLogo} alt="CHMSU Logo" width={50} height={50} className='logo' />
          {/* <Typography variant={"h6"} component="div" color='primary' textAlign={'center'}>
              CARLOS HILADO MEMORIAL STATE UNIVERSITY
          </Typography> */}
          <Typography
              className="systemName"
              variant="h6"
              component="div"
              sx={{ color: "primary.dark", flexGrow: 1, lineHeight: "1" }}
            >
              <span></span>
              <span></span>
            </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center' }} className='admissionText'>
          <Typography variant="h6" textAlign={'end'} sx={{color: "primary.dark", textWrap: 'balance', lineHeight: "1"}}>GREAT futures await you!</Typography>
          {/* <Typography variant="body2" component="div" color='primary' textAlign={'end'} sx={{ mt: -0.75, color: "primary.dark" }}>
              A.Y 2025-2026
          </Typography> */}
        </Box>
    </Box>
  );
}