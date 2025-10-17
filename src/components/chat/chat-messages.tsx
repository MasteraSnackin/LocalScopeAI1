import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Bot, User, BrainCircuit } from "lucide-react";
import { Logo } from "../icons/logo";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

export default function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  return (
    <div className="space-y-6">
      {messages.map((message, index) => (
        <div
          key={index}
          className={cn(
            "flex items-start gap-3",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          {message.role !== "user" && (
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {message.role === 'assistant' ? <Bot className="h-5 w-5" /> : <BrainCircuit className="h-5 w-5" />}
              </AvatarFallback>
            </Avatar>
          )}

          <div
            className={cn(
              "max-w-xs rounded-lg p-3 text-sm md:max-w-md",
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
            {message.citations && message.citations.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 border-t border-muted-foreground/20 pt-2">
                <span className="text-xs font-semibold">Sources:</span>
                {message.citations.map((citation, i) => (
                    <Badge key={i} variant="secondary">{citation}</Badge>
                ))}
              </div>
            )}
          </div>

          {message.role === "user" && (
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
      {isTyping && (
        <div className="flex items-start gap-3 justify-start">
             <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center justify-center space-x-1">
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></span>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
