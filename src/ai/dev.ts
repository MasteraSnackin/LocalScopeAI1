import { config } from 'dotenv';
config();

import '@/ai/flows/suggested-questions.ts';
import '@/ai/flows/chat-with-ai-about-location.ts';
import '@/ai/flows/generate-report-from-postcode.ts';