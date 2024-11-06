import { Box, CircularProgress } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router'
import Authentication from './Auth/Auth'
const Header: React.LazyExoticComponent<() => JSX.Element> = React.lazy(() => import('./Header'))

const Layout = () => {
    return(
        <React.Suspense fallback={<CircularProgress />}>
            <Box
                sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100dvh',
                    width: '100%',
                 }}
            >
                <Header />
                <Authentication />
            </Box>
        </React.Suspense>
    )
}

export default Layout