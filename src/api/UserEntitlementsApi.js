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
        return await axios.get(`${process.env.REACT_APP_API_VSAEX_URL}/_apis/userentitlements?api-version=7.1-preview.3`);
    } catch (error) {
        return Promise.reject(error.data);
    }
};
