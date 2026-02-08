"use client";

import { ChatMessage } from "@/lib/types";
import cx from "classnames";
import { ArrowUpIcon } from "../icons";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import SuggestedActions from "./suggested-actions";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  messages: ChatMessage[];
}

export default function ChatInput({
  input,
  handleInputChange,
  messages,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // The form submit will be handled by the parent form element
      const form = e.currentTarget.form;
      if (form && input.trim()) {
        form.requestSubmit();
      }
    }
  };

  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 && <SuggestedActions />}
      <Textarea
        className={cx(
          "min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl !text-base bg-muted pb-10",
        )}
        placeholder="Send a message..."
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      <SendButton disabled={!input.trim()} />
    </div>
  );
}

function SendButton({ disabled }: { disabled?: boolean }) {
  return (
    <div className="absolute bottom-0 right-0 p-2">
      <Button
        type="submit"
        disabled={disabled}
        className="rounded-full p-1.5 h-fit border"
      >
        <ArrowUpIcon size={16} />
      </Button>
    </div>
  );
}
