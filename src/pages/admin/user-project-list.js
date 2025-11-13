import React, { useEffect, useState, useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Stack, CircularProgress, Alert, Chip } from '@mui/material';

// project imports
import CustomGrid from 'components/DataGrid';
import MainCard from 'components/MainCard';
import { GetUserProjects } from 'api/TeamsApi';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// ==============================|| USER PROJECT LIST PAGE ||============================== //

const UserProjectList = () => {
    const theme = useTheme();
    const intl = useIntl();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Kullanıcıları ve projelerini getir
    useEffect(() => {
        const fetchUserProjects = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await GetUserProjects();
                setUsers(response.data.value || []);
            } catch (error) {
                console.error('Error fetching user projects:', error);
                setError('Kullanıcı projeleri yüklenirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProjects();
    }, []);

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
                field: 'projectCount',
                headerName: 'Proje Sayısı',
                description: 'Kullanıcının çalıştığı proje sayısı',
                flex: 0.5,
                minWidth: 120,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params) => (
                    <Chip 
                        label={params.value} 
                        color="primary" 
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                    />
                )
            },
            {
                field: 'teamCount',
                headerName: 'Takım Sayısı',
                description: 'Kullanıcının üye olduğu toplam takım sayısı',
                flex: 0.5,
                minWidth: 120,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params) => (
                    <Chip 
                        label={params.value} 
                        color="secondary" 
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                    />
                )
            },
            {
                field: 'projects',
                headerName: 'Projeler ve Takımlar',
                description: 'Kullanıcının çalıştığı projeler ve takımlar',
                flex: 3,
                minWidth: 400,
                renderCell: (params) => {
                    const projects = params.value || [];
                    return (
                        <Box sx={{ py: 1, width: '100%' }}>
                            {projects.map((project, index) => (
                                <Box 
                                    key={index} 
                                    sx={{ 
                                        mb: index < projects.length - 1 ? 1 : 0,
                                        pb: index < projects.length - 1 ? 1 : 0,
                                        borderBottom: index < projects.length - 1 ? '1px solid #e0e0e0' : 'none'
                                    }}
                                >
                                    <Box sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mb: 0.5 }}>
                                        {project.projectName}
                                    </Box>
                                    <Box sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary }}>
                                        {project.teams.join(', ')}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    );
                }
            }
        ],
        [theme, intl]
    );

    return (
        <>
            <MainCard
                content={false}
                title={<FormattedMessage id="user-project-list" />}
                secondary={
                    <Stack direction="row" spacing={2}>
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
                                    Hiç kullanıcı bulunamadı.
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

export default UserProjectList;
