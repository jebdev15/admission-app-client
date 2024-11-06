import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import ErrorPage from '../pages/ErrorPage'
import Home, {loader as HomeLoader} from '../pages/Student/Home/Home'
import { AuthContextProvider } from '../context/Auth/AuthContext'
import { HomeContextProvider } from '../pages/Student/Home/HomeContext'

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
        element: <HomeContextProvider>
                    <Home />
                </HomeContextProvider>,
        loader: HomeLoader,
        errorElement: <ErrorPage />,
    },
    {
        path: "*",
        element: <ErrorPage />
    }
])