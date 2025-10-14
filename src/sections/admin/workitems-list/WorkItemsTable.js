import React, { useMemo, useState, useCallback } from 'react';
import { useWorkItems } from 'hooks/useAzureDevOps';
import CustomDataGrid from 'components/DataGrid/CustomDataGrid';
import GridToolbar from 'components/DataGrid/GridToolbar';
import { Chip, Box } from '@mui/material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const WorkItemsTable = () => {
    const { data: workItems, loading, error } = useWorkItems();
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({});

    const handleSearch = useCallback((value) => {
        setSearchTerm(value);
    }, []);

    const handleFilter = useCallback((field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const filteredRows = useMemo(() => {
        if (!workItems) return [];

        return workItems.filter(item => {
            // Arama filtresi
            if (searchTerm) {
                const searchFields = [
                    item.fields['System.Title'],
                    item.fields['System.AssignedTo']?.displayName,
                    item.id.toString()
                ];
                const matchesSearch = searchFields.some(field =>
                    field?.toLowerCase().includes(searchTerm.toLowerCase())
                );
                if (!matchesSearch) return false;
            }

            // Durum filtresi
            if (filters.state && item.fields['System.State'] !== filters.state) {
                return false;
            }

            // Atanan kişi filtresi
            if (filters.assignedTo &&
                item.fields['System.AssignedTo']?.displayName !== filters.assignedTo) {
                return false;
            }

            return true;
        });
    }, [workItems, searchTerm, filters]);

    const filterOptions = useMemo(() => [
        {
            field: 'state',
            label: 'Durum',
            defaultValue: 'Done',
            renderValue: (value) => value
        },
        {
            field: 'assignedTo',
            label: 'Atanan Kişi',
            defaultValue: workItems?.[0]?.fields['System.AssignedTo']?.displayName,
            renderValue: (value) => value
        }
    ], [workItems]);

    const columns = useMemo(() => [
        {
            field: 'id',
            headerName: 'ID',
            width: 100
        },
        {
            field: 'title',
            headerName: 'Başlık',
            flex: 1,
            valueGetter: (params) => params.row.fields['System.Title']
        },
        {
            field: 'state',
            headerName: 'Durum',
            width: 150,
            renderCell: (params) => (
                <Chip
                    label={params.row.fields['System.State']}
                    color={params.row.fields['System.State'] === 'Done' ? 'success' : 'default'}
                    size="small"
                />
            )
        },
        {
            field: 'assignedTo',
            headerName: 'Atanan',
            width: 200,
            valueGetter: (params) => params.row.fields['System.AssignedTo']?.displayName || '-'
        },
        {
            field: 'createdDate',
            headerName: 'Oluşturulma Tarihi',
            width: 180,
            valueGetter: (params) => {
                const dateValue = params.row?.fields?.['System.CreatedDate'];
                return dateValue
                    ? format(new Date(dateValue), 'dd MMMM yyyy', { locale: tr })
                    : '-'; // Varsayılan bir değer döndür
            }
        }
    ], []);

    return (
        <Box sx={{ height: '100%' }}>
            <GridToolbar
                onSearch={handleSearch}
                onFilter={handleFilter}
                filters={filterOptions}
                activeFilters={filters}
                searchPlaceholder="Work item ara..."
            />
            <CustomDataGrid
                rows={filteredRows}
                columns={columns}
                loading={loading}
                error={error}
                pageSize={15}
                getRowId={(row) => row.id}
            />
        </Box>
    );
};

export default WorkItemsTable; 
