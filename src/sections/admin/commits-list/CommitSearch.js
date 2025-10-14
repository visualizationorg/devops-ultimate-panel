import React, { useState, useCallback } from 'react';
import { 
    TextField, 
    InputAdornment, 
    IconButton,
    Tooltip
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { debounce } from 'lodash';

const CommitSearch = ({ onSearch }) => {
    const [searchValue, setSearchValue] = useState('');

    const debouncedSearch = useCallback(
        debounce((value) => {
            onSearch(value);
        }, 300),
        [onSearch]
    );

    const handleChange = (event) => {
        const value = event.target.value;
        setSearchValue(value);
        debouncedSearch(value);
    };

    const handleClear = () => {
        setSearchValue('');
        onSearch('');
    };

    return (
        <TextField
            fullWidth
            size="small"
            value={searchValue}
            onChange={handleChange}
            placeholder="Commit mesajı, ID veya yazar ara..."
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                ),
                endAdornment: searchValue && (
                    <InputAdornment position="end">
                        <Tooltip title="Temizle">
                            <IconButton onClick={handleClear} size="small">
                                <Clear />
                            </IconButton>
                        </Tooltip>
                    </InputAdornment>
                )
            }}
        />
    );
};

export default CommitSearch; 
