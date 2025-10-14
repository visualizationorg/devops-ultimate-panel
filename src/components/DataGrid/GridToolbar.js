import React, { useState } from 'react';
import {
    Box,
    TextField,
    IconButton,
    Tooltip,
    Menu,
    MenuItem,
    Chip,
    Stack
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import PropTypes from 'prop-types';

const GridToolbar = ({
    onSearch,
    onFilter,
    filters = [],
    activeFilters = {},
    searchPlaceholder = 'Ara...'
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchValue(value);
        onSearch?.(value);
    };

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    const handleFilterSelect = (filter, value) => {
        onFilter?.(filter.field, value);
        handleFilterClose();
    };

    const handleFilterClear = (field) => {
        onFilter?.(field, null);
    };

    return (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                    <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={handleSearchChange}
                        InputProps={{
                            endAdornment: searchValue && (
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setSearchValue('');
                                        onSearch?.('');
                                    }}
                                >
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            )
                        }}
                    />
                </Box>
                {filters.length > 0 && (
                    <Tooltip title="Filtrele">
                        <IconButton onClick={handleFilterClick}>
                            <FilterIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Stack>

            {Object.keys(activeFilters).length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap">
                    {Object.entries(activeFilters).map(([field, value]) => {
                        const filter = filters.find(f => f.field === field);
                        if (!filter || !value) return null;
                        
                        return (
                            <Chip
                                key={field}
                                label={`${filter.label}: ${filter.renderValue?.(value) || value}`}
                                onDelete={() => handleFilterClear(field)}
                                size="small"
                            />
                        );
                    })}
                </Stack>
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleFilterClose}
            >
                {filters.map((filter) => (
                    <MenuItem
                        key={filter.field}
                        onClick={() => handleFilterSelect(filter, filter.defaultValue)}
                    >
                        {filter.label}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

GridToolbar.propTypes = {
    onSearch: PropTypes.func,
    onFilter: PropTypes.func,
    filters: PropTypes.arrayOf(PropTypes.shape({
        field: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        defaultValue: PropTypes.any,
        renderValue: PropTypes.func
    })),
    activeFilters: PropTypes.object,
    searchPlaceholder: PropTypes.string
};

export default GridToolbar; 
