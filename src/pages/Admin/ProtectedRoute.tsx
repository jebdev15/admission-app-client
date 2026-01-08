import React from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';

type ProtectedRouteContextType = { 
    accessToken: string, 
    refresh: boolean,
    handleLogout: () => void,
    refreshApplicants: () => void
}
const initialProtectedRouteContext = { 
    accessToken: '', 
    refresh: false, 
    handleLogout: () => {},
    refreshApplicants: () => {} 
}
export const ProtectedRouteContext = React.createContext<ProtectedRouteContextType>(initialProtectedRouteContext);

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    const [cookie,,removeCookie] = useCookies(['token']);
    const navigate = useNavigate();
    const handleLogout = () => {
        removeCookie('token', { path: '/' });
        navigate('/admin')
    }
    const [refresh, setRefresh] = React.useState(false)
    const refreshApplicants = () => setRefresh((prevState) => !prevState)
    const token: string = cookie.token || '';
    React.useEffect(() => { 
        if(!token) navigate('/admin')
    }, [token, navigate])
    // ✅ Return null when token is missing to prevent undefined rendering
    if (!token) return null;
    return <ProtectedRouteContext.Provider value={{ accessToken: cookie.token, refresh, handleLogout, refreshApplicants }}>{children}</ProtectedRouteContext.Provider>
}

export default ProtectedRoute