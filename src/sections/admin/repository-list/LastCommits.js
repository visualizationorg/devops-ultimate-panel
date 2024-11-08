import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// project imports
import CustomGrid from 'components/DataGrid';

import { GetAll as GetAllRepos, GetCommits } from 'api/ReposApi';
import { GetAll as GetAllProjects } from 'api/ProjectsApi';

// third-party
import moment from 'moment';

// ==============================|| REPOSITORY LIST - LAST COMMITS ||============================== //

const LastCommits = (props) => {
    const {
        projects = [],
        repositories = []
    } = props;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [projects, setProjects] = useState([]);
    const [commits, setCommits] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectsResponse = await GetAllProjects();
                setProjects(projectsResponse.data.value);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        const fetchCommits = async () => {
            const commitsData = [];
            for (const project of projects) {
                try {
                    const reposResponse = await GetAllRepos(project.name);
                    for (const repo of reposResponse.data.value) {
                        const commitsResponse = await GetCommits(project.name, repo.id)
                        if (commitsResponse.data.value.length === 0) {
                            setError('No commits found');
                        } else {
                            commitsResponse.data.value.forEach(commit => {
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
                } catch (error) {
                    console.error(`Error fetching commits for project ${project.name}:`, error);
                    setError(`Error fetching commits for project ${project.name}`);
                }
            }
            setCommits(commitsData);
            setLoading(false);
        };

        if (projects.length > 0) {
            fetchCommits();
        }
    }, [projects]);

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
