import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from '../pages/ErrorPage'
import HomeErrorPage from '../pages/HomeErrorPage'
import Home, {loader as HomeLoader} from '../pages/Student/Home/Home'
import { AuthContextProvider } from '../context/Auth/AuthContext'
import App from '../App'
import { HomeContextProvider } from '../pages/Student/Home/HomeContext'

import AdminErrorPage from '../pages/AdminErrorPage'
import AdminAuth from '../pages/Admin/Layout'
import AdminMain from '../pages/Admin/Main/Main'
import ProtectedRoute from '../pages/Admin/ProtectedRoute'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthContextProvider>
                    <App />
                </AuthContextProvider>,
        errorElement: <ErrorPage />,
    },
    {
        path: '/home/:uuid',
        element: <HomeContextProvider><Home /></HomeContextProvider>,
        loader: HomeLoader,
        errorElement: <HomeErrorPage  />,
    },
    {
        path: '/admin',
        element: <AdminAuth />,
        errorElement: <AdminErrorPage />,
    },
    {
        path: '/admin/main',
        element: <ProtectedRoute>
                <AdminMain />
            </ProtectedRoute>, // Wrap AdminMain with ProtectedRoute
        errorElement: <AdminErrorPage />,
    },
    {
        path: "*",
        element: <ErrorPage />
    }
])