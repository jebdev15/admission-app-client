import { Box, CircularProgress } from '@mui/material'
import React from 'react'
import Authentication from '../../pages/Student/Auth/Auth'
const Header: React.LazyExoticComponent<() => JSX.Element> = React.lazy(() => import('./Header'))
// const DrawerComponent = React.lazy(() => import('../DrawerComponent'))

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
                {/* <DrawerComponent /> */}
            </Box>
        </React.Suspense>
    )
}

export default Layout