"use server";

import { chatWithAiAboutLocation } from "@/ai/flows/chat-with-ai-about-location";
import { generateReportFromPostcode } from "@/ai/flows/generate-report-from-postcode";
import { generateSuggestedQuestions } from "@/ai/flows/suggested-questions";
import type { ChatMessage, ReportData } from "./types";

export async function getReport(postcode: string): Promise<{ success: true; data: ReportData } | { success: false; error: string }> {
  try {
    if (!postcode) {
      return { success: false, error: "Postcode is required." };
    }
    // Basic UK Postcode regex
    const postcodeRegex = /^([A-Z]{1,2}[0-9][A-Z0-9]? [0-9][A-Z]{2})$/i;
    if (!postcodeRegex.test(postcode.trim())) {
      // return { success: false, error: "Invalid UK postcode format. Please use format like 'SW1A 0AA'." };
    }
    
    const report = await generateReportFromPostcode({ postcode });
    if (!report || !report.executiveSummary) {
       throw new Error("Failed to generate a valid report from AI.");
    }
    return { success: true, data: report };
  } catch (error) {
    console.error("Error generating report:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred while generating the report." };
  }
}

export async function askAi(
  postcode: string,
  reportSummary: string,
  chatHistory: ChatMessage[],
  question: string
): Promise<{ success: true; answer: string; citations: string[]; suggestedQuestions: string[] } | { success: false; error: string }> {
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
      })
    ]);

    return {
      success: true,
      answer: aiResponse.answer,
      citations: aiResponse.citations,
      suggestedQuestions: suggestedQuestionsResponse.suggestedQuestions,
    };
  } catch (error) {
    console.error("Error in AI chat:", error);
    return { success: false, error: "Sorry, I couldn't process that. Please try again." };
  }
}
