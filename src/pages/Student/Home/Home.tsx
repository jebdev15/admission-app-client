import { CircularProgress } from '@mui/material'
import React from 'react'

const Home = () => {
  return (
    <React.Suspense fallback={<CircularProgress />}>
        <h1>Home</h1>
    </React.Suspense>
  )
}

export default Home