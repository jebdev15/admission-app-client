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
    GridToolbar,
    GridRenderCellParams
} from '@mui/x-data-grid';
import { useCookies } from 'react-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { adminScheduleService } from '@services/adminScheduleService';
import {
    Download as DownloadIcon,
    EventAvailable as EventAvailableIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import CustomCircularProgress from '@components/CustomCircularProgress';
import Header from './Header';
import { FormatDateUtil } from '@utils/formatDate';
import ScheduleManagementDialog from '@/components/Student/ScheduleManagementDialog';

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

interface ScheduleDetails extends Schedule {
    student_names: string[];
    student_emails: string[];
    applicant_ids: string[];
}

// In-memory cache for schedules during SPA session
let inMemorySchedulesCache: { key: string; timestamp: number; data: Schedule[] } | null = null;

const ScheduleManagement: React.FC = () => {
    const [cookie] = useCookies(['token']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [selectedSchedule, setSelectedSchedule] = useState<ScheduleDetails | null>(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 25,
    });

    const decodedToken = jwtDecode<DecodedToken>(cookie.token || '');
    const { office, campus, name } = decodedToken;

    const CACHE_KEY_BASE = 'schedules_cache_v1';
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    const loadSchedules = useCallback(async (forceRefresh = false) => {
        setError(null);
        const tokenSuffix = cookie.token ? `_${cookie.token.slice(0, 10)}` : '_anon';
        const CACHE_KEY = `${CACHE_KEY_BASE}${tokenSuffix}`;

        // in-memory cache
        if (!forceRefresh && inMemorySchedulesCache && inMemorySchedulesCache.key === CACHE_KEY) {
            if ((Date.now() - inMemorySchedulesCache.timestamp) < CACHE_TTL) {
                setSchedules(inMemorySchedulesCache.data);
                return;
            }
            inMemorySchedulesCache = null;
        }

        // persistent cache
        if (!forceRefresh) {
            try {
                const raw = localStorage.getItem(CACHE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed.timestamp && (Date.now() - parsed.timestamp) < CACHE_TTL && Array.isArray(parsed.data)) {
                        inMemorySchedulesCache = { key: CACHE_KEY, timestamp: parsed.timestamp, data: parsed.data };
                        setSchedules(parsed.data);
                        return;
                    }
                }
            } catch (e) {
                // ignore cache errors
            }
        }

        setLoading(true);
        try {
            const response = await adminScheduleService.getAllSchedules(cookie.token);
            if (response.success) {
                setSchedules(response.data);
                try {
                    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: response.data }));
                    inMemorySchedulesCache = { key: CACHE_KEY, timestamp: Date.now(), data: response.data };
                } catch (e) {
                    // ignore storage errors
                }
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

    const handleViewDetails = (scheduleId: number) => {
        // Find the schedule from already-fetched schedules and open dialog
        const schedule = schedules.find((s) => s.schedule_id === scheduleId) || null;
        setSelectedSchedule(schedule as ScheduleDetails | null);
        setDetailsDialogOpen(true);
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
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewDetails(params.row.schedule_id)}
                >
                    View
                </Button>
            ),
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
                            Schedule Management
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
                            <Typography variant="h6">Examination Schedules</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" onClick={() => loadSchedules(true)}>Refresh</Button>
                                <Button
                                    variant="contained"
                                    startIcon={<DownloadIcon />}
                                    onClick={() => exportToCSV(schedules, 'schedules')}
                                >
                                    Export to CSV
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
                                slots={{ toolbar: GridToolbar }}
                                slotProps={{
                                    toolbar: {
                                        showQuickFilter: true,
                                    },
                                }}
                                disableRowSelectionOnClick
                            />
                        )}
                    </Paper>

                    {/* Schedule Details Dialog */}
                    <ScheduleManagementDialog
                        open={detailsDialogOpen}
                        onClose={() => setDetailsDialogOpen(false)}
                        selectedSchedule={selectedSchedule}
                    />
                </Box>
            </Box>
        </React.Suspense>
    );
};

export default ScheduleManagement;
