import { z } from 'zod';

export const EvidenceSchema = z.object({
  source: z.enum(['linkedin', 'instagram']),
  ref: z.string(),
  quote_or_note: z.string(),
});

export const TraitItemSchema = z.object({
  label: z.string(),
  detail: z.string(),
  evidence: z.array(EvidenceSchema),
  confidence: z.number().min(0).max(1),
});

export const ProfileAnalysisSchema = z.object({
  summary: z.string(),
  needs: z.array(TraitItemSchema),
  hobbies: z.array(TraitItemSchema),
  interests: z.array(TraitItemSchema),
  values: z.array(TraitItemSchema),
  personality: z.array(TraitItemSchema),
  lifestyle: z.array(TraitItemSchema),
  communication_style: z.string(),
  relationship_signals: z.array(TraitItemSchema),
  friction_points: z.array(TraitItemSchema),
  dating_persona: z.string(),
  overall_confidence: z.number().min(0).max(1),
  data_quality: z.enum(['rich', 'ok', 'thin']),
});

export type ProfileAnalysis = z.infer<typeof ProfileAnalysisSchema>;
export type TraitItem = z.infer<typeof TraitItemSchema>;
