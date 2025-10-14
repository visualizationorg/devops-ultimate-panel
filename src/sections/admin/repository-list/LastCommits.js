import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// project imports
import CustomGrid from 'components/DataGrid';

import { fetchAllProjects, fetchAllRepositories, fetchCommits } from 'services/AzureDevOpsService';

// third-party
import moment from 'moment';

// ==============================|| REPOSITORY LIST - LAST COMMITS ||============================== //

const LastCommits = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [commits, setCommits] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const projects = await fetchAllProjects();
                const commitsData = [];

                for (const project of projects) {
                    const repositories = await fetchAllRepositories(project.name);
                    
                    for (const repo of repositories) {
                        const repoCommits = await fetchCommits(project.name, repo.id);
                        
                        if (repoCommits.length > 0) {
                            repoCommits.forEach(commit => {
                                commitsData.push({
                                    id: commit.commitId,
                                    projectName: project.name,
                                    repoName: repo.name,
                                    author: commit.author.name,
                                    date: commit.author.date,
                                    message: commit.comment
                                });
                            });
                        }
                    }
                }

                setCommits(commitsData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const columns = [
        { field: 'id', headerName: 'Commit ID', width: 200, headerAlign: 'center', align: 'center' },
        { field: 'projectName', headerName: 'Project Name', width: 150 },
        { field: 'repoName', headerName: 'Repository Name', width: 150 },
        { field: 'author', headerName: 'Author', width: 150 },
        { field: 'date', headerName: 'Date', width: 200, renderCell: (params) => Boolean(params.value) && moment(params.value).format('LLL') },
        { field: 'message', headerName: 'Message', width: 300 }
    ];

    return (
        <div style={{ padding: '0 20px 0 20px', width: '100%' }}>
            <h1>Last Commits Across Organization</h1>
            {error ? (
                <p>{error}</p>
            ) : (
                <CustomGrid
                    rows={Array.isArray(commits) ? commits : []}
                    columns={columns}
                    pageSize={100}
                    loading={loading}
                />
            )}
        </div>
    );
};

LastCommits.propTypes = {
    projects: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]).isRequired,
    repositories: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]).isRequired
};

export default LastCommits;
