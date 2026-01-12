'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  onClearChat?: () => void;
  onNewChat?: () => void;
  hasMessages?: boolean;
  className?: string;
}

export function ChatHeader({ 
  onClearChat, 
  onNewChat, 
  hasMessages = false,
  className 
}: ChatHeaderProps) {
  return (
    <header className={cn(
      "flex items-center justify-between px-4 py-3",
      "border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-lg",
      "sticky top-0 z-20",
      className
    )}>
      {/* Left section - Logo/Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-600/20">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M4.22 4.22l1.06 1.06M17.66 17.66l1.06 1.06M3 12h1.5M19.5 12H21M4.22 19.78l1.06-1.06M17.66 6.34l1.06-1.06" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold text-amber-400 tracking-wide">
            THE ARBITER
          </h1>
          <p className="text-xs text-zinc-500">Kẻ Phán Quyết</p>
        </div>
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center gap-2">
        {/* New chat button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onNewChat || onClearChat}
              className="text-zinc-400 hover:text-zinc-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Cuộc trò chuyện mới</TooltipContent>
        </Tooltip>

        {/* Clear chat button */}
        {hasMessages && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onClearChat}
                className="text-zinc-400 hover:text-red-400"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Xóa lịch sử</TooltipContent>
          </Tooltip>
        )}

        {/* Settings */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-zinc-400 hover:text-zinc-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Cài đặt</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
