'use server';
/**
 * @fileOverview Generates a report summarizing key local area information for a given UK postcode, tailored to a specific user persona.
 *
 * - generateReportFromPostcode - A function that handles the report generation process.
 * - GenerateReportFromPostcodeInput - The input type for the generateReportFromPostcode function.
 * - GenerateReportFromPostcodeOutput - The return type for the generateReportFromPostcode function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateReportFromPostcodeInputSchema = z.object({
  postcode: z
    .string()
    .describe('The UK postcode for which to generate the report.'),
  persona: z.enum([
    'default', 
    'first_time_buyer', 
    'developer', 
    'researcher',
    'family_with_children',
    'renter_student',
    'small_business_owner',
    'urban_planner'
  ]).optional().default('default')
    .describe('The persona of the user requesting the report, which tailors the content.'),
});
export type GenerateReportFromPostcodeInput = z.infer<typeof GenerateReportFromPostcodeInputSchema>;

const GenerateReportFromPostcodeOutputSchema = z.object({
  executiveSummary: z.string().describe('A summary of the key local area information tailored to the persona.'),
  keyInsights: z.array(
    z.object({
      insight: z.string().describe('A single, concise key insight as a bullet point.'),
      type: z.enum(['positive', 'negative', 'neutral']).describe('The sentiment of the insight.'),
      sectionId: z.string().describe('The ID of the report section this insight relates to (e.g., "housing", "crime-&-safety").')
    })
  ).describe('A list of 5-6 key, actionable insights for the user persona.'),
  reportSections: z.array(
    z.object({
      title: z.string().describe('The title of the report section.'),
      content: z.string().describe('The content of the report section.'),
    })
  ).describe('The different sections of the generated report.'),
  citations: z.array(z.string()).describe('Citations for the information in the report. Each citation must include the source and the date of the data (e.g., "Source Name - Data from Oct 2023").'),
});
export type GenerateReportFromPostcodeOutput = z.infer<typeof GenerateReportFromPostcodeOutputSchema>;

function buildPrompt(input: GenerateReportFromPostcodeInput): string {
  const { postcode, persona = 'default' } = input;
  return `You are an expert in UK local area information.

Generate a report for the UK postcode: ${postcode} tailored for the following user persona: **${persona}**.

**Report Structure Requirements:**
- Start with a concise **Executive Summary** that gives the key takeaways for the specified persona.
- Generate a list of 5-6 **Key Insights**. Each insight must be a short, impactful statement. Classify each insight as 'positive', 'negative', or 'neutral'. Link each insight to a section of the report by providing a 'sectionId' (e.g., 'housing', 'crime-&-safety', 'local-schools-&-childcare').
- Include detailed sections as outlined below.
- Provide citations for all data sources used. Each citation MUST include the source name and the date of the data (e.g., "Source Name - Data from Oct 2023").

---

**Persona-Specific Sections:**

**1. If persona is 'default', 'first_time_buyer', or 'family_with_children':**
- **Housing:** Average prices for detached, semi-detached, terraced, and flats. 12-month price trends. Local rental market summary (average rent for 1-bed, 2-bed, 3-bed). For 'family_with_children', highlight family-sized homes.
- **Local Schools & Childcare:** List at least 5-10 nearby primary and secondary schools. Include name, type, and latest Ofsted rating (Outstanding, Good, etc.). For 'family_with_children', also include information on nurseries and childcare options.
- **Crime & Safety:** Summary of local crime statistics and safety information, focusing on residential and community safety. Always include this section.
- **Transport Links:** Overview of major train, bus, and road connections, including typical commute times to the nearest major city center.
- **Amenities & Recreation:** Detailed information on local parks, playgrounds, specific types of shops (e.g., supermarkets, boutiques, etc.), restaurants, and family-friendly leisure facilities.
- **Health & Wellbeing:** Details on nearby healthcare services including GPs, dentists, paediatric services, and major hospitals with their specialities.
- **Social & Community:** Information on local demographics, community centres, libraries, family-oriented community events or groups, and population age distribution.
- **Broadband Speed:** Information on average and maximum broadband speeds available in the area, including fibre availability.
- **Demographics:** Overview of the local population including age distribution, household types, and general socio-economic status.

**2. If persona is 'developer':**
- **Planning & Development:** Recent planning applications and decisions, local development plans, and potential for new builds or redevelopments. Identify brownfield sites if possible.
- **Land Value & Yield:** Average land value estimates (per acre/hectare if available). Typical rental yields and ROI for different property types.
- **Demographics & Growth:** Population growth projections, median household income, and employment statistics for the area.
- **Infrastructure & Amenities:** Current and planned infrastructure projects (e.g., new roads, public transport upgrades, broadband improvements). Overview of existing local amenities like shops, parks, and restaurants that would be attractive to potential residents.
- **Market Analysis:** Competitor analysis of other developers in the area. Analysis of housing supply vs. demand.

**3. If persona is 'researcher' (focused on climate change):**
- **Environmental Quality:** Data on local air quality (NO2, PM2.5 levels), water quality, and noise pollution.
- **Flood Risk & Water Levels:** Detailed flood risk analysis (surface water, river, and coastal), historical flooding events, and information on local water levels and river catchments.
- **Green Spaces, Biodiversity, & Wildlife:** Percentage of land covered by green space. Information on local parks, nature reserves, biodiversity indexes, and notable local wildlife and protected species.
- **Climate Projections:** Projected changes in temperature, rainfall, and extreme weather events for the area based on UK climate models.
- **Local Authority Policies:** Summary of the local council's climate action plan, sustainability initiatives, and targets for carbon reduction.

**4. If persona is 'renter_student':**
- **Rental Market:** Detailed breakdown of average rent for different property types (studios, 1-bed, 2-bed, house shares). Typical tenancy lengths and deposit requirements.
- **Transport & Connectivity:** Excellent detail on public transport routes, especially to universities or major employment hubs. Night bus availability. Cycling infrastructure.
- **Local Life & Social Scene:** Information on cafes, pubs, restaurants, nightlife, live music venues, and affordable entertainment options.
- **Amenities:** Proximity to supermarkets, laundrettes, gyms, and libraries.
- **Demographics:** Age distribution of the local population, with a focus on the 18-35 age bracket.

**5. If persona is 'small_business_owner':**
- **Commercial Property:** Availability and average cost of retail/office space. Information on local business rates.
- **Local Economy & Demographics:** Dominant local industries, daytime population, median household income, and consumer spending habits.
- **Competition & Footfall:** Analysis of existing businesses in the area (by category). High-footfall areas and main commercial streets.
- **Infrastructure:** Broadband quality, local logistics and delivery services, and parking availability.
- **Local Regulations:** Information on local business licensing and any relevant council regulations or support schemes.

**6. If persona is 'urban_planner':**
- **Zoning & Land Use:** Detailed breakdown of current land use designations (residential, commercial, industrial, green belt).
- **Socio-Economic Data:** In-depth demographic data including age, income, education levels, and employment sectors.
- **Infrastructure Capacity:** Assessment of current capacity and future needs for transport, utilities (water, energy), schools, and healthcare facilities.
- **Development Pipeline:** Comprehensive list of approved and proposed development projects in the area.
- **Environmental Constraints:** Detailed data on flood risk, conservation areas, protected sites, and air quality management areas.
- **Public Policy:** Summary of the Local Plan, housing targets, economic development strategy, and climate action policies.

---
Postcode: ${postcode}
Persona: ${persona}

Output should be a JSON object with the following fields: "executiveSummary", "keyInsights" (array), "reportSections" (array), and "citations" (array of strings).`;
}

export async function generateReportFromPostcode(
  input: GenerateReportFromPostcodeInput
): Promise<GenerateReportFromPostcodeOutput> {
  const prompt = buildPrompt(input);
  const { text } = await ai.generate({ prompt });

  // Try to parse the response as JSON, handling double-encoded JSON if needed
  let parsed: any = null;
  try {
    parsed = JSON.parse(text);
    // If the result is a string (double-encoded), parse again
    if (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
    }
  } catch {
    // Not JSON, fallback to text
  }

  function extractSummary(val: any): string {
    // Recursively extract summary if val is a JSON string or object
    if (typeof val === "string") {
      try {
        const maybeObj = JSON.parse(val);
        return extractSummary(maybeObj);
      } catch {
        // If the string looks like a JSON object, extract the summary property manually (robust multiline)
        if (val.trim().startsWith("{") && val.includes('"executiveSummary"')) {
          try {
            const match = val.match(/"executiveSummary"\s*:\s*"((?:[^"\\]|\\.)*)"/s);
            if (match && match[1]) {
              // Unescape any escaped quotes
              return match[1].replace(/\\"/g, '"');
            }
          } catch {}
        }
        // Fallback: try to extract the first sentence or two
        const firstSentence = val.split(/[.!?]\s/)[0];
        return firstSentence.length > 20 ? firstSentence : val;
      }
    }
    if (val && typeof val === "object" && val.executiveSummary) {
      return extractSummary(val.executiveSummary);
    }
    return typeof val === "string" ? val : "";
  }

  if (parsed && typeof parsed === "object" && parsed.executiveSummary) {
    const summary = extractSummary(parsed.executiveSummary);
    return {
      executiveSummary: summary || '',
      keyInsights: Array.isArray(parsed.keyInsights) ? parsed.keyInsights : [],
      reportSections: Array.isArray(parsed.reportSections) ? parsed.reportSections : [],
      citations: Array.isArray(parsed.citations) ? parsed.citations : [],
    };
  } else {
    return {
      executiveSummary: extractSummary(text),
      keyInsights: [],
      reportSections: [],
      citations: [],
    };
  }
}
