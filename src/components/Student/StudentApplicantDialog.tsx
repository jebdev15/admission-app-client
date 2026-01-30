import React from 'react';
import {
    Box,
    Grid,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Divider,
} from '@mui/material';
import { FormatDateUtil } from '@/utils/formatDate';
import { ApplicantDetails } from '@/pages/Admin/Main/type';


interface Props {
    open: boolean;
    onClose: () => void;
    applicant?: ApplicantDetails | null;
    onExamStatusUpdate: (uuid: string, passed: boolean) => void;
    onEnrollmentUpdate: (uuid: string, enrolled: boolean) => void;
}

const StudentApplicantDialog: React.FC<Props> = ({ open, onClose, applicant }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Student Details</DialogTitle>
            <DialogContent>
                {applicant ? (
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>Personal Information</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="textSecondary">Full Name</Typography>
                                <Typography variant="body1">{applicant.full_name || '-'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                                <Typography variant="body1">{applicant.email || '-'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="textSecondary">Contact Number</Typography>
                                <Typography variant="body1">{applicant.mobile_no || '-'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="textSecondary">Date of Birth</Typography>
                                <Typography variant="body1">{applicant.date_of_birth ? FormatDateUtil.formatDateOnly(applicant.date_of_birth) : '-'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="textSecondary">Sex</Typography>
                                <Typography variant="body1">{applicant.gender || '-'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="textSecondary">LRN</Typography>
                                <Typography variant="body1">{applicant.lrn || '-'}</Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Address Information</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" color="textSecondary">Province</Typography>
                                <Typography variant="body1">{applicant.province || '-'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" color="textSecondary">Municipality</Typography>
                                <Typography variant="body1">{applicant.municipality || '-'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" color="textSecondary">Barangay</Typography>
                                <Typography variant="body1">{applicant.barangay || '-'}</Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Academic Information</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" color="textSecondary">Campus (Enroll)</Typography>
                                <Typography variant="body1">{applicant.campus_to_enroll || '-'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" color="textSecondary">Campus (Exam)</Typography>
                                <Typography variant="body1">{applicant.campus_to_take_exam || '-'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" color="textSecondary">Program</Typography>
                                <Typography variant="body1">{`${applicant.college_description || ''}${applicant.course_description ? ' - ' + applicant.course_description : ''}`}</Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Parents / Guardian</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" color="textSecondary">Father</Typography>
                                <Typography variant="body1">{applicant.father_name || '-'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" color="textSecondary">Mother</Typography>
                                <Typography variant="body1">{applicant.mother_name || '-'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" color="textSecondary">Guardian</Typography>
                                <Typography variant="body1">{applicant.guardian_name || '-'}</Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Schedule Information</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" color="textSecondary">Exam Date</Typography>
                                <Typography variant="body1">{applicant.schedule_date ? FormatDateUtil.formatDateOnly(applicant.schedule_date) : 'Not scheduled'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" color="textSecondary">Time</Typography>
                                <Typography variant="body1">{applicant.schedule_time_start ? FormatDateUtil.formatTimeTo12Hour(applicant.schedule_time_start) : 'Not scheduled'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" color="textSecondary">Location</Typography>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{applicant.schedule_location || 'Not scheduled'}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                ) : (
                    <Typography>No applicant selected</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default StudentApplicantDialog;