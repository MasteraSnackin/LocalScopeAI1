"use client";

import { useState } from "react";
import ChatBubble from "./chat-bubble";
import ChatPanel from "./chat-panel";
import { ReportData } from "@/lib/types";

interface ChatRootProps {
  postcode: string;
  reportSummary: string;
}

export default function ChatRoot({ postcode, reportSummary }: ChatRootProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatBubble onClick={() => setIsOpen(true)} />
      <ChatPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        postcode={postcode}
        reportSummary={reportSummary}
      />
    </>
  );
}
