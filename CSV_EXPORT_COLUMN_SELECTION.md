# CSV Export Column Selection Feature

## Overview
This document describes the implementation of the column selection feature for CSV export in the Admin > Registered Applicants section. This feature allows administrators to choose which columns to include when exporting applicant data to CSV format.

## Features

### 1. **Column Selection Dialog**
- **Interactive UI**: A dialog that displays all available columns grouped by category
- **Select/Deselect All**: Quick actions to select or deselect all columns at once
- **Real-time Counter**: Shows the number of selected columns vs total available
- **Persistent Preferences**: Selected columns are saved to localStorage and restored on next use

### 2. **Available Column Categories**

#### Basic Information
- Applicant ID
- Full Name, First Name, Middle Name, Last Name
- Email, Contact Number
- Date of Birth, Gender, LRN

#### Address
- Province, Municipality, Barangay

#### Academic
- Campus to Enroll, Campus to Take Exam
- College, Course

#### Schedule
- Schedule Campus, Schedule Location
- Schedule Date, Schedule Time
- Schedule Time Start, Schedule Time End

#### Family
- Father Name, Mother Name, Guardian Name

#### Status
- Admission Status, Exam Passed, Enrolled
- Forms Submitted Date, Registration Date

### 3. **User Experience**
- Click "Export to CSV" button to open column selection dialog
- Select/deselect desired columns
- Preferences are automatically saved
- Export generates CSV with only selected columns
- Friendly column headers in the exported file

## Implementation Details

### Frontend Components

#### 1. ColumnSelectionDialog Component
**Location**: `src/components/Admin/ColumnSelectionDialog.tsx`

**Key Features**:
- Material-UI Dialog with categorized column checkboxes
- localStorage integration for persistent preferences
- Select All/Deselect All functionality
- Validation to require at least one column
- Column counter display

**Props**:
```typescript
interface ColumnSelectionDialogProps {
    open: boolean;
    onClose: () => void;
    onExport: (selectedColumns: string[]) => void;
    availableColumns: ColumnOption[];
    defaultSelectedColumns?: string[];
}
```

#### 2. StudentApplicants Component Updates
**Location**: `src/pages/Admin/Main/StudentApplicants.tsx`

**Changes**:
- Added `ColumnSelectionDialog` component integration
- Defined `availableColumns` array with all exportable fields
- Updated `handleExportAll` to open column selection dialog
- Modified `exportToCSV` to accept selected columns parameter
- Created `handleExportWithColumns` to handle export with column selection

**Default Selected Columns**:
```typescript
const defaultSelectedColumns = [
    'full_name',
    'email_address',
    'contact_number',
    'campus_to_take_exam',
    'schedule_location',
    'schedule_date',
    'schedule_time_start',
];
```

### Backend Updates

#### AdminApplicantManagementController
**Location**: `controllers/AdminApplicantManagementController.js`

**Method**: `exportApplicantsForCSV`

**Key Changes**:
- Accepts `columns` query parameter (comma-separated list of column keys)
- Dynamically builds SQL SELECT clause based on requested columns
- Maintains column-to-SQL mapping with friendly aliases
- Falls back to default columns if none specified
- Properly formats dates and times for CSV export

**Available Columns Mapping**:
```javascript
const availableColumns = {
    'applicant_id': { sql: 'applicant_id', alias: 'Applicant ID' },
    'full_name': { sql: 'full_name', alias: 'Fullname' },
    // ... (31 total columns)
};
```

**API Endpoint**:
```
GET /admin/applicants-management/export-csv?columns=full_name,email_address,contact_number
```

### Service Layer

#### adminApplicantService
**Location**: `src/services/adminApplicantService.ts`

**Method**: `exportApplicantsForCSV`

**Signature**:
```typescript
exportApplicantsForCSV: async (token: string, selectedColumns?: string[]) => {
    // Converts array to comma-separated string
    // Passes as 'columns' query parameter
}
```

### Type Definitions

#### Type Updates
**Location**: `src/pages/Admin/Main/type.ts`

