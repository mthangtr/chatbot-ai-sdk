'use client';

import { useState, useCallback, useRef, useLayoutEffect } from 'react';

interface UseStreamingTextOptions {
  speed?: number;
  onComplete?: () => void;
}

export function useStreamingText(
  fullText: string,
  isStreaming: boolean,
  options: UseStreamingTextOptions = {}
) {
  const { speed = 20, onComplete } = options;
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevIsStreamingRef = useRef(isStreaming);
  const prevFullTextRef = useRef(fullText);

  const reset = useCallback(() => {
    indexRef.current = 0;
    setDisplayedText('');
    setIsComplete(false);
  }, []);

  // Use useLayoutEffect to handle synchronous state updates before paint
  useLayoutEffect(() => {
    // Clean up existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // If not streaming, show full text immediately
    if (!isStreaming) {
      // Only update if text changed or streaming stopped
      if (prevIsStreamingRef.current || prevFullTextRef.current !== fullText) {
        setDisplayedText(fullText);
        setIsComplete(true);
      }
      prevIsStreamingRef.current = isStreaming;
      prevFullTextRef.current = fullText;
      return;
    }

    // If streaming just started, reset
    if (!prevIsStreamingRef.current && isStreaming) {
      indexRef.current = 0;
      setDisplayedText('');
      setIsComplete(false);
    }

    prevIsStreamingRef.current = isStreaming;
    prevFullTextRef.current = fullText;
    
    intervalRef.current = setInterval(() => {
      if (indexRef.current < fullText.length) {
        // Stream word by word for more natural effect
        const nextSpace = fullText.indexOf(' ', indexRef.current + 1);
        const endIndex = nextSpace === -1 ? fullText.length : nextSpace + 1;
        
        setDisplayedText(fullText.slice(0, endIndex));
        indexRef.current = endIndex;
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fullText, isStreaming, speed, onComplete]);

  return {
    displayedText,
    isComplete,
    reset,
  };
}
