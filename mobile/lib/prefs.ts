import type { IntakePreferences } from "@byv/core";

// In-memory preference store for the prototype. Phase 2 persists this with the signed-in
// profile (Supabase), the same way the web app moves from localStorage.
let current: IntakePreferences | null = null;
const listeners = new Set<() => void>();

export function getPreferences() {
  return current;
}
export function setPreferences(p: IntakePreferences | null) {
  current = p;
  listeners.forEach((l) => l());
}
export function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
