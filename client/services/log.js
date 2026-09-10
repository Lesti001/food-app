// Daily food log — fully offline. The zustand `logStore` (persisted to
// AsyncStorage) is the single source of truth. These functions read from it
// and hand back plain data; the screens keep doing their own optimistic
// store updates (addEntry / removeEntry / moveEntry), so writes here stay
// side-effect free to avoid double-applying an entry.
import { useLogStore } from '../store/logStore';

function emptyDay(date) {
  return { date, entries: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } };
}

function newEntryId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function fetchDailyLog(date) {
  return useLogStore.getState().getCachedLog(date) ?? emptyDay(date);
}

// Returns the payload wrapped as a one-entry "day" with a freshly generated,
// unique id. The caller reads `result.entries[last]` and adds it to the store.
export async function addLogEntry(data) {
  const entry = { id: newEntryId(), ...data };
  return { entries: [entry] };
}

// The store already handles the move/delete optimistically in the screens,
// so there's nothing left to persist here.
export async function updateLogEntry() {
  return null;
}

export async function deleteLogEntry() {
  return null;
}

// Calendar view: total calories per day, computed from the local cache.
export async function fetchCalorieSummary(start, end) {
  const logsByDate = useLogStore.getState().logsByDate ?? {};
  return Object.values(logsByDate)
    .filter((log) => log?.date >= start && log?.date <= end)
    .map((log) => ({ date: log.date, calories: log.totals?.calories ?? 0 }));
}
