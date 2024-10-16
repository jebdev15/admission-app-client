import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import ErrorPage from '../pages/ErrorPage'
import Home from '../pages/Student/Home/Home'
import { AuthContextProvider } from '../context/Auth/AuthContext'
import Authentication from '../pages/Student/Auth/Auth'
import { HomeContextProvider } from '../pages/Student/Home/HomeContext'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthContextProvider>
                    <App />
                </AuthContextProvider>,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Authentication />,
            },
            {
                path: 'home',
                element: <HomeContextProvider>
                            <Home />
                        </HomeContextProvider>,
            }
        ]
    },
    {
        path: "*",
        element: <ErrorPage />
    }
])