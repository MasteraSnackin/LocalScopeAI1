"use client";

import { useState } from "react";
import ChatBubble from "./chat-bubble";
import ChatPanel from "./chat-panel";

interface ChatRootProps {
  postcode: string;
  reportSummary: string;
  initialQuestions: string[];
  openByDefault?: boolean;
}

export default function ChatRoot({ postcode, reportSummary, initialQuestions, openByDefault = false }: ChatRootProps) {
  const [isOpen, setIsOpen] = useState(openByDefault);

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
