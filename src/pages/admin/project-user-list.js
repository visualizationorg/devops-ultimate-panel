import React, { useEffect, useState, useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Stack, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert } from '@mui/material';

// project imports
import CustomGrid from 'components/DataGrid';
import MainCard from 'components/MainCard';
import { GetAll as GetAllProjects } from 'api/ProjectsApi';
import { GetProjectUsers } from 'api/TeamsApi';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// ==============================|| PROJECT USER LIST PAGE ||============================== //

const ProjectUserList = () => {
    const theme = useTheme();
    const intl = useIntl();

    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Projeleri getir
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectsResponse = await GetAllProjects();
                const projectsData = projectsResponse.data.value || [];
                setProjects(projectsData);
                
                // İlk projeyi otomatik seç
                if (projectsData.length > 0) {
                    setSelectedProject(projectsData[0].name);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
                setError('Projeler yüklenirken bir hata oluştu');
            }
        };

        fetchProjects();
    }, []);

    // Seçilen projenin kullanıcılarını getir
    useEffect(() => {
        const fetchUsers = async () => {
            if (!selectedProject) return;

            setLoading(true);
            setError(null);
            
            try {
                const response = await GetProjectUsers(selectedProject);
                setUsers(response.data.value || []);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Kullanıcılar yüklenirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [selectedProject]);

    const columns = useMemo(
        () => [
            {
                field: 'displayName',
                headerName: intl.formatMessage({ id: 'user' }),
                description: intl.formatMessage({ id: 'user' }),
                flex: 1,
                minWidth: 200
            },
            {
                field: 'uniqueName',
                headerName: 'E-mail / Kullanıcı Adı',
                description: 'E-mail / Kullanıcı Adı',
                flex: 1,
                minWidth: 250
            },
            {
                field: 'teams',
                headerName: 'Takımlar',
                description: 'Kullanıcının üye olduğu takımlar',
                flex: 2,
                minWidth: 300,
                renderCell: (params) => {
                    const teams = params.value || [];
                    return (
                        <Box sx={{ py: 1 }}>
                            {teams.join(', ')}
                        </Box>
                    );
                }
            },
            {
                field: 'teamCount',
                headerName: 'Takım Sayısı',
                description: 'Kullanıcının üye olduğu takım sayısı',
                flex: 0.5,
                minWidth: 120,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params) => {
                    const teams = params.row.teams || [];
                    return teams.length;
                }
            }
        ],
        [theme, intl]
    );

    const handleProjectChange = (event) => {
        setSelectedProject(event.target.value);
    };

    return (
        <>
            <MainCard
                content={false}
                title={<FormattedMessage id="project-user-list" />}
                secondary={
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormControl sx={{ minWidth: 250 }} size="small">
                            <InputLabel id="project-select-label">Proje Seçin</InputLabel>
                            <Select
                                labelId="project-select-label"
                                id="project-select"
                                value={selectedProject}
                                label="Proje Seçin"
                                onChange={handleProjectChange}
                                disabled={projects.length === 0}
                            >
                                {projects.map((project) => (
                                    <MenuItem key={project.id} value={project.name}>
                                        {project.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box id="filter-panel" />
                    </Stack>
                }
            >
                {error && (
                    <Alert severity="error" sx={{ m: 2 }}>
                        {error}
                    </Alert>
                )}
                
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {users.length === 0 && !error ? (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Alert severity="info">
                                    {selectedProject 
                                        ? `"${selectedProject}" projesinde kullanıcı bulunamadı.`
                                        : 'Lütfen bir proje seçin.'}
                                </Alert>
                            </Box>
                        ) : (
                            <CustomGrid
                                rows={users}
                                columns={columns}
                                getRowId={(row) => row.id}
                                getRowHeight={() => 'auto'}
                                sx={{
                                    '& .MuiDataGrid-columnHeaderTitle': {
                                        whiteSpace: 'normal',
                                        lineHeight: 'normal'
                                    },
                                    '& .MuiDataGrid-columnHeader': {
                                        height: 'unset !important'
                                    },
                                    '& .MuiDataGrid-columnHeaders': {
                                        maxHeight: '168px !important'
                                    },
                                    '& .MuiDataGrid-row': {
                                        minHeight: '66.5px !important'
                                    },
                                    '& .MuiDataGrid-cell': {
                                        whiteSpace: 'normal',
                                        lineHeight: 'normal'
                                    },
                                    '& .MuiDataGrid-cell:first-of-type': {
                                        paddingLeft: '24px'
                                    },
                                    '& .MuiDataGrid-columnHeader:first-of-type': {
                                        paddingLeft: '24px'
                                    }
                                }}
                            />
                        )}
                    </>
                )}
            </MainCard>
        </>
    );
};

export default ProjectUserList;
