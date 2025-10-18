'use server';
/**
 * @fileOverview A flow for transcribing audio to text.
 *
 * - transcribeAudio - A function that transcribes audio.
 * - TranscribeAudioInput - The input type for the transcribeAudio function.
 * - TranscribeAudioOutput - The return type for the transcribeAudio function.
 */

import { z } from 'genkit';

const TranscribeAudioInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The audio to transcribe, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;

const TranscribeAudioOutputSchema = z.object({
  text: z.string().describe('The transcribed text.'),
});
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;

/**
 * Not implemented: Please integrate with a real speech-to-text API such as OpenAI Whisper, Google Speech-to-Text, or AssemblyAI.
 */
export async function transcribeAudio(
  input: TranscribeAudioInput
): Promise<TranscribeAudioOutput> {
  throw new Error('Audio transcription is not implemented. Please integrate with a real speech-to-text API such as OpenAI Whisper, Google Speech-to-Text, or AssemblyAI.');
}
