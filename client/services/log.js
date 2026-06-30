import { apiClient } from './api';
import { enqueue } from './syncQueue';
import { useLogStore } from '../store/logStore';

function emptyDay(date) {
  return { date, entries: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } };
}

export async function fetchDailyLog(date) {
  try {
    const res = await apiClient.get(`/log/${date}`);
    return res.data;
  } catch {
    // Offline or request failed — fall back to the last cached version of this day
    return useLogStore.getState().getCachedLog(date) ?? emptyDay(date);
  }
}

export async function addLogEntry(data) {
  try {
    const res = await apiClient.post('/log', data);
    return res.data;
  } catch (err) {
    if (!err.response) {
      await enqueue({ type: 'addLogEntry', payload: data });
    }
    return null;
  }
}

export async function fetchCalorieSummary(start, end) {
  try {
    const res = await apiClient.get('/log/summary', { params: { start, end } });
    return res.data;
  } catch {
    return [];
  }
}

export async function updateLogEntry(id, mealType) {
  try {
    const res = await apiClient.patch(`/log/${id}`, { mealType });
    return res.data;
  } catch (err) {
    if (!err.response) {
      await enqueue({ type: 'updateLogEntry', payload: { id, mealType } });
    }
    return null;
  }
}

export async function deleteLogEntry(id) {
  try {
    await apiClient.delete(`/log/${id}`);
  } catch (err) {
    if (!err.response) {
      await enqueue({ type: 'deleteLogEntry', payload: { id } });
    }
  }
}
