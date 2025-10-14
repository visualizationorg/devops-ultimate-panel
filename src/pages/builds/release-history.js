import React, { useEffect, useState } from 'react';

// project imports
import MainCard from 'components/MainCard';
import CustomGrid from 'components/DataGrid';
import { GetReleaseHistory } from 'api/ProjectsApi';
import { GetAll } from 'api/ProjectsApi';

// third-party
import moment from 'moment';

// ==============================|| RELEASE HISTORY PAGE ||============================== //

const ReleaseHistoryPage = () => {
    const [loading, setLoading] = useState(true);
    const [releases, setReleases] = useState([]);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Önce projeleri çek
                const projectsResponse = await GetAll();
                const projectsData = projectsResponse.data.value || [];
                setProjects(projectsData);

                // Sonra her proje için release history'yi çek
                const releasesData = [];
                for (const project of projectsData) {
                    try {
                        const releasesResponse = await GetReleaseHistory(project.name);
                        if (releasesResponse.data.count > 0) {
                            releasesResponse.data.value.forEach(release => {
                                releasesData.push({
                                    id: release.id,
                                    projectName: project.name,
                                    releaseName: release.name,
                                    status: release.status,
                                    createdOn: release.createdOn,
                                    modifiedOn: release.modifiedOn
                                });
                            });
                        }
                    } catch (error) {
                        console.error(`Error fetching releases for project ${project.name}:`, error);
                    }
                }
                setReleases(releasesData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90, headerAlign: 'center', align: 'center' },
        { field: 'projectName', headerName: 'Project Name', width: 150 },
        { field: 'releaseName', headerName: 'Release Name', width: 200 },
        { field: 'status', headerName: 'Status', width: 110, headerAlign: 'center', align: 'center' },
        {
            field: 'createdOn',
            headerName: 'Created On',
            width: 180,
            renderCell: (params) => Boolean(params.value) && moment(params.value).format('LLL')
        },
        {
            field: 'modifiedOn',
            headerName: 'Modified On',
            width: 180,
            renderCell: (params) => Boolean(params.value) && moment(params.value).format('LLL')
        }
    ];

    return (
        <MainCard title="Release History">
            <CustomGrid
                rows={Array.isArray(releases) ? releases : []}
                columns={columns}
                // getRowId={() => crypto.randomUUID()}
                getRowHeight={() => 'auto'}
                loading={loading}
            />
        </MainCard>
    );
};

export default ReleaseHistoryPage;
