import React from 'react'
import StudentLayout from './pages/Student/Layout'
import CustomCircularProgress from './components/CustomCircularProgress'

const App:React.FC = () => {
    return(
        <React.Suspense fallback={<CustomCircularProgress />}>
            <StudentLayout />
        </React.Suspense>
    )
}

export default App