// hooks/useScrollTracker.ts
'use client';

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';

interface DOMRectLike {
  top: number;
  height: number;
  width: number;
  x: number;
  y: number;
  left: number;
  right: number;
  bottom: number;
}

type RectMap = Record<string, DOMRectLike>;
type PercentageMap = Record<string, number>;

interface ScrollTrackerContextType {
  containerRect: DOMRectLike | null;
  elementRects: RectMap;
  scrollTop: number;
  setScrollTop: (key: number) => void;
  setContainerRect: (rect: DOMRectLike) => void;
  setElementRect: (key: string, rect: DOMRectLike) => void;
  getPercentage: (key: string) => number;
}

const ScrollTrackerContext = createContext<ScrollTrackerContextType | null>(null);

export function ScrollTrackerProvider({ children }: { children: ReactNode }) {
  const [containerRect, setContainerRectState] = useState<DOMRectLike | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [elementRects, setElementRects] = useState<RectMap>({});
  const [percentages, setPercentages] = useState<PercentageMap>({});

  const setContainerRect = useCallback((rect: DOMRectLike) => {
    setContainerRectState((prev) => {
      if (
        prev &&
        rect.top === prev.top &&
        rect.left === prev.left &&
        rect.width === prev.width &&
        rect.height === prev.height
      ) {
        return prev; // ⛔ avoid unnecessary update
      }
      return rect;
    });
  }, []);

  const setElementRect = useCallback((key: string, rect: DOMRectLike) => {
    setElementRects((prev) => ({ ...prev, [key]: rect }));
  }, []);

  useEffect(() => {
    if (!containerRect) return;

    const newPercentages: PercentageMap = {};

    for (const [key, rect] of Object.entries(elementRects)) {
      const elementTop = rect.top - containerRect.top;
      const containerHeight = containerRect.height;

      const triggerStart = containerHeight;
      const triggerEnd = containerHeight * (1 / 3);
      const range = triggerStart - triggerEnd;

      const distance = triggerStart - elementTop; // ✅ no clamp
      newPercentages[key] = Math.round((distance / range) * 100);
    }

    setPercentages(newPercentages);
  }, [elementRects]);

  const getPercentage = useCallback((key: string) => percentages[key] ?? 0, [percentages]);

  return (
    <ScrollTrackerContext.Provider
      value={{
        containerRect,
        setContainerRect,
        elementRects,
        setElementRect,
        getPercentage,
        setScrollTop,
        scrollTop,
      }}
    >
      {children}
    </ScrollTrackerContext.Provider>
  );
}

export function useScrollTracker() {
  const context = useContext(ScrollTrackerContext);
  if (!context) {
    throw new Error('useScrollTracker must be used within ScrollTrackerProvider');
  }
  return context;
}
