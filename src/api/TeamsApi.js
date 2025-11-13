import axios from 'utils/axios';
import { getStorageValue, STORAGE_KEYS } from 'utils/storage';

// Tüm takımları getir (pagination ile)
export const GetAllTeams = async () => {
    try {
        const organization = getStorageValue(STORAGE_KEYS.ORGANIZATION, '');
        let allTeams = [];
        let skip = 0;
        const top = 100;
        let hasMoreData = true;

        while (hasMoreData) {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/${organization}/_apis/teams?api-version=7.1-preview.3&$top=${top}&$skip=${skip}`
            );
            
            const teams = response.data.value || [];
            
            if (teams.length === 0) {
                hasMoreData = false;
            } else {
                allTeams = [...allTeams, ...teams];
                
                if (teams.length < top) {
                    hasMoreData = false;
                } else {
                    skip += top;
                }
            }
        }

        return { data: { value: allTeams } };
    } catch (error) {
        console.error('Error fetching teams:', error);
        return Promise.reject(error.data);
    }
};

// Bir takımın üyelerini getir (pagination ile)
export const GetTeamMembers = async (projectId, teamId) => {
    try {
        const organization = getStorageValue(STORAGE_KEYS.ORGANIZATION, '');
        let allMembers = [];
        let skip = 0;
        const top = 100;
        let hasMoreData = true;

        while (hasMoreData) {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/${organization}/_apis/projects/${projectId}/teams/${teamId}/members?api-version=7.1&$top=${top}&$skip=${skip}`
            );
            
            const members = response.data.value || [];
            
            if (members.length === 0) {
                hasMoreData = false;
            } else {
                allMembers = [...allMembers, ...members];
                
                if (members.length < top) {
                    hasMoreData = false;
                } else {
                    skip += top;
                }
            }
        }

        return { data: { value: allMembers } };
    } catch (error) {
        console.error(`Error fetching team members for team ${teamId}:`, error);
        return Promise.reject(error.data);
    }
};

// Tüm takımları ve üyelerini getir (proje-kullanıcı ilişkisi için)
export const GetAllTeamsWithMembers = async () => {
    try {
        const teamsResponse = await GetAllTeams();
        const teams = teamsResponse.data.value || [];
        
        const teamsWithMembers = await Promise.all(
            teams.map(async (team) => {
                try {
                    const membersResponse = await GetTeamMembers(team.projectId, team.id);
                    return {
                        ...team,
                        members: membersResponse.data.value || []
                    };
                } catch (error) {
                    console.error(`Error fetching members for team ${team.name}:`, error);
                    return {
                        ...team,
                        members: []
                    };
                }
            })
        );

        return { data: { value: teamsWithMembers } };
    } catch (error) {
        console.error('Error fetching teams with members:', error);
        return Promise.reject(error.data);
    }
};

// Projeye göre kullanıcıları getir (project-user-list için)
export const GetProjectUsers = async (projectName) => {
    try {
        const organization = getStorageValue(STORAGE_KEYS.ORGANIZATION, '');
        
        // Önce projedeki tüm takımları getir
        let allTeams = [];
        let skip = 0;
        const top = 100;
        let hasMoreData = true;

        while (hasMoreData) {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/${organization}/_apis/teams?api-version=7.1-preview.3&$top=${top}&$skip=${skip}`
            );
            
            const teams = response.data.value || [];
            
            if (teams.length === 0) {
                hasMoreData = false;
            } else {
                // Sadece bu projeye ait takımları filtrele
                const projectTeams = teams.filter(team => team.projectName === projectName);
                allTeams = [...allTeams, ...projectTeams];
                
                if (teams.length < top) {
                    hasMoreData = false;
                } else {
                    skip += top;
                }
            }
        }

        // Her takımın üyelerini getir
        const allMembers = new Map(); // Tekrar eden kullanıcıları önlemek için Map kullan
        
        for (const team of allTeams) {
            try {
                const membersResponse = await GetTeamMembers(team.projectId, team.id);
                const members = membersResponse.data.value || [];
                
                members.forEach(member => {
                    const identity = member.identity;
                    if (identity && identity.id) {
                        if (!allMembers.has(identity.id)) {
                            allMembers.set(identity.id, {
                                id: identity.id,
                                displayName: identity.displayName || 'N/A',
                                uniqueName: identity.uniqueName || 'N/A',
                                imageUrl: identity.imageUrl || '',
                                descriptor: identity.descriptor || '',
                                teams: [team.name]
                            });
                        } else {
                            // Kullanıcı zaten varsa, sadece takım ekle
                            const existingUser = allMembers.get(identity.id);
                            if (!existingUser.teams.includes(team.name)) {
                                existingUser.teams.push(team.name);
                            }
                        }
                    }
                });
            } catch (error) {
                console.error(`Error fetching members for team ${team.name}:`, error);
            }
        }

        // Map'i array'e çevir
        const users = Array.from(allMembers.values());
        
        return { data: { value: users } };
    } catch (error) {
        console.error(`Error fetching project users for ${projectName}:`, error);
        return Promise.reject(error.data);
    }
};

// Kullanıcıya göre projeleri getir (user-project-list için)
export const GetUserProjects = async () => {
    try {
        const teamsWithMembersResponse = await GetAllTeamsWithMembers();
        const teams = teamsWithMembersResponse.data.value || [];
        
        // Kullanıcı -> Projeler mapping'i oluştur
        const userProjectsMap = new Map();
        
        teams.forEach(team => {
            team.members.forEach(member => {
                const identity = member.identity;
                if (identity && identity.id) {
                    if (!userProjectsMap.has(identity.id)) {
                        userProjectsMap.set(identity.id, {
                            id: identity.id,
                            displayName: identity.displayName || 'N/A',
                            uniqueName: identity.uniqueName || 'N/A',
                            imageUrl: identity.imageUrl || '',
                            projects: []
                        });
                    }
                    
                    const userProjects = userProjectsMap.get(identity.id);
                    
                    // Proje zaten listede yoksa ekle
                    const existingProject = userProjects.projects.find(p => p.projectName === team.projectName);
                    if (!existingProject) {
                        userProjects.projects.push({
                            projectId: team.projectId,
                            projectName: team.projectName,
                            teams: [team.name]
                        });
                    } else {
                        // Proje varsa, sadece takım ekle
                        if (!existingProject.teams.includes(team.name)) {
                            existingProject.teams.push(team.name);
                        }
                    }
                }
            });
        });
        
        // Map'i array'e çevir ve sırala
        const users = Array.from(userProjectsMap.values()).map(user => ({
            ...user,
            projectCount: user.projects.length,
            projectNames: user.projects.map(p => p.projectName).join(', '),
            teamCount: user.projects.reduce((sum, p) => sum + p.teams.length, 0)
        }));
        
        return { data: { value: users } };
    } catch (error) {
        console.error('Error fetching user projects:', error);
        return Promise.reject(error.data);
    }
};

// Loader fonksiyonları
export const TeamsLoader = async () => {
    try {
        const response = await GetAllTeams();
        return response?.data;
    } catch (error) {
        console.error(error);
        return { value: [] };
    }
};

export const ProjectUsersLoader = async ({ params }) => {
    try {
        const { projectName } = params;
        const response = await GetProjectUsers(projectName);
        return response?.data;
    } catch (error) {
        console.error(error);
        return { value: [] };
    }
};

export const UserProjectsLoader = async () => {
    try {
        const response = await GetUserProjects();
        return response?.data;
    } catch (error) {
        console.error(error);
        return { value: [] };
    }
};

