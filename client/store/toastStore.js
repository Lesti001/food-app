import { create } from 'zustand';

export const useToastStore = create(() => ({ toast: null }));

let counter = 0;

function show(payload) {
  counter += 1;
  useToastStore.setState({ toast: { id: counter, duration: 3000, type: 'info', ...payload } });
}

export const toast = {
  success: (message, opts) => show({ type: 'success', message, ...opts }),
  error: (message, opts) => show({ type: 'error', message, duration: 4000, ...opts }),
  info: (message, opts) => show({ type: 'info', message, ...opts }),
};

export function dismissToast() {
  useToastStore.setState({ toast: null });
}
