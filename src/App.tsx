import { CircularProgress } from '@mui/material'
import React from 'react'
import StudentLayout from './pages/Student/Layout'

const App:React.FC = () => {
    return(
        <React.Suspense fallback={<CircularProgress />}>
            <StudentLayout />
        </React.Suspense>
    )
}

export default App