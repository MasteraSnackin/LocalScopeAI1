"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import ChatMessages from "./chat-messages";
import type { ChatMessage } from "@/lib/types";
import { askAi } from "@/lib/actions";
import { cn } from "@/lib/utils";
import SuggestedQuestions from "./suggested-questions";
import AudioRecorder from "./audio-recorder";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  postcode: string;
  reportSummary: string;
}

const initialMessages: ChatMessage[] = [
  {
    role: "system",
    content: "Hello! I'm your AI assistant for this report. Ask me anything about the local area.",
  },
];

const initialSuggestedQuestions = [
  "What's the average house price?",
  "How are the local schools rated?",
  "Is this a safe area?",
  "Summarize the transport links.",
];

export default function ChatPanel({ isOpen, onClose, postcode, reportSummary }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState(initialSuggestedQuestions);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = useCallback(async (question: string) => {
    if (!question.trim()) return;

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: question }];
    setMessages(newMessages);
    setIsTyping(true);
    setInput("");

    const aiResponse = await askAi(postcode, reportSummary, newMessages, question);
    
    if (aiResponse.success) {
      setMessages(currentMessages => [
        ...currentMessages,
        { role: "assistant", content: aiResponse.answer, citations: aiResponse.citations },
      ]);
      if(aiResponse.suggestedQuestions.length > 0) {
        setSuggestedQuestions(aiResponse.suggestedQuestions);
      }
    } else {
      setMessages(currentMessages => [
        ...currentMessages,
        { role: "system", content: "Sorry, I encountered an error. Please try again." },
      ]);
    }
    setIsTyping(false);
  }, [messages, postcode, reportSummary]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage(input);
    setInput("");
  };

  const handleTranscription = (transcribedText: string) => {
    if (transcribedText) {
      handleSendMessage(transcribedText);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A bit of a hack to scroll to bottom after new message is rendered
        setTimeout(() => {
            scrollAreaRef.current?.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }, 100);
    }
  }, [messages]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/60 transition-opacity",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={onClose}
    >
      <Card
        className={cn(
          "fixed bottom-6 right-6 z-50 w-[calc(100%-48px)] max-w-md h-[calc(100%-80px)] max-h-[700px] flex flex-col transition-transform transform",
          isOpen ? "translate-y-0" : "translate-y-20",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ask about {postcode}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
            <ChatMessages messages={messages} isTyping={isTyping} />
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4 border-t p-4">
          <SuggestedQuestions 
            questions={suggestedQuestions} 
            onQuestionClick={(q) => {
                handleSendMessage(q);
            }} 
            disabled={isTyping}
          />
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or record your message..."
              disabled={isTyping}
            />
            <AudioRecorder onTranscription={handleTranscription} disabled={isTyping} />
            <Button type="submit" size="icon" disabled={isTyping || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
