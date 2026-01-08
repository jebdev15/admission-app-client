import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Badge as BadgeIcon, Description } from '@mui/icons-material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useCookies } from 'react-cookie';
import useFetch from '@hooks/useFetch';
import StatusDialog from '../Dialog/Status';
import { jwtDecode, JwtPayload } from 'jwt-decode';

type SelectedDataType = {
    name: string,
    imageName: string,
    emailAddress: string,
    uuid: string,
}


const initialSelectedData: SelectedDataType = {
    name: "",
    imageName: "",
    emailAddress: "",
    uuid: "",
}
interface DecodedToken extends JwtPayload {
    office: string;
}
const DataComponent = () => {
    const [cookie] = useCookies(['token']);
    const [openAdmissionStatusDialog, setOpenAdmissionStatusDialog] = React.useState(false);
    const [openEnrollmentStatusDialog, setOpenEnrollmentStatusDialog] = React.useState(false);
    const [selectedAdmissionData, setSelectedAdmissionData] = React.useState(initialSelectedData);
    const [selectedEnrollmentData, setSelectedEnrollmentData] = React.useState(initialSelectedData);

    const handleOpenAdmissionStatusDialog = () => setOpenAdmissionStatusDialog(true);
    const handleCloseAdmissionStatusDialog = () => setOpenAdmissionStatusDialog(false);
    const handleOpenEnrollmentStatusDialog = () => setOpenEnrollmentStatusDialog(true);
    const handleCloseEnrollmentStatusDialog = () => setOpenEnrollmentStatusDialog(false);
    const decodedToken = jwtDecode(cookie.token || '') as DecodedToken;
    const { data, loading, error } = useFetch('/admin/applicants', cookie.token);
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error?.message}</div>;
    }

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "applicant_id", headerName: "Applicant ID", width: 200 },
        {
            field: "name",
            headerName: "Full name",
            width: 400,
        },
        {
            field: "emailAddress",
            headerName: "Email Address",
            width: 300
        },
        {
            field: "contactNo",
            headerName: "Contact Number",
            width: 300
        },
        {
            field: "date_of_birth",
            headerName: "Date of Birth",
            width: 200
        },
        {
            field: "campus",
            headerName: "Campus",
            width: 200
        },
        {
            field: "examVenue",
            headerName: "Exam Venue",
            width: 200
        },
        {
            field: "scheduleDate",
            headerName: "Exam Schedule",
            width: 300
        },
        {
            field: "program",
            headerName: "Program",
            width: 500
        },
        {
            field: "admission_status",
            headerName: "Status",
            width: 100,
        },
        {
            field: "program_status",
            headerName: "Program Status",
            width: 100,
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            renderCell: (params: any) => (
                <>
                    <Tooltip title="Admission Status">
                        <IconButton
                            aria-label="view"
                            onClick={() => {
                                handleOpenAdmissionStatusDialog();
                                setSelectedAdmissionData((prevState) => ({
                                    ...prevState,
                                    name: params.row.name,
                                    imageName: params.row.imageName,
                                    emailAddress: params.row.emailAddress,
                                    uuid: params.row.uuid,
                                }))
                            }}
                        >
                            <Description />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Program Status">
                        <IconButton aria-label="view" onClick={() => {
                            handleOpenEnrollmentStatusDialog();
                            setSelectedEnrollmentData((prevState) => ({
                                ...prevState,
                                name: params.row.name,
                                imageName: params.row.imageName,
                                emailAddress: params.row.emailAddress,
                                uuid: params.row.uuid,
                            }))
                        }}>
                            <BadgeIcon />
                        </IconButton>
                    </Tooltip>
                </>
            ),
        }
    ]
    const columnsForChairperson: GridColDef[] = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "applicant_id", headerName: "Applicant ID", width: 200 },
        {
            field: "name",
            headerName: "Full name",
            width: 400,
        },
        {
            field: "emailAddress",
            headerName: "Email Address",
            width: 300
        },
        {
            field: "contactNo",
            headerName: "Contact Number",
            width: 300
        },
        {
            field: "date_of_birth",
            headerName: "Date of Birth",
            width: 200
        },
        {
            field: "campus",
            headerName: "Campus",
            width: 200
        },
        {
            field: "examVenue",
            headerName: "Exam Venue",
            width: 200
        },
        {
            field: "scheduleDate",
            headerName: "Exam Schedule",
            width: 300
        },
        {
            field: "program",
            headerName: "Program",
            width: 500
        },
        {
            field: "program_status",
            headerName: "Program Status",
            width: 100,
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            renderCell: (params: any) => (
                <>
                    <Tooltip title="Program Status">
                        <IconButton aria-label="view" onClick={() => {
                            handleOpenEnrollmentStatusDialog();
                            setSelectedEnrollmentData((prevState) => ({
                                ...prevState,
                                name: params.row.name,
                                imageName: params.row.imageName,
                                emailAddress: params.row.emailAddress,
                                uuid: params.row.uuid,
                            }))
                        }}>
                            <BadgeIcon />
                        </IconButton>
                    </Tooltip>
                </>
            ),
        }
    ]
    const columnsForGuidance: GridColDef[] = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "applicant_id", headerName: "Applicant ID", width: 200 },
        {
            field: "name",
            headerName: "Full name",
            width: 400,
        },
        {
            field: "emailAddress",
            headerName: "Email Address",
            width: 300
        },
        {
            field: "contactNo",
            headerName: "Contact Number",
            width: 300
        },
        {
            field: "date_of_birth",
            headerName: "Date of Birth",
            width: 200
        },
        {
            field: "campus",
            headerName: "Campus",
            width: 200
        },
        {
            field: "examVenue",
            headerName: "Exam Venue",
            width: 200
        },
        {
            field: "scheduleDate",
            headerName: "Exam Schedule",
            width: 300
        },
        {
            field: "program",
            headerName: "Program",
            width: 500
        },
        {
            field: "admission_status",
            headerName: "Status",
            width: 100,
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            renderCell: (params: any) => (
                <>
                    <Tooltip title="Admission Status">
                        <IconButton
                            aria-label="view"
                            onClick={() => {
                                handleOpenAdmissionStatusDialog();
                                setSelectedAdmissionData((prevState) => ({
                                    ...prevState,
                                    name: params.row.name,
                                    imageName: params.row.imageName,
                                    emailAddress: params.row.emailAddress,
                                    uuid: params.row.uuid,
                                }))
                            }}
                        >
                            <Description />
                        </IconButton>
                    </Tooltip>
                </>
            ),
        }
    ]
    const columnToUse = decodedToken.office === "MIS" ? columns : decodedToken.office === "CHAIRPERSON" ? columnsForChairperson : columnsForGuidance;
    return (
        <>
            <DataGrid
                rows={data}
                columns={columnToUse}
                loading={loading}
                slots={{
                    toolbar: GridToolbar,
                }}
            />
            {openAdmissionStatusDialog && (<StatusDialog open={openAdmissionStatusDialog} onClose={handleCloseAdmissionStatusDialog} action="Admission" selectedData={selectedAdmissionData} />)}
            {openEnrollmentStatusDialog && (<StatusDialog open={openEnrollmentStatusDialog} onClose={handleCloseEnrollmentStatusDialog} action="Program" selectedData={selectedEnrollmentData} />)}
        </>
    );
};

export default React.memo(DataComponent);