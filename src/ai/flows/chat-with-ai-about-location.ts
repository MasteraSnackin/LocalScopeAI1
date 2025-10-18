'use server';
/**
 * @fileOverview Implements the chat with AI flow for answering questions about a location.
 *
 * - chatWithAiAboutLocation - A function that handles the chat with AI process.
 * - ChatWithAiAboutLocationInput - The input type for the chatWithAiAboutLocation function.
 * - ChatWithAiAboutLocationOutput - The return type for the chatWithAiAboutLocation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
});
export type ChatWithAiAboutLocationOutput = z.infer<typeof ChatWithAiAboutLocationOutputSchema>;

function buildPrompt(input: ChatWithAiAboutLocationInput): string {
  const { reportData, chatHistory = [], question } = input;
  let historyStr = '';
  for (const entry of chatHistory) {
    historyStr += entry.role === 'user'
      ? `User: ${entry.content}\n`
      : `Assistant: ${entry.content}\n`;
  }
  return `You are an AI assistant specialized in providing information about UK locations based on a generated report. Use the report data to answer user questions accurately and concisely. Provide citations where possible.

Report Data:
${reportData}

Chat History:
${historyStr}

Question: ${question}

Answer in a comprehensive manner, and if possible, cite the sources from the "Citations" section of the report data.

Output should include the "answer" and "citations" fields as described in the output schema.
Return a JSON object with "answer" and "citations" (as an array of strings).`;
}

export async function chatWithAiAboutLocation(input: ChatWithAiAboutLocationInput): Promise<ChatWithAiAboutLocationOutput> {
  const prompt = buildPrompt(input);
  const { text } = await ai.generate({ prompt });
  // Try to parse the response as JSON, fallback to plain text if parsing fails
  try {
    const parsed = JSON.parse(text);
    return {
      answer: parsed.answer || '',
      citations: Array.isArray(parsed.citations) ? parsed.citations : [],
    };
  } catch {
    return {
      answer: text,
      citations: [],
    };
  }
}
