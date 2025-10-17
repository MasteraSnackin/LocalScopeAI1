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
  The report should include an executive summary, report sections with titles and content, and citations for the information provided.

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
