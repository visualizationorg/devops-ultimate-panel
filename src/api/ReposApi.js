import axios from 'utils/axios';

export const GetAll = async (projectName) => {
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/${projectName}/_apis/git/repositories?api-version=7.1-preview.1`);
    } catch (error) {
        return Promise.reject(error.data);
    }
};

export const GetCommits = async (projectName, repoId) => {
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/${projectName}/_apis/git/repositories/${repoId}/commits?/commits?api-version=7.1-preview.1`);
    } catch (error) {
        return Promise.reject(error.data);
    }
};
