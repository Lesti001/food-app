// Profile & goals — fully offline. The zustand `profileStore` (persisted to
// AsyncStorage) is the source of truth. These helpers just mirror updates into
// it so callers keep a stable, promise-based API.
import { useProfileStore } from '../store/profileStore';

export async function fetchProfile() {
  return useProfileStore.getState().profile;
}

export async function updateProfile(data) {
  useProfileStore.getState().updateProfile(data);
  return useProfileStore.getState().profile;
}
