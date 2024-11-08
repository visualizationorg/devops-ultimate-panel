import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// project imports
import CustomGrid from 'components/DataGrid';

import { GetBuildHistory } from 'api/ProjectsApi';

// ==============================|| PROJECT LIST - BUILD HISTORY ||============================== //

const BuildHistory = (props) => {
    const {
        projects = []
    } = props;

    const [loading, setLoading] = useState(true);

    const [builds, setBuilds] = useState({});

    useEffect(() => {
        const fetchBuilds = async () => {
            const buildsData = [];
            for (const project of projects) {
                try {
                    const buildsResponse = await GetBuildHistory(project.name);
                    if (buildsResponse.data.count > 0) {
                        buildsResponse.data.value.forEach(build => {
                            buildsData.push({
                                id: build.id,
                                projectName: project.name,
                                buildNumber: build.buildNumber,
                                status: build.status,
                                result: build.result
                            });
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching builds for project ${project.name}:`, error);
                }
            }
            setBuilds(buildsData);
            setLoading(false);
        };

        if (projects.length > 0) {
            fetchBuilds();
        }
    }, [projects]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90, headerAlign: 'center', align: 'center' },
        { field: 'projectName', headerName: 'Project Name', width: 150 },
        { field: 'buildNumber', headerName: 'Build Number', width: 150 },
        { field: 'status', headerName: 'Status', width: 110, headerAlign: 'center', align: 'center' },
        { field: 'result', headerName: 'Result', width: 110, headerAlign: 'center', align: 'center' }
    ];

    return (
        <div style={{ padding: '0 20px 0 20px', width: '100%' }}>
            <h1>Build History</h1>
            <CustomGrid
                rows={Array.isArray(builds) ? builds : []}
                columns={columns}
                getRowHeight={() => 'auto'}
                loading={loading}
            />
        </div>
    );
};

BuildHistory.propTypes = {
    projects: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]).isRequired
};

export default BuildHistory;
