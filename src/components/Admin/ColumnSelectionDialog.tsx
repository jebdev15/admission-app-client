import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Box,
    Typography,
    Divider,
    Alert,
} from '@mui/material';
import { CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon } from '@mui/icons-material';

interface ColumnOption {
    key: string;
    label: string;
}

interface ColumnGroup {
    category: string;
    columns: ColumnOption[];
}

// All available columns mirroring the availableColumns object in
// AdminApplicantManagementController.js > exportApplicantsForCSV
const COLUMN_GROUPS: ColumnGroup[] = [
    {
        category: 'Personal Information',
        columns: [
            { key: 'full_name',                        label: 'Fullname' },
            { key: 'email_address',                    label: 'Email' },
            { key: 'contact_number',                   label: 'Contact Number' },
            { key: 'lrn',                              label: 'LRN' },
            { key: 'date_of_birth',                    label: 'Date of Birth' },
            { key: 'gender',                           label: 'Gender' },
            { key: 'civil_status',                     label: 'Civil Status' },
            { key: 'religion',                         label: 'Religion' },
            { key: 'other_religion',                   label: 'Other Religion' },
            { key: 'is_solo_parent',                   label: 'Solo Parent' },
            { key: 'is_pwd',                           label: 'PWD' },
            { key: 'pwd_id_no',                        label: 'PWD ID No.' },
            { key: 'is_indigenous_group',              label: 'Indigenous Group' },
            { key: 'indigenous_group',                 label: 'Indigenous Group Name' },
            { key: 'school_last_attended',             label: 'School Last Attended' },
            { key: 'type_of_school',                   label: 'Type of School' },
            { key: 'has_scholarship_or_financial_aid', label: 'Has Scholarship / Financial Aid' },
            { key: 'scholarship_or_financial_aid',     label: 'Scholarship / Financial Aid Details' },
        ],
    },
    {
        category: 'Address Information',
        columns: [
            { key: 'province',                        label: 'Province' },
            { key: 'city',                            label: 'City/Municipality' },
            { key: 'barangay',                        label: 'Barangay' },
            { key: 'street',                          label: 'Street' },
            { key: 'is_same_as_permanent_address',    label: 'Same as Permanent Address' },
            { key: 'current_address_province',        label: 'Current Province' },
            { key: 'current_address_city',            label: 'Current City/Municipality' },
            { key: 'current_address_barangay',        label: 'Current Barangay' },
            { key: 'current_address_street',          label: 'Current Street' },
        ],
    },
    {
        category: 'Parent Profile',
        columns: [
            { key: 'father_highest_educational_attainment', label: "Father's Educational Attainment" },
            { key: 'father_occupation',                     label: "Father's Occupation" },
            { key: 'mother_highest_educational_attainment', label: "Mother's Educational Attainment" },
            { key: 'mother_occupation',                     label: "Mother's Occupation" },
            { key: 'is_living_with_guardian',               label: 'Living with Guardian' },
        ],
    },
    {
        category: 'Home & Family Background',
        columns: [
            { key: 'no_of_siblings_gainfully_employed', label: 'No. of Siblings Gainfully Employed' },
            { key: 'who_finances_your_schooling',       label: 'Who Finances Your Education' },
            { key: 'is_four_ps_beneficiary',            label: '4Ps Beneficiary' },
            { key: 'four_ps_id_no',                     label: '4Ps ID No.' },
            { key: 'is_first_gen_student',              label: 'First Gen Student' },
            { key: 'household_monthly_income',          label: 'Household Monthly Income' },
            { key: 'nature_of_residence',               label: 'Nature of Residence' },
        ],
    },
    {
        category: 'Health Information',
        columns: [
            { key: 'is_sped',                          label: 'SPED' },
            { key: 'sped_category',                    label: 'SPED Category' },
            { key: 'has_siblings_studying_in_chmsu',   label: 'Siblings Studying in CHMSU' },
            { key: 'has_relatives_working_in_chmsu',   label: 'Relatives Working in CHMSU' },
        ],
    },
    {
        category: 'Academic Information',
        columns: [
            { key: 'campus_to_enroll',      label: 'Campus to enroll' },
            { key: 'college_description',   label: 'College' },
            { key: 'course_description',    label: 'Program' },
        ],
    },
    {
        category: 'Schedule Information',
        columns: [
            { key: 'schedule_campus',       label: 'Campus' },
            { key: 'schedule_location',     label: 'Location' },
            { key: 'schedule_date',         label: 'Date' },
            { key: 'schedule_time_start',   label: 'Time' },
        ],
    },
];

