import React from 'react';
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import { FormatDateUtil } from '@/utils/formatDate';

interface ScheduleDetails {
    schedule_id?: number;
    campus?: string;
    location?: string;
    schedule_date?: string;
    schedule_time_start?: string;
    schedule_time_end?: string;
    time_slot?: string;
    total_slots?: number;
    slots_remaining?: number;
    slots_reserved?: number;
    student_names?: string[];
    student_emails?: string[];
    applicant_ids?: string[];
}

interface Props {
    open: boolean;
    onClose: () => void;
    selectedSchedule?: ScheduleDetails | null;
}

const ScheduleManagementDialog: React.FC<Props> = ({ open, onClose, selectedSchedule }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Schedule Details</DialogTitle>
            <DialogContent>
                {selectedSchedule ? (
                    <Box sx={{ pt: 2 }}>
                        <Typography variant="h6" gutterBottom>Schedule Information</Typography>
                        <Typography><strong>Campus:</strong> {selectedSchedule.campus || 'N/A'}</Typography>
                        <Typography><strong>Location:</strong> {selectedSchedule.location || 'N/A'}</Typography>
                        <Typography><strong>Date:</strong> {selectedSchedule.schedule_date || 'N/A'}</Typography>
                        <Typography><strong>Time:</strong> {selectedSchedule.schedule_time_start ? FormatDateUtil.formatTimeTo12Hour(selectedSchedule.schedule_time_start) : ''}</Typography>
                        <Typography><strong>Total number of slots:</strong> {selectedSchedule.total_slots ?? 0}</Typography>
                        <Typography><strong>Slots reserved:</strong> {selectedSchedule.slots_reserved ?? 0}</Typography>
                        <Typography><strong>Slots remaining:</strong> {selectedSchedule.slots_remaining ?? 0}</Typography>

                        {/* {selectedSchedule.student_names && selectedSchedule.student_names.length > 0 && (
                            <>
                                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                    Students Scheduled ({selectedSchedule.student_names.length})
                                </Typography>
                                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                                    {selectedSchedule.student_names.map((name, index) => (
                                        <Box key={index} sx={{ p: 1, borderBottom: '1px solid #eee' }}>
                                            <Typography><strong>Name:</strong> {name}</Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                <strong>Email:</strong> {selectedSchedule.student_emails?.[index] || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                <strong>ID:</strong> {selectedSchedule.applicant_ids?.[index] || 'N/A'}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </>
                        )} */}
                    </Box>
                ) : (
                    <Typography>No schedule selected</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ScheduleManagementDialog;