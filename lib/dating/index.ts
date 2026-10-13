import { chatCompleteJson, chatComplete } from '../llm';
import { getDb } from '../db';
import { z } from 'zod';

export const ScreenResultSchema = z.object({
  score: z.number().min(0).max(100),
  shared: z.array(z.string()),
  tension: z.array(z.string()),
  rationale: z.string(),
});

export const VenueSchema = z.object({
  name: z.string(),
  city: z.string(),
  activity: z.string(),
  rationale: z.string(),
});

export const VerdictSchema = z.object({
  chemistry: z.number().min(0).max(100),
  what_clicked: z.string(),
  concerns: z.string(),
  would_see_again: z.boolean(),
  one_line_summary: z.string(),
});

export interface TurnMessage {
  speakerId: string;
  speakerName: string;
  text: string;
}

export async function runQuickScreen(
  profileA: any,
  profileB: any
): Promise<z.infer<typeof ScreenResultSchema>> {
  const prompt = `Perform a high-level compatibility screen between two prospective dating profiles:

PERSON A:
Name: ${profileA.name}
City: ${profileA.city}
Summary: ${profileA.summary}
Needs: ${JSON.stringify(profileA.needs?.map((n: any) => n.label) || [])}
Interests: ${JSON.stringify(profileA.interests?.map((i: any) => i.label) || [])}
Lifestyle: ${JSON.stringify(profileA.lifestyle?.map((l: any) => l.label) || [])}

PERSON B:
Name: ${profileB.name}
City: ${profileB.city}
Summary: ${profileB.summary}
Needs: ${JSON.stringify(profileB.needs?.map((n: any) => n.label) || [])}
Interests: ${JSON.stringify(profileB.interests?.map((i: any) => i.label) || [])}
Lifestyle: ${JSON.stringify(profileB.lifestyle?.map((l: any) => l.label) || [])}

Evaluate their mutual affinity. Output JSON with:
- score: integer 0 to 100
- shared: array of 2 to 4 shared interests/values
- tension: array of 1 to 2 friction points
- rationale: one-line summary`;

  return await chatCompleteJson(
    [{ role: 'user', content: prompt }],
    ScreenResultSchema,
    { useFast: true }
  );
}

export async function selectVenue(
  personA: any,
  personB: any
): Promise<z.infer<typeof VenueSchema>> {
  const prompt = `Choose a fictional but culturally plausible venue and activity for a first date between ${personA.name} and ${personB.name}.
Person A interests: ${JSON.stringify(personA.profile?.interests?.map((i: any) => i.label) || [])}
Person B interests: ${JSON.stringify(personB.profile?.interests?.map((i: any) => i.label) || [])}
Cities: ${personA.city} / ${personB.city}

Return JSON with:
- "name": venue name
- "city": realistic city matching either candidate
- "activity": short activity (e.g. "Natural wine tasting and vinyl listening")
- "rationale": one-line reason tied to their profile evidence`;

  return await chatCompleteJson(
    [{ role: 'user', content: prompt }],
    VenueSchema,
    { useFast: true }
  );
}

export async function simulateDateConversation(
  personA: any,
  personB: any,
  venue: z.infer<typeof VenueSchema>,
  onTurn?: (turn: TurnMessage) => void
): Promise<TurnMessage[]> {
  const turns: TurnMessage[] = [];
  const totalTurns = 10;

  for (let i = 0; i < totalTurns; i++) {
    const isATurn = i % 2 === 0;
    const speaker = isATurn ? personA : personB;
    const other = isATurn ? personB : personA;

    const transcriptText = turns.map((t) => `${t.speakerName}: ${t.text}`).join('\n');

    const systemPrompt = `You are roleplaying as ${speaker.name} on a first date with ${other.name} at ${venue.name} in ${venue.city} (${venue.activity}).
YOUR DATING PERSONA:
${speaker.profile?.dating_persona || 'Thoughtful, curious, and authentic.'}

PROFILE FACTS ABOUT YOU:
Summary: ${speaker.profile?.summary || ''}
Interests: ${(speaker.profile?.interests || []).map((x: any) => x.label).join(', ')}
Values: ${(speaker.profile?.values || []).map((x: any) => x.label).join(', ')}
Communication style: ${speaker.profile?.communication_style || 'Direct and warm'}

CRITICAL RULES:
1. Speak in first person naturally with your person's tone. Keep it to 1 to 3 conversational sentences.
2. ONLY state facts that appear in your profile. NEVER invent biography, jobs, trips, or names. If asked something unknown, deflect honestly ("I don't really talk about that").
3. Be curious about ${other.name} and react to what they said.
4. No stage directions or actions longer than 3 words.`;

    const userPrompt = transcriptText.length === 0
      ? `You just arrived at ${venue.name} and sit down across from ${other.name}. Say hello and break the ice.`
      : `Here is the conversation transcript so far:\n${transcriptText}\n\nRespond to ${other.name} naturally.`;

    const text = await chatComplete([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], { temperature: 0.8, maxTokens: 150 });

    const cleanText = text.replace(/^"|"$/g, '').trim();
    const turnMessage: TurnMessage = {
      speakerId: speaker.id,
      speakerName: speaker.name,
      text: cleanText,
    };

    turns.push(turnMessage);
    if (onTurn) onTurn(turnMessage);
  }

  return turns;
}

export async function debriefDate(
  agentPerson: any,
  otherPerson: any,
  venue: any,
  transcript: TurnMessage[]
): Promise<z.infer<typeof VerdictSchema>> {
  const transcriptText = transcript.map((t) => `${t.speakerName}: ${t.text}`).join('\n');
  const prompt = `You are ${agentPerson.name}'s private dating agent debriefing their date with ${otherPerson.name} at ${venue.name}.
${agentPerson.name}'s Persona:
${agentPerson.profile?.dating_persona}
Needs & Values:
${JSON.stringify(agentPerson.profile?.needs?.map((n: any) => n.label) || [])}

Date Transcript:
${transcriptText}

Evaluate how well ${otherPerson.name} met your person's needs and emotional frequency.
Output JSON with:
- "chemistry": 0-100 score
- "what_clicked": specific moment or alignment
- "concerns": friction or hesitation
- "would_see_again": boolean
- "one_line_summary": concise private summary`;

  return await chatCompleteJson(
    [{ role: 'user', content: prompt }],
    VerdictSchema,
    { temperature: 0.5 }
  );
}
