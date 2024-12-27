import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from '../pages/ErrorPage'
import HomeErrorPage from '../pages/HomeErrorPage'
import Home, {loader as HomeLoader} from '../pages/Student/Home/Home'
import { AuthContextProvider } from '../context/Auth/AuthContext'
import App from '../App'
import { HomeContextProvider } from '../pages/Student/Home/HomeContext'

// import AdminErrorPage from '../pages/AdminErrorPage'
// import AdminLayout from '../pages/Admin/Layout'
// import AdminMain from '../pages/Admin/Main/Main'
// import AdminApplicants from '../pages/Admin/Applicants/Applicants'

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
    // {
    //     path: '/admin',
    //     element: <AdminLayout />,
    //     errorElement: <AdminErrorPage />,
    // },
    // {
    //     path: '/admin/main',
    //     element: <AdminMain />,
    //     errorElement: <AdminErrorPage />,
    //     children: [
    //         {
    //             index: true,
    //             element: <AdminApplicants />
    //         }
    //     ]
    // },
    {
        path: "*",
        element: <ErrorPage />
    }
])