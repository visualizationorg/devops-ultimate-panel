import React, { useMemo, useState, useCallback } from 'react';
import { usePullRequests, useProjects } from 'hooks/useAzureDevOps';
import CustomDataGrid from 'components/DataGrid/CustomDataGrid';
import GridToolbar from 'components/DataGrid/GridToolbar';
import { Box, Chip, Link, Tooltip, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Visibility } from '@mui/icons-material';
import PullRequestStats from './PullRequestStats';
import PullRequestDetails from './PullRequestDetails';

const PullRequestsTable = () => {
    const [selectedProject, setSelectedProject] = useState('');
    const { data: projects, loading: projectsLoading } = useProjects();
    const { data: pullRequests, loading: prsLoading, error } = usePullRequests(selectedProject);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({});
    const [selectedPR, setSelectedPR] = useState(null);

    const loading = projectsLoading || prsLoading;

    const getPrStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'active': return 'info';
            case 'completed': return 'success';
            case 'abandoned': return 'error';
            default: return 'default';
        }
    };

    const columns = useMemo(() => [
        {
            field: 'pullRequestId',
            headerName: 'PR #',
            width: 100,
            renderCell: (params) => (
                <Link 
                    href={params.row.url} 
                    target="_blank"
                    underline="hover"
                >
                    {params.row.pullRequestId}
                </Link>
            )
        },
        {
            field: 'title',
            headerName: 'Başlık',
            flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.row.title}>
                    <span>{params.row.title}</span>
                </Tooltip>
            )
        },
        {
            field: 'status',
            headerName: 'Durum',
            width: 150,
            renderCell: (params) => (
                <Chip
                    label={params.row.status}
                    color={getPrStatusColor(params.row.status)}
                    size="small"
                />
            )
        },
        {
            field: 'createdBy',
            headerName: 'Oluşturan',
            width: 180,
            valueGetter: (params) => params.row.createdBy?.displayName
        },
        {
            field: 'repository',
            headerName: 'Repository',
            width: 200,
            valueGetter: (params) => params.row.repository?.name
        },
        {
            field: 'creationDate',
            headerName: 'Oluşturulma',
            width: 180,
            valueGetter: (params) => format(
                new Date(params.row.creationDate),
                'dd MMM yyyy HH:mm',
                { locale: tr }
            )
        },
        {
            field: 'actions',
            headerName: 'İşlemler',
            width: 100,
            renderCell: (params) => (
                <IconButton onClick={() => setSelectedPR(params.row)}>
                    <Visibility />
                </IconButton>
            )
        }
    ], []);

    const handleSearch = useCallback((value) => {
        setSearchTerm(value);
    }, []);

    const handleFilter = useCallback((field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const handleProjectChange = useCallback((event) => {
        setSelectedProject(event.target.value);
    }, []);

    const filterOptions = useMemo(() => [
        {
            field: 'status',
            label: 'Durum',
            defaultValue: 'active',
            renderValue: (value) => value
        },
        {
            field: 'repository',
            label: 'Repository',
            defaultValue: pullRequests?.[0]?.repository?.name,
            renderValue: (value) => value
        },
        {
            field: 'createdBy',
            label: 'Oluşturan',
            defaultValue: pullRequests?.[0]?.createdBy?.displayName,
            renderValue: (value) => value
        }
    ], [pullRequests]);

    const filteredRows = useMemo(() => {
        if (!pullRequests) return [];
        
        return pullRequests.filter(pr => {
            if (searchTerm) {
                const searchFields = [
                    pr.pullRequestId?.toString(),
                    pr.title,
                    pr.createdBy?.displayName,
                    pr.repository?.name,
                    pr.status
                ];
                const matchesSearch = searchFields.some(field => 
                    field?.toLowerCase().includes(searchTerm.toLowerCase())
                );
                if (!matchesSearch) return false;
            }

            if (filters.status && pr.status !== filters.status) return false;
            if (filters.repository && pr.repository?.name !== filters.repository) return false;
            if (filters.createdBy && pr.createdBy?.displayName !== filters.createdBy) return false;

            return true;
        });
    }, [pullRequests, searchTerm, filters]);

    return (
        <Box sx={{ height: '100%' }}>
            {selectedProject && <PullRequestStats pullRequests={pullRequests} />}
            
            <Box sx={{ mb: 2 }}>
                <FormControl fullWidth>
                    <InputLabel>Proje Seçin</InputLabel>
                    <Select
                        value={selectedProject}
                        label="Proje Seçin"
                        onChange={handleProjectChange}
                        disabled={projectsLoading}
                    >
                        {projects?.map((project) => (
                            <MenuItem key={project.id} value={project.name}>
                                {project.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            
            {selectedProject ? (
                <>
                    <GridToolbar
                        onSearch={handleSearch}
                        onFilter={handleFilter}
                        filters={filterOptions}
                        activeFilters={filters}
                        searchPlaceholder="Pull request ara..."
                    />
                    <CustomDataGrid
                        rows={filteredRows}
                        columns={columns}
                        loading={loading}
                        error={error}
                        pageSize={15}
                        getRowId={(row) => row.pullRequestId}
                    />
                </>
            ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    Lütfen bir proje seçin
                </Box>
            )}

            <PullRequestDetails
                pullRequest={selectedPR}
                open={Boolean(selectedPR)}
                onClose={() => setSelectedPR(null)}
            />
        </Box>
    );
};

export default PullRequestsTable;