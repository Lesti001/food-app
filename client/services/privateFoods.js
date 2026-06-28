import { apiClient } from './api';

export async function fetchPrivateFoods() {
  const res = await apiClient.get('/foods/private');
  return res.data;
}

export async function createPrivateFood({ name, brand, calories, protein, carbs, fat }) {
  const res = await apiClient.post('/foods/private', { name, brand, calories, protein, carbs, fat });
  return res.data;
}

export async function deletePrivateFood(id) {
  await apiClient.delete(`/foods/private/${id}`);
}
