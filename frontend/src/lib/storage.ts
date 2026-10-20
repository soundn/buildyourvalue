import type { Profile } from "@byv/core";

// The prototype keeps the profile in the browser. The MVP moves it to Supabase behind
// phone-OTP auth; this module is the only place that changes.
const KEY = "byv.profile.v1";

export const emptyProfile: Profile = {
  basics: { name: "", email: "", phone: "", location: "", summary: "" },
  targetRole: "customer_support",
  workPreference: "any",
  work: [{ company: "", position: "", startDate: "", endDate: "", highlights: ["", "", ""] }],
  education: [{ institution: "", area: "", studyType: "BSc", endDate: "", grade: "" }],
  skills: [],
  certifications: [],
  nyscStatus: "completed",
};

export function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: Profile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* private mode or blocked storage: the session still works in memory */
  }
}

export function clearProfile() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
