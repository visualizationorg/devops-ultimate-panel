import axios from 'utils/axios';

export const Loader = async () => {
    try {
        const response = await GetAll();
        return response?.data;
    } catch (error) {
        console.error(error);
    }
};

export const GetAll = async () => {
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/_apis/projects?api-version=7.2-preview.4`);
    } catch (error) {
        return Promise.reject(error.data);
    }
};

export const GetBuildHistory = async (projectName) => {
    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/${projectName}/_apis/build/builds?api-version=7.1-preview.7`);
    } catch (error) {
        return Promise.reject(error.data);
    }
};

export const GetReleaseHistory = async (projectName) => {
    try {
        return await axios.get(`${process.env.REACT_APP_API_VSRM_URL}/${projectName}/_apis/release/releases?api-version=7.1-preview.8`);
    } catch (error) {
        return Promise.reject(error.data);
    }
};
