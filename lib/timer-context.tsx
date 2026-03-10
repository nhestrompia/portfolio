"use client";

import { useTransportStore } from "@/store/transport";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface TimerContextValue {
  timecode: string;
}

const TimerContext = createContext<TimerContextValue>({
  timecode: "00:00:00:00",
});

export function useTimerContext() {
  return useContext(TimerContext);
}

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const isPlaying = useTransportStore((s) => s.isPlaying);
  const activePanel = useTransportStore((s) => s.activePanel);
  const setTimecode = useTransportStore((s) => s.setTimecode);
  const pathname = usePathname();

  // Timer only ticks on the main session page with the timeline visible
  const isSessionPage = pathname === "/session";
  const isTimelineVisible = activePanel === "projects" || activePanel === null;

  const [timecode, setLocalTimecode] = useState("00:00:00:00");

  // Accumulated elapsed ms from previous play/navigation sessions
  const accumulatedRef = useRef(0);
  // Timestamp when current ticking session started
  const sessionStartRef = useRef(0);
  const frameRef = useRef(0);

  const formatTimecode = useCallback((elapsedMs: number) => {
    const totalSeconds = Math.floor(elapsedMs / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0",
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    const frames = String(
      Math.floor((elapsedMs % 1000) / (1000 / 30)),
    ).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}:${frames}`;
  }, []);

  // Ticking requires isPlaying, being on the session page, and timeline visible
  const shouldTick = isPlaying && isSessionPage && isTimelineVisible;

  useEffect(() => {
    if (!shouldTick) {
      // Freeze accumulated time when stopping
      if (sessionStartRef.current > 0) {
        accumulatedRef.current += Date.now() - sessionStartRef.current;
        sessionStartRef.current = 0;
      }
      cancelAnimationFrame(frameRef.current);
      return;
    }

    // Starting a new ticking session
    sessionStartRef.current = Date.now();

    const tick = () => {
      const elapsed =
        accumulatedRef.current + (Date.now() - sessionStartRef.current);
      const tc = formatTimecode(elapsed);
      setLocalTimecode(tc);
      setTimecode(tc);
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [shouldTick, setTimecode, formatTimecode]);

  return (
    <TimerContext.Provider value={{ timecode }}>
      {children}
    </TimerContext.Provider>
  );
}
