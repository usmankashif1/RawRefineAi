// import axios from 'axios';
// import { API_BASE_URL } from '../utils/config';
// import { getToken } from '../utils/tokenStorage';
// import { toApiError } from './apiError';

// export const apiClient = axios.create({
//     baseURL: API_BASE_URL,
//     timeout: 15000,
//     headers: { 'Content-Type': 'application/json' },
// });

// apiClient.interceptors.request.use(async config => {
//     const token = await getToken();
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// apiClient.interceptors.response.use(
//     response => response,
//     error => Promise.reject(toApiError(error)),
// );
