import { apiClient } from './api';
import { enqueue } from './syncQueue';

export async function fetchProfile() {
  try {
    const res = await apiClient.get('/profile');
    return res.data;
  } catch {
    // Offline or request failed — caller should keep the last cached profile
    return null;
  }
}

export async function updateProfile(data) {
  try {
    const res = await apiClient.put('/profile', data);
    return res.data;
  } catch (err) {
    if (!err.response) {
      // Network failure — queue it for when connectivity returns
      await enqueue({ type: 'updateProfile', payload: data });
    }
    return null;
  }
}
