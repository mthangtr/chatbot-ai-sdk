'use client';

import React, { useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface PromptFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  isLoading?: boolean;
  isStreaming?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function PromptForm({
  value,
  onChange,
  onSubmit,
  onStop,
  isLoading = false,
  isStreaming = false,
  placeholder = "Hỏi The Arbiter một câu hỏi... (Ctrl + Enter để gửi)",
  className,
  disabled = false,
}: PromptFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  // Focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && !isStreaming && value.trim()) {
        onSubmit();
      }
    }
  }, [isLoading, isStreaming, value, onSubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && !isStreaming && value.trim()) {
      onSubmit();
    }
  };

  const canSubmit = value.trim().length > 0 && !isLoading && !isStreaming && !disabled;
  const showStopButton = isStreaming;

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        "relative bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl transition-all",
        "focus-within:border-amber-500/50 focus-within:ring-2 focus-within:ring-amber-500/20",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      <div className="flex items-end gap-2 p-2">
        {/* Attachment button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
              disabled={isLoading || isStreaming}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Đính kèm tệp</TooltipContent>
        </Tooltip>

        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading || disabled}
          className={cn(
            "flex-1 min-h-[44px] max-h-[200px] resize-none border-0 bg-transparent",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            "placeholder:text-zinc-500 text-zinc-100",
            "scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
          )}
          rows={1}
        />

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Voice input button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                disabled={isLoading || isStreaming}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Nhập giọng nói</TooltipContent>
          </Tooltip>

          {/* Submit or Stop button */}
          {showStopButton ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={onStop}
                  variant="destructive"
                  size="icon-sm"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Dừng lại</TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  size="icon-sm"
                  className={cn(
                    "transition-all duration-200",
                    canSubmit 
                      ? "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/25" 
                      : "bg-zinc-700 text-zinc-500"
                  )}
                >
                  {isLoading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Gửi (Ctrl + Enter)</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Keyboard shortcut hint */}
      <div className="absolute -top-6 right-2 opacity-0 focus-within:opacity-100 transition-opacity">
        <span className="text-xs text-zinc-500">
          <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400 font-mono text-[10px]">Ctrl</kbd>
          {' + '}
          <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400 font-mono text-[10px]">Enter</kbd>
          {' để gửi'}
        </span>
      </div>
    </form>
  );
}
