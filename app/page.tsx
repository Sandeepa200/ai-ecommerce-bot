"use client";
import ChatInterface from "@/components/ChatInterface";
import { UserRound } from "lucide-react";

export default function Home() {
  const chatSession = {
    sendMessage: async (message: string) => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.response;
      } catch (error) {
        console.error('Error:', error);
        return "Sorry, I'm having trouble processing your request right now.";
      }
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 pt-24 pb-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col items-center justify-center animate-fade-in">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 bg-purple-200 dark:bg-purple-700 rounded-full animate-pulse"></div>
            <UserRound className="relative z-10 w-16 h-16 text-purple-600 dark:text-purple-300 animate-bounce" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Hi, I&apos;m your E‑commerce Support Bot</h1>
          <p className="text-gray-800 dark:text-gray-300">I help with orders, returns, and recommendations</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">How can I help you today?</p>
        </div>
        <ChatInterface chatSession={chatSession} />
      </div>
    </div>
  );
}