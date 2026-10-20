// Lightweight skill normalisation. A production build swaps this for ESCO-based
// extraction (see docs/PLAN.md, Architecture); the interface stays the same.

const ALIASES: Record<string, string> = {
  js: "javascript",
  "node.js": "node",
  nodejs: "node",
  reactjs: "react",
  "react.js": "react",
  nextjs: "next.js",
  ms_excel: "excel",
  "microsoft excel": "excel",
  "ms excel": "excel",
  "google sheets": "google sheets",
  "power bi": "power bi",
  powerbi: "power bi",
  "customer care": "customer service",
  "customer relations": "customer service",
  "client service": "customer service",
  "social media marketing": "social media",
  "social media management": "social media",
  "search engine optimization": "seo",
  "facebook ads": "meta ads",
  "instagram ads": "meta ads",
  "ui/ux": "ui design",
  "ui/ux design": "ui design",
  "user experience": "user research",
  "data visualisation": "data visualization",
  "financial reports": "financial reporting",
  "bank reconciliation": "reconciliation",
  "account reconciliation": "reconciliation",
  "team work": "teamwork",
  "team player": "teamwork",
  "problem-solving": "problem solving",
  "communication skills": "communication",
  "verbal communication": "communication",
  "written communication": "communication",
  "g suite": "google workspace",
  "google suite": "google workspace",
  "ms office": "microsoft office",
  "microsoft office suite": "microsoft office",
};

export function normalizeSkill(raw: string): string {
  const s = raw.trim().toLowerCase().replace(/\s+/g, " ");
  return ALIASES[s] ?? s;
}

export function normalizeSkills(list: string[]): string[] {
  const out = new Set<string>();
  for (const s of list) {
    const n = normalizeSkill(s);
    if (n) out.add(n);
  }
  return [...out];
}

/** Returns true when the CV skill list covers the wanted skill (exact or token-contained). */
export function hasSkill(cvSkills: string[], wanted: string): boolean {
  const w = normalizeSkill(wanted);
  return cvSkills.some((s) => s === w || s.includes(w) || w.includes(s));
}

/** Pulls skill-like terms from free text by matching against a vocabulary. */
export function extractSkillsFromText(text: string, vocabulary: string[]): string[] {
  const lower = text.toLowerCase();
  return vocabulary.filter((v) => lower.includes(v.toLowerCase()));
}
