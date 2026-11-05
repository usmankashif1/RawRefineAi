import { apiClient } from '../../core/api/apiClient';
import type { ApiResponse } from '../../core/api/apiTypes';
import { ENDPOINTS } from '../../core/api/endpoints';
import type { LoginPayload, LoginResponse } from './auth.types';

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>(ENDPOINTS.AUTH.LOGIN, payload);
    return data.data;
};
