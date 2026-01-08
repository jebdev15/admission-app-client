/**
 * Health Step Component
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
import { MedicalInformation } from '@mui/icons-material';
import { useUnifiedForm } from '../UnifiedFormContext';
import { HealthType } from '../types';

const HealthStep: React.FC = () => {
    const { formData, updateFormData } = useUnifiedForm();
    const health = formData.health;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateFormData('health', {
            [event.target.name]: event.target.value
        } as Partial<HealthType>);
    };

    const handleChangeSelect = (event: SelectChangeEvent<string>) => {
        updateFormData('health', {
            [event.target.name]: event.target.value
        } as Partial<HealthType>);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <MedicalInformation sx={{ color: 'primary.main', fontSize: '2.5rem' }} />
                <Typography variant="h6" color="primary">Health Information</Typography>
            </Box>

            <Grid container spacing={2} rowSpacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel id="label-pwd">Are you a Person with Disability (PWD)?</InputLabel>
                        <Select
                            labelId="label-pwd"
                            label="Are you a Person with Disability (PWD)?"
                            name="is_pwd"
                            value={health.is_pwd}
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
                {health.is_pwd === 'Yes' && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <TextField
                                name="pwd_id_no"
                                label="PWD ID Number"
                                value={health.pwd_id_no}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                            />
                        </FormControl>
                    </Grid>
                )}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel id="label-sped">Are you a SPED student?</InputLabel>
                        <Select
                            labelId="label-sped"
                            label="Are you a SPED student?"
                            name="is_sped"
                            value={health.is_sped}
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
                {health.is_sped === 'Yes' && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <TextField
                                name="specify_sped"
                                label="Specify SPED Category"
                                value={health.specify_sped}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                            />
                        </FormControl>
                    </Grid>
                )}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel id="label-siblings-chmsu">Do you have siblings studying in CHMSU?</InputLabel>
                        <Select
                            labelId="label-siblings-chmsu"
                            label="Do you have siblings studying in CHMSU?"
                            name="has_siblings_studying_in_chmsu"
                            value={health.has_siblings_studying_in_chmsu}
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
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel id="label-relatives-chmsu">Do you have relatives studying in CHMSU?</InputLabel>
                        <Select
                            labelId="label-relatives-chmsu"
                            label="Do you have relatives studying in CHMSU?"
                            name="has_relatives_studying_in_chmsu"
                            value={health.has_relatives_studying_in_chmsu}
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

export default HealthStep;
