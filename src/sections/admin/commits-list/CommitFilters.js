import React from 'react';
import { 
    Box, 
    TextField, 
    Autocomplete, 
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

const CommitFilters = ({ 
    authors, 
    repositories, 
    filters, 
    onFilterChange,
    onDateRangeChange 
}) => {
    const handleFilterChange = (field, value) => {
        onFilterChange({
            ...filters,
            [field]: value
        });
    };

    return (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Autocomplete
                options={authors}
                value={filters.author || null}
                onChange={(_, value) => handleFilterChange('author', value)}
                renderInput={(params) => (
                    <TextField {...params} label="Yazar" size="small" />
                )}
                sx={{ minWidth: 200 }}
            />

            <Autocomplete
                options={repositories}
                value={filters.repository || null}
                onChange={(_, value) => handleFilterChange('repository', value)}
                renderInput={(params) => (
                    <TextField {...params} label="Repository" size="small" />
                )}
                sx={{ minWidth: 200 }}
            />

            <DatePicker
                label="Başlangıç Tarihi"
                value={filters.startDate || null}
                onChange={(date) => handleFilterChange('startDate', date)}
                renderInput={(params) => (
                    <TextField {...params} size="small" />
                )}
            />

            <DatePicker
                label="Bitiş Tarihi"
                value={filters.endDate || null}
                onChange={(date) => handleFilterChange('endDate', date)}
                renderInput={(params) => (
                    <TextField {...params} size="small" />
                )}
            />

            {Object.entries(filters).map(([key, value]) => 
                value && (
                    <Chip
                        key={key}
                        label={`${key}: ${value}`}
                        onDelete={() => handleFilterChange(key, null)}
                        size="small"
                    />
                )
            )}
        </Stack>
    );
};

export default CommitFilters; 
