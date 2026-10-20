import type { Course, Job, Profile, Role } from "../types.js";
import rolesJson from "./roles.json" with { type: "json" };
import jobsJson from "./jobs.json" with { type: "json" };
import coursesJson from "./courses.json" with { type: "json" };

// Sample data for the prototype. Listings, companies and domains are fictional
// (scam fixtures imitate real fraud patterns, including brand impersonation, on purpose).
export const roles = rolesJson as Role[];
export const jobs = jobsJson as Job[];
export const courses = coursesJson as Course[];

export const sampleProfile: Profile = {
  basics: {
    name: "Adaeze Okonkwo",
    email: "adaeze.okonkwo@example.com",
    phone: "08031234567",
    location: "Lagos, Lagos",
    summary: "",
  },
  targetRole: "customer_support",
  workPreference: "any",
  work: [
    {
      company: "Sunrise Pharmacy",
      position: "Sales Attendant (NYSC placement)",
      startDate: "2025-03",
      endDate: "2026-02",
      highlights: [
        "Responsible for attending to customers and processing sales",
        "Helped with stock counting at month end",
        "Handled customer complaints and WhatsApp enquiries",
      ],
    },
  ],
  education: [
    { institution: "University of Nigeria, Nsukka", area: "Mass Communication", studyType: "BSc", endDate: "2024", grade: "Second Class Upper" },
  ],
  skills: ["Communication skills", "MS Excel", "Team player", "Social media"],
  certifications: [],
  nyscStatus: "completed",
};
