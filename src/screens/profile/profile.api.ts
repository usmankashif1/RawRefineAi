import { apiClient } from '../../core/api/apiClient';
import type { ApiResponse } from '../../core/api/apiTypes';
import { ENDPOINTS } from '../../core/api/endpoints';
import type { UserProfile } from './profile.types';

export const fetchProfile = async (): Promise<UserProfile> => {
    const { data } = await apiClient.get<ApiResponse<UserProfile>>(ENDPOINTS.PROFILE.ME);
    return data.data;
};
