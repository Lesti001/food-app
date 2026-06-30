import NetInfo from '@react-native-community/netinfo';
import { flushQueue } from './syncQueue';

let unsubscribe = null;

export function startNetworkSync() {
  if (unsubscribe) return;

  // Try once on startup in case there's leftover queued work from before the app was closed
  flushQueue();

  unsubscribe = NetInfo.addEventListener((state) => {
    if (state.isConnected && state.isInternetReachable !== false) {
      flushQueue();
    }
  });
}

export function stopNetworkSync() {
  unsubscribe?.();
  unsubscribe = null;
}
