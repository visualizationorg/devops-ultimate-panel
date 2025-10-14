import React, { useMemo, useState, useCallback } from 'react';
import { useCommits, useProjects, usePullRequests } from 'hooks/useAzureDevOps';
import CustomDataGrid from 'components/DataGrid/CustomDataGrid';
import GridToolbar from 'components/DataGrid/GridToolbar';
import { Box, Link, Tooltip, FormControl, InputLabel, Select, MenuItem, IconButton, Stack } from '@mui/material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import RepositoryDetails from '../repositories/RepositoryDetails';
import CommitDetails from './CommitDetails';
import { Visibility } from '@mui/icons-material';
import CommitFilters from './CommitFilters';
import CommitSearch from './CommitSearch';
import CommitStats from './CommitStats';

const CommitsTable = () => {
    const [selectedProject, setSelectedProject] = useState('');
    const { data: projects, loading: projectsLoading } = useProjects();
    const { data: commits, loading: commitsLoading, error } = useCommits(selectedProject);
    const { data: pullRequests, loading: prsLoading } = usePullRequests(selectedProject);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({});
    const [selectedRepo, setSelectedRepo] = useState(null);
    const [selectedCommit, setSelectedCommit] = useState(null);

    const loading = projectsLoading || commitsLoading || prsLoading;

    const columns = useMemo(() => [
        {
            field: 'commitId',
            headerName: 'Commit ID',
            width: 100,
            renderCell: (params) => (
                <Tooltip title={params.row.commitId}>
                    <Link 
                        href={params.row.remoteUrl} 
                        target="_blank"
                        underline="hover"
                    >
                        {params.row.commitId.slice(0, 7)}
                    </Link>
                </Tooltip>
            )
        },
        {
            field: 'comment',
            headerName: 'Açıklama',
            flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.row.comment}>
                    <span>{params.row.comment}</span>
                </Tooltip>
            )
        },
        {
            field: 'author',
            headerName: 'Yazar',
            width: 180,
            valueGetter: (params) => params.row.author?.name
        },
        {
            field: 'date',
            headerName: 'Tarih',
            width: 180,
            valueGetter: (params) => format(
                new Date(params.row.author.date),
                'dd MMM yyyy HH:mm',
                { locale: tr }
            )
        },
        {
            field: 'repository',
            headerName: 'Repository',
            width: 200,
            renderCell: (params) => (
                <Link
                    component="button"
                    variant="body2"
                    onClick={() => setSelectedRepo(params.row.repository)}
                >
                    {params.row.repository?.name}
                </Link>
            )
        },
        {
            field: 'actions',
            headerName: 'İşlemler',
            width: 100,
            renderCell: (params) => (
                <IconButton onClick={() => setSelectedCommit(params.row)}>
                    <Visibility />
                </IconButton>
            )
        }
    ], []);

    const filterOptions = useMemo(() => [
        {
            field: 'repository',
            label: 'Repository',
            defaultValue: commits?.[0]?.repository?.name,
            renderValue: (value) => value
        },
        {
            field: 'author',
            label: 'Yazar',
            defaultValue: commits?.[0]?.author?.name,
            renderValue: (value) => value
        }
    ], [commits]);

    const authors = useMemo(() => {
        if (!commits) return [];
        return [...new Set(commits.map(commit => commit.author.name))];
    }, [commits]);

    const repositories = useMemo(() => {
        if (!commits) return [];
        return [...new Set(commits.map(commit => commit.repository.name))];
    }, [commits]);

    const filteredCommits = useMemo(() => {
        if (!commits) return [];

        return commits.filter(commit => {
            // Arama filtresi
            if (searchTerm) {
                const searchFields = [
                    commit.commitId,
                    commit.comment,
                    commit.author.name,
                    commit.repository.name
                ];
                if (!searchFields.some(field => 
                    field?.toLowerCase().includes(searchTerm.toLowerCase())
                )) {
                    return false;
                }
            }

            // Filtreler
            if (filters.author && commit.author.name !== filters.author) return false;
            if (filters.repository && commit.repository.name !== filters.repository) return false;
            if (filters.startDate && new Date(commit.author.date) < filters.startDate) return false;
            if (filters.endDate && new Date(commit.author.date) > filters.endDate) return false;

            return true;
        });
    }, [commits, searchTerm, filters]);

    const handleSearch = useCallback((value) => {
        setSearchTerm(value);
    }, []);

    const handleFilter = useCallback((field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    // Proje seçimi için handler
    const handleProjectChange = useCallback((event) => {
        setSelectedProject(event.target.value);
    }, []);

    const repoCommits = useMemo(() => {
        if (!selectedRepo || !commits) return [];
        return commits.filter(commit => commit.repository?.id === selectedRepo.id);
    }, [selectedRepo, commits]);

    const repoPullRequests = useMemo(() => {
        if (!selectedRepo || !pullRequests) return [];
        return pullRequests.filter(pr => pr.repository?.id === selectedRepo.id);
    }, [selectedRepo, pullRequests]);

    return (
        <Box sx={{ height: '100%' }}>
            <Stack spacing={3}>
                <CommitSearch onSearch={setSearchTerm} />
                <CommitFilters
                    authors={authors}
                    repositories={repositories}
                    filters={filters}
                    onFilterChange={setFilters}
                />
                <CommitStats 
                    commits={commits}
                    startDate={filters.startDate}
                    endDate={filters.endDate}
                />
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
                            searchPlaceholder="Commit ara..."
                        />
                        <CustomDataGrid
                            rows={filteredCommits}
                            columns={columns}
                            loading={loading}
                            error={error}
                            pageSize={15}
                            getRowId={(row) => row.commitId}
                        />
                    </>
                ) : (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        Lütfen bir proje seçin
                    </Box>
                )}

                <RepositoryDetails
                    repository={selectedRepo}
                    commits={repoCommits}
                    pullRequests={repoPullRequests}
                    open={Boolean(selectedRepo)}
                    onClose={() => setSelectedRepo(null)}
                />

                <CommitDetails
                    commit={selectedCommit}
                    open={Boolean(selectedCommit)}
                    onClose={() => setSelectedCommit(null)}
                />
            </Stack>
        </Box>
    );
};

export default CommitsTable; 