**Changes**:
- Extended `StudentApplicantsType` to include `email_address` and `contact_number`
- Maintains type safety for optional fields

## Usage Guide

### For Administrators

1. **Navigate** to Admin > Registered Applicants
2. **Click** the "Export to CSV" button
3. **Select/Deselect** columns you want to include:
   - Use checkboxes to select individual columns
   - Click "Select All" to choose all columns
   - Click "Deselect All" to clear all selections
4. **Review** the selection count at the top right
5. **Click** "Export CSV" to download the file

### For Developers

#### Adding New Columns

1. **Add to Backend** (`AdminApplicantManagementController.js`):
```javascript
const availableColumns = {
    // ... existing columns
    'new_field': { sql: 'new_field', alias: 'New Field Display Name' }
};
```

2. **Add to Frontend** (`StudentApplicants.tsx`):
```typescript
const availableColumns: ColumnOption[] = [
    // ... existing columns
    { key: 'new_field', label: 'New Field Display Name', category: 'Category Name' },
];
```

3. **Update Database View** (if needed):
Ensure the `student_applicants` view includes the new field.

#### Modifying Default Selections

Update the `defaultSelectedColumns` array in `StudentApplicants.tsx`:
```typescript
const defaultSelectedColumns = [
    'full_name',
    'email_address',
    // Add or remove defaults here
];
```

## Technical Architecture

### Data Flow
```
User clicks "Export to CSV"
    ↓
ColumnSelectionDialog opens
    ↓
User selects columns
    ↓
handleExportWithColumns(selectedColumns)
    ↓
adminApplicantService.exportApplicantsForCSV(token, selectedColumns)
    ↓
API: GET /admin/applicants-management/export-csv?columns=col1,col2,col3
    ↓
Backend builds dynamic SQL query
    ↓
Returns filtered data
    ↓
exportToCSV generates CSV file
    ↓
Browser downloads file
```

### State Management
- **Dialog State**: Local component state
- **Column Preferences**: localStorage (`admin_csv_export_columns`)
- **Export Loading**: Component state (`exportLoading`)

### Security & Access Control
- Maintains existing campus-based access control
- Respects privileged office permissions
- Token authentication required for all exports

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires localStorage support
- CSV download via Blob API

## Performance Considerations
- Only selected columns are fetched from database (reduces data transfer)
- Server-side column filtering (efficient SQL queries)
- Client-side CSV generation (no additional API calls)

## Future Enhancements
1. **Column Reordering**: Drag-and-drop to change column order
2. **Saved Presets**: Multiple saved column configurations
3. **Column Groups**: Quick selection by category
4. **Export Preview**: Preview first few rows before export
5. **Format Options**: Additional export formats (Excel, JSON)

## Testing Checklist
- [ ] Column selection persists across sessions
- [ ] Select All/Deselect All works correctly
- [ ] At least one column is required for export
- [ ] CSV headers match selected columns
- [ ] CSV data corresponds to selected columns
- [ ] Campus-based filtering still works
- [ ] Dates and times are properly formatted
- [ ] Special characters in data are properly escaped
- [ ] Large exports (1000+ records) complete successfully
- [ ] Works across different browsers

## Troubleshooting

### Columns not persisting
- Check browser localStorage is enabled
- Clear cache and try again
- Check console for errors

### Missing columns in export
- Verify column exists in `student_applicants` view
- Check column key matches between frontend and backend
- Ensure column is included in `availableColumns` mapping

### Export fails
- Check network tab for API errors
- Verify authentication token is valid
- Check backend logs for SQL errors

## Related Files

### Frontend
- `src/components/Admin/ColumnSelectionDialog.tsx`
- `src/pages/Admin/Main/StudentApplicants.tsx`
- `src/services/adminApplicantService.ts`
- `src/pages/Admin/Main/type.ts`

### Backend
- `controllers/AdminApplicantManagementController.js`
- `routes/adminApplicantManagementRoutes.js`

## Changelog

### Version 1.0.0 (Current)
- Initial implementation of column selection feature
- 31 available columns across 5 categories
- localStorage persistence
- Dynamic SQL query generation
- Friendly column headers
