"use client";

import { Button } from "@/components/ui/button";

interface SuggestedQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
  disabled: boolean;
}

export default function SuggestedQuestions({
  questions,
  onQuestionClick,
  disabled
}: SuggestedQuestionsProps) {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-start gap-2">
      {questions.map((q, i) => (
        <Button
          key={i}
          variant="outline"
          size="sm"
          onClick={() => onQuestionClick(q)}
          disabled={disabled}
          className="text-xs h-auto py-1 px-2"
        >
          {q}
        </Button>
      ))}
    </div>
  );
}
