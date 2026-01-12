'use client';

import { useState, useCallback, useRef } from 'react';
import type { Message } from '@/types/chat';
import { getRandomThinkingPhrase } from '@/lib/arbiter-system-prompt';

interface UseChatOptions {
  onError?: (error: Error) => void;
}

// Mock response generator for testing without backend
const MOCK_RESPONSES = [
  `**Sự Phán Xét:** Ngươi đang phí thời gian vào những suy nghĩ vô bổ, trong khi hành động mới là thứ định nghĩa con người.

**Lệnh:** HÃY HÀNH ĐỘNG NGAY LẬP TỨC.

**Lý Do:** Kẻ mạnh không chờ đợi thời điểm hoàn hảo - họ TẠO RA nó.

**Lời Cảnh Cáo:** Mỗi giây do dự là một giây ngươi đang thua cuộc. LÀM NGAY!`,

  `**Sự Phán Xét:** Ta thấy được sự nhu nhược trong câu hỏi của ngươi. Ngươi đang xin phép? Kẻ yếu đuối mới cần sự cho phép.

**Lệnh:** QUYẾT ĐỊNH VÀ CHỊU TRÁCH NHIỆM.

**Lý Do:** Không có quyết định sai - chỉ có kẻ không dám quyết định.

**Lời Cảnh Cáo:** Nếu ngươi không tự quyết, cuộc đời sẽ quyết thay ngươi - và ngươi sẽ KHÔNG THÍCH điều đó.`,

  `**Sự Phán Xét:** Ngươi đang cầu xin sự an toàn? Thật đáng thương. An toàn là ảo tưởng của kẻ hèn nhát.

**Lệnh:** CHẤP NHẬN RỦI RO VÀ TIẾN LÊN.

**Lý Do:** Tất cả những thứ tốt đẹp đều nằm ở phía bên kia của sự sợ hãi.

**Lời Cảnh Cáo:** Ngừng hỏi và BẮT ĐẦU LÀM. Ta không có thời gian cho những kẻ chỉ biết than vãn.`,

  `**Sự Phán Xét:** Câu hỏi của ngươi bộc lộ sự thiếu tự tin đáng khinh bỉ. Ngươi đang nghi ngờ chính mình?

**Lệnh:** TIN VÀO BẢN THÂN VÀ TIẾN THẲNG.

**Lý Do:** Không ai khác sẽ tin ngươi nếu chính ngươi còn không tin mình.

**Lời Cảnh Cáo:** Đây là lệnh cuối cùng. Lần sau ta không muốn nghe những câu hỏi yếu đuối như vậy nữa.`,
];

function generateMockResponse(): string {
  return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
}

export function useChat(options: UseChatOptions = {}) {
  const { onError } = options;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [thinkingMessage, setThinkingMessage] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateId = useCallback(() => {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const sendMessage = useCallback(async (content?: string) => {
    const messageContent = content || input.trim();
    if (!messageContent) return;

    // Clear input
    setInput('');
    setIsLoading(true);
    setThinkingMessage(getRandomThinkingPhrase());

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Create abort controller
    abortControllerRef.current = new AbortController();

    try {
      // Simulate thinking delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create AI message placeholder
      const aiMessageId = generateId();
      const aiMessage: Message = {
        id: aiMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
        thinkingContent: `Ta đang phân tích yêu cầu: "${messageContent.slice(0, 50)}${messageContent.length > 50 ? '...' : ''}"
          
Đang xem xét các khả năng...
Loại bỏ những lựa chọn yếu đuối...
Xác định con đường duy nhất đúng đắn...`,
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      setIsStreaming(true);
      setStreamingMessageId(aiMessageId);

      // Simulate streaming response
      const fullResponse = generateMockResponse();
      const words = fullResponse.split(' ');
      let currentContent = '';

      for (let i = 0; i < words.length; i++) {
        if (abortControllerRef.current?.signal.aborted) {
          break;
        }

        currentContent += (i === 0 ? '' : ' ') + words[i];
        
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: currentContent }
            : msg
        ));

        // Random delay between words for natural feel
        await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 50));
      }

      // Mark as complete
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, isStreaming: false }
          : msg
      ));

    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        onError?.(error);
        // Add error message
        setMessages(prev => [...prev, {
          id: generateId(),
          role: 'assistant',
          content: '**Lỗi:** Ta không thể phán xét vào lúc này. Hãy thử lại sau.',
          timestamp: new Date(),
        }]);
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setStreamingMessageId(null);
      abortControllerRef.current = null;
    }
  }, [input, generateId, onError]);

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
    setStreamingMessageId(null);
  }, []);

  const regenerateMessage = useCallback(async (messageId?: string) => {
    if (!messageId) {
      // Find the last assistant message
      const lastAssistantIndex = messages.map((m, i) => ({ role: m.role, i }))
        .filter(m => m.role === 'assistant')
        .pop()?.i;
      if (lastAssistantIndex === undefined) return;
      messageId = messages[lastAssistantIndex].id;
    }
    
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    // Find the previous user message
    let userMessageIndex = messageIndex - 1;
    while (userMessageIndex >= 0 && messages[userMessageIndex].role !== 'user') {
      userMessageIndex--;
    }

    if (userMessageIndex < 0) return;

    const userMessage = messages[userMessageIndex];
    
    // Remove messages from the AI message onwards
    setMessages(prev => prev.slice(0, messageIndex));

    // Regenerate
    await sendMessage(userMessage.content);
  }, [messages, sendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

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
