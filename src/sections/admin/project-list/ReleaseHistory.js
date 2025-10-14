import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// project imports
import CustomGrid from 'components/DataGrid';
import { GetReleaseHistory } from 'api/ProjectsApi';

// third-party
import moment from 'moment';

// ==============================|| PROJECT LIST - RELEASE HISTORY ||============================== //

const ReleaseHistory = (props) => {
    const {
        projects = []
    } = props;

    const [loading, setLoading] = useState(true);

    const [releases, setReleases] = useState([]);

    useEffect(() => {
        const fetchReleases = async () => {
            const releasesData = [];
            for (const project of projects) {
                try {
                    const releasesResponse = await GetReleaseHistory(project.name);
                    if (releasesResponse.data.count > 0) {
                        releasesResponse.data.value.forEach(release => {
                            releasesData.push({
                                id: release.id,
                                projectName: project.name,
                                releaseName: release.name,
                                status: release.status,
                                createdOn: release.createdOn
                            });
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching releases for project ${project.name}:`, error);
                }
            }
            setReleases(releasesData);
            setLoading(false);
        };

        if (projects.length > 0) {
            fetchReleases();
        }
    }, [projects]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90, headerAlign: 'center', align: 'center' },
        { field: 'projectName', headerName: 'Project Name', width: 150 },
        { field: 'releaseName', headerName: 'Release Name', width: 150 },
        { field: 'status', headerName: 'Status', width: 110, headerAlign: 'center', align: 'center' },
        { field: 'createdOn', headerName: 'Created On', width: 200, renderCell: (params) => Boolean(params.value) && moment(params.value).format('LLL') },
    ];

    return (
        <div style={{ padding: '0 20px 0 20px', width: '100%' }}>
            <h1>Release History</h1>
            <CustomGrid
                rows={Array.isArray(releases) ? releases : []}
                columns={columns}
                // getRowId={(row) => `${row?.id}-${row?.projectReference?.id}`}
                getRowId={() => crypto.randomUUID()}
                getRowHeight={() => 'auto'}
                loading={loading}
            />
        </div>
    );
};

ReleaseHistory.propTypes = {
    projects: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]).isRequired
};

export default ReleaseHistory;
