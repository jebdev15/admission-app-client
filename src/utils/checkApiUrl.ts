import { VITE_API_URL } from "../constants"

export const checkApiUrl = () => {
    let isProduction: boolean;
    if(VITE_API_URL === 'http://localhost:3000') {
        isProduction = false
    } else if(VITE_API_URL === 'https://admission-backend.chmsu.edu.ph') {
        isProduction = true
    } else {
        isProduction = false
    }
    return isProduction
}