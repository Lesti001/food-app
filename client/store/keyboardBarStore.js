import { create } from 'zustand';

/**
 * Controls whether the global floating "Done" pill (KeyboardDismissBar) is
 * allowed to show. Modals that already have their own Cancel/Add/Save buttons
 * suppress it while open, so the pill only appears on plain screens (profile
 * fields, the search bar) where nothing else dismisses the keyboard.
 *
 * A counter (not a boolean) keeps it correct if more than one suppressor is
 * ever active at once.
 */
export const useKeyboardBarStore = create(() => ({ suppressCount: 0 }));

export function suppressKeyboardBar() {
  useKeyboardBarStore.setState((s) => ({ suppressCount: s.suppressCount + 1 }));
}

export function releaseKeyboardBar() {
  useKeyboardBarStore.setState((s) => ({ suppressCount: Math.max(0, s.suppressCount - 1) }));
}
