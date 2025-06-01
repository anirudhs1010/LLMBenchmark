import { z } from 'zod';

export const RatingSchema = z.object({
  clarity: z.number().min(1).max(10),
  relevance: z.number().min(1).max(10),
  coherence: z.number().min(1).max(10),
  creativity: z.number().min(1).max(10),
  overall: z.number().min(1).max(10),
});

export const RatePromptInputSchema = z.object({
  prompt: z.string(),
  generatedText: z.string(),
});

export const RatePromptOutputSchema = z.object({
  sonar: RatingSchema,
  r1: RatingSchema,
  llama: RatingSchema,
});

export type Rating = z.infer<typeof RatingSchema>;
export type RatePromptInput = z.infer<typeof RatePromptInputSchema>;
export type RatePromptOutput = z.infer<typeof RatePromptOutputSchema>; 