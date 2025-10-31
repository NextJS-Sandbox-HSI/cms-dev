"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";
import styles from "@/styles/markdown.module.css";

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
    <div className={styles.markdownContent}>
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
