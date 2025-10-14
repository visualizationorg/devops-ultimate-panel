import { useState, useEffect, useCallback } from 'react';
import * as AzureDevOpsService from 'services/AzureDevOpsService';

export const useAzureDevOps = () => {
    const [projects, setProjects] = useState([]);
    const [workItems, setWorkItems] = useState([]);
    const [builds, setBuilds] = useState([]);
    const [commits, setCommits] = useState([]);
    const [stateCategoryMap, setStateCategoryMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Projeleri çek
                const projectsData = await AzureDevOpsService.fetchAllProjects();
                setProjects(projectsData);

                // Process ve state category bilgilerini çek
                const projectProcessMap = await AzureDevOpsService.fetchProcesses();
                const tempStateCategoryMap = {};

                for (const projectName in projectProcessMap) {
                    tempStateCategoryMap[projectName] = await AzureDevOpsService.fetchStateCategory(projectProcessMap[projectName]);
                }
                setStateCategoryMap(tempStateCategoryMap);

                let allWorkItems = [];
                let workItemIdsSet = new Set(); // Tekrarları engellemek için Set kullanıyoruz

                for (const project of projectsData) {

                    // Tüm projelerden son 20 Build'i çek   
                    const buildsData = await AzureDevOpsService.fetchLast20Builds(project.name);

                    // Tüm Build'leri başlangıç zamanına göre sıralayıp ilk 20 tanesini seç
                    const sortedBuilds = buildsData
                        .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
                        .slice(0, 20);
                    setBuilds(sortedBuilds);

                    // Work Item'ları çek   
                    const workItemIds = await AzureDevOpsService.fetchWorkItemsForProject(project.name);

                    // Work item ID'leri varsa ve Set'te değilse ekle
                    workItemIds.forEach(item => {
                        if (item?.id && !workItemIdsSet.has(item.id)) {
                            workItemIdsSet.add(item.id);
                        }
                    });
                }

                const idsArray = Array.from(workItemIdsSet);
                while (idsArray.length > 0) {
                    const chunk = idsArray.splice(0, 200);
                    const details = await AzureDevOpsService.fetchWorkItemDetails(chunk);
                    allWorkItems = [...allWorkItems, ...details];
                }
                setWorkItems(allWorkItems);

                // Commit'leri çek
                let allCommits = [];
                for (const project of projectsData) {
                    const repositories = await AzureDevOpsService.fetchAllRepositories(project.name);
                    for (const repo of repositories) {
                        const repoCommits = await AzureDevOpsService.fetchCommits(project.name, repo.id);
                        if (repoCommits.length > 0) {
                            repoCommits.forEach(commit => {
                                allCommits.push({
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
                setCommits(allCommits);

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return {
        projects,
        workItems,
        builds,
        commits,
        stateCategoryMap,
        loading,
        error
    };
};

const createBaseHook = (fetchFunction) => {
    return (params) => {
        const [data, setData] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        const fetchData = useCallback(async () => {
            let isMounted = true;

            try {
                setLoading(true);
                const result = await fetchFunction(params);
                if (isMounted) {
                    setData(result);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err);
                    setData(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }, [params]);

        useEffect(() => {
            let isMounted = true;
            fetchData();
            return () => {
                isMounted = false;
            };
        }, [fetchData]);

        const refresh = useCallback(() => fetchData(), [fetchData]);

        return { data, loading, error, refresh };
    };
};

// Veri çekme fonksiyonları
const fetchAllWorkItems = async () => {
    const projects = await AzureDevOpsService.fetchAllProjects();
    let workItemIdsSet = new Set();
    let allWorkItems = [];

    // Tüm work item ID'lerini topla
    for (const project of projects) {
        const workItemIds = await AzureDevOpsService.fetchWorkItemsForProject(project.name);
        workItemIds.forEach(item => {
            if (item?.id) workItemIdsSet.add(item.id);
        });
    }

    // ID'leri 200'lük parçalara böl ve detayları çek
    const idsArray = Array.from(workItemIdsSet);
    for (let i = 0; i < idsArray.length; i += 200) {
        const chunk = idsArray.slice(i, i + 200);
        const details = await AzureDevOpsService.fetchWorkItemDetails(chunk);
        allWorkItems = [...allWorkItems, ...details];
    }

    return allWorkItems;
};

const fetchAllBuilds = async (projectName) => {
    if (projectName) {
        const builds = await AzureDevOpsService.fetchLast20Builds(projectName);
        return builds.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    }

    const projects = await AzureDevOpsService.fetchAllProjects();
    const allBuilds = await Promise.all(
        projects.map(project => AzureDevOpsService.fetchLast20Builds(project.name))
    );

    return allBuilds
        .flat()
        .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
        .slice(0, 20);
};

const fetchProjectCommits = async (projectName) => {
    if (!projectName) throw new Error('Proje adı gerekli');

    const repositories = await AzureDevOpsService.fetchAllRepositories(projectName);
    const commitsPromises = repositories.map(async repo => {
        const commits = await AzureDevOpsService.fetchCommits(projectName, repo.id);
        return commits.map(commit => ({ ...commit, repository: repo }));
    });

    const commits = await Promise.all(commitsPromises);
    return commits.flat();
};

const fetchProjectPullRequests = async (projectName) => {
    if (!projectName) throw new Error('Proje adı gerekli');

    const repositories = await AzureDevOpsService.fetchAllRepositories(projectName);
    const prsPromises = repositories.map(async repo => {
        const pullRequests = await AzureDevOpsService.fetchPullRequests(projectName, repo.id);
        return pullRequests.map(pr => ({
            ...pr,
            repository: repo
        }));
    });

    const pullRequests = await Promise.all(prsPromises);
    return pullRequests.flat().sort((a, b) => 
        new Date(b.creationDate) - new Date(a.creationDate)
    );
};

const fetchCommitDetails = async (projectName, repositoryId, commitId) => {
    if (!projectName || !repositoryId || !commitId) {
        throw new Error('Proje adı, repository ID ve commit ID gerekli');
    }

    const details = await AzureDevOpsService.fetchCommitDetails(
        projectName,
        repositoryId,
        commitId
    );

    return details;
};

const fetchRepositories = async (projectName) => {
    if (!projectName) {
        const projects = await AzureDevOpsService.fetchAllProjects();
        let allRepositories = [];
        
        for (const project of projects) {
            const repos = await AzureDevOpsService.fetchAllRepositories(project.name);
            allRepositories = [...allRepositories, ...repos.map(repo => ({
                ...repo,
                project: project
            }))];
        }
        
        return allRepositories;
    }
    
    return AzureDevOpsService.fetchAllRepositories(projectName);
};

// Hook exports
export const useWorkItems = createBaseHook(fetchAllWorkItems);
export const useBuilds = createBaseHook(fetchAllBuilds);
export const useCommits = createBaseHook(fetchProjectCommits);
export const useProjects = createBaseHook(AzureDevOpsService.fetchAllProjects);
export const useProcesses = createBaseHook(AzureDevOpsService.fetchProcesses);
export const usePullRequests = createBaseHook(fetchProjectPullRequests);
export const useCommitDetails = createBaseHook(fetchCommitDetails);
export const useRepositories = createBaseHook(fetchRepositories); 
