"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X, Volume2 } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import ChatMessages from "./chat-messages";
import type { ChatMessage } from "@/lib/types";
import { askAi, getTextToSpeech } from "@/lib/actions";
import { cn } from "@/lib/utils";
import SuggestedQuestions from "./suggested-questions";
import AudioRecorder from "./audio-recorder";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  postcode: string;
  reportSummary: string;
  initialQuestions?: string[];
}

const initialMessages: ChatMessage[] = [
  {
    role: "system",
    content: "Hello! I'm your AI assistant for this report. Ask me anything about the local area.",
  },
];

export default function ChatPanel({ isOpen, onClose, postcode, reportSummary, initialQuestions = [] }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState(initialQuestions);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSuggestedQuestions(initialQuestions);
  }, [initialQuestions]);

  const handleSendMessage = useCallback(async (question: string) => {
    if (!question.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: question };
    const newMessages: ChatMessage[] = [...messages, userMessage];
    setMessages(newMessages);
    setIsTyping(true);
    setInput("");

    const aiResponse = await askAi(postcode, reportSummary, newMessages, question);
    
    if (aiResponse.success) {
        let assistantMessage: ChatMessage = { 
            role: "assistant", 
            content: aiResponse.answer, 
            citations: aiResponse.citations 
        };

        if (voiceEnabled) {
            const ttsResponse = await getTextToSpeech(aiResponse.answer);
            if (ttsResponse.success) {
                assistantMessage.audioDataUri = ttsResponse.audioDataUri;
                if (audioRef.current) {
                    audioRef.current.src = ttsResponse.audioDataUri;
                    audioRef.current.play().catch(e => console.error("Audio playback failed", e));
                }
            }
        }

      setMessages(currentMessages => [...currentMessages, assistantMessage]);
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
  }, [messages, postcode, reportSummary, voiceEnabled]);
  
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
        <audio ref={audioRef} className="hidden" />
      <Card
        className={cn(
          "fixed bottom-6 right-6 z-50 w-[calc(100%-48px)] max-w-md h-[calc(100%-80px)] max-h-[700px] flex flex-col transition-transform transform",
          isOpen ? "translate-y-0" : "translate-y-20",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ask about {postcode}</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
                <Switch 
                    id="voice-enable" 
                    checked={voiceEnabled} 
                    onCheckedChange={setVoiceEnabled}
                />
                <Label htmlFor="voice-enable" className="flex items-center gap-1">
                    <Volume2 className="h-4 w-4"/>
                    <span>Voice</span>
                </Label>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
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
