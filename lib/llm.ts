import OpenAI from 'openai';
import { z } from 'zod';

const apiKey = process.env.LLM_API_KEY || process.env.GROK_API_KEY || '';
const baseURL = process.env.LLM_BASE_URL || 'https://api.groq.com/openai/v1';

const strongModel = process.env.LLM_MODEL_STRONG || 'openai/gpt-oss-120b';
const fastModel = process.env.LLM_MODEL_FAST || 'qwen/qwen3.8-27b';
const visionModel = process.env.LLM_VISION_MODEL || 'openai/gpt-oss-120b';

const client = new OpenAI({
  apiKey,
  baseURL,
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{ type: 'text' | 'image_url'; text?: string; image_url?: { url: string } }>;
}

export async function chatComplete(
  messages: ChatMessage[],
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    json?: boolean;
    useFast?: boolean;
  } = {}
): Promise<string> {
  const model = options.model || (options.useFast ? fastModel : strongModel);

  const response = await client.chat.completions.create({
    model,
    messages: messages as any,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 2048,
    response_format: options.json ? { type: 'json_object' } : undefined,
  });

  return response.choices[0]?.message?.content || '';
}

export async function chatCompleteJson<T>(
  messages: ChatMessage[],
  schema: z.ZodSchema<T>,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    useFast?: boolean;
  } = {}
): Promise<T> {
  // Ensure prompt instructs JSON
  const systemReminder: ChatMessage = {
    role: 'system',
    content: 'You must respond ONLY with a single valid JSON object. No commentary, markdown wrappers or code blocks.',
  };

  const fullMessages = [systemReminder, ...messages];

  let raw = await chatComplete(fullMessages, { ...options, json: true });

  // Clean raw if it contains markdown triple backticks
  raw = cleanJsonString(raw);

  try {
    const parsed = JSON.parse(raw);
    return schema.parse(parsed);
  } catch (err) {
    // Retry once with error feedback
    const retryMessages: ChatMessage[] = [
      ...fullMessages,
      { role: 'assistant', content: raw },
      {
        role: 'user',
        content: `Your previous response failed JSON schema validation: ${(err as Error).message}. Provide ONLY the corrected valid JSON now.`,
      },
    ];

    const retryRaw = cleanJsonString(await chatComplete(retryMessages, { ...options, json: true }));
    const retryParsed = JSON.parse(retryRaw);
    return schema.parse(retryParsed);
  }
}

function cleanJsonString(str: string): string {
  let cleaned = str.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

export { strongModel, fastModel, visionModel };
