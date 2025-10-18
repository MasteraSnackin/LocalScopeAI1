'use server';

/**
 * @fileOverview A flow for generating suggested questions based on the report and user interactions.
 *
 * - generateSuggestedQuestions - A function that generates suggested questions for the AI chat.
 * - GenerateSuggestedQuestionsInput - The input type for the generateSuggestedQuestions function.
 * - GenerateSuggestedQuestionsOutput - The return type for the generateSuggestedQuestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSuggestedQuestionsInputSchema = z.object({
  reportSummary: z
    .string()
    .describe('A summary of the generated report for the local area.'),
  userHistory: z
    .string()
    .optional()
    .describe('The history of the user interactions in the chat.'),
});

export type GenerateSuggestedQuestionsInput = z.infer<
  typeof GenerateSuggestedQuestionsInputSchema
>;

const GenerateSuggestedQuestionsOutputSchema = z.object({
  suggestedQuestions: z
    .array(z.string())
    .describe('An array of suggested questions for the user.'),
});

export type GenerateSuggestedQuestionsOutput = z.infer<
  typeof GenerateSuggestedQuestionsOutputSchema
>;

function buildPrompt(input: GenerateSuggestedQuestionsInput): string {
  const { reportSummary, userHistory = '' } = input;
  return `You are an AI assistant that suggests relevant questions to the user based on a report summary and the user's chat history.

Report Summary: ${reportSummary}
User History: ${userHistory}

Generate a list of suggested questions that the user might find helpful to further explore the local area. Focus on extracting key topics to build these questions.

Format the questions as a JSON array of strings. Limit the list to 5 questions.`;
}

export async function generateSuggestedQuestions(
  input: GenerateSuggestedQuestionsInput
): Promise<GenerateSuggestedQuestionsOutput> {
  const prompt = buildPrompt(input);
  const { text } = await ai.generate({ prompt });
  try {
    const suggestedQuestions = JSON.parse(text);
    return {
      suggestedQuestions: Array.isArray(suggestedQuestions) ? suggestedQuestions : [],
    };
  } catch {
    return {
      suggestedQuestions: [],
    };
  }
}
