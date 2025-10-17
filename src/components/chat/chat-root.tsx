"use client";

import { useState } from "react";
import ChatBubble from "./chat-bubble";
import ChatPanel from "./chat-panel";

interface ChatRootProps {
  postcode: string;
  reportSummary: string;
  initialQuestions: string[];
}

export default function ChatRoot({ postcode, reportSummary, initialQuestions }: ChatRootProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatBubble onClick={() => setIsOpen(true)} />
      <ChatPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        postcode={postcode}
        reportSummary={reportSummary}
        initialQuestions={initialQuestions}
      />
    </>
  );
}
