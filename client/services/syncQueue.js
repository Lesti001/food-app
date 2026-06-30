import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './api';

const QUEUE_KEY = 'sync_queue_v1';

let queue = null; // null = not loaded yet
let flushing = false;

async function loadQueue() {
  if (queue !== null) return queue;
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  queue = raw ? JSON.parse(raw) : [];
  return queue;
}

async function persistQueue() {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue ?? []));
}

export async function enqueue(operation) {
  await loadQueue();
  queue.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, ...operation });
  await persistQueue();
}

async function runOperation(op) {
  switch (op.type) {
    case 'addLogEntry':
      return apiClient.post('/log', op.payload);
    case 'deleteLogEntry':
      return apiClient.delete(`/log/${op.payload.id}`);
    case 'updateLogEntry':
      return apiClient.patch(`/log/${op.payload.id}`, { mealType: op.payload.mealType });
    case 'updateProfile':
      return apiClient.put('/profile', op.payload);
    case 'createPrivateFood':
      return apiClient.post('/foods/private', op.payload);
    default:
      return null;
  }
}

export async function flushQueue() {
  if (flushing) return;
  flushing = true;
  try {
    await loadQueue();
    while (queue.length > 0) {
      const op = queue[0];
      try {
        await runOperation(op);
        queue.shift();
        await persistQueue();
      } catch (err) {
        if (!err.response) {
          // Genuine network failure — stop here and retry on the next connectivity event
          break;
        }
        // Server rejected this operation (e.g. 404/400) — it will never succeed, drop it and keep going
        queue.shift();
        await persistQueue();
      }
    }
  } finally {
    flushing = false;
  }
}

export async function getQueueLength() {
  await loadQueue();
  return queue.length;
}
