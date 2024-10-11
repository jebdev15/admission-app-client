import { Box, CircularProgress } from '@mui/material'
import React from 'react'
import Authentication from '../../pages/Student/Auth/Auth'
import { useCookies } from 'react-cookie'
import { Outlet } from 'react-router'
const Header: React.LazyExoticComponent<() => JSX.Element> = React.lazy(() => import('./Header'))
// const Home: React.LazyExoticComponent<() => JSX.Element> = React.lazy(() => import('../../pages/Student/Home/Home'))
// const DrawerComponent = React.lazy(() => import('../DrawerComponent'))

const Layout = () => {
    const [cookie] = useCookies(['token'])
    const isAuthenticated = !!cookie.token
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
                {isAuthenticated ? <Outlet /> : <Authentication />}
                {/* <DrawerComponent /> */}
            </Box>
        </React.Suspense>
    )
}

export default Layout