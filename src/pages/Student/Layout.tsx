import { Box, CircularProgress } from '@mui/material'
import React from 'react'
import { useCookies } from 'react-cookie'
import { Outlet, useNavigate } from 'react-router'
const Header: React.LazyExoticComponent<() => JSX.Element> = React.lazy(() => import('./Header'))

const Layout = () => {
    const navigate = useNavigate()
    const [cookie] = useCookies(['token'])
    const isAuthenticated = !!cookie.token
    React.useEffect(() => {
        if(!isAuthenticated) {
            navigate('/')
            console.log('not authenticated')
        }
    }, [isAuthenticated, navigate])
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
                <Outlet />
            </Box>
        </React.Suspense>
    )
}

export default Layout