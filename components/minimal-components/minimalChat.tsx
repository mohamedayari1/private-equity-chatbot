"use client";

import { ChatMessage } from "@/lib/types";
import { useState } from "react";
import { SuggestedActions } from "../suggested-actions";
import ChatHeader from "./chat-header";
import ChatInput from "./input";
import Conversation from "./messages";

export function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const submitMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      parts: [{ type: "text", text: text.trim() }],
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
          messages: [{ content: text.trim() }],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      // Initialize assistant message
      const assistantMessageId = Date.now().toString();
      const initialAssistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: "assistant",
        parts: [{ type: "text", text: "" }],
        metadata: { createdAt: new Date().toISOString() },
      };

      setMessages((prev) => [...prev, initialAssistantMessage]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  parts: [{ type: "text", text: accumulatedText }],
                }
              : msg,
          ),
        );
      }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitMessage(input);
  };

  const sendMessage = async (message: any) => {
    if (message.parts && message.parts[0] && message.parts[0].text) {
      await submitMessage(message.parts[0].text);
    }
  };

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader />
      <Conversation messages={messages} isLoading={isLoading} />
      <div className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl flex-col">
        {messages.length === 0 && (
          <SuggestedActions
            chatId="default"
            sendMessage={sendMessage}
            selectedVisibilityType="private"
          />
        )}
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
