import dayjs from "dayjs";

export const FormatDateUtil = {
    formatDateTime: (date: string, time: string) => {
        // Combine date and time into a single datetime format
        const combinedDateTime = dayjs(`${date}T${time}`);
        
        // Format the datetime as "February 2, 2025 10:00 AM"
        return combinedDateTime.format('MMMM D, YYYY h:mm A');
    },
    formatDateOnly: (date: string) => {
        return dayjs(date).format('MMMM D, YYYY');
    },
    formatTimeTo12Hour: (time: string) => {
        const scheduleTimeStart = time.split('-')[0].trim();
        return dayjs(`1970-01-01T${scheduleTimeStart}`).format('h:mm A');
    }
}