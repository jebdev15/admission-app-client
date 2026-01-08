/**
 * Personal Information Step Component
 * Part of the unified multi-step form
 */

import React from 'react';
import {
    Box,
    FormControl,
    TextField,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    SelectChangeEvent,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Person } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { useUnifiedForm } from '../UnifiedFormContext';
import { PersonalInformationType } from '../types';

const PersonalInformationStep: React.FC = () => {
    const { formData, updateFormData } = useUnifiedForm();
    const personalInformation = formData.personalInformation;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateFormData('personalInformation', {
            [event.target.name]: event.target.value
        } as Partial<PersonalInformationType>);
    };

    const handleChangeSelect = (event: SelectChangeEvent<string>) => {
        updateFormData('personalInformation', {
            [event.target.name]: event.target.value
        } as Partial<PersonalInformationType>);
    };

    const handleChangeDate = (newValue: Dayjs | null) => {
        updateFormData('personalInformation', {
            date_of_birth: newValue ?? dayjs()
        });
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Person sx={{ color: 'primary.main', fontSize: '2.5rem' }} />
                <Typography variant="h6" color="primary">Personal Information</Typography>
            </Box>

            <Grid container spacing={2} rowSpacing={3}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <FormControl fullWidth>
                        <TextField
                            name="first_name"
                            label="First Name"
                            placeholder="e.g. John"
                            value={personalInformation.first_name}
                            onChange={handleChange}
                            required
                            sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                        />
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <FormControl fullWidth>
                        <TextField
                            name="middle_name"
                            label="Middle Name"
                            placeholder="e.g. Doe"
                            value={personalInformation.middle_name}
                            onChange={handleChange}
                            sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                        />
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <FormControl fullWidth>
                        <TextField
                            name="last_name"
                            label="Last Name"
                            placeholder="e.g. Smith"
                            value={personalInformation.last_name}
                            onChange={handleChange}
                            required
                            sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                        />
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 7, md: 6 }}>
                    <FormControl fullWidth>
                        <TextField
                            name="lrn"
                            label="Learner's Reference Number"
                            value={personalInformation.lrn}
                            onChange={handleChange}
                            required
                            sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                            slotProps={{ htmlInput: { maxLength: 30 } }}
                        />
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 5, md: 6 }}>
                    <FormControl fullWidth>
                        <TextField
                            name="mobile_no"
                            label="Mobile Number"
                            placeholder="e.g. 09123456789"
                            type="number"
                            value={personalInformation.mobile_no}
                            onChange={handleChange}
                            required
                            sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                            slotProps={{ htmlInput: { maxLength: 11, pattern: "[0-9]*" } }}
                            helperText="Mobile number must be 11 digits"
                            error={personalInformation.mobile_no.length > 11}
                        />
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 6, sm: 4, md: 4 }}>
                    <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                name="date_of_birth"
                                label="Date of Birth"
                                value={personalInformation.date_of_birth ? dayjs(personalInformation.date_of_birth) : null}
                                onChange={handleChangeDate}
                                format="YYYY-MM-DD"
                                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                            />
                        </LocalizationProvider>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 4 }}>
                    <FormControl fullWidth>
                        <InputLabel id="label-select-sex">Sex</InputLabel>
                        <Select
                            labelId="label-select-sex"
                            label="Sex"
                            name="gender"
                            value={personalInformation.gender}
                            onChange={handleChangeSelect}
                            required
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value=""><em>Select</em></MenuItem>
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 5, md: 4 }}>
                    <FormControl fullWidth>
                        <InputLabel id="label-select-civilStatus">Civil Status</InputLabel>
                        <Select
                            labelId="label-select-civilStatus"
                            label="Civil Status"
                            name="civil_status"
                            value={personalInformation.civil_status}
                            onChange={handleChangeSelect}
                            required
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value=""><em>Select</em></MenuItem>
                            <MenuItem value="Single">Single</MenuItem>
                            <MenuItem value="Married">Married</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid container size={12}>
                    <Grid size={"grow"}>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-religion">Religion</InputLabel>
                            <Select
                                labelId="label-select-religion"
                                label="Religion"
                                name="religion"
                                value={personalInformation.religion}
                                onChange={handleChangeSelect}
                                required
                                sx={{ borderRadius: 2 }}
                            >
                                <MenuItem value=""><em>Select</em></MenuItem>
                                <MenuItem value="Roman Catholic">Roman Catholic</MenuItem>
                                <MenuItem value="Iglesia ni Cristo">Iglesia ni Cristo</MenuItem>
                                <MenuItem value="Seventh Day Adventist">Seventh Day Adventist</MenuItem>
                                <MenuItem value="Latter Day Saints(Mormon)">Latter Day Saints(Mormon)</MenuItem>
                                <MenuItem value="Protestant">Protestant</MenuItem>
                                <MenuItem value="Jehovah's Witness">Jehovah's Witness</MenuItem>
                                <MenuItem value="Islam">Islam</MenuItem>
                                <MenuItem value="Others">Others</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {personalInformation.religion === 'Others' && (
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <TextField
                                    name="other_religion"
                                    label="Specify religion"
                                    value={personalInformation.other_religion}
                                    onChange={handleChange}
                                    variant="standard"
                                    required
                                    sx={{ mt: { xs: -2, sm: 0 } }}
                                />
                            </FormControl>
                        </Grid>
                    )}
                </Grid>
                <Grid container size={12}>
                    <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-soloParent">Solo Parent</InputLabel>
                            <Select
                                labelId="label-select-soloParent"
                                label="Solo Parent"
                                name="is_solo_parent"
                                value={personalInformation.is_solo_parent}
                                onChange={handleChangeSelect}
                                required
                                sx={{ borderRadius: 2 }}
                            >
                                <MenuItem value=""><em>Select</em></MenuItem>
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: "grow", md: "grow" }}>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-isIndigenousGroup">Are you part of an Indigenous Group?</InputLabel>
                            <Select
                                labelId="label-select-isIndigenousGroup"
                                label="Are you part of an Indigenous Group?"
                                name="is_indigenous_group"
                                value={personalInformation.is_indigenous_group}
                                onChange={handleChangeSelect}
                                required
                                sx={{ borderRadius: 2 }}
                            >
                                <MenuItem value=""><em>Select</em></MenuItem>
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {personalInformation.is_indigenous_group === 'Yes' && (
                        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                            <FormControl fullWidth>
                                <TextField
                                    name="indigenous_group"
                                    label="Specify indigenous group"
                                    value={personalInformation.indigenous_group}
                                    onChange={handleChange}
                                    required
                                    variant="standard"
                                    sx={{ mt: { xs: -2, sm: 0 } }}
                                />
                            </FormControl>
                        </Grid>
                    )}
                </Grid>
                <Grid size={{ xs: 12, sm: 9, md: 8 }}>
                    <FormControl fullWidth>
                        <TextField
                            name="school_last_attended"
                            label="School Last Attended"
                            value={personalInformation.school_last_attended}
                            onChange={handleChange}
                            required
                            sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                        />
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 3, md: 4 }}>
                    <FormControl fullWidth>
                        <InputLabel id="label-select-typeOfSchool">Type of School</InputLabel>
                        <Select
                            labelId="label-select-typeOfSchool"
                            label="Type of School"
                            name="type_of_school"
                            value={personalInformation.type_of_school}
                            onChange={handleChangeSelect}
                            required
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value=""><em>Select</em></MenuItem>
                            <MenuItem value="Public">Public</MenuItem>
                            <MenuItem value="Private">Private</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid container size={12}>
                    <Grid size={{ xs: 12, sm: 12, md: "grow" }}>
                        <FormControl fullWidth>
                            <InputLabel id="label-select-hasScholarship">Do you have an existing Scholarship/Financial Aid?</InputLabel>
                            <Select
                                labelId="label-select-hasScholarship"
                                label="Do you have an existing Scholarship/Financial Aid?"
                                name="has_scholarship_or_financial_aid"
                                value={personalInformation.has_scholarship_or_financial_aid}
                                onChange={handleChangeSelect}
                                required
                                sx={{ borderRadius: 2 }}
                            >
                                <MenuItem value=""><em>Select</em></MenuItem>
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {personalInformation.has_scholarship_or_financial_aid === 'Yes' && (
                        <Grid size={{ xs: 12, sm: 12, md: "grow" }}>
                            <FormControl fullWidth>
                                <TextField
                                    name="scholarship_or_financial_aid"
                                    label="Specify Scholarship/Financial Aid"
                                    value={personalInformation.scholarship_or_financial_aid}
                                    onChange={handleChange}
                                    required
                                    variant="standard"
                                    sx={{ mt: { sm: -2, md: 0 } }}
                                />
                            </FormControl>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default PersonalInformationStep;
