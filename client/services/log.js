import { apiClient } from './api';
import { MOCK_DAILY_LOG } from './mockData';

export async function fetchDailyLog(date) {
  try {
    const res = await apiClient.get(`/log/${date}`);
    return res.data;
  } catch {
    return { ...MOCK_DAILY_LOG, date };
  }
}

export async function addLogEntry(data) {
  try {
    const res = await apiClient.post('/log', data);
    return res.data;
  } catch {
    return null;
  }
}

export async function deleteLogEntry(id) {
  try {
    await apiClient.delete(`/log/${id}`);
  } catch {}
}
