import axiosInstance from "../api";

export const AuthService = {
    getDailyReservationLimit: async () => {
        try {
            const { data, status } = await axiosInstance.get('/daily-reservation-limit/get-all');
            return { data, status }
        } catch (error) {
            console.error('Error fetching daily reservation limit:', error);
            throw error;
        }
    },
    getNoOfSlotsRemaingByCampus: async () => {
        try {
            const { data, status } = await axiosInstance.get('/schedules/slots-remaining');
            return { data, status }
        } catch (error) {
            console.error('Error fetching no of slots remaining:', error);
            throw error;
        }
    },
}