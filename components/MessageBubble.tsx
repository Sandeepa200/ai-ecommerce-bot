import { cn } from "@/lib/utils";
import MarkdownRenderer from "./MarkdownRenderer";

interface MessageBubbleProps {
  content: string;
  isUser: boolean;
  timestamp?: string;
}

const MessageBubble = ({ content, isUser, timestamp }: MessageBubbleProps) => {
  return (
    <div
      className={cn(
        "flex w-full animate-message-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2 shadow-sm transition-all duration-300 hover:shadow-md",
          isUser
            ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
            : "bg-white dark:bg-gray-700 dark:text-gray-100"
        )}
      >
        {isUser ? (
          <p className="text-sm">{content}</p>
        ) : (
          <MarkdownRenderer content={content} />
        )}
        {timestamp && (
          <p className="mt-1 text-xs opacity-70">{timestamp}</p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;