// Keys pre-selected when no saved preference exists
const DEFAULT_SELECTED_COLUMNS = [
    'full_name',
    'email_address',
    'contact_number',
    'schedule_campus',
    'schedule_location',
    'schedule_date',
    'schedule_time_start',
];

const ALL_COLUMN_KEYS = COLUMN_GROUPS.flatMap(g => g.columns.map(c => c.key));
const STORAGE_KEY = 'admin_csv_export_columns';

interface ColumnSelectionDialogProps {
    open: boolean;
    onClose: () => void;
    onExport: (selectedColumns: string[]) => void;
}

const ColumnSelectionDialog: React.FC<ColumnSelectionDialogProps> = ({
    open,
    onClose,
    onExport,
}) => {
    const [selectedColumns, setSelectedColumns] = useState<Set<string>>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return new Set(JSON.parse(saved));
        } catch {
            // ignore
        }
        return new Set(DEFAULT_SELECTED_COLUMNS);
    });

    // Re-sync from localStorage whenever the dialog opens
    useEffect(() => {
        if (!open) return;
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setSelectedColumns(new Set(JSON.parse(saved)));
        } catch {
            // ignore
        }
    }, [open]);

    const saveAndSet = (next: Set<string>) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
        setSelectedColumns(next);
    };

    const handleToggle = (key: string) => {
        const next = new Set(selectedColumns);
        next.has(key) ? next.delete(key) : next.add(key);
        saveAndSet(next);
    };

    const handleSelectAll    = () => saveAndSet(new Set(ALL_COLUMN_KEYS));
    const handleDeselectAll  = () => saveAndSet(new Set());

    const handleExport = () => {
        if (selectedColumns.size === 0) return;
        onExport(Array.from(selectedColumns));
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h6">Select Columns to Export</Typography>
                <Typography variant="caption" color="textSecondary">
                    Choose which columns to include in the CSV export. Your preferences will be saved.
                </Typography>
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Button size="small" variant="outlined" startIcon={<CheckBoxIcon />} onClick={handleSelectAll}>
                        Select All
                    </Button>
                    <Button size="small" variant="outlined" startIcon={<CheckBoxOutlineBlankIcon />} onClick={handleDeselectAll}>
                        Deselect All
                    </Button>
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 'auto' }}>
                        {selectedColumns.size} / {ALL_COLUMN_KEYS.length} selected
                    </Typography>
                </Box>

                {selectedColumns.size === 0 && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Please select at least one column to export.
                    </Alert>
                )}

                {COLUMN_GROUPS.map(({ category, columns }) => (
                    <Box key={category} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
                            {category}
                        </Typography>
                        <FormGroup>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0.5 }}>
                                {columns.map(col => (
                                    <FormControlLabel
                                        key={col.key}
                                        label={col.label}
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={selectedColumns.has(col.key)}
                                                onChange={() => handleToggle(col.key)}
                                            />
                                        }
                                    />
                                ))}
                            </Box>
                        </FormGroup>
                        <Divider sx={{ mt: 1 }} />
                    </Box>
                ))}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={handleExport} variant="contained" disabled={selectedColumns.size === 0}>
                    Export CSV
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ColumnSelectionDialog;
