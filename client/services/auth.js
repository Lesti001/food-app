import { apiClient } from './api';
import * as SecureStore from 'expo-secure-store';

export async function login(username, password) {
  const res = await apiClient.post('/auth/login', { username, password });
  const { token, user } = res.data;
  await SecureStore.setItemAsync('auth_token', token);
  await SecureStore.setItemAsync('auth_user', JSON.stringify(user));
  return { token, user };
}

export async function register(name, username, password) {
  const res = await apiClient.post('/auth/register', { name, username, password });
  const { token, user } = res.data;
  await SecureStore.setItemAsync('auth_token', token);
  await SecureStore.setItemAsync('auth_user', JSON.stringify(user));
  return { token, user };
}

export async function logout() {
  await SecureStore.deleteItemAsync('auth_token');
  await SecureStore.deleteItemAsync('auth_user');
}
