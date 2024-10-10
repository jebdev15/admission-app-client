import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import ErrorPage from '../pages/ErrorPage'
import Home from '../pages/Student/Home/Home'
import { AuthContextProvider } from '../context/Auth/AuthContext'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthContextProvider>
                    <App />
                </AuthContextProvider>,
        errorElement: <ErrorPage />
    },
    {
        path: 'home',
        element: <Home />,
        errorElement: <ErrorPage />
    }
])