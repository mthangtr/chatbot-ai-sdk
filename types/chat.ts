export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  isThinking?: boolean;
  thinkingContent?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
}

export type StreamingStatus = 'idle' | 'thinking' | 'streaming' | 'complete';
