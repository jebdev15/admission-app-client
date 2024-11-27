import { Box } from '@mui/material'
import React from 'react'
import Authentication from './Auth/Auth'
import CustomCircularProgress from '../../components/CustomCircularProgress'
const Header: React.LazyExoticComponent<() => JSX.Element> = React.lazy(() => import('./Header'))

const Layout = () => {
    return(
        <React.Suspense fallback={<CustomCircularProgress />}>
            <Box
                sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    backgroundColor: '#e0e0e0'
                 }}
            >
                <Header />
                <Authentication />
            </Box>
        </React.Suspense>
    )
}

export default Layout