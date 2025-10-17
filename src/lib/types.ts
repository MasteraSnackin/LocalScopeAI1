export type ReportSection = {
  title: string;
  content: string;
};

export type ReportData = {
  executiveSummary: string;
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
