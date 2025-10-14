import React, { useEffect, useState } from 'react';

// project imports
import MainCard from 'components/MainCard';
import CustomGrid from 'components/DataGrid';
import { GetBuildHistory } from 'api/ProjectsApi';
import { GetAll } from 'api/ProjectsApi';

// third-party
import moment from 'moment';

// ==============================|| BUILD HISTORY PAGE ||============================== //

const BuildHistoryPage = () => {
    const [loading, setLoading] = useState(true);
    const [builds, setBuilds] = useState([]);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Önce projeleri çek
                const projectsResponse = await GetAll();
                const projectsData = projectsResponse.data.value || [];
                setProjects(projectsData);

                // Sonra her proje için build history'yi çek
                const buildsData = [];
                for (const project of projectsData) {
                    try {
                        const buildsResponse = await GetBuildHistory(project.name);
                        if (buildsResponse.data.count > 0) {
                            buildsResponse.data.value.forEach(build => {
                                buildsData.push({
                                    id: build.id,
                                    projectName: project.name,
                                    buildNumber: build.buildNumber,
                                    status: build.status,
                                    result: build.result,
                                    reason: build.reason,
                                    createdOn: build.createdOn,
                                    finishedOn: build.finishedOn
                                });
                            });
                        }
                    } catch (error) {
                        console.error(`Error fetching builds for project ${project.name}:`, error);
                    }
                }
                setBuilds(buildsData);
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
        { field: 'buildNumber', headerName: 'Build Number', width: 150 },
        { field: 'status', headerName: 'Status', width: 110, headerAlign: 'center', align: 'center' },
        { field: 'result', headerName: 'Result', width: 110, headerAlign: 'center', align: 'center' },
        { field: 'reason', headerName: 'Reason', width: 120, headerAlign: 'center', align: 'center' },
        {
            field: 'createdOn',
            headerName: 'Created On',
            width: 180,
            renderCell: (params) => Boolean(params.value) && moment(params.value).format('LLL')
        },
        {
            field: 'finishedOn',
            headerName: 'Finished On',
            width: 180,
            renderCell: (params) => Boolean(params.value) && moment(params.value).format('LLL')
        }
    ];

    return (
        <MainCard title="Build History">
            <CustomGrid
                rows={Array.isArray(builds) ? builds : []}
                columns={columns}
                // getRowId={() => crypto.randomUUID()}
                getRowHeight={() => 'auto'}
                loading={loading}
            />
        </MainCard>
    );
};

export default BuildHistoryPage;
