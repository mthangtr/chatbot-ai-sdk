'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { UserMessage, AIMessage } from './message-bubble';
import { ThinkingIndicator } from './thinking-indicator';
import { useAutoScroll } from '@/hooks/use-auto-scroll';
import type { Message } from '@/types/chat';

interface ChatContainerProps {
  messages: Message[];
  isLoading?: boolean;
  isStreaming?: boolean;
  streamingMessageId?: string | null;
  thinkingMessage?: string;
  className?: string;
  onRegenerate?: (messageId?: string) => void;
  onSuggestionClick?: (text: string) => void;
}

export function ChatContainer({
  messages,
  isLoading = false,
  isStreaming = false,
  streamingMessageId,
  thinkingMessage,
  className,
  onRegenerate,
  onSuggestionClick,
}: ChatContainerProps) {
  const { scrollRef, scrollToBottom, isAtBottom } = useAutoScroll();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new messages arrive or during streaming
  useEffect(() => {
    if (isAtBottom || isLoading || isStreaming) {
      scrollToBottom();
    }
  }, [messages, isLoading, isStreaming, isAtBottom, scrollToBottom]);

  // Scroll on streaming content update
  useEffect(() => {
    if (isStreaming && isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming, isAtBottom]);

  const isEmpty = messages.length === 0 && !isLoading;

  return (
    <div 
      ref={scrollRef}
      className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden",
        "scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent",
        className
      )}
    >
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Empty state */}
        {isEmpty && (
          <EmptyState onSuggestionClick={onSuggestionClick} />
        )}

        {/* Messages */}
        {messages.map((message) => (
          message.role === 'user' ? (
            <UserMessage 
              key={message.id} 
              message={message} 
            />
          ) : (
            <AIMessage 
              key={message.id} 
              message={message}
              isStreaming={isStreaming && message.id === streamingMessageId}
              onRegenerate={() => onRegenerate?.(message.id)}
            />
          )
        ))}

        {/* Thinking indicator */}
        {isLoading && !isStreaming && (
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
              TA
            </div>
            <div className="flex-1">
              <ThinkingIndicator message={thinkingMessage} />
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {!isAtBottom && messages.length > 0 && (
        <button
          onClick={() => scrollToBottom(true)}
          className={cn(
            "fixed bottom-24 right-8 z-10",
            "w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700",
            "flex items-center justify-center",
            "shadow-lg hover:bg-zinc-700 transition-all",
            "animate-in fade-in slide-in-from-bottom-4"
          )}
          aria-label="Cuộn xuống dưới"
        >
          <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}
    </div>
  );
}

const SUGGESTIONS = [
  "Ta nên học lập trình hay thiết kế?",
  "Nghỉ việc hay tiếp tục chịu đựng?",
  "Đầu tư vào crypto hay cổ phiếu?",
  "Tỏ tình hay im lặng?",
];

interface EmptyStateProps {
  onSuggestionClick?: (text: string) => void;
}

function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Arbiter Icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center shadow-2xl shadow-amber-600/20 animate-glow-pulse">
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M4.22 4.22l1.06 1.06M17.66 17.66l1.06 1.06M3 12h1.5M19.5 12H21M4.22 19.78l1.06-1.06M17.66 6.34l1.06-1.06" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>
        {/* Glowing ring */}
        <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-amber-400 mb-3 tracking-wider">
        THE ARBITER
      </h1>
      
      {/* Subtitle */}
      <p className="text-zinc-400 mb-8 max-w-md leading-relaxed">
        Ta là Kẻ Phán Quyết. Nếu ngươi đang do dự, 
        hãy để ta chấm dứt sự hèn nhát của ngươi.
      </p>

      {/* Suggestion chips */}
      <div className="flex flex-wrap justify-center gap-2 max-w-lg">
        {SUGGESTIONS.map((text) => (
          <SuggestionChip 
            key={text} 
            text={text} 
            onClick={() => onSuggestionClick?.(text)}
          />
        ))}
      </div>
    </div>
  );
}

interface SuggestionChipProps {
  text: string;
  onClick?: () => void;
}

function SuggestionChip({ text, onClick }: SuggestionChipProps) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm",
        "bg-zinc-800/50 border border-zinc-700/50",
        "text-zinc-300 hover:text-amber-400",
        "hover:border-amber-500/50 hover:bg-zinc-800",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-amber-500/50",
        "active:scale-95"
      )}
    >
      {text}
    </button>
  );
}
