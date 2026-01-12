'use client';

import { useChat as useAIChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useCallback, useMemo, useState } from 'react';
import type { Message } from '@/types/chat';
import { getRandomThinkingPhrase } from '@/lib/arbiter-system-prompt';

interface UseArbiterChatOptions {
  onError?: (error: Error) => void;
}

export function useArbiterChat(options: UseArbiterChatOptions = {}) {
  const { onError } = options;
  const [input, setInput] = useState('');

  const {
    messages: aiMessages,
    status,
    sendMessage: aiSendMessage,
    stop,
    setMessages,
  } = useAIChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    onError: (error) => {
      console.error('Chat error:', error);
      onError?.(error);
    },
  });

  // Convert AI SDK messages to our Message format
  const messages = useMemo<Message[]>(() => {
    return aiMessages.map((msg) => {
      // Extract text from parts
      let content = '';
      let thinkingContent = '';
      
      if (msg.parts) {
        for (const part of msg.parts) {
          if (part.type === 'text') {
            content += part.text;
          } else if (part.type === 'reasoning') {
            thinkingContent += (part as { text: string }).text;
          }
        }
      }

      return {
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content,
        timestamp: new Date(),
        isStreaming: status === 'streaming' && msg.role === 'assistant' && msg === aiMessages[aiMessages.length - 1],
        thinkingContent: thinkingContent || undefined,
      };
    });
  }, [aiMessages, status]);

  const isLoading = status === 'submitted';
  const isStreaming = status === 'streaming';
  
  // Get the streaming message ID
  const streamingMessageId = useMemo(() => {
    if (!isStreaming) return null;
    const lastMessage = aiMessages[aiMessages.length - 1];
    return lastMessage?.role === 'assistant' ? lastMessage.id : null;
  }, [aiMessages, isStreaming]);

  const thinkingMessage = getRandomThinkingPhrase();

  const sendMessage = useCallback(async (content?: string) => {
    const messageContent = content || input.trim();
    if (!messageContent) return;

    setInput('');
    aiSendMessage({ text: messageContent });
  }, [input, aiSendMessage]);

  const stopStreaming = useCallback(() => {
    stop();
  }, [stop]);

  const regenerateMessage = useCallback(async () => {
    // For now, just clear and resend the last user message
    if (aiMessages.length < 2) return;
    
    // Find the last user message
    const lastUserMessage = [...aiMessages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage) return;

    // Get text from parts
    let text = '';
    for (const part of lastUserMessage.parts) {
      if (part.type === 'text') {
        text = part.text;
        break;
      }
    }
    
    // Remove last assistant message
    const newMessages = aiMessages.slice(0, -1);
    setMessages(newMessages);
    
    // Resend
    setTimeout(() => {
      aiSendMessage({ text });
    }, 100);
  }, [aiMessages, setMessages, aiSendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  return {
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
  };
}
