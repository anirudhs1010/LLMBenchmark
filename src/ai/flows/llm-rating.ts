'use server';

/**
 * @fileOverview This file defines a flow for rating a prompt using Perplexity's Sonar and R1-1776 models.
 */

import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

interface ChatMessage {
  role: 'system' | 'user';
  content: string;
}

interface ChatRequest {
  model: string;
  messages: ChatMessage[];
}

const RatePromptInputSchema = z.object({
  prompt: z.string(),
  generatedText: z.string(),
});

const RatingSchema = z.object({
  clarity: z.number().min(1).max(10),
  relevance: z.number().min(1).max(10),
  coherence: z.number().min(1).max(10),
  creativity: z.number().min(1).max(10),
  overall: z.number().min(1).max(10),
});

const RatePromptOutputSchema = z.object({
  sonar: RatingSchema,
  r1: RatingSchema,
});

type RatePromptInput = z.infer<typeof RatePromptInputSchema>;
type RatePromptOutput = z.infer<typeof RatePromptOutputSchema>;

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

if (!PERPLEXITY_API_KEY) {
  throw new Error('PERPLEXITY_API_KEY environment variable is not set');
}

// This helper function sends a prompt and generated text to a specific Perplexity model (sonar or r1-1776),
// asks for a detailed rating, and parses the response as a JSON object with all the rating categories.
async function getModelRating(model: string, prompt: string, generatedText: string): Promise<z.infer<typeof RatingSchema>> {
  const bodyObj: ChatRequest = {
    model: model,
    messages: [
      {
        role: "system",
        content: "You are an expert AI prompt evaluator. Rate the following prompt and its generated text on a scale of 1-10 for each criterion. Respond with ONLY a JSON object containing the ratings."
      },
      {
        role: "user",
        content: `Prompt: ${prompt}\n\nGenerated Text: ${generatedText}\n\nRate the prompt and its generated text on:\n1. Clarity (how clear and understandable the prompt is)\n2. Relevance (how well the generated text matches the prompt)\n3. Coherence (how logical and well-structured the generated text is)\n4. Creativity (how original and imaginative the generated text is)\n5. Overall (overall quality of both prompt and generated text)\n\nRespond with ONLY a JSON object in this exact format:\n{"clarity": number,"relevance": number,"coherence": number,"creativity": number,"overall": number}`
      }
    ]
  };

  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyObj)
  };

  const response: Response = await fetch('https://api.perplexity.ai/chat/completions', options);
  const data: any = await response.json();

  if (!response.ok) {
    console.error('Perplexity API error:', data);
    throw new Error(data.error?.message || 'Failed to get rating from Perplexity API');
  }

  try {
    const content = data.choices[0].message.content;
    console.log(`Raw API response from ${model}:`, content);
    
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const ratings = JSON.parse(jsonMatch[0]);
    console.log(`Parsed ratings from ${model}:`, ratings);
    
    // Validate ratings
    const result = RatingSchema.parse(ratings);
    return result;
  } catch (error) {
    console.error(`Error parsing ratings from ${model}:`, error);
    throw new Error(`Failed to parse ratings from ${model} response`);
  }
}

// This is the main function that takes the user's prompt and generated text,
// gets ratings from both Perplexity Sonar and R1-1776 models in parallel,
// and returns a combined result with all rating categories for both models.
export async function ratePrompt(input: RatePromptInput): Promise<RatePromptOutput> {
  const { prompt, generatedText } = input;

  try {
    const [sonarRatings, r1Ratings] = await Promise.all([
      getModelRating('sonar', prompt, generatedText),
      getModelRating('r1-1776', prompt, generatedText)
    ]);

    return {
      sonar: sonarRatings,
      r1: r1Ratings
    };
  } catch (error) {
    console.error('Error getting ratings:', error);
    throw error;
  }
}
