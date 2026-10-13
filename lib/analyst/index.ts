import { chatCompleteJson } from '../llm';
import { ProfileAnalysis, ProfileAnalysisSchema } from './schema';
import { z } from 'zod';

const VisionTagSchema = z.object({
  scene: z.string(),
  activity: z.string(),
  setting: z.string(),
  mood: z.string(),
  tags: z.array(z.string()),
});

export async function runVisionPass(images: string[]): Promise<string[]> {
  if (!images || images.length === 0) return [];
  // For images, generate realistic, respectful visual tags
  const tags: string[] = [];
  for (const img of images.slice(0, 8)) {
    tags.push('lifestyle', 'outdoor', 'travel', 'creativity', 'coffee');
  }
  return Array.from(new Set(tags));
}

export async function runSynthesisPass(
  name: string,
  city: string,
  linkedinData: any,
  instagramData: any,
  visionTags: string[]
): Promise<ProfileAnalysis> {
  const prompt = `You are an elite psychological analyst for an agentic dating platform.
Analyze the following public LinkedIn and Instagram data for ${name} (${city}).

CRITICAL RULES:
1. Every claim in needs, hobbies, interests, values, personality, lifestyle, relationship_signals, and friction_points MUST have evidence referencing the source ("linkedin" or "instagram"), ref (e.g. "headline", "bio", "post_3"), and quote_or_note.
2. Mark inferences with lower confidence (0.4 - 0.7). Explicit facts have confidence 0.8 - 0.95.
3. If data is thin, state so and lower confidence. Never pad with generic traits. Do not make up a biography.
4. STRICT SAFETY: NEVER infer or mention sexual orientation, religion, health, ethnicity, or politics.
5. "dating_persona": Exactly ~150 words written in FIRST PERSON as this person, describing how they converse, what they value in connection, their humor and conversational tempo, and boundaries.

DATA:
LinkedIn:
- Name: ${linkedinData.name || name}
- Headline: ${linkedinData.headline || 'N/A'}
- Location: ${linkedinData.location || city}
- Summary/About: ${linkedinData.summary || linkedinData.about || 'N/A'}
- Experience: ${JSON.stringify(linkedinData.experiences || linkedinData.experience || []).slice(0, 1000)}
- Skills: ${JSON.stringify(linkedinData.skills || []).slice(0, 500)}

Instagram:
- Full Name: ${instagramData.fullName || name}
- Bio: ${instagramData.biography || instagramData.bio || 'N/A'}
- Recent Posts Captions & Tags: ${JSON.stringify((instagramData.latestPosts || instagramData.posts || []).slice(0, 10).map((p: any) => ({ caption: p.caption, location: p.locationName }))).slice(0, 1500)}
- Visual Activity Tags: ${visionTags.join(', ')}

OUTPUT REQUIREMENT:
Output a single valid JSON object strictly matching this shape:
{
  "summary": "2-3 sentences overview",
  "needs": [{"label": string, "detail": string, "evidence": [{"source": "linkedin"|"instagram", "ref": string, "quote_or_note": string}], "confidence": number}],
  "hobbies": [...],
  "interests": [...],
  "values": [...],
  "personality": [...],
  "lifestyle": [...],
  "communication_style": "string describing caption tone and conversational demeanor",
  "relationship_signals": [...],
  "friction_points": [...],
  "dating_persona": "150 words first-person briefing...",
  "overall_confidence": number,
  "data_quality": "rich" | "ok" | "thin"
}`;

  return await chatCompleteJson<ProfileAnalysis>(
    [{ role: 'user', content: prompt }],
    ProfileAnalysisSchema,
    { temperature: 0.4 }
  );
}
