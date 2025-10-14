import React, { useEffect, useState } from 'react';

// DevExtreme
import DataGrid, { Column, Grouping, GroupPanel, Paging, Pager, Toolbar, Item } from 'devextreme-react/data-grid';

// project imports
import MainCard from 'components/MainCard';

import { GetAll as GetAllRepos, GetCommits } from 'api/ReposApi';
import { GetAll as GetAllProjects } from 'api/ProjectsApi';

// third-party
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

// ==============================|| REPO LIST ||============================== //

export default function RepoList() {
    const [loading, setLoading] = useState(true);
    // error sadece bir projede olsa da sayfaya basıyor. oysa ki tüm projelerde length 0 ise hata vermesi gerekiyor.
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

    // DevExtreme için cell render fonksiyonları
    const renderCommitId = (data) => {
        return (
            <span style={{ fontFamily: 'monospace', cursor: 'pointer' }} title={data.value}>
                {data.value ? data.value.substring(0, 10) : ''}
            </span>
        );
    };

    const renderDate = (data) => {
        return data.value ? moment(data.value).format('LLL') : '';
    };

    return (
        <>
            <MainCard
                content={false}
                title={<FormattedMessage id="repo-list" />}
            >
                {error ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
                        <h3>Hata</h3>
                        <p>{error}</p>
                    </div>
                ) : (
                    <>
                        <h1>Last Commits Across Organization</h1>
                        <div style={{ width: '100%' }}>
                            <DataGrid
                                dataSource={commits}
                                showBorders={true}
                                allowColumnReordering={true}
                                allowColumnResizing={true}
                                columnAutoWidth={true}
                                showRowLines={true}
                                showColumnLines={true}
                                rowAlternationEnabled={true}
                                hoverStateEnabled={true}
                                height={600}
                                width="100%"
                            >
                                <Grouping autoExpandAll={true} />
                                <GroupPanel visible={true} />
                                <Paging defaultPageSize={50} />
                                <Pager
                                    showPageSizeSelector={true}
                                    allowedPageSizes={[25, 50, 100]}
                                    showInfo={true}
                                />
                                <Toolbar>
                                    <Item name="groupPanel" />
                                    <Item name="exportButton" />
                                    <Item name="columnChooserButton" />
                                </Toolbar>
                                
                                <Column 
                                    dataField="projectName" 
                                    caption="Project Name" 
                                    width={150}
                                    groupIndex={0}
                                />
                                <Column 
                                    dataField="repoName" 
                                    caption="Repository Name" 
                                    width={150}
                                />
                                <Column 
                                    dataField="author" 
                                    caption="Author" 
                                    width={150}
                                />
                                <Column 
                                    dataField="date" 
                                    caption="Date" 
                                    width={200}
                                    cellRender={renderDate}
                                />
                                <Column 
                                    dataField="id" 
                                    caption="Commit ID" 
                                    width={120}
                                    cellRender={renderCommitId}
                                    alignment="center"
                                />
                                <Column 
                                    dataField="message" 
                                    caption="Message" 
                                    width={300}
                                />
                            </DataGrid>
                        </div>
                    </>
                )}
            </MainCard>
        </>
    );
}
