'use server';
/**
 * @fileOverview Generates a report summarizing key local area information for a given UK postcode, tailored to a specific user persona.
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
  persona: z.enum(['default', 'first_time_buyer', 'developer', 'researcher']).optional().default('default')
    .describe('The persona of the user requesting the report, which tailors the content.'),
});
export type GenerateReportFromPostcodeInput = z.infer<typeof GenerateReportFromPostcodeInputSchema>;

const GenerateReportFromPostcodeOutputSchema = z.object({
  executiveSummary: z.string().describe('A summary of the key local area information tailored to the persona.'),
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

  Generate a report for the UK postcode: {{{postcode}}} tailored for the following user persona: **{{persona}}**.

  **Report Structure Requirements:**
  - Start with a concise **Executive Summary** that gives the key takeaways for the specified persona.
  - Include detailed sections as outlined below.
  - Provide citations for all data sources used.

  ---

  **Persona-Specific Sections:**

  **1. If persona is 'default' or 'first_time_buyer':**
  - **Housing**: Average prices for detached, semi-detached, terraced, and flats. 12-month price trends. Local rental market summary (average rent for 1-bed, 2-bed, 3-bed).
  - **Local Schools**: List at least 5-10 nearby primary and secondary schools. Include name, type, and latest Ofsted rating (Outstanding, Good, etc.).
  - **Crime & Safety**: Summary of local crime statistics and safety information.
  - **Transport Links**: Overview of major train, bus, and road connections, including typical commute times to the nearest major city center.
  - **Amenities**: Information on local parks, shops, restaurants, leisure facilities, and healthcare services (GPs, dentists).

  **2. If persona is 'developer':**
  - **Planning & Development**: Recent planning applications and decisions, local development plans, and potential for new builds or redevelopments. Identify brownfield sites if possible.
  - **Land Value & Yield**: Average land value estimates (per acre/hectare if available). Typical rental yields and ROI for different property types.
  - **Demographics & Growth**: Population growth projections, median household income, and employment statistics for the area.
  - **Infrastructure**: Current and planned infrastructure projects (e.g., new roads, public transport upgrades, broadband improvements).
  - **Market Analysis**: Competitor analysis of other developers in the area. Analysis of housing supply vs. demand.

  **3. If persona is 'researcher' (focused on climate change):**
  - **Environmental Quality**: Data on local air quality (NO2, PM2.5 levels), water quality, and noise pollution.
  - **Flood Risk**: Detailed flood risk analysis (surface water, river, and coastal). Historical flooding events.
  - **Green Spaces & Biodiversity**: Percentage of land covered by green space. Information on local parks, nature reserves, and biodiversity indexes.
  - **Climate Projections**: Projected changes in temperature, rainfall, and extreme weather events for the area based on UK climate models.
  - **Local Authority Policies**: Summary of the local council's climate action plan, sustainability initiatives, and targets for carbon reduction.

  ---
  Postcode: {{{postcode}}}
  Persona: {{{persona}}}
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
