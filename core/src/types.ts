// Core domain types for the prototype. The CV shape is a pragmatic subset of the
// JSON Resume schema so a future export to the full schema is a straight mapping.

export type WorkEntry = {
  company: string;
  position: string;
  startDate: string; // YYYY-MM
  endDate?: string; // YYYY-MM or empty for present
  highlights: string[];
};

export type EducationEntry = {
  institution: string;
  area: string; // field of study
  studyType: string; // BSc, HND, OND, MSc...
  endDate?: string; // YYYY
  grade?: string;
};

export type Profile = {
  basics: {
    name: string;
    email: string;
    phone: string;
    location: string; // city, state
    summary: string;
  };
  targetRole: string; // role id from roles.json
  workPreference: "onsite" | "hybrid" | "remote" | "any";
  work: WorkEntry[];
  education: EducationEntry[];
  skills: string[];
  certifications: string[];
  nyscStatus: "completed" | "serving" | "exempted" | "not_yet" | "na";
  preferences?: IntakePreferences; // from the guided intake; the matcher honours the salary floor
};

export type IntakePreferences = {
  targetRoles: string[];
  helpChoosing: boolean;
  interests: string[];
  workPreference: "onsite" | "hybrid" | "remote" | "any";
  remoteAbroad: boolean;
  experienceBand: "none" | "under_1" | "1_3" | "3_5" | "5_plus";
  minSalaryNgn: number | null;
  wantsDollarPay: boolean;
  dealBreakers: string[];
  mustHaves: string[];
  startWithinDays: number | null;
};

export type Job = {
  id: string;
  title: string;
  company: string;
  companyDomain?: string; // e.g. "flutterwave.com"; missing is a scam signal
  location: string;
  workType: "onsite" | "hybrid" | "remote";
  salaryMin?: number; // NGN per month
  salaryMax?: number;
  experienceYears: number; // minimum required
  skills: string[];
  description: string;
  applyUrl: string;
  contactEmail?: string;
  postedAt: string; // YYYY-MM-DD
  source: string; // where the listing was ingested from
  roleIds: string[];
};

export type Role = {
  id: string;
  title: string;
  family: string;
  coreSkills: string[];
  niceToHave: string[];
  keywords: string[]; // ATS-style keywords expected on a CV for this role
};

export type Course = {
  id: string;
  title: string;
  provider: string;
  url: string;
  skills: string[];
  hours: number;
  cost: "free" | "free_with_aid" | "paid";
  priceNgn?: number;
  certificate: boolean;
  affiliate: boolean;
};

export type ScoreComponent = {
  id:
    | "keywords"
    | "impact"
    | "completeness"
    | "experience_fit"
    | "certifications"
    | "format";
  label: string;
  score: number; // 0-100
  weight: number; // sums to 1 across components
  finding: string; // one plain-language explanation
  fix: string; // what to do about it
  missingSkills?: string[];
};

export type WeaknessReport = {
  total: number; // 0-100
  band: "weak" | "developing" | "competitive" | "strong";
  components: ScoreComponent[];
  missingSkills: string[];
};

export type ScamVerdict = {
  status: "pass" | "review" | "fail";
  flags: string[];
};

export type Match = {
  job: Job;
  fit: number; // 0-100
  reasons: string[]; // "why you fit"
  gaps: string[]; // skills the job wants that the CV lacks
  scam: ScamVerdict;
  eligibility?: { verdict: "open" | "restricted" | "unclear"; reasons: string[] }; // remote listings only (BR-062)
};

export type LearningStep = {
  step: number;
  skill: string;
  course: Course;
  why: string;
};

export type LearningPath = {
  targetRole: string;
  steps: LearningStep[];
  estimatedHours: number;
  projectedFitLift: number; // percentage points added to the average fit score
};
