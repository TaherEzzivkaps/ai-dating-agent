import { chatCompleteJson } from '../llm';
import { z } from 'zod';

const ExplanationSchema = z.object({
  why_fits: z.string(),
  watch_out: z.string(),
});

export function calculateScore(
  screenScore: number,
  pVerdictScore?: number,
  cVerdictScore?: number
): { score: number; isFullDate: boolean } {
  if (pVerdictScore !== undefined && cVerdictScore !== undefined) {
    const score = 0.55 * pVerdictScore + 0.2 * cVerdictScore + 0.25 * screenScore;
    return { score: Math.round(score * 10) / 10, isFullDate: true };
  }
  return { score: Math.round(screenScore * 0.8 * 10) / 10, isFullDate: false };
}

export async function generateRankingExplanation(
  person: any,
  candidate: any,
  score: number,
  isFullDate: boolean
): Promise<{ why_fits: string; watch_out: string }> {
  const prompt = `Generate a concise compatibility explanation between ${person.name} and ${candidate.name} (Calculated Score: ${score}%).

${person.name}:
Needs: ${JSON.stringify(person.profile?.needs?.map((n: any) => n.label) || [])}
Interests: ${JSON.stringify(person.profile?.interests?.map((i: any) => i.label) || [])}
Values: ${JSON.stringify(person.profile?.values?.map((v: any) => v.label) || [])}

${candidate.name}:
Needs: ${JSON.stringify(candidate.profile?.needs?.map((n: any) => n.label) || [])}
Interests: ${JSON.stringify(candidate.profile?.interests?.map((i: any) => i.label) || [])}
Values: ${JSON.stringify(candidate.profile?.values?.map((v: any) => v.label) || [])}

Output a JSON object with:
- "why_fits": 2 to 3 sentences referencing specific concrete commonalities or evidence.
- "watch_out": Exactly 1 sentence pointing out potential schedule, lifestyle, or personality friction.`;

  try {
    return await chatCompleteJson(
      [{ role: 'user', content: prompt }],
      ExplanationSchema,
      { useFast: true }
    );
  } catch (err) {
    return {
      why_fits: `Strong mutual resonance across shared interests and complementary conversational styles. Both display high curiosity and ambition.`,
      watch_out: `Potential friction in balancing busy career priorities and independent social calendars.`,
    };
  }
}
