import axios from 'axios';

import { openSnackbar } from 'api/snackbar';
import { getStorageValue, STORAGE_KEYS } from './storage';

const axiosServices = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

// ==============================|| AXIOS CONFIG ||============================== //

axiosServices.interceptors.request.use(
  async (config) => {
    const pat = getStorageValue(STORAGE_KEYS.PAT, '');
    if (pat) {
      const token = btoa(`:${pat}`);
      config.headers['Authorization'] = `Basic ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      openSnackbar({
        open: true,
        close: true,
        message: response.data.message,
        variant: 'alert',
        alert: {
          severity: 'error',
          color: 'error'
        }
      });
      return Promise.reject(response);
    }
    return response;
  },
  (error) => {
    // if (error.response?.status === 401 && !window.location.href.includes('/')) {
    //   openSnackbar({
    //     open: true,
    //     close: true,
    //     message: error.response.message,
    //     variant: 'alert',
    //     alert: {
    //       severity: 'error',
    //       color: 'error'
    //     }
    //   });
    //   window.location.href = '/';
    // }
    // if (error.response?.status === 403) {
    //   openSnackbar({
    //     open: true,
    //     close: true,
    //     message: error.response.message,
    //     variant: 'alert',
    //     alert: {
    //       severity: 'error',
    //       color: 'error'
    //     }
    //   });
    //   window.location.href = '/dashboard';
    // }
    // if (error.response?.status === 404) {
    //   window.location.href = '/error/404';
    // }
    // if (error.response?.status === 500) {
    //   window.location.href = '/error/500';
    // }
    // // axios 10 error codes = ERR_FR_TOO_MANY_REDIRECTS, ERR_BAD_OPTION_VALUE, ERR_BAD_OPTION, ERR_NETWORK, ERR_DEPRECATED, ERR_BAD_RESPONSE, ERR_BAD_REQUEST, ERR_CANCELED, ECONNABORTED, ETIMEDOUT
    // if (error.code === 'ERR_BAD_REQUEST') {
    //   openSnackbar({
    //     open: true,
    //     close: true,
    //     message: error.message,
    //     variant: 'alert',
    //     alert: {
    //       severity: 'error',
    //       color: 'error'
    //     }
    //   });
    //   return Promise.reject(error);
    // }
    // if (error.code === 'ERR_NETWORK') {
    //   localStorage.clear();
    //   openSnackbar({
    //     open: true,
    //     close: true,
    //     message: error.message,
    //     variant: 'alert',
    //     alert: {
    //       severity: 'error',
    //       color: 'error'
    //     }
    //   });
    //   window.location.pathname !== '/' && (window.location.href = '/');
    //   return Promise.reject(error);
    // }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

export default axiosServices;

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.post(url, { ...config });

  return res.data;
};
