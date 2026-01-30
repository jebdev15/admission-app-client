import React, { Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from '@context/Auth/AuthContext'
import App from '@/App'
import CustomCircularProgress from '@components/CustomCircularProgress'

// Import loader separately (loaders cannot be lazy loaded)
import { loader as HomeLoader } from '@pages/Student/Home/Home'
import { HomeContextProvider } from '@pages/Student/Home/HomeContext'

// Lazy load pages that are not immediately needed
const ErrorPage = React.lazy(() => import('@pages/ErrorPage'))
const HomeErrorPage = React.lazy(() => import('@pages/HomeErrorPage'))
const AdminErrorPage = React.lazy(() => import('@pages/AdminErrorPage'))

// Lazy load Home page
const Home = React.lazy(() => import('@pages/Student/Home/Home'))

// Lazy load Admin pages
const AdminAuth = React.lazy(() => import('@pages/Admin/Layout'))
const AdminMain = React.lazy(() => import('@pages/Admin/Main/Main'))
const AdminReports = React.lazy(() => import('@pages/Admin/Main/Reports'))
const ScheduleManagement = React.lazy(() => import('@pages/Admin/Main/ScheduleManagement'))
const StudentApplicants = React.lazy(() => import('@pages/Admin/Main/StudentApplicants'))
const ProtectedRoute = React.lazy(() => import('@pages/Admin/ProtectedRoute'))

// Suspense wrapper for lazy components
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Suspense fallback={<CustomCircularProgress />}>
        {children}
    </Suspense>
)

export const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <AuthContextProvider>
                <App />
            </AuthContextProvider>
        ),
        errorElement: (
            <SuspenseWrapper>
                <ErrorPage />
            </SuspenseWrapper>
        ),
    },
    {
        path: '/home/:uuid',
        element: (
            <HomeContextProvider>
                <SuspenseWrapper>
                    <Home />
                </SuspenseWrapper>
            </HomeContextProvider>
        ),
        loader: HomeLoader,
        errorElement: (
            <SuspenseWrapper>
                <HomeErrorPage />
            </SuspenseWrapper>
        ),
    },
    {
        path: '/admin',
        element: (
            <SuspenseWrapper>
                <AdminAuth />
            </SuspenseWrapper>
        ),
        errorElement: (
            <SuspenseWrapper>
                <AdminErrorPage />
            </SuspenseWrapper>
        ),
    },
    {
        path: '/admin/main',
        element: (
            <SuspenseWrapper>
                <ProtectedRoute>
                    <AdminMain />
                </ProtectedRoute>
            </SuspenseWrapper>
        ),
        errorElement: (
            <SuspenseWrapper>
                <AdminErrorPage />
            </SuspenseWrapper>
        ),
    },
    {
        path: '/admin/reports',
        element: (
            <SuspenseWrapper>
                <ProtectedRoute>
                    <AdminReports />
                </ProtectedRoute>
            </SuspenseWrapper>
        ),
        errorElement: (
            <SuspenseWrapper>
                <AdminErrorPage />
            </SuspenseWrapper>
        ),
    },
    {
        path: '/admin/schedules',
        element: (
            <SuspenseWrapper>
                <ProtectedRoute>
                    <ScheduleManagement />
                </ProtectedRoute>
            </SuspenseWrapper>
        ),
        errorElement: (
            <SuspenseWrapper>
                <AdminErrorPage />
            </SuspenseWrapper>
        ),
    },
    {
        path: '/admin/applicants',
        element: (
            <SuspenseWrapper>
                <ProtectedRoute>
                    <StudentApplicants />
                </ProtectedRoute>
            </SuspenseWrapper>
        ),
        errorElement: (
            <SuspenseWrapper>
                <AdminErrorPage />
            </SuspenseWrapper>
        ),
    },
    {
        path: '*',
        element: (
            <SuspenseWrapper>
                <ErrorPage />
            </SuspenseWrapper>
        ),
    },
])