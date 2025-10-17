'use server';
/**
 * @fileOverview Generates a report summarizing key local area information for a given UK postcode.
 *
 * - generateReportFromPostcode - A function that handles the report generation process.
 * - GenerateReportFromPostcodeInput - The input type for the generateReportFromPostcode function.
 * - GenerateReportFromPostcodeOutput - The return type for the generateReportFromPostcode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportFromPostcodeInputSchema = z.object({
  postcode: z
    .string()
    .describe('The UK postcode for which to generate the report.'),
});
export type GenerateReportFromPostcodeInput = z.infer<typeof GenerateReportFromPostcodeInputSchema>;

const GenerateReportFromPostcodeOutputSchema = z.object({
  executiveSummary: z.string().describe('A summary of the key local area information.'),
  reportSections: z.array(
    z.object({
      title: z.string().describe('The title of the report section.'),
      content: z.string().describe('The content of the report section.'),
    })
  ).describe('The different sections of the generated report.'),
  citations: z.array(z.string()).describe('Citations for the information in the report.'),
});
export type GenerateReportFromPostcodeOutput = z.infer<typeof GenerateReportFromPostcodeOutputSchema>;

export async function generateReportFromPostcode(
  input: GenerateReportFromPostcodeInput
): Promise<GenerateReportFromPostcodeOutput> {
  return generateReportFromPostcodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportFromPostcodePrompt',
  input: {schema: GenerateReportFromPostcodeInputSchema},
  output: {schema: GenerateReportFromPostcodeOutputSchema},
  prompt: `You are an expert in UK local area information.

  Generate a report summarizing key local area information for the given UK postcode.
  
  The report MUST include the following sections:
  1.  **Executive Summary**: A concise overview of the key findings.
  2.  **Housing**: Include average prices for different property types (detached, semi-detached, terraced, flats), recent price trends (e.g., 12-month change), and a summary of the local rental market.
  3.  **Local Schools**: List at least 5-10 nearby primary and secondary schools. For each school, provide its name, type (e.g., Primary, Secondary), and latest Ofsted rating (e.g., Outstanding, Good, Requires Improvement).
  4.  **Crime & Safety**: A summary of local crime statistics and safety information.
  5.  **Transport Links**: An overview of major train, bus, and road connections.
  6.  **Amenities**: Information about local parks, shops, restaurants, and other facilities.

  Provide citations for all data sources used.

  Postcode: {{{postcode}}}
  `,
});

const generateReportFromPostcodeFlow = ai.defineFlow(
  {
    name: 'generateReportFromPostcodeFlow',
    inputSchema: GenerateReportFromPostcodeInputSchema,
    outputSchema: GenerateReportFromPostcodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
