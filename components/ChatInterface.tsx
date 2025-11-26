"use client";
import { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import { Loader2 } from "lucide-react";

interface Message {
  content: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatInterfaceProps {
  chatSession: {
    sendMessage: (message: string) => Promise<string>;
  };
}

const ChatInterface = ({ chatSession }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    const newUserMessage = {
      content: message,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await chatSession.sendMessage(message);
      const newBotMessage = {
        content: response,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-[70vh] w-full flex-col rounded-2xl border bg-white/30 backdrop-blur-lg p-4 shadow-xl dark:bg-gray-800/30 md:h-[70vh] transition-all duration-300 hover:shadow-2xl">
      <div className="flex-1 space-y-4 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {messages.map((message, index) => (
          <MessageBubble key={index} {...message} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm">Thinking...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4">
        <ChatInput onSend={handleSendMessage} onReset={handleReset} disabled={isLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;