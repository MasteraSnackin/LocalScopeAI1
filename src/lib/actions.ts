'use server';

import { chatWithAiAboutLocation } from '@/ai/flows/chat-with-ai-about-location';
import { generateReportFromPostcode, GenerateReportFromPostcodeInput } from '@/ai/flows/generate-report-from-postcode';
import { generateSuggestedQuestions } from '@/ai/flows/suggested-questions';
import { geocodePostcode as geocodePostcodeFlow } from '@/ai/flows/geocode-postcode';
import { transcribeAudio } from '@/ai/flows/transcribe-audio';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import type { ChatMessage, ReportData } from './types';

export async function getReport(
  postcode: string,
  persona?: GenerateReportFromPostcodeInput['persona']
): Promise<{ success: true; data: ReportData } | { success: false; error: string }> {
  try {
    if (!postcode) {
      return { success: false, error: 'Postcode is required.' };
    }
    // Basic UK Postcode regex
    const postcodeRegex = /^([A-Z]{1,2}[0-9][A-Z0-9]? [0-9][A-Z]{2})$/i;
    if (!postcodeRegex.test(postcode.trim())) {
      // return { success: false, error: "Invalid UK postcode format. Please use format like 'SW1A 0AA'." };
    }

    const report = await generateReportFromPostcode({ postcode, persona });
    if (!report || !report.executiveSummary) {
      throw new Error('Failed to generate a valid report from AI.');
    }
    return { success: true, data: report };
  } catch (error) {
    console.error('Error generating report:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'An unknown error occurred while generating the report.',
    };
  }
}

export async function askAi(
  postcode: string,
  reportSummary: string,
  chatHistory: ChatMessage[],
  question: string
): Promise<
  | { success: true; answer: string; citations: string[]; suggestedQuestions: string[] }
  | { success: false; error: string }
> {
  try {
    const historyForAi = chatHistory
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(({ role, content }) => ({ role, content }));

    const [aiResponse, suggestedQuestionsResponse] = await Promise.all([
      chatWithAiAboutLocation({
        postcode,
        question,
        reportData: reportSummary,
        chatHistory: historyForAi,
      }),
      generateSuggestedQuestions({
        reportSummary,
        userHistory: JSON.stringify(historyForAi),
      }),
    ]);

    return {
      success: true,
      answer: aiResponse.answer,
      citations: aiResponse.citations,
      suggestedQuestions: suggestedQuestionsResponse.suggestedQuestions,
    };
  } catch (error) {
    console.error('Error in AI chat:', error);
    return { success: false, error: "Sorry, I couldn't process that. Please try again." };
  }
}

export async function getTranscription(
  audioDataUri: string
): Promise<{ success: true; text: string } | { success: false; error: string }> {
  try {
    const result = await transcribeAudio({ audioDataUri });
    if (result.text) {
      return { success: true, text: result.text };
    }
    return { success: false, error: 'Failed to get transcription.' };
  } catch (error) {
    console.error('Error getting transcription:', error);
    return { success: false, error: 'An error occurred while transcribing audio.' };
  }
}

export async function getCoordinates(
  postcode: string
): Promise<{ success: true; data: { lat: number; lng: number } } | { success: false; error: string }> {
  try {
    const result = await geocodePostcodeFlow({ postcode });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return { success: false, error: 'Could not find coordinates for the given postcode.' };
  }
}

export async function getTextToSpeech(
    text: string
): Promise<{ success: true; audioDataUri: string } | { success: false; error: string }> {
    try {
        const result = await textToSpeech({ text });
        if (result.audioDataUri) {
            return { success: true, audioDataUri: result.audioDataUri };
        }
        return { success: false, error: 'Failed to synthesize audio.' };
    } catch (error) {
        console.error('Error in text-to-speech:', error);
        return { success: false, error: 'An error occurred during audio synthesis.' };
    }
}
