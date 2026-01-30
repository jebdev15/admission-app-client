import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridToolbar,
    GridRenderCellParams
} from '@mui/x-data-grid';
import { useCookies } from 'react-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { adminApplicantService } from '@services/adminApplicantService';
import {
    Download as DownloadIcon,
    People as PeopleIcon,
    Visibility as VisibilityIcon,
    PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import CustomCircularProgress from '@components/CustomCircularProgress';
import Header from './Header';
import { FormatDateUtil } from '@/utils/formatDate';
import { ApplicantDetails } from './type';
const StudentApplicantDialog = React.lazy(() => import('@/components/Student/StudentApplicantDialog'));
const StudentImageDialog = React.lazy(() => import('@/components/Student/StudentImageDialog'));

interface DecodedToken extends JwtPayload {
    office: string;
    campus: string;
    role: string;
    name: string;
}



// In-memory cache lives across component mounts during the SPA session
let inMemoryApplicantsCache: { key: string; timestamp: number; data: ApplicantDetails[] } | null = null;

const StudentApplicants: React.FC = () => {
    const [cookie] = useCookies(['token']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [applicants, setApplicants] = useState<ApplicantDetails[]>([]);
    const [selectedApplicant, setSelectedApplicant] = useState<ApplicantDetails | null>(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [imageDialogData, setImageDialogData] = useState<{ uuid?: string | null; name?: string; email?: string } | null>(null);
    
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 25,
    });

    const decodedToken = jwtDecode<DecodedToken>(cookie.token || '');
    const { office, campus, name } = decodedToken;

    const CACHE_KEY_BASE = 'applicants_cache_v1';
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

        const addRowIds = (data: ApplicantDetails[]) => {
            return data.map((item, idx) => ({ ...item, _id: idx + 1 }));
        }

    const loadApplicants = useCallback(async (forceRefresh = false) => {
        setError(null);
        const tokenSuffix = cookie.token ? `_${cookie.token.slice(0, 10)}` : '_anon';
        const CACHE_KEY = `${CACHE_KEY_BASE}${tokenSuffix}`;

        // Try in-memory cache first
        if (!forceRefresh && inMemoryApplicantsCache && inMemoryApplicantsCache.key === CACHE_KEY) {
            if ((Date.now() - inMemoryApplicantsCache.timestamp) < CACHE_TTL) {
                setApplicants(inMemoryApplicantsCache.data);
                return;
            }
            // expired -> drop
            inMemoryApplicantsCache = null;
        }

        // Try persistent cache next
        if (!forceRefresh) {
            try {
                const raw = localStorage.getItem(CACHE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed.timestamp && (Date.now() - parsed.timestamp) < CACHE_TTL && Array.isArray(parsed.data)) {
                        // populate in-memory cache for faster reuse
                        const withIds = addRowIds(parsed.data as ApplicantDetails[]);
                        inMemoryApplicantsCache = { key: CACHE_KEY, timestamp: parsed.timestamp, data: withIds };
                        setApplicants(withIds);
                        return;
                    }
                }
            } catch (e) {
                // ignore cache parse errors
            }
        }

        setLoading(true);
        try {
            const response = await adminApplicantService.getAllApplicantsWithDetails(cookie.token);
            if (response.success) {
                const withIds = addRowIds(response.data as ApplicantDetails[]);
                setApplicants(withIds);
                try {
                    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: withIds }));
                    inMemoryApplicantsCache = { key: CACHE_KEY, timestamp: Date.now(), data: withIds };
                } catch (e) {
                    // ignore storage errors
                }
            }
        } catch (err) {
            setError((err as Error).message || 'Failed to load applicants');
        } finally {
            setLoading(false);
        }
    }, [cookie.token]);

    useEffect(() => {
        loadApplicants();
    }, [loadApplicants]);

    const handleViewDetails = (applicant: ApplicantDetails) => {
        setSelectedApplicant(applicant);
        setDetailsDialogOpen(true);
    };

    const handleViewImage = (applicant: ApplicantDetails) => {
        setImageDialogData({ uuid: applicant.uuid, name: applicant.full_name, email: applicant.email });
        setImageDialogOpen(true);
    };

    const handleExamStatusUpdate = async (uuid: string, passed: boolean) => {
        try {
            const response = await adminApplicantService.updateExamPassedStatus(
                uuid,
                passed,
                cookie.token
            );
            if (response.success) {
                loadApplicants();
                setDetailsDialogOpen(false);
                alert('Exam status updated successfully');
            }
        } catch (err) {
            alert((err as Error).message || 'Failed to update exam status');
        }
    };

    const handleEnrollmentUpdate = async (uuid: string, enrolled: boolean) => {
        try {
            const response = await adminApplicantService.updateEnrolledStatus(
                uuid,
                enrolled,
                cookie.token
            );
            if (response.success) {
                loadApplicants();
                setDetailsDialogOpen(false);
                alert('Enrollment status updated successfully');
            }
        } catch (err) {
            alert((err as Error).message || 'Failed to update enrollment status');
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

    const applicantColumns: GridColDef[] = [
        { field: '_id', headerName: 'No.', width: 100 },
        { field: 'full_name', headerName: 'Full Name', width: 250 },
        { field: 'campus_to_take_exam', headerName: 'Campus', width: 130 },
        { field: 'schedule_date', headerName: 'Exam Date', width: 120 },
        { 
            field: 'schedule_time_start', 
            headerName: 'Time', 
            width: 130,
            renderCell: (params: GridRenderCellParams) => (
                <span>
                    {FormatDateUtil.formatTimeTo12Hour(params.value)}
                </span>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                    <>
                        <Button size="small" startIcon={<VisibilityIcon />} onClick={() => handleViewDetails(params.row as ApplicantDetails)}>
                            View
                        </Button>
                        <Button size="small" sx={{ ml: 1 }} startIcon={<PhotoCameraIcon />} onClick={() => handleViewImage(params.row as ApplicantDetails)}>
                            Photo
                        </Button>
                    </>
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
                            <PeopleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Student Applicants Management
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
                            <Typography variant="h6">All Student Applicants</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => loadApplicants(true)}
                                >
                                    Refresh
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<DownloadIcon />}
                                    onClick={() => exportToCSV(applicants, 'applicants_report')}
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
                                rows={applicants.map((row) => ({ id: row._id ?? 0, ...row }))}
                                columns={applicantColumns}
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

                    {/* Student Details Dialog */}
                    <StudentApplicantDialog 
                        open={detailsDialogOpen}
                        onClose={() => setDetailsDialogOpen(false)}
                        applicant={selectedApplicant} 
                        onExamStatusUpdate={handleExamStatusUpdate}
                        onEnrollmentUpdate={handleEnrollmentUpdate}
                    />
                    <StudentImageDialog
                        open={imageDialogOpen}
                        onClose={() => setImageDialogOpen(false)}
                        uuid={imageDialogData?.uuid}
                        name={imageDialogData?.name}
                        email={imageDialogData?.email}
                    />
                </Box>
            </Box>
        </React.Suspense>
    );
};

export default StudentApplicants;
