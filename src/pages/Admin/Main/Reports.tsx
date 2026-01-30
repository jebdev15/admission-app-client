import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Tab,
    Tabs,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridToolbar
} from '@mui/x-data-grid';
import { useCookies } from 'react-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { adminReportService } from '@services/adminReportService';
import {
    Download as DownloadIcon,
    School as SchoolIcon,
    EventAvailable as EventAvailableIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import CustomCircularProgress from '@components/CustomCircularProgress';
import Header from './Header';

interface DecodedToken extends JwtPayload {
    office: string;
    campus: string;
    role: string;
    name: string;
}



interface ScheduleReport {
    campus: string;
    location: string;
    schedule_date: string;
    schedule_time_start: string;
    schedule_time_end: string;
    time_slot: string;
    total_slots: number;
    slots_remaining: number;
    slots_reserved: number;
    students_scheduled: number;
    student_names: string[];
    student_emails: string[];
    student_uuids: string[];
    applicant_ids: string[];
}

interface StatsSummary {
    total_applicants: number;
    scheduled_applicants: number;
    passed_applicants: number;
    enrolled_applicants: number;
    failed_applicants: number;
}

interface SlotsSummary {
    campus: string;
    location: string;
    schedule_date: string;
    schedule_time_start: string;
    schedule_time_end: string;
    total_slots: number;
    slots_remaining: number;
    slots_reserved: number;
}

const AdminReportsPage: React.FC = () => {
    const [cookie] = useCookies(['token']);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [scheduleReports, setScheduleReports] = useState<ScheduleReport[]>([]);
    const [slotsSummary, setSlotsSummary] = useState<SlotsSummary[]>([]);
    const [statistics, setStatistics] = useState<StatsSummary | null>(null);
    
    // Pagination state
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 25,
    });

    const decodedToken = jwtDecode<DecodedToken>(cookie.token || '');
    const { office, campus, name } = decodedToken;

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (activeTab === 0) {
                // Load scheduled exam reports
                const response = await adminReportService.getScheduledExamReport(cookie.token);
                if (response.success) {
                    setScheduleReports(response.data);
                }
            } else if (activeTab === 1) {
                // Load slots summary
                const response = await adminReportService.getSlotsSummary(cookie.token);
                if (response.success) {
                    setSlotsSummary(response.data);
                }
            } else if (activeTab === 2) {
                // Load statistics
                const response = await adminReportService.getStatisticsSummary(cookie.token);
                if (response.success) {
                    setStatistics(response.data);
                }
            }
        } catch (err) {
            setError((err as Error).message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    }, [activeTab, cookie.token]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };



    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exportToCSV = (data: any[], filename: string) => {
        if (data.length === 0) return;

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row =>
                headers.map(header => {
                    const value = row[header];
                    // Handle arrays and objects
                    if (Array.isArray(value)) {
                        return `"${value.join('; ')}"`;
                    }
                    if (typeof value === 'object' && value !== null) {
                        return `"${JSON.stringify(value)}"`;
                    }
                    return `"${value}"`;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Columns for Schedule Report
    const scheduleColumns: GridColDef[] = [
        { field: 'campus', headerName: 'Campus', width: 150 },
        { field: 'schedule_date', headerName: 'Date', width: 120 },
        { field: 'time_slot', headerName: 'Time Slot', width: 150 },
        { field: 'location', headerName: 'Location', width: 300 },
        { field: 'total_slots', headerName: 'Total Slots', width: 100 },
        { field: 'slots_reserved', headerName: 'Reserved', width: 100 },
        { field: 'slots_remaining', headerName: 'Remaining', width: 100 },
        { field: 'students_scheduled', headerName: 'Students', width: 100 },
    ];

    // Columns for Slots Summary
    const slotsColumns: GridColDef[] = [
        { field: 'campus', headerName: 'Campus', width: 150 },
        { field: 'schedule_date', headerName: 'Date', width: 120 },
        { field: 'schedule_time_start', headerName: 'Start Time', width: 100 },
        { field: 'schedule_time_end', headerName: 'End Time', width: 100 },
        { field: 'location', headerName: 'Location', width: 300 },
        { field: 'total_slots', headerName: 'Total', width: 80 },
        { field: 'slots_reserved', headerName: 'Reserved', width: 100 },
        { field: 'slots_remaining', headerName: 'Remaining', width: 100 },
    ];



    const renderStatisticsCards = () => {
        if (!statistics) return null;

        return (
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Applicants
                            </Typography>
                            <Typography variant="h4">{statistics.total_applicants}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Scheduled
                            </Typography>
                            <Typography variant="h4" color="primary">
                                {statistics.scheduled_applicants}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Card sx={{ bgcolor: 'success.light' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Passed
                            </Typography>
                            <Typography variant="h4" color="success.dark">
                                {statistics.passed_applicants}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Card sx={{ bgcolor: 'error.light' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Failed
                            </Typography>
                            <Typography variant="h4" color="error.dark">
                                {statistics.failed_applicants}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Card sx={{ bgcolor: 'info.light' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Enrolled
                            </Typography>
                            <Typography variant="h4" color="info.dark">
                                {statistics.enrolled_applicants}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    };

    return (
        <React.Suspense fallback={<CustomCircularProgress />}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100dvh",
                    backgroundColor: "#e0e0e0",
                }}
            >
                <Header />
                <Box sx={{ p: 3, paddingTop: { xs: 12, md: 14 } }}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Admin Reports & Management
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            Welcome, {name} | Office: {office} | Campus Access: {campus}
                        </Typography>
                    </Paper>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Paper sx={{ width: '100%' }}>
                        <Tabs value={activeTab} onChange={handleTabChange}>
                            <Tab label="Schedule Reports" icon={<EventAvailableIcon />} iconPosition="start" />
                            <Tab label="Slots Summary" icon={<CheckCircleIcon />} iconPosition="start" />
                            <Tab label="Statistics" icon={<CheckCircleIcon />} iconPosition="start" />
                        </Tabs>

                        <Box sx={{ p: 3 }}>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    {activeTab === 0 && (
                                        <Box>
                                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="h6">Scheduled Exam Report</Typography>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<DownloadIcon />}
                                                    onClick={() => exportToCSV(scheduleReports, 'schedule_report')}
                                                >
                                                    Export to CSV
                                                </Button>
                                            </Box>
                                            <DataGrid
                                                rows={scheduleReports.map((row, index) => ({ id: index, ...row }))}
                                                columns={scheduleColumns}
                                                autoHeight
                                                pageSizeOptions={[10, 25, 50, 100]}
                                                paginationModel={paginationModel}
                                                onPaginationModelChange={setPaginationModel}
                                                slots={{ toolbar: GridToolbar }}
                                                slotProps={{
                                                    toolbar: {
                                                        showQuickFilter: true,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    )}

                                    {activeTab === 1 && (
                                        <Box>
                                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="h6">Slots Summary by Campus</Typography>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<DownloadIcon />}
                                                    onClick={() => exportToCSV(slotsSummary, 'slots_summary')}
                                                >
                                                    Export to CSV
                                                </Button>
                                            </Box>
                                            <DataGrid
                                                rows={slotsSummary.map((row, index) => ({ id: index, ...row }))}
                                                columns={slotsColumns}
                                                autoHeight
                                                pageSizeOptions={[10, 25, 50, 100]}
                                                paginationModel={paginationModel}
                                                onPaginationModelChange={setPaginationModel}
                                                slots={{ toolbar: GridToolbar }}
                                                slotProps={{
                                                    toolbar: {
                                                        showQuickFilter: true,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    )}



                                    {activeTab === 2 && (
                                        <Box>
                                            <Typography variant="h6" sx={{ mb: 3 }}>
                                                Statistics Overview
                                            </Typography>
                                            {renderStatisticsCards()}
                                        </Box>
                                    )}
                                </>
                            )}
                        </Box>
                    </Paper>


                </Box>
            </Box>
        </React.Suspense>
    );
};

export default AdminReportsPage;
