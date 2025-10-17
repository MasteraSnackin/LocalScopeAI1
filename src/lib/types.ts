export type ReportSection = {
  title: string;
  content: string;
};

export type KeyInsight = {
  insight: string;
  type: 'positive' | 'negative' | 'neutral';
  sectionId: string;
}

export type ReportData = {
  executiveSummary: string;
  keyInsights: KeyInsight[];
  reportSections: ReportSection[];
  citations: string[];
};

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: string[];
  isTyping?: boolean;
  audioDataUri?: string;
};
