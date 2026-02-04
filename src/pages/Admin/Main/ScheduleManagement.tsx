import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Chip
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams
} from '@mui/x-data-grid';
import { useCookies } from 'react-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { adminScheduleService } from '@services/adminScheduleService';
import {
    Download as DownloadIcon,
    EventAvailable as EventAvailableIcon,
} from '@mui/icons-material';
import CustomCircularProgress from '@components/CustomCircularProgress';
import Header from './Header';
import { FormatDateUtil } from '@utils/formatDate';

interface DecodedToken extends JwtPayload {
    office: string;
    campus: string;
    role: string;
    name: string;
}

interface Schedule {
    schedule_id: number;
    campus: string;
    location: string;
    schedule_date: string;
    schedule_time_start: string;
    schedule_time_end: string;
    time_slot: string;
    total_slots: number;
    slots_remaining: number;
    slots_reserved: number;
}

const ScheduleManagement: React.FC = () => {
    const [cookie] = useCookies(['token']);
    const [loading, setLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const decodedToken = jwtDecode<DecodedToken>(cookie.token || '');
    const { office, campus, name } = decodedToken;

    const loadSchedules = useCallback(async (forceRefresh = false) => {
        setError(null);
        setLoading(true);
        try {
            const response = await adminScheduleService.getAllSchedules(cookie.token, forceRefresh);
            if (response.success) {
                setSchedules(response.data);
            }
        } catch (err) {
            setError((err as Error).message || 'Failed to load schedules');
        } finally {
            setLoading(false);
        }
    }, [cookie.token]);

    useEffect(() => {
        loadSchedules();
    }, [loadSchedules]);


    const handleExportSchedules = async () => {
        setExportLoading(true);
        try {
            const response = await adminScheduleService.exportSchedulesForCSV(cookie.token);
            if (response.success && response.data) {
                exportToCSV(response.data, 'examination_schedules');
            }
        } catch (err) {
            setError((err as Error).message || 'Failed to export schedules');
        } finally {
            setExportLoading(false);
        }
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

    const scheduleColumns: GridColDef[] = [
        { field: 'schedule_id', headerName: 'ID', width: 80 },
        { field: 'campus', headerName: 'Campus', width: 150 },
        { field: 'schedule_date', headerName: 'Date', width: 120 },
        { 
            field: 'schedule_time_start', 
            headerName: 'Time', 
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <span>
                    {FormatDateUtil.formatTimeTo12Hour(params.value)}
                </span>
            )
        },
        { field: 'location', headerName: 'Location', width: 300 },
        { 
            field: 'total_slots', 
            headerName: 'Total Slots', 
            width: 100,
            align: 'center',
            headerAlign: 'center'
        },
        { 
            field: 'slots_reserved', 
            headerName: 'Reserved', 
            width: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params: GridRenderCellParams) => (
                <Chip 
                    label={params.value} 
                    color="primary" 
                    size="small" 
                />
            )
        },
        { 
            field: 'slots_remaining', 
            headerName: 'Remaining', 
            width: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params: GridRenderCellParams) => (
                <Chip 
                    label={params.value} 
                    color={params.value === 0 ? 'error' : 'success'} 
                    size="small" 
                />
            )
        },
    ];

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
                <Box sx={{ p: 3 }}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            <EventAvailableIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Examination Schedules
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

                    <Paper sx={{ width: '100%', p: 3 }}>
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">Schedule Overview</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" onClick={() => loadSchedules(true)} disabled={loading}>Refresh</Button>
                                <Button
                                    variant="contained"
                                    startIcon={exportLoading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                                    onClick={handleExportSchedules}
                                    disabled={exportLoading || loading}
                                >
                                    {exportLoading ? 'Exporting...' : 'Export to CSV'}
                                </Button>
                            </Box>
                        </Box>

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <DataGrid
                                rows={schedules}
                                columns={scheduleColumns}
                                getRowId={(row) => row.schedule_id}
                                autoHeight
                                pageSizeOptions={[10, 25, 50, 100]}
                                paginationModel={paginationModel}
                                onPaginationModelChange={setPaginationModel}
                                // slots={{ toolbar: GridToolbar }}
                                // slotProps={{
                                //     toolbar: {
                                //         showQuickFilter: true,
                                //     },
                                // }}
                                disableRowSelectionOnClick
                            />
                        )}
                    </Paper>
                </Box>
            </Box>
        </React.Suspense>
    );
};

export default ScheduleManagement;
