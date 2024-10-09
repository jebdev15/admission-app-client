import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import ErrorPage from '../pages/ErrorPage'
import StudentLayout from '../components/Applicant/Layout'
import { LoginContextProvider } from '../context/Login/LoginContext'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <LoginContextProvider>
                    <App />
                </LoginContextProvider>,
        errorElement: <ErrorPage />
    },
    {
        path: 'student',
        element: <StudentLayout />,
        errorElement: <ErrorPage />
    }
])