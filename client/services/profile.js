import { apiClient } from './api';
import { MOCK_PROFILE } from './mockData';

export async function fetchProfile() {
  try {
    const res = await apiClient.get('/profile');
    return res.data;
  } catch {
    return MOCK_PROFILE;
  }
}

export async function updateProfile(data) {
  try {
    const res = await apiClient.put('/profile', data);
    return res.data;
  } catch {
    return { ...MOCK_PROFILE, ...data };
  }
}
