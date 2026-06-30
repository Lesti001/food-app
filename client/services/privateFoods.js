import { apiClient } from './api';
import { enqueue } from './syncQueue';

export async function fetchPrivateFoods() {
  const res = await apiClient.get('/foods/private');
  return res.data;
}

export async function createPrivateFood(payload) {
  try {
    const res = await apiClient.post('/foods/private', payload);
    return res.data;
  } catch (err) {
    if (!err.response) {
      await enqueue({ type: 'createPrivateFood', payload });
      return null;
    }
    throw err;
  }
}

export async function deletePrivateFood(id) {
  await apiClient.delete(`/foods/private/${id}`);
}
