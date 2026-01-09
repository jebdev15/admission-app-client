/**
 * Home and Family Background Step Component
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
import { House } from '@mui/icons-material';
import { useUnifiedForm } from '../UnifiedFormContext';
import { HomeAndFamilyBackgroundType } from '../types';

const HomeAndFamilyBackgroundStep: React.FC = () => {
    const { formData, updateFormData } = useUnifiedForm();
    const homeAndFamily = formData.homeAndFamilyBackground;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateFormData('homeAndFamilyBackground', {
            [event.target.name]: event.target.value
        } as Partial<HomeAndFamilyBackgroundType>);
    };

    const handleChangeSelect = (event: SelectChangeEvent<string>) => {
        updateFormData('homeAndFamilyBackground', {
            [event.target.name]: event.target.value
        } as Partial<HomeAndFamilyBackgroundType>);
    };

    const handleChangeNumber = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = parseInt(event.target.value) || 0;
        const clampedValue = Math.min(Math.max(value, 0), 99);
        updateFormData('homeAndFamilyBackground', {
            [event.target.name]: clampedValue
        } as Partial<HomeAndFamilyBackgroundType>);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, rowGap: 2, alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, columnGap: 1, alignItems: 'center' }}>
                    <House sx={{ color: 'primary.main', fontSize: '3rem' }} />
                    <Typography variant="h6" color="primary">Home and Family Background</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: { xs: 'center', sm: 'flex-end' } }}>
                    <Typography variant="body1" color='textSecondary' sx={{ fontWeight: 'bold' }}>CHMSU Admission Portal</Typography>
                    <Typography variant="body1" color='textSecondary' sx={{ fontWeight: 'bold' }}>Academic Year 2026 - 2027</Typography>
                </Box>
            </Box>

            <Grid container spacing={2} rowSpacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <TextField
                            name="no_of_siblings_gainfully_employed"
                            label="Number of siblings gainfully employed"
                            type="number"
                            value={homeAndFamily.no_of_siblings_gainfully_employed}
                            onChange={handleChangeNumber}
                            sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                            slotProps={{ htmlInput: { min: 0, max: 99 } }}
                        />
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel id="label-finances">Who is financing your education?</InputLabel>
                        <Select
                            labelId="label-finances"
                            label="Who is financing your education?"
                            name="who_finances_your_schooling"
                            value={homeAndFamily.who_finances_your_schooling}
                            onChange={handleChangeSelect}
                            required
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value=""><em>Select</em></MenuItem>
                            <MenuItem value="Parents">Parents</MenuItem>
                            <MenuItem value="Guardian">Guardian</MenuItem>
                            <MenuItem value="Siblings">Siblings</MenuItem>
                            <MenuItem value="Self">Self</MenuItem>
                            <MenuItem value="Others">Others</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel id="label-4ps">Are you a 4Ps beneficiary?</InputLabel>
                        <Select
                            labelId="label-4ps"
                            label="Are you a 4Ps beneficiary?"
                            name="is_four_ps_beneficiary"
                            value={homeAndFamily.is_four_ps_beneficiary}
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
                {homeAndFamily.is_four_ps_beneficiary === 'Yes' && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <TextField
                                name="four_ps_id_no"
                                label="4Ps ID Number"
                                value={homeAndFamily.four_ps_id_no}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                                slotProps={{ htmlInput: { maxLength: 20 } }}
                            />
                        </FormControl>
                    </Grid>
                )}
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel id="label-first-gen">Are you a first generation college student?</InputLabel>
                        <Select
                            labelId="label-first-gen"
                            label="Are you a first generation college student?"
                            name="is_first_gen_student"
                            value={homeAndFamily.is_first_gen_student}
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
                        <InputLabel id="label-income">Household Monthly Income</InputLabel>
                        <Select
                            labelId="label-income"
                            label="Household Monthly Income"
                            name="household_monthly_income"
                            value={homeAndFamily.household_monthly_income}
                            onChange={handleChangeSelect}
                            required
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value=""><em>Select</em></MenuItem>
                            <MenuItem value="Below ₱10,957">Below ₱10,957</MenuItem>
                            <MenuItem value="₱10,957 - ₱21,914">₱10,957 - ₱21,914</MenuItem>
                            <MenuItem value="₱21,914 - ₱43,828">₱21,914 - ₱43,828</MenuItem>
                            <MenuItem value="₱43,828 - ₱76,669">₱43,828 - ₱76,669</MenuItem>
                            <MenuItem value="₱76,669 - ₱131,484">₱76,669 - ₱131,484</MenuItem>
                            <MenuItem value="₱131,484 - ₱219,140">₱131,484 - ₱219,140</MenuItem>
                            <MenuItem value="Above ₱219,140">Above ₱219,140</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel id="label-residence">Nature of residence while attending school</InputLabel>
                        <Select
                            labelId="label-residence"
                            label="Nature of residence while attending school"
                            name="nature_of_residence"
                            value={homeAndFamily.nature_of_residence}
                            onChange={handleChangeSelect}
                            required
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value=""><em>Select</em></MenuItem>
                            <MenuItem value="Owned">Owned</MenuItem>
                            <MenuItem value="Rented">Rented</MenuItem>
                            <MenuItem value="Living with Relatives">Living with Relatives</MenuItem>
                            <MenuItem value="Others">Others</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    );
};

export default HomeAndFamilyBackgroundStep;
