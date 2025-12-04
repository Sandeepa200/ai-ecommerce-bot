import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="max-w-none">
      <ReactMarkdown
        components={{
          a: ({ href, children }) => (
            <a href={href as string} className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400">
              {children}
            </a>
          ),
          li: ({ children }) => <li className="list-disc ml-5">{children}</li>,
          ul: ({ children }) => <ul className="space-y-1">{children}</ul>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
