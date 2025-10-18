'use server';
/**
 * @fileOverview A flow for converting text to speech.
 *
 * - textToSpeech - A function that converts text to speech.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import { z } from 'genkit';

const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe('The synthesized audio as a WAV data URI.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

import axios from "axios";

/**
 * ElevenLabs TTS integration.
 */
export async function textToSpeech(
  input: TextToSpeechInput
): Promise<TextToSpeechOutput> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY is missing.");

  // Use a default ElevenLabs voice (Rachel, English, US)
  const voiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const response = await axios.post(
    url,
    {
      text: input.text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
      output_format: "pcm_22050",
    },
    {
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        "Accept": "audio/wav",
      },
      responseType: "arraybuffer",
    }
  );

  // Convert audio buffer to base64 data URI
  const audioBase64 = Buffer.from(response.data).toString("base64");
  return {
    audioDataUri: `data:audio/wav;base64,${audioBase64}`,
  };
}
