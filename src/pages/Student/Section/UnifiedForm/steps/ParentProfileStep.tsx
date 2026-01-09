/**
 * Parent Profile Step Component
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
import { Work } from '@mui/icons-material';
import { useUnifiedForm } from '../UnifiedFormContext';
import { ParentProfileType } from '../types';

const ParentProfileStep: React.FC = () => {
    const { formData, updateFormData } = useUnifiedForm();
    const parentProfile = formData.parentProfile;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateFormData('parentProfile', {
            [event.target.name]: event.target.value
        } as Partial<ParentProfileType>);
    };

    const handleChangeSelect = (event: SelectChangeEvent<string>) => {
        updateFormData('parentProfile', {
            [event.target.name]: event.target.value
        } as Partial<ParentProfileType>);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, rowGap: 2, alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, columnGap: 1, alignItems: 'center' }}>
                    <Work sx={{ color: 'primary.main', fontSize: '3rem' }} />
                    <Typography variant="h6" color="primary">Parent Profile</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: { xs: 'center', sm: 'flex-end' } }}>
                    <Typography variant="body1" color='textSecondary' sx={{ fontWeight: 'bold' }}>CHMSU Admission Portal</Typography>
                    <Typography variant="body1" color='textSecondary' sx={{ fontWeight: 'bold' }}>Academic Year 2026 - 2027</Typography>
                </Box>
            </Box>

            <Grid container spacing={2} rowSpacing={3}>
                {/* Father's Information */}
                <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle1" color="textSecondary" fontWeight="bold">
                        Father's Information
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel id="label-father-education">Father's Highest Educational Attainment</InputLabel>
                        <Select
                            labelId="label-father-education"
                            label="Father's Highest Educational Attainment"
                            name="father_highest_educational_attainment"
                            value={parentProfile.father_highest_educational_attainment}
                            onChange={handleChangeSelect}
                            required
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value=""><em>Select</em></MenuItem>
                            <MenuItem value="Post Graduate">Post Graduate</MenuItem>
                            <MenuItem value="College">College</MenuItem>
                            <MenuItem value="High School">High School</MenuItem>
                            <MenuItem value="Elementary">Elementary</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <TextField
                            name="father_occupation"
                            label="Father's Occupation"
                            value={parentProfile.father_occupation}
                            onChange={handleChange}
                            required
                            sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                        />
                    </FormControl>
                </Grid>

                {/* Mother's Information */}
                <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle1" color="textSecondary" fontWeight="bold" sx={{ mt: 2 }}>
                        Mother's Information
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel id="label-mother-education">Mother's Highest Educational Attainment</InputLabel>
                        <Select
                            labelId="label-mother-education"
                            label="Mother's Highest Educational Attainment"
                            name="mother_highest_educational_attainment"
                            value={parentProfile.mother_highest_educational_attainment}
                            onChange={handleChangeSelect}
                            required
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value=""><em>Select</em></MenuItem>
                            <MenuItem value="Post Graduate">Post Graduate</MenuItem>
                            <MenuItem value="College">College</MenuItem>
                            <MenuItem value="High School">High School</MenuItem>
                            <MenuItem value="Elementary">Elementary</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <TextField
                            name="mother_occupation"
                            label="Mother's Occupation"
                            value={parentProfile.mother_occupation}
                            onChange={handleChange}
                            required
                            sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                        />
                    </FormControl>
                </Grid>

                {/* Guardian Question */}
                <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="label-guardian">Are you living with a guardian?</InputLabel>
                        <Select
                            labelId="label-guardian"
                            label="Are you living with a guardian?"
                            name="is_living_with_guardian"
                            value={parentProfile.is_living_with_guardian}
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
            </Grid>
        </Box>
    );
};

export default ParentProfileStep;
