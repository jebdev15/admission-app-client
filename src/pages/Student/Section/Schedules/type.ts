import { Dayjs } from "dayjs";

export interface SchedulesType {
    selected_datetime: Dayjs | null
}

export interface ScheduleType {
    schedule_date: string;
    schedule_time_start: string;
    schedule_time_end: string;
    slots_remaining: number;
}

export interface AvailableDateType {
    date: string;
    schedules: { timeRange: string; slotsRemaining: number }[];
}

export interface AccumulatorItem {
    date: string;
    schedules: { 
        timeRange: string; 
        slotsRemaining: number; 
    }[];
}