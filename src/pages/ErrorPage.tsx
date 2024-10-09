import React from 'react'
import { useNavigate } from 'react-router-dom'

const ErrorPage: React.FC = () => {
    const navigate = useNavigate()
    return (
        <div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')}>
            Click here to go back to Home
        </button>
    </div>
    )
}

export default ErrorPage