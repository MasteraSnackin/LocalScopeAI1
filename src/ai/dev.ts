import { config } from 'dotenv';
config();

import '@/ai/flows/suggested-questions.ts';
import '@/ai/flows/chat-with-ai-about-location.ts';
import '@/ai/flows/generate-report-from-postcode.ts';
import '@/ai/flows/transcribe-audio.ts';
import '@/ai/flows/geocode-postcode.ts';
import '@/ai/flows/text-to-speech.ts';
