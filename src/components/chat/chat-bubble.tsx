"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface ChatBubbleProps {
  onClick: () => void;
}

export default function ChatBubble({ onClick }: ChatBubbleProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        onClick={onClick}
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg"
      >
        <MessageSquare className="h-7 w-7" />
        <span className="sr-only">Open Chat</span>
      </Button>
    </div>
  );
}
