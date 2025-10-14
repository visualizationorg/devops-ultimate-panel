import React, { useMemo, useState, useCallback } from 'react';
import { useBuilds } from 'hooks/useAzureDevOps';
import CustomDataGrid from 'components/DataGrid/CustomDataGrid';
import GridToolbar from 'components/DataGrid/GridToolbar';
import { Chip, Box, Link } from '@mui/material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const BuildsTable = () => {
    const { data: builds, loading, error } = useBuilds();
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({});

    const getBuildStatusColor = (status, result) => {
        if (status === 'inProgress') return 'info';
        if (status === 'completed') {
            switch (result) {
                case 'succeeded': return 'success';
                case 'failed': return 'error';
                case 'canceled': return 'warning';
                default: return 'default';
            }
        }
        return 'default';
    };

    const columns = useMemo(() => [
        {
            field: 'buildNumber',
            headerName: 'Build No',
            width: 130,
            renderCell: (params) => (
                <Link 
                    href={params.row._links.web.href} 
                    target="_blank"
                    underline="hover"
                >
                    {params.row.buildNumber}
                </Link>
            )
        },
        {
            field: 'project',
            headerName: 'Proje',
            width: 200,
            valueGetter: (params) => params.row.project.name
        },
        {
            field: 'status',
            headerName: 'Durum',
            width: 150,
            renderCell: (params) => (
                <Chip
                    label={`${params.row.status} ${params.row.result || ''}`}
                    color={getBuildStatusColor(params.row.status, params.row.result)}
                    size="small"
                />
            )
        },
        {
            field: 'requestedFor',
            headerName: 'Başlatan',
            width: 180,
            valueGetter: (params) => params.row.requestedFor?.displayName
        },
        {
            field: 'startTime',
            headerName: 'Başlangıç',
            width: 180,
            valueGetter: (params) => params.row.startTime ? 
                format(new Date(params.row.startTime), 'dd MMM yyyy HH:mm', { locale: tr }) : '-'
        },
        {
            field: 'finishTime',
            headerName: 'Bitiş',
            width: 180,
            valueGetter: (params) => params.row.finishTime ? 
                format(new Date(params.row.finishTime), 'dd MMM yyyy HH:mm', { locale: tr }) : '-'
        }
    ], []);

    const filterOptions = useMemo(() => [
        {
            field: 'status',
            label: 'Durum',
            defaultValue: 'completed',
            renderValue: (value) => value
        },
        {
            field: 'result',
            label: 'Sonuç',
            defaultValue: 'succeeded',
            renderValue: (value) => value
        },
        {
            field: 'project',
            label: 'Proje',
            defaultValue: builds?.[0]?.project.name,
            renderValue: (value) => value
        }
    ], [builds]);

    const filteredRows = useMemo(() => {
        if (!builds) return [];
        
        return builds.filter(build => {
            if (searchTerm) {
                const searchFields = [
                    build.buildNumber,
                    build.project.name,
                    build.requestedFor?.displayName,
                    build.status,
                    build.result
                ];
                const matchesSearch = searchFields.some(field => 
                    field?.toLowerCase().includes(searchTerm.toLowerCase())
                );
                if (!matchesSearch) return false;
            }

            if (filters.status && build.status !== filters.status) return false;
            if (filters.result && build.result !== filters.result) return false;
            if (filters.project && build.project.name !== filters.project) return false;

            return true;
        });
    }, [builds, searchTerm, filters]);

    const handleSearch = useCallback((value) => {
        setSearchTerm(value);
    }, []);

    const handleFilter = useCallback((field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    return (
        <Box sx={{ height: '100%' }}>
            <GridToolbar
                onSearch={handleSearch}
                onFilter={handleFilter}
                filters={filterOptions}
                activeFilters={filters}
                searchPlaceholder="Build ara..."
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

export default BuildsTable; 
