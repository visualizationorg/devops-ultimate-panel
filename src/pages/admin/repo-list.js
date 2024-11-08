import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLoaderData, useNavigate, useRevalidator } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Fab, Link, Stack } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';

// project imports
import AnimateButton from 'components/@extended/AnimateButton';
import CustomGrid from 'components/DataGrid';
import MainCard from 'components/MainCard';

import { GetAll as GetAllRepos, GetCommits } from 'api/ReposApi';
import { GetAll as GetAllProjects } from 'api/ProjectsApi';

// assets
import { DeleteOutlined, EditOutlined, LinkOutlined, PlusOutlined } from '@ant-design/icons';
import { Link as LinkIcon, Lock as LockIcon, Public as PublicIcon } from '@mui/icons-material/';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';

// ==============================|| REPO LIST ||============================== //

export default function RepoList() {
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
        <>
            <MainCard
                content={false}
                title={<FormattedMessage id="repo-list" />}
            >
                {error ? (
                    <p>{error}</p>
                ) : (
                    <>
                        <h1>Last Commits Across Organization</h1>
                        <CustomGrid
                            rows={Array.isArray(commits) ? commits : []}
                            columns={columns}
                            getRowHeight={() => 'auto'}
                            pageSize={100}
                            loading={loading}
                        />
                    </>
                )}
            </MainCard>
        </>
    );
}
