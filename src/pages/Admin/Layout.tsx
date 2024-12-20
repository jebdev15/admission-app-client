import { Box } from '@mui/material'
import React from 'react'
import Admin from './Auth/Auth'
const Header: React.LazyExoticComponent<() => JSX.Element> = React.lazy(() => import('./Header'))

const Layout = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: 'auto',
                minHeight: '100dvh',
                backgroundColor: '#e0e0e0'
            }}
        >
            <Header />
            <Admin />
        </Box>

    )
}

export default Layout