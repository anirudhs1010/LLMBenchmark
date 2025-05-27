'use server';

/**
 * @fileOverview This file defines a Genkit flow for rating a prompt using Llama, DeepSeek, and Mistral distilled models.
 *
 * - ratePrompt - A function that takes a prompt as input and returns ratings from the three models.
 * - RatePromptInput - The input type for the ratePrompt function.
 * - RatePromptOutput - The return type for the ratePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RatePromptInputSchema = z.object({
  prompt: z.string().describe('The prompt to be rated by the LLMs.'),
});
export type RatePromptInput = z.infer<typeof RatePromptInputSchema>;

const RatePromptOutputSchema = z.object({
  llamaRating: z.number().describe('The rating from the Llama model (1-10).'),
  deepSeekRating: z.number().describe('The rating from the DeepSeek model (1-10).'),
  mistralRating: z.number().describe('The rating from the Mistral model (1-10).'),
});
export type RatePromptOutput = z.infer<typeof RatePromptOutputSchema>;

export async function ratePrompt(input: RatePromptInput): Promise<RatePromptOutput> {
  return ratePromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ratePromptPrompt',
  input: {schema: RatePromptInputSchema},
  output: {schema: RatePromptOutputSchema},
  prompt: `You are a panel of expert judges that can be used for Benchmarking other large language models.

You will use the input prompt to evaluate the prompt, and assign a rating from 1 to 10.

Rate Llama, DeepSeek and Mistral distilled models.

Prompt: {{{prompt}}}`,
});

const ratePromptFlow = ai.defineFlow(
  {
    name: 'ratePromptFlow',
    inputSchema: RatePromptInputSchema,
    outputSchema: RatePromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
