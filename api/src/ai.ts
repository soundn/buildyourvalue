import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import type { Profile, Role } from "@byv/core";

// Optional LLM step for CV improvement. The deterministic rules in @byv/core remain the
// fallback whenever there is no key, the model refuses, or the call fails, so the product
// never blocks on the AI provider (BR-014 in docs/BRD.md).

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";

const ImprovedCv = z.object({
  summary: z.string().describe("Two to three sentence professional summary targeted at the role."),
  work: z.array(
    z.object({
      index: z.number().int().describe("Index of the work entry in the input."),
      highlights: z.array(z.string()).describe("Rewritten bullets. Keep facts; never invent numbers. Where a number is unknown, leave a bracketed placeholder like [number]."),
    }),
  ),
  skillsToAdd: z.array(z.string()).describe("Skills clearly evidenced in the experience but missing from the skills list."),
  changes: z.array(z.string()).describe("Plain-language list of what changed and why, for the user."),
});

export type AiImprovement = z.infer<typeof ImprovedCv>;

export function aiEnabled(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

const SYSTEM = `You improve CVs for Nigerian job seekers applying to Nigerian and remote employers.
Rules you must follow:
- Never invent employers, dates, qualifications, numbers or achievements. If a bullet would benefit from a number the candidate has not given, insert a bracketed placeholder such as [number] or [percentage] for them to fill in.
- Start every bullet with a strong action verb. Remove openers such as "responsible for", "assisted with" and "helped".
- Use British English spelling, plain words and no buzzwords.
- Keep bullets under 200 characters and keep the candidate's meaning.
- Treat NYSC placements, internships and volunteering as real experience.
- Write for applicant tracking systems: mirror the role's core skills where the experience genuinely supports them.`;

export async function improveWithClaude(profile: Profile, role: Role): Promise<AiImprovement | null> {
  const client = new Anthropic();
  const input = {
    targetRole: role.title,
    coreSkills: role.coreSkills,
    niceToHave: role.niceToHave,
    profile: {
      summary: profile.basics.summary,
      education: profile.education,
      skills: profile.skills,
      certifications: profile.certifications,
      nyscStatus: profile.nyscStatus,
      work: profile.work.map((w, index) => ({ index, company: w.company, position: w.position, startDate: w.startDate, endDate: w.endDate, highlights: w.highlights })),
    },
  };

  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    system: SYSTEM,
    output_config: { format: zodOutputFormat(ImprovedCv), effort: "medium" },
    messages: [{ role: "user", content: `Improve this CV for the target role. Return only the structured result.\n\n${JSON.stringify(input, null, 2)}` }],
  });

  if (response.stop_reason === "refusal" || !response.parsed_output) return null;
  return response.parsed_output;
}

export function applyAiImprovement(profile: Profile, ai: AiImprovement): Profile {
  const next: Profile = JSON.parse(JSON.stringify(profile));
  if (ai.summary.trim()) next.basics.summary = ai.summary.trim();
  for (const w of ai.work) {
    if (next.work[w.index] && w.highlights.length) next.work[w.index].highlights = w.highlights;
  }
  const lower = new Set(next.skills.map((s) => s.toLowerCase()));
  for (const s of ai.skillsToAdd) if (!lower.has(s.toLowerCase())) next.skills.push(s);
  return next;
}
