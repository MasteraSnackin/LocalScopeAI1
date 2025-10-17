'use server';
/**
 * @fileOverview Implements the chat with AI flow for answering questions about a location.
 *
 * - chatWithAiAboutLocation - A function that handles the chat with AI process.
 * - ChatWithAiAboutLocationInput - The input type for the chatWithAiAboutLocation function.
 * - ChatWithAiAboutLocationOutput - The return type for the chatWithAiAboutLocation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatWithAiAboutLocationInputSchema = z.object({
  postcode: z.string().describe('The postcode of the location.'),
  question: z.string().describe('The question to ask about the location.'),
  reportData: z.string().describe('The generated report data for the location.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The chat history with the AI.').default([]),
});
export type ChatWithAiAboutLocationInput = z.infer<typeof ChatWithAiAboutLocationInputSchema>;

const ChatWithAiAboutLocationOutputSchema = z.object({
  answer: z.string().describe('The AI generated answer to the question.'),
  citations: z.array(z.string()).describe('Citations for the answer.'),
  suggestedQuestions: z.array(z.string()).describe('Suggested questions to ask next.'),
});
export type ChatWithAiAboutLocationOutput = z.infer<typeof ChatWithAiAboutLocationOutputSchema>;

export async function chatWithAiAboutLocation(input: ChatWithAiAboutLocationInput): Promise<ChatWithAiAboutLocationOutput> {
  return chatWithAiAboutLocationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithAiAboutLocationPrompt',
  input: {schema: ChatWithAiAboutLocationInputSchema},
  output: {schema: ChatWithAiAboutLocationOutputSchema},
  prompt: `You are an AI assistant specialized in providing information about UK locations based on a generated report. Use the report data to answer user questions accurately and concisely. Provide citations where possible.

Report Data:
{{reportData}}

Chat History:
{{#each chatHistory}}
{{#ifEquals role "user"}}User: {{content}}{{
else}}Assistant: {{content}}{{/ifEquals}}
{{/each}}

Question: {{question}}

Answer in a comprehensive manner, and if possible, cite the sources from the \"Citations\" section of the report data.

Output should include the \"answer\", \"citations\", and \"suggestedQuestions\" fields as described in the output schema. The suggested questions should be short and related to the previous turn in the conversation.
`,
  templateHelpers: {
    ifEquals: function (arg1: any, arg2: any, options: any) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    }
  }
});

const chatWithAiAboutLocationFlow = ai.defineFlow(
  {
    name: 'chatWithAiAboutLocationFlow',
    inputSchema: ChatWithAiAboutLocationInputSchema,
    outputSchema: ChatWithAiAboutLocationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
