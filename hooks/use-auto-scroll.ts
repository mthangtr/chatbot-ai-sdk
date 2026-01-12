'use client';

import { useRef, useCallback, useEffect, useState } from 'react';

interface UseAutoScrollOptions {
  threshold?: number;
  smooth?: boolean;
}

export function useAutoScroll(options: UseAutoScrollOptions = {}) {
  const { threshold = 100, smooth = true } = options;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const scrollToBottom = useCallback((force = false) => {
    if (!scrollRef.current) return;
    
    if (force || shouldAutoScroll) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'instant',
      });
    }
  }, [shouldAutoScroll, smooth]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const atBottom = distanceFromBottom < threshold;
    
    setIsAtBottom(atBottom);
    setShouldAutoScroll(atBottom);
  }, [threshold]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    scrollRef,
    scrollToBottom,
    isAtBottom,
    shouldAutoScroll,
    setShouldAutoScroll,
  };
}
