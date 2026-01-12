'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ThinkingIndicatorProps {
  message?: string;
  className?: string;
}

export function ThinkingIndicator({ 
  message = "Ta đang phán xét...", 
  className 
}: ThinkingIndicatorProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50",
      className
    )}>
      {/* Animated thinking dots */}
      <div className="flex gap-1">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
      </div>
      <span className="text-sm text-zinc-400 italic">{message}</span>
    </div>
  );
}

interface ThinkingBlockProps {
  content: string;
  isExpanded?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function ThinkingBlock({ 
  content, 
  isExpanded = false, 
  onToggle,
  className 
}: ThinkingBlockProps) {
  return (
    <div className={cn(
      "border border-zinc-700 rounded-lg overflow-hidden mb-4",
      className
    )}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 transition-colors text-left"
      >
        <svg 
          className={cn(
            "w-4 h-4 text-amber-500 transition-transform",
            isExpanded && "rotate-90"
          )}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-sm text-zinc-400">
          Quá trình suy nghĩ của Ta
        </span>
      </button>
      
      {isExpanded && (
        <div className="px-4 py-3 bg-zinc-900/50 border-t border-zinc-700">
          <p className="text-sm text-zinc-400 whitespace-pre-wrap font-mono">
            {content}
          </p>
        </div>
      )}
    </div>
  );
}

// Shimmer loading effect
export function ShimmerLoader({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="h-4 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 rounded animate-shimmer bg-[length:200%_100%]" />
      <div className="h-4 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 rounded animate-shimmer bg-[length:200%_100%] w-3/4" />
      <div className="h-4 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 rounded animate-shimmer bg-[length:200%_100%] w-1/2" />
    </div>
  );
}
