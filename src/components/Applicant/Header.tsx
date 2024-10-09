// import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import chmsuLogo from '../../assets/chmsu.png';


export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1, px: 'auto' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
            }}
          >
          <img 
            src={chmsuLogo}
            alt="chmsu logo"
            width="50"
            height="50"
            loading='lazy'
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CARLOS HILADO MEMORIAL STATE UNIVERSITY
          </Typography>
          </Box>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}