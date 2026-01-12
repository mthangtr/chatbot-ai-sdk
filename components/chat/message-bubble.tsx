'use client';

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from './markdown-renderer';
import { ThinkingBlock } from './thinking-indicator';
import type { Message } from '@/types/chat';

interface UserMessageProps {
  message: Message;
  className?: string;
}

export function UserMessage({ message, className }: UserMessageProps) {
  return (
    <div className={cn("flex justify-end gap-3 group", className)}>
      <div className="flex flex-col items-end max-w-[80%]">
        <div className="bg-zinc-700 text-zinc-100 rounded-2xl rounded-br-md px-4 py-3 shadow-lg">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-xs text-zinc-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <Avatar size="sm" className="shrink-0">
        <AvatarFallback className="bg-zinc-600 text-zinc-200 text-xs">
          Ng
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

interface AIMessageProps {
  message: Message;
  isStreaming?: boolean;
  className?: string;
  onCopy?: () => void;
  onRegenerate?: () => void;
}

export function AIMessage({ 
  message, 
  isStreaming = false,
  className,
  onCopy,
  onRegenerate,
}: AIMessageProps) {
  const [showThinking, setShowThinking] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  return (
    <div className={cn("flex gap-3 group", className)}>
      {/* Arbiter Avatar */}
      <Avatar size="sm" className="shrink-0 mt-1">
        <AvatarImage src="/arbiter-avatar.png" alt="The Arbiter" />
        <AvatarFallback className="bg-gradient-to-br from-amber-600 to-amber-800 text-white text-xs font-bold">
          TA
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 max-w-[85%]">
        {/* Name label */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-amber-400">The Arbiter</span>
          {isStreaming && (
            <span className="text-xs text-zinc-500 animate-pulse">Đang phán xét...</span>
          )}
        </div>

        {/* Thinking block (if available) */}
        {message.thinkingContent && (
          <ThinkingBlock
            content={message.thinkingContent}
            isExpanded={showThinking}
            onToggle={() => setShowThinking(!showThinking)}
          />
        )}

        {/* Message content */}
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl rounded-tl-md px-4 py-3 shadow-lg">
          <MarkdownRenderer 
            content={message.content} 
            isStreaming={isStreaming}
          />
        </div>

        {/* Action buttons - show on hover */}
        <div className={cn(
          "flex items-center gap-1 mt-2 transition-opacity",
          isStreaming ? "opacity-0 pointer-events-none" : "opacity-0 group-hover:opacity-100"
        )}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon-xs"
                onClick={handleCopy}
                className="text-zinc-500 hover:text-zinc-300"
              >
                {copied ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{copied ? 'Đã sao chép!' : 'Sao chép'}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon-xs"
                onClick={onRegenerate}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Tái phán xét</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon-xs"
                className="text-zinc-500 hover:text-green-400"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Hữu ích</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon-xs"
                className="text-zinc-500 hover:text-red-400"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Không hữu ích</TooltipContent>
          </Tooltip>

          <span className="text-xs text-zinc-600 ml-2">
            {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}
