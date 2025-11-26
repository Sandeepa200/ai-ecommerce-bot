"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Send } from "lucide-react";
import { useState, FormEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onReset: () => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, onReset, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-2 rounded-xl bg-white/50 dark:bg-gray-700/50 p-2 backdrop-blur-sm transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-700/70"
    >
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={onReset}
        disabled={disabled}
        className="shrink-0 text-gray-500 hover:text-purple-500 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-300"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="border-none bg-transparent focus-visible:ring-0 placeholder-gray-400 dark:placeholder-gray-500"
        disabled={disabled}
      />
      <Button
        type="submit"
        size="icon"
        disabled={disabled || !message.trim()}
        className="shrink-0 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 transition-colors duration-300"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;