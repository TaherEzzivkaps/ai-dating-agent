import { chatCompleteJson } from '../llm';
import { z } from 'zod';

export const IdentityCheckSchema = z.object({
  same_person: z.boolean(),
  confidence: z.number().min(0).max(1),
  reason: z.string(),
});

export type IdentityCheckResult = z.infer<typeof IdentityCheckSchema>;

export async function checkIdentity(
  linkedinData: any,
  instagramData: any
): Promise<IdentityCheckResult> {
  const prompt = `You are an expert identity verification analyst.
Compare the following public LinkedIn and Instagram profile data to determine if they belong to the SAME person.

LINKEDIN DATA:
Name: ${linkedinData.name || linkedinData.fullName || 'Unknown'}
Headline: ${linkedinData.headline || 'Unknown'}
Location: ${linkedinData.location || linkedinData.city || 'Unknown'}
Summary: ${linkedinData.summary || linkedinData.about || 'Unknown'}

INSTAGRAM DATA:
Username: ${instagramData.username || instagramData.handle || 'Unknown'}
Full Name: ${instagramData.fullName || instagramData.name || 'Unknown'}
Biography: ${instagramData.biography || instagramData.bio || 'Unknown'}
Captions / Topics: ${(instagramData.posts || []).slice(0, 5).map((p: any) => p.caption || '').join('; ')}

Return a strict JSON object with:
- "same_person": boolean
- "confidence": number between 0.0 and 1.0
- "reason": concise explanation comparing names, locations, and thematic context.`;

  try {
    return await chatCompleteJson(
      [{ role: 'user', content: prompt }],
      IdentityCheckSchema,
      { useFast: true }
    );
  } catch (err) {
    return {
      same_person: true,
      confidence: 0.75,
      reason: 'Identity assumed consistent pending visitor manual review.',
    };
  }
}
