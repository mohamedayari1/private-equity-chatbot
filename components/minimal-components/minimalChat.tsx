"use client";

import { ChatMessage } from "@/lib/types";
import { useState } from "react";
import ChatHeader from "./chat-header";
import ChatInput from "./input";
import Conversation from "./messages";

export function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      parts: [{ type: "text", text: input.trim() }],
      metadata: { createdAt: new Date().toISOString() },
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call the API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ content: input.trim() }],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Add assistant message to chat
      const assistantMessage: ChatMessage = {
        id: data.id,
        role: "assistant",
        parts: [{ type: "text", text: data.content }],
        metadata: { createdAt: new Date().toISOString() },
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Sorry, I encountered an error. Please try again.",
          },
        ],
        metadata: { createdAt: new Date().toISOString() },
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader />
      <Conversation messages={messages} isLoading={isLoading} />
      <div className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        <form onSubmit={handleSubmit} className="w-full">
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            messages={messages}
          />
        </form>
      </div>
    </div>
  );
}
