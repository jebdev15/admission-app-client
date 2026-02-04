import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Alert,
    TextField,
    InputAdornment,
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams
} from '@mui/x-data-grid';
import { useCookies } from 'react-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { adminApplicantService } from '@services/adminApplicantService';
import {
    Download as DownloadIcon,
    People as PeopleIcon,
    PhotoCamera as PhotoCameraIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import CustomCircularProgress from '@components/CustomCircularProgress';
import Header from './Header';
import { FormatDateUtil } from '@/utils/formatDate';
import { StudentApplicantsType } from './type';
const StudentImageDialog = React.lazy(() => import('@/components/Student/StudentImageDialog'));

interface DecodedToken extends JwtPayload {
    office: string;
    campus: string;
    role: string;
    name: string;
}



const StudentApplicants: React.FC = () => {
    const [cookie] = useCookies(['token']);
    const [loading, setLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [applicants, setApplicants] = useState<StudentApplicantsType[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [imageDialogData, setImageDialogData] = useState<{ image_name?: string | null; name?: string; } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const loadingRef = React.useRef(false);
    const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const decodedToken = jwtDecode<DecodedToken>(cookie.token || '');
    const { office, campus, name } = decodedToken;

    const loadApplicants = useCallback(async (page: number = paginationModel.page, pageSize: number = paginationModel.pageSize, search: string = '', forceRefresh = false) => {
        // Prevent multiple simultaneous requests
        if (loadingRef.current) {
            return;
        }
        
        loadingRef.current = true;
        setError(null);
        setLoading(true);
        try {
            const response = await adminApplicantService.getAllApplicantsWithDetails(cookie.token, page, pageSize, search, forceRefresh);
            if (response.success) {
                setApplicants(response.data as StudentApplicantsType[]);
                setTotalRows(response.pagination?.totalRows || 0);
            }
        } catch (err) {
            setError((err as Error).message || 'Failed to load applicants');
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    }, [cookie.token, paginationModel.page, paginationModel.pageSize]);

    useEffect(() => {
        loadApplicants(paginationModel.page, paginationModel.pageSize, searchQuery);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationModel.page, paginationModel.pageSize]);

    // Debounced search effect - triggers 1.5 seconds after user stops typing
    useEffect(() => {
        // Clear any existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout for 1.5 seconds
        searchTimeoutRef.current = setTimeout(() => {
            // Reset to first page when searching
            setPaginationModel(prev => ({ ...prev, page: 0 }));
            loadApplicants(0, paginationModel.pageSize, searchQuery);
        }, 1500);

        // Cleanup function
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    const handleViewImage = (applicant: StudentApplicantsType) => {
        setImageDialogData({ image_name: applicant.image_name, name: applicant.full_name });
        setImageDialogOpen(true);
    };

    const handleExportAll = async () => {
        setExportLoading(true);
        try {
            const response = await adminApplicantService.exportApplicantsForCSV(cookie.token);
            if (response.success && response.data) {
                exportToCSV(response.data, 'applicants_report');
            }
        } catch (err) {
            setError((err as Error).message || 'Failed to export data');
        } finally {
            setExportLoading(false);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exportToCSV = (data: any[], filename: string) => {
        if (data.length === 0) return;

        const headers = Object.keys(data[0]);
        
        // Create friendly column headers
        const headerMapping: { [key: string]: string } = {
            'full_name': 'Full Name',
            'campus': 'Campus',
            'exam_date': 'Exam Date',
            'exam_time': 'Exam Time',
            'exam_location': 'Location'
        };

        const friendlyHeaders = headers.map(h => headerMapping[h] || h);

        const csvContent = [
            friendlyHeaders.join(','),
            ...data.map(row =>
                headers.map(header => {
                    const value = row[header];
                    if (value === null || value === undefined) {
                        return '""';
                    }
                    if (Array.isArray(value)) {
                        return `"${value.join('; ')}"`;
                    }
                    if (typeof value === 'object') {
                        return `"${JSON.stringify(value)}"`;
                    }
                    // Escape quotes and wrap in quotes
                    return `"${String(value).replace(/"/g, '""')}"`;
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
        { field: 'full_name', headerName: 'Fullname', width: 250 },
        { field: 'campus_to_take_exam', headerName: 'Campus', width: 130 },
        { 
            field: 'schedule_date', 
            headerName: 'Exam date', 
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <span>
                    {FormatDateUtil.formatDateOnly(params.value)}
                </span>
            ),
        },
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
            renderCell: (params: GridRenderCellParams) => (
                    <>
                        <Button size="small" sx={{ ml: 1 }} startIcon={<PhotoCameraIcon />} onClick={() => handleViewImage(params.row as StudentApplicantsType)}>
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
                            Registered Applicants
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
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                placeholder="Search by name, campus, or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                size="small"
                            />
                        </Box>

                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h6">Applicant Records</Typography>
                                <Typography variant="caption" color="textSecondary">
                                    Showing {applicants.length > 0 ? paginationModel.page * paginationModel.pageSize + 1 : 0} - {Math.min((paginationModel.page + 1) * paginationModel.pageSize, totalRows)} of {totalRows} applicants
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => loadApplicants(paginationModel.page, paginationModel.pageSize, searchQuery, true)}
                                    disabled={loading}
                                >
                                    Refresh
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={exportLoading ? <CircularProgress size={20} /> : <DownloadIcon />}
                                    onClick={handleExportAll}
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
                                rows={applicants.map((row, index) => ({ id: paginationModel.page * paginationModel.pageSize + index + 1, _id: paginationModel.page * paginationModel.pageSize + index + 1, ...row }))}
                                columns={applicantColumns}
                                autoHeight
                                rowCount={totalRows}
                                pageSizeOptions={[10, 25, 50, 100]}
                                paginationModel={paginationModel}
                                paginationMode="server"
                                onPaginationModelChange={(newModel) => {
                                    setPaginationModel(newModel);
                                }}
                                disableRowSelectionOnClick
                            />
                        )}
                    </Paper>

                    <StudentImageDialog
                        open={imageDialogOpen}
                        onClose={() => setImageDialogOpen(false)}
                        name={imageDialogData?.name}
                        imageName={imageDialogData?.image_name ?? ''}
                    />
                </Box>
            </Box>
        </React.Suspense>
    );
};

export default StudentApplicants;
