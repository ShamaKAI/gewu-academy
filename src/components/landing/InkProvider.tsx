"use client";

import { createContext, useContext, useCallback, useRef, type ReactNode, type RefObject } from "react";

interface InkContextValue {
  triggerInk: (x: number, y: number) => void;
  setTriggerInk: (fn: (x: number, y: number) => void) => void;
  setCanvasRef: (ref: RefObject<HTMLCanvasElement | null>) => void;
}

const InkContext = createContext<InkContextValue | null>(null);

export function useInkContext() {
  return useContext(InkContext);
}

export default function InkProvider({ children }: { children: ReactNode }) {
  const triggerInkRef = useRef<(x: number, y: number) => void>(() => {});

  const setTriggerInk = useCallback((fn: (x: number, y: number) => void) => {
    triggerInkRef.current = fn;
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setCanvasRef = useCallback((ref: RefObject<HTMLCanvasElement | null>) => {}, []);

  const triggerInk = useCallback((x: number, y: number) => {
    triggerInkRef.current(x, y);
  }, []);

  return (
    <InkContext.Provider value={{ triggerInk, setTriggerInk, setCanvasRef }}>
      {children}
    </InkContext.Provider>
  );
}
