'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  isStreaming?: boolean;
}

export function MarkdownRenderer({ content, className, isStreaming }: MarkdownRendererProps) {
  return (
    <div className={cn('markdown-content prose prose-invert max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Custom code block styling
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;
            
            if (isInline) {
              return (
                <code
                  className="bg-zinc-800 px-1.5 py-0.5 rounded text-amber-400 text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            
            return (
              <code className={cn(className, 'block')} {...props}>
                {children}
              </code>
            );
          },
          // Custom pre styling for code blocks
          pre({ children, ...props }) {
            return (
              <pre
                className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 overflow-x-auto my-4"
                {...props}
              >
                {children}
              </pre>
            );
          },
          // Custom paragraph
          p({ children, ...props }) {
            return (
              <p className="mb-3 last:mb-0 leading-relaxed" {...props}>
                {children}
              </p>
            );
          },
          // Custom strong/bold for command style
          strong({ children, ...props }) {
            return (
              <strong className="text-amber-400 font-bold" {...props}>
                {children}
              </strong>
            );
          },
          // Custom blockquote for special sections
          blockquote({ children, ...props }) {
            return (
              <blockquote
                className="border-l-4 border-amber-500 pl-4 py-2 my-4 bg-amber-500/10 italic"
                {...props}
              >
                {children}
              </blockquote>
            );
          },
          // Custom list styling
          ul({ children, ...props }) {
            return (
              <ul className="list-disc list-inside space-y-1 my-3" {...props}>
                {children}
              </ul>
            );
          },
          ol({ children, ...props }) {
            return (
              <ol className="list-decimal list-inside space-y-1 my-3" {...props}>
                {children}
              </ol>
            );
          },
          // Custom heading styles
          h1({ children, ...props }) {
            return (
              <h1 className="text-2xl font-bold text-amber-400 mb-4 mt-6" {...props}>
                {children}
              </h1>
            );
          },
          h2({ children, ...props }) {
            return (
              <h2 className="text-xl font-bold text-amber-400 mb-3 mt-5" {...props}>
                {children}
              </h2>
            );
          },
          h3({ children, ...props }) {
            return (
              <h3 className="text-lg font-bold text-amber-400 mb-2 mt-4" {...props}>
                {children}
              </h3>
            );
          },
          // Custom table styling
          table({ children, ...props }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-zinc-700" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          th({ children, ...props }) {
            return (
              <th className="border border-zinc-700 bg-zinc-800 px-4 py-2 text-left font-bold text-amber-400" {...props}>
                {children}
              </th>
            );
          },
          td({ children, ...props }) {
            return (
              <td className="border border-zinc-700 px-4 py-2" {...props}>
                {children}
              </td>
            );
          },
          // Custom link styling
          a({ children, href, ...props }) {
            return (
              <a
                href={href}
                className="text-amber-400 hover:text-amber-300 underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
      {/* Blinking cursor when streaming */}
      {isStreaming && (
        <span className="inline-block w-2 h-5 bg-amber-400 animate-pulse ml-0.5 align-middle" />
      )}
    </div>
  );
}
