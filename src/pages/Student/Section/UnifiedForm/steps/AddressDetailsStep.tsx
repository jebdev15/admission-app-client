import React, { useState, useEffect } from 'react';
import {
    Box,
    FormControl,
    TextField,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    SelectChangeEvent,
    CircularProgress, // Import loader
    FormHelperText
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Place } from '@mui/icons-material';
import { useUnifiedForm } from '../UnifiedFormContext';
import { AddressDetailsType } from '../types';

// Interfaces remain the same
interface RegionItem {
    code: string;
    name: string;
    regionName?: string;
}

interface ProvinceItem {
    code: string;
    name: string;
    regionCode: string;
}

interface CityItem {
    code: string;
    name: string;
    provinceCode: string;
}

interface BarangayItem {
    code: string;
    name: string;
    municipalityCode: string | boolean;
    cityCode: string | boolean;
}

const AddressDetailsStep: React.FC = () => {
    const { formData, updateFormData } = useUnifiedForm();
    const addressDetails = formData.addressDetails;

    // 1. Define state to hold the lazy-loaded data
    const [regions, setRegions] = useState<RegionItem[]>([]);
    const [provinces, setProvinces] = useState<ProvinceItem[]>([]);
    const [cities, setCities] = useState<CityItem[]>([]);
    const [barangays, setBarangays] = useState<BarangayItem[]>([]);

    // 2. Add a loading state
    const [isLoading, setIsLoading] = useState(true);

    // 3. Use useEffect to load data only when component mounts
    useEffect(() => {
        const loadAddressData = async () => {
            try {
                // Execute imports in parallel for faster loading
                const [
                    regionsModule,
                    provincesModule,
                    citiesModule,
                    barangaysModule
                ] = await Promise.all([
                    import('../AddressJson/regions.json'),
                    import('../AddressJson/provinces.json'),
                    import('../AddressJson/cities-municipalities.json'),
                    import('../AddressJson/barangays.json')
                ]);

                // In Vite/ESM, JSON imports provide the data in the 'default' property
                setRegions(regionsModule.default as RegionItem[]);
                setProvinces(provincesModule.default as ProvinceItem[]);
                setCities(citiesModule.default as CityItem[]);
                setBarangays(barangaysModule.default as BarangayItem[]);
            } catch (error) {
                console.error("Failed to load address data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAddressData();
    }, []);

    const handleChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        const updates: Partial<AddressDetailsType> = { [name]: value };

        // Field-specific resets
        if (name === 'region_code') {
            updates.province_code = '';
            updates.city_code = '';
            updates.barangay_code = '';
            const region = regions.find(r => r.code === value);
            if (region) {
                updates.region_name = region.name;
                updates.region_region_name = region.regionName;
            }
        } else if (name === 'province_code') {
            updates.city_code = '';
            updates.barangay_code = '';
            const province = provinces.find(p => p.code === value);
            if (province) {
                updates.province_name = province.name;
            }
        } else if (name === 'city_code') {
            updates.barangay_code = '';
            const city = cities.find(c => c.code === value);
            if (city) {
                updates.city_name = city.name;
            }
        } else if (name === 'barangay_code') {
            const barangay = barangays.find(b => b.code === value);
            if (barangay) {
                updates.barangay_name = barangay.name;
            }
        } else if (name === 'current_address_region_code') {
            updates.current_address_province_code = '';
            updates.current_address_city_code = '';
            updates.current_address_barangay_code = '';
            const region = regions.find(r => r.code === value);
            if (region) {
                updates.current_address_region_name = region.name;
                updates.current_address_region_region_name = region.regionName;
            }
        } else if (name === 'current_address_province_code') {
            updates.current_address_city_code = '';
            updates.current_address_barangay_code = '';
            const province = provinces.find(p => p.code === value);
            if (province) {
                updates.current_address_province_name = province.name;
            }
        } else if (name === 'current_address_city_code') {
            updates.current_address_barangay_code = '';
            const city = cities.find(c => c.code === value);
            if (city) {
                updates.current_address_city_name = city.name;
            }
        } else if (name === 'current_address_barangay_code') {
            const barangay = barangays.find(b => b.code === value);
            if (barangay) {
                updates.current_address_barangay_name = barangay.name;
            }
        }

        updateFormData('addressDetails', updates);
    };

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateFormData('addressDetails', {
            [event.target.name]: event.target.value
        });
    };

    // Filter logic remains exactly the same
    const filteredProvinces = provinces.filter(p => p.regionCode === addressDetails.region_code);
    const filteredCities = cities.filter(c => c.provinceCode === addressDetails.province_code);
    const filteredBarangays = barangays.filter((barangay) => {
        if (barangay.municipalityCode === false) {
            return barangay.cityCode === addressDetails.city_code;
        }
        return barangay.municipalityCode === addressDetails.city_code;
    });

    const filteredCurrentProvinces = provinces.filter(p => p.regionCode === addressDetails.current_address_region_code);
    const filteredCurrentCities = cities.filter(c => c.provinceCode === addressDetails.current_address_province_code);
    const filteredCurrentBarangays = barangays.filter((barangay) => {
        if (barangay.municipalityCode === false) {
            return barangay.cityCode === addressDetails.current_address_city_code;
        }
        return barangay.municipalityCode === addressDetails.current_address_city_code;
    });

    // 4. Return loading spinner while data is being fetched
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            {/* The rest of your JSX remains exactly the same */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, rowGap: 2, alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, columnGap: 1, alignItems: 'center' }}>
                    <Place sx={{ color: 'primary.main', fontSize: '3rem' }} />
                    <Typography variant="h6" color="primary">Address Details</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: { xs: 'center', sm: 'flex-end' } }}>
                    <Typography variant="body1" color='textSecondary' sx={{ fontWeight: 'bold' }}>CHMSU Admission Portal</Typography>
                    <Typography variant="body1" color='textSecondary' sx={{ fontWeight: 'bold' }}>Academic Year 2026 - 2027</Typography>
                </Box>
            </Box>

            {/* Permanent Address Section */}
            <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 2, fontWeight: 'bold' }}>
                Permanent Address
            </Typography>
            <Grid container spacing={2} rowSpacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel id="label-region">Region</InputLabel>
                        <Select
                            labelId="label-region"
                            label="Region"
                            name="region_code"
                            value={addressDetails.region_code}
                            onChange={handleChange}
                            required
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value=""><em>Select</em></MenuItem>
                            {regions.map((region) => (
                                <MenuItem key={region.code} value={region.code}>
                                    {region.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                {/* ... Rest of your components ... */}
                {/* Ensure you copy the rest of the original JSX here */}
                {/* I have omitted the repetitive JSX for brevity, but you should keep it exactly as it was */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel id="label-province">Province</InputLabel>
                        <Select
                            labelId="label-province"
                            label="Province"
                            name="province_code"
                            value={addressDetails.province_code}
                            onChange={handleChange}
                            required
                            disabled={!addressDetails.region_code}
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value=""><em>Select</em></MenuItem>
                            {filteredProvinces.map((province) => (
                                <MenuItem key={province.code} value={province.code}>
                                    {province.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel id="label-city">City/Municipality</InputLabel>
                        <Select
                            labelId="label-city"
                            label="City/Municipality"
                            name="city_code"
                            value={addressDetails.city_code}
                            onChange={handleChange}
                            required
                            disabled={!addressDetails.province_code}
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value=""><em>Select</em></MenuItem>
                            {filteredCities.map((city) => (
                                <MenuItem key={city.code} value={city.code}>
                                    {city.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel id="label-barangay">Barangay</InputLabel>
                        <Select
                            labelId="label-barangay"
                            label="Barangay"
                            name="barangay_code"
                            value={addressDetails.barangay_code}
                            onChange={handleChange}
                            required
                            disabled={!addressDetails.city_code}
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value=""><em>Select</em></MenuItem>
                            {filteredBarangays.map((barangay) => (
                                <MenuItem key={barangay.code} value={barangay.code}>
                                    {barangay.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth>
                        <TextField
                            name="street"
                            label="House No., Street, Purok/Sitio"
                            value={addressDetails.street}
                            onChange={handleChangeInput}
                            required
                            sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                        />
                    </FormControl>
                </Grid>
            </Grid>

            {/* Current Address Question */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth>
                        <InputLabel id="label-same-address">Is your current address the same as your permanent address?</InputLabel>
                        <Select
                            labelId="label-same-address"
                            label="Is your current address the same as your permanent address?"
                            name="is_same_as_home_address"
                            value={addressDetails.is_same_as_home_address}
                            onChange={handleChange}
                            required
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value=""><em>Select</em></MenuItem>
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                        </Select>
                        <FormHelperText>*For students staying in a board and lodging or relative's residence away from home.</FormHelperText>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Current Address Section (shown if different from home) */}
            {addressDetails.is_same_as_home_address === 'No' && (
                <>
                    <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Current Address
                    </Typography>
                    <Grid container spacing={2} rowSpacing={3}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel id="label-current-region">Region</InputLabel>
                                <Select
                                    labelId="label-current-region"
                                    label="Region"
                                    name="current_address_region_code"
                                    value={addressDetails.current_address_region_code}
                                    onChange={handleChange}
                                    required
                                    sx={{ borderRadius: 2 }}
                                >
                                    <MenuItem value=""><em>Select</em></MenuItem>
                                    {regions.map((region) => (
                                        <MenuItem key={region.code} value={region.code}>
                                            {region.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel id="label-current-province">Province</InputLabel>
                                <Select
                                    labelId="label-current-province"
                                    label="Province"
                                    name="current_address_province_code"
                                    value={addressDetails.current_address_province_code}
                                    onChange={handleChange}
                                    required
                                    disabled={!addressDetails.current_address_region_code}
                                    sx={{ borderRadius: 2 }}
                                >
                                    <MenuItem value=""><em>Select</em></MenuItem>
                                    {filteredCurrentProvinces.map((province) => (
                                        <MenuItem key={province.code} value={province.code}>
                                            {province.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel id="label-current-city">City/Municipality</InputLabel>
                                <Select
                                    labelId="label-current-city"
                                    label="City/Municipality"
                                    name="current_address_city_code"
                                    value={addressDetails.current_address_city_code}
                                    onChange={handleChange}
                                    required
                                    disabled={!addressDetails.current_address_province_code}
                                    sx={{ borderRadius: 2 }}
                                >
                                    <MenuItem value=""><em>Select</em></MenuItem>
                                    {filteredCurrentCities.map((city) => (
                                        <MenuItem key={city.code} value={city.code}>
                                            {city.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel id="label-current-barangay">Barangay</InputLabel>
                                <Select
                                    labelId="label-current-barangay"
                                    label="Barangay"
                                    name="current_address_barangay_code"
                                    value={addressDetails.current_address_barangay_code}
                                    onChange={handleChange}
                                    required
                                    disabled={!addressDetails.current_address_city_code}
                                    sx={{ borderRadius: 2 }}
                                >
                                    <MenuItem value=""><em>Select</em></MenuItem>
                                    {filteredCurrentBarangays.map((barangay) => (
                                        <MenuItem key={barangay.code} value={barangay.code}>
                                            {barangay.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <FormControl fullWidth>
                                <TextField
                                    name="current_address_street"
                                    label="House No., Street, Purok/Sitio"
                                    value={addressDetails.current_address_street}
                                    onChange={handleChangeInput}
                                    required
                                    sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </>
            )}
        </Box>
    );
};

export default AddressDetailsStep;