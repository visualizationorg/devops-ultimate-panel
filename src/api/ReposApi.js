import axios from 'utils/axios';
import { getStorageValue, STORAGE_KEYS } from 'utils/storage';

export const GetAll = async (projectName) => {
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/${getStorageValue(STORAGE_KEYS.ORGANIZATION, '')}/${projectName}/_apis/git/repositories?api-version=7.1-preview.1`);
    } catch (error) {
        return Promise.reject(error.data);
    }
};

export const GetCommits = async (projectName, repoId) => {
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/${getStorageValue(STORAGE_KEYS.ORGANIZATION, '')}/${projectName}/_apis/git/repositories/${repoId}/commits?api-version=7.1-preview.1`);
    } catch (error) {
        return Promise.reject(error.data);
    }
};
