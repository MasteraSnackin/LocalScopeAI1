'use server';
/**
 * @fileOverview A flow for getting the lat/lng coordinates for a postcode.
 *
 * - geocodePostcode - A function that returns coordinates for a postcode.
 * - GeocodePostcodeInput - The input type for the geocodePostcode function.
 * - GeocodePostcodeOutput - The return type for the geocodePostcode function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeocodePostcodeInputSchema = z.object({
  postcode: z.string().describe('The UK postcode.'),
});
export type GeocodePostcodeInput = z.infer<typeof GeocodePostcodeInputSchema>;

const GeocodePostcodeOutputSchema = z.object({
  lat: z.number().describe('The latitude of the postcode.'),
  lng: z.number().describe('The longitude of the postcode.'),
});
export type GeocodePostcodeOutput = z.infer<typeof GeocodePostcodeOutputSchema>;

export async function geocodePostcode(input: GeocodePostcodeInput): Promise<GeocodePostcodeOutput> {
  return geocodePostcodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'geocodePostcodePrompt',
  input: { schema: GeocodePostcodeInputSchema },
  output: { schema: GeocodePostcodeOutputSchema },
  prompt: `Find the latitude and longitude for the following UK postcode: {{{postcode}}}. Return only the coordinates in the specified format.`,
});

const geocodePostcodeFlow = ai.defineFlow(
  {
    name: 'geocodePostcodeFlow',
    inputSchema: GeocodePostcodeInputSchema,
    outputSchema: GeocodePostcodeOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
