import { VITE_API_URL } from "@constants/index";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

export default axiosInstance