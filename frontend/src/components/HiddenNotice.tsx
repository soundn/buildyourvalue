"use client";
import type { HiddenSummary, Profile } from "@byv/core";

type Props = {
  hidden: HiddenSummary;
  profile: Profile;
  undone: { dealBreakers: string[]; salaryFloor: number | null };
  onChange: (next: Profile, undone: Props["undone"]) => void;
};

// "We hid 3 roles" with a one-tap undo per reason, so the preference filter is never a black
// box (BR-064). Showing a reason again removes it from the saved preferences; Restore puts it back.
export function HiddenNotice({ hidden, profile, undone, onChange }: Props) {
  const prefs = profile.preferences;
  const nothingHidden = hidden.total === 0;
  const nothingUndone = undone.dealBreakers.length === 0 && undone.salaryFloor === null;
  if (!prefs || (nothingHidden && nothingUndone)) return null;

  const withPrefs = (patch: Partial<NonNullable<Profile["preferences"]>>): Profile => ({ ...profile, preferences: { ...prefs, ...patch } });
  const naira = (n: number) => `\u20a6${n.toLocaleString("en-NG")}`;
  const parts: string[] = hidden.dealBreakers.map((d) => `${d.count} for ${d.label}`);
  if (hidden.salaryFloor && hidden.salaryFloor.count) parts.push(`${hidden.salaryFloor.count} paying under ${naira(hidden.salaryFloor.floor)}`);

  return (
    <div className="rounded-lg border border-[var(--line)] bg-white p-4 text-sm space-y-2" role="status">
      {!nothingHidden && (
        <p>
          We hid <strong>{hidden.total}</strong> {hidden.total === 1 ? "role" : "roles"} because of your answers: {parts.join(", ")}.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {hidden.dealBreakers.map((d) => (
          <button key={d.id} type="button" className="min-h-11 px-3 py-2 rounded-full border border-[var(--line)] bg-white" onClick={() => onChange(withPrefs({ dealBreakers: prefs.dealBreakers.filter((x) => x !== d.id) }), { ...undone, dealBreakers: [...undone.dealBreakers, d.id] })}>
            Show the {d.count} with {d.label}
          </button>
        ))}
        {hidden.salaryFloor && hidden.salaryFloor.count > 0 && (
          <button type="button" className="min-h-11 px-3 py-2 rounded-full border border-[var(--line)] bg-white" onClick={() => onChange(withPrefs({ minSalaryNgn: null }), { ...undone, salaryFloor: hidden.salaryFloor!.floor })}>
            Show the {hidden.salaryFloor.count} under {naira(hidden.salaryFloor.floor)}
          </button>
        )}
        {!nothingUndone && (
          <button type="button" className="min-h-11 px-3 py-2 rounded-full bg-[var(--brand)] text-white" onClick={() => onChange(withPrefs({ dealBreakers: [...prefs.dealBreakers, ...undone.dealBreakers], minSalaryNgn: undone.salaryFloor ?? prefs.minSalaryNgn }), { dealBreakers: [], salaryFloor: null })}>
            Undo, hide them again
          </button>
        )}
      </div>
    </div>
  );
}
