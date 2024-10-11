import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import ErrorPage from '../pages/ErrorPage'
import Home from '../pages/Student/Home/Home'
import { AuthContextProvider } from '../context/Auth/AuthContext'
import Authentication from '../pages/Student/Auth/Auth'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthContextProvider>
                    <App />
                </AuthContextProvider>,
        children: [
            {
                index: true,
                element: <Authentication />,
                errorElement: <ErrorPage />,
            },
            {
                path: 'home',
                element: <Home />,
                errorElement: <ErrorPage />
            }
        ]
    },
])