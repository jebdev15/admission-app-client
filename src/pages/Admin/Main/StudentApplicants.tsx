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
    PhotoCamera as PhotoCameraIcon
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
    const [error, setError] = useState<string | null>(null);
    const [applicants, setApplicants] = useState<StudentApplicantsType[]>([]);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [imageDialogData, setImageDialogData] = useState<{ image_name?: string | null; name?: string; } | null>(null);
    
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const decodedToken = jwtDecode<DecodedToken>(cookie.token || '');
    const { office, campus, name } = decodedToken;

    const addRowIds = (data: StudentApplicantsType[]) => {
        return data.map((item, idx) => ({ _id: idx + 1, ...item }));
    }

    const loadApplicants = useCallback(async () => {
        setError(null);
        setLoading(true);
        try {
            const response = await adminApplicantService.getAllApplicantsWithDetails(cookie.token);
            if (response.success) {
                const withIds = addRowIds(response.data as StudentApplicantsType[]);
                setApplicants(withIds);
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


    const handleViewImage = (applicant: StudentApplicantsType) => {
        setImageDialogData({ image_name: applicant.image_name, name: applicant.full_name });
        setImageDialogOpen(true);
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
        { field: 'full_name', headerName: 'Fullname', width: 250 },
        { field: 'campus_to_take_exam', headerName: 'Exam venue', width: 130 },
        { field: 'schedule_date', headerName: 'Exam date', width: 120 },
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
                                    onClick={() => loadApplicants()}
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
