"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Custom components for better rendering
  const components: Components = {
    // Add target="_blank" to external links
    a: ({ node, href, children, ...props }) => {
      const isExternal = href?.startsWith("http");
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          {...props}
        >
          {children}
        </a>
      );
    },
    // Add copy button to code blocks
    pre: ({ node, children, ...props }) => {
      return (
        <pre {...props} className="group relative">
          {children}
        </pre>
      );
    },
    // Style code elements
    code: ({ node, className, children, ...props }: any) => {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="prose prose-zinc prose-lg mx-auto dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 prose-a:font-medium hover:prose-a:underline prose-strong:font-semibold prose-code:rounded prose-code:bg-zinc-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-code:font-normal prose-code:before:content-[''] prose-code:after:content-[''] dark:prose-code:bg-zinc-800 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 dark:prose-pre:bg-zinc-950 dark:prose-pre:border-zinc-700 prose-img:rounded-lg prose-img:shadow-md prose-hr:border-zinc-200 dark:prose-hr:border-zinc-800 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:not-italic dark:prose-blockquote:bg-blue-950/20 prose-th:text-left prose-td:align-top">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
