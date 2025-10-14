import axios from 'axios';
import { getStorageValue, STORAGE_KEYS } from 'utils/storage';

const getBaseHeaders = () => {
    const pat = getStorageValue(STORAGE_KEYS.PAT, '');
    const token = btoa(`:${pat}`);
    return {
        'Authorization': `Basic ${token}`,
        'Content-Type': 'application/json'
    };
};

const getOrganization = () => {
    return getStorageValue(STORAGE_KEYS.ORGANIZATION, '');
};

// Organizasyondaki tüm projeleri çek
export const fetchAllProjects = async () => {
    try {
        const response = await axios.get(
            `https://dev.azure.com/${getOrganization()}/_apis/projects?api-version=7.0-preview.4`,
            { headers: getBaseHeaders() }
        );
        return response.data.value;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

// Organizasyondaki tüm process tiplerini projects expand ederek çek
export const fetchProcesses = async () => {
    try {
        const response = await axios.get(
            `https://dev.azure.com/${getOrganization()}/_apis/work/processes?$expand=projects&api-version=7.2-preview.2`,
            { headers: getBaseHeaders() }
        );
        
        const processes = response.data.value;
        const projectProcessMap = {};

        processes.forEach(process => {
            if (process.projects) {
                process.projects.forEach(project => {
                    projectProcessMap[project.name] = process.typeId;
                });
            }
        });

        return projectProcessMap;
    } catch (error) {
        console.error('Error fetching processes:', error);
        throw error;
    }
};

// Projelerin bulundukları process tiplerinin State kategorilerini çek
export const fetchStateCategory = async (typeId) => {
    try {
        const response = await axios.get(
            `https://dev.azure.com/${getOrganization()}/_apis/work/processes/${typeId}/workitemtypes?$expand=states&api-version=7.2-preview.2`,
            { headers: getBaseHeaders() }
        );

        const states = response.data.value.flatMap(item => item.states);
        return states.reduce((acc, state) => {
            acc[state.name] = state.stateCategory;
            return acc;
        }, {});
    } catch (error) {
        console.error('Error fetching state categories:', error);
        throw error;
    }
};

// Projedeki tüm repository'leri çek
export const fetchAllRepositories = async (projectName) => {
    try {
        const response = await axios.get(
            `https://dev.azure.com/${getOrganization()}/${projectName}/_apis/git/repositories?api-version=7.1-preview.1`,
            { headers: getBaseHeaders() }
        );
        return response.data.value;
    } catch (error) {
        console.error(`Error fetching repositories for project ${projectName}:`, error);
        throw error;
    }
};

// Projedeki repository'deki commits'i çek
export const fetchCommits = async (projectName, repoId) => {
    try {
        const response = await axios.get(
            `https://dev.azure.com/${getOrganization()}/${projectName}/_apis/git/repositories/${repoId}/commits?api-version=7.1-preview.1`,
            { headers: getBaseHeaders() }
        );
        return response.data.value;
    } catch (error) {
        console.error(`Error fetching commits for repository ${repoId}:`, error);
        throw error;
    }
};

// Projedeki tüm work itemları çek
export const fetchWorkItemsForProject = async (projectName) => {
    try {
        let workItems = [];
        let continuationToken = null;
        
        do {
            const wiqlResponse = await axios.post(
                `https://dev.azure.com/${getOrganization()}/${projectName}/_apis/wit/wiql?$top=2000&api-version=7.2-preview.2`,
                { query: `SELECT [System.Id], [System.State] FROM WorkItems` },
                {
                    headers: {
                        ...getBaseHeaders(),
                        'X-MS-Continuation': continuationToken || '',
                    },
                }
            );
            
            workItems = [...workItems, ...wiqlResponse.data.workItems];
            continuationToken = wiqlResponse.headers['x-ms-continuationtoken'];
        } while (continuationToken);

        return workItems;
    } catch (error) {
        console.error(`Error fetching work items for project ${projectName}:`, error);
        throw error;
    }
};

// Work Item detaylarını çek
export const fetchWorkItemDetails = async (ids, fields = 'System.TeamProject,System.IterationPath,System.IterationLevel1,System.IterationLevel2,System.State,System.AssignedTo,System.Title,System.WorkItemType') => {
    try {
        const response = await axios.get(
            `https://dev.azure.com/${getOrganization()}/_apis/wit/workitems?ids=${ids.join(',')}&fields=${fields}&api-version=7.2-preview.3`,
            { headers: getBaseHeaders() }
        );
        return response.data.value;
    } catch (error) {
        console.error('Error fetching work item details:', error);
        throw error;
    }
}; 

// Projelerdeki tüm build'leri çek
export const fetchLast20Builds = async (projectName) => {
    try {
        const response = await axios.get(
            `https://dev.azure.com/${getOrganization()}/${projectName}/_apis/build/builds?api-version=7.0&$top=20`,
            { headers: getBaseHeaders() }
        );
        return response.data.value;
    } catch (error) {
        console.error('Error fetching last 20 builds:', error);
        throw error;
    }
};

// Kullanıcı listesini çek
export const fetchUsers = async () => {
    try {
        const response = await axios.get(
            `https://vssps.dev.azure.com/${getOrganization()}/_apis/graph/users?api-version=7.0-preview.1`,
            { headers: getBaseHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Kullanıcı yetkilendirmelerini çek
export const fetchUserEntitlements = async () => {
    try {
        const response = await axios.get(
            `https://vsaex.dev.azure.com/${getOrganization()}/_apis/userentitlements?api-version=7.0-preview.3`,
            { headers: getBaseHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching user entitlements:', error);
        throw error;
    }
};

// Dashboard için özet verileri çek
export const fetchDashboardSummary = async () => {
    try {
        const response = await axios.get(
            `https://dev.azure.com/${getOrganization()}/_apis/dashboard/summary?api-version=7.0`,
            { headers: getBaseHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        throw error;
    }
};

// Self-hosted agent'ları çek
export const fetchSelfHostedAgents = async () => {
    try {
        const response = await axios.get(
            `https://dev.azure.com/${getOrganization()}/_apis/distributedtask/pools?api-version=7.0`,
            { headers: getBaseHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching self-hosted agents:', error);
        throw error;
    }
};

// Deployment pool'ları çek
export const fetchDeploymentPools = async () => {
    try {
        const response = await axios.get(
            `https://dev.azure.com/${getOrganization()}/_apis/distributedtask/deploymentgroups?api-version=7.0`,
            { headers: getBaseHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching deployment pools:', error);
        throw error;
    }
};

export const fetchPullRequests = async (projectName, repositoryId) => {
    try {
        const response = await axios.get(
            `https://dev.azure.com/${getOrganization()}/${projectName}/_apis/git/repositories/${repositoryId}/pullrequests?searchCriteria.status=all&api-version=7.0`,
            { headers: getBaseHeaders() }
        );
        return response.data.value;
    } catch (error) {
        console.error('Pull requests fetch error:', error);
        throw new Error('Pull request\'ler alınırken bir hata oluştu');
    }
};

export const fetchCommitDetails = async (projectName, repositoryId, commitId) => {
    try {
        const [detailsResponse, changesResponse] = await Promise.all([
            axios.get(
                `https://dev.azure.com/${getOrganization()}/${projectName}/_apis/git/repositories/${repositoryId}/commits/${commitId}?api-version=7.0`
            ),
            axios.get(
                `https://dev.azure.com/${getOrganization()}/${projectName}/_apis/git/repositories/${repositoryId}/commits/${commitId}/changes?api-version=7.0`
            )
        ]);

        return {
            ...detailsResponse.data,
            changes: changesResponse.data.changes
        };
    } catch (error) {
        console.error('Commit details fetch error:', error);
        throw new Error('Commit detayları alınırken bir hata oluştu');
    }
};
