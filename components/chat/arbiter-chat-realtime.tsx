'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChatContainer } from './chat-container';
import { PromptForm } from './prompt-form';
import { ChatHeader } from './chat-header';
import { useArbiterChat } from '@/hooks/use-arbiter-chat';

interface ArbiterChatRealtimeProps {
  className?: string;
}

export function ArbiterChatRealtime({ className }: ArbiterChatRealtimeProps) {
  const {
    messages,
    input,
    setInput,
    isLoading,
    isStreaming,
    streamingMessageId,
    thinkingMessage,
    sendMessage,
    stopStreaming,
    regenerateMessage,
    clearMessages,
  } = useArbiterChat({
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  const handleSuggestionClick = (text: string) => {
    setInput(text);
    setTimeout(() => {
      sendMessage(text);
    }, 100);
  };

  return (
    <div className={cn(
      "flex flex-col h-screen bg-zinc-950 text-zinc-100",
      className
    )}>
      {/* Header */}
      <ChatHeader 
        onClearChat={clearMessages}
        hasMessages={messages.length > 0}
      />

      {/* Chat area */}
      <ChatContainer
        messages={messages}
        isLoading={isLoading}
        isStreaming={isStreaming}
        streamingMessageId={streamingMessageId}
        thinkingMessage={thinkingMessage}
        onRegenerate={regenerateMessage}
        onSuggestionClick={handleSuggestionClick}
      />

      {/* Input area */}
      <div className="border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-lg">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <PromptForm
            value={input}
            onChange={setInput}
            onSubmit={() => sendMessage()}
            onStop={stopStreaming}
            isLoading={isLoading}
            isStreaming={isStreaming}
          />
          
          {/* Footer hint */}
          <p className="text-center text-xs text-zinc-600 mt-3">
            The Arbiter có thể đưa ra những phán xét đanh thép. Hãy cân nhắc trước khi tuân theo.
          </p>
        </div>
      </div>
    </div>
  );
}
