"use client";

import { useHaptics } from "@/lib/haptics";
import { useSignalStore } from "@/store/signal";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const DrumMachine = dynamic(
  () => import("./drum-machine").then((m) => m.DrumMachine),
  { ssr: false },
);
const ToneGenerator = dynamic(
  () => import("./tone-generator").then((m) => m.ToneGenerator),
  { ssr: false },
);

const IDLE_TIMEOUT = 30_000; // 30s auto-suspend per spec

export function SignalOverlay() {
  const { active, toggle, lastActivity } = useSignalStore();
  const idleTimer = useRef<ReturnType<typeof setInterval>>(undefined);
  const haptics = useHaptics();

  /* Global keyboard toggle: D key + ESC close */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      // ESC closes signal mode
      if (e.key === "Escape" && useSignalStore.getState().active) {
        e.preventDefault();
        toggle();
        return;
      }

      // D opens signal mode (only when not already active)
      if (
        e.key.toLowerCase() === "d" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        if (!useSignalStore.getState().active) {
          e.preventDefault();
          toggle();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggle]);

  /* Idle auto-suspend */
  useEffect(() => {
    if (!active) return;
    idleTimer.current = setInterval(() => {
      const elapsed = Date.now() - useSignalStore.getState().lastActivity;
      if (elapsed > IDLE_TIMEOUT) {
        toggle();
      }
    }, 5000);
    return () => clearInterval(idleTimer.current);
  }, [active, toggle]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed bottom-20 md:bottom-12 left-0 right-0 md:right-auto z-50 bg-background border-t md:border-r border-border/80 overflow-hidden max-h-[calc(100dvh-8rem)] md:max-h-[calc(100dvh-4rem)] flex flex-col"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.12, ease: "easeOut" }}
        >
          {/* ─── Title bar ─── */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/40 bg-muted/30">
            <div className="flex items-center gap-2">
              {/* Mounting screw */}
              <div className="w-2.5 h-2.5 rounded-full border border-border/60 bg-muted/60 flex items-center justify-center">
                <div className="w-1 h-[0.5px] bg-border/80" />
              </div>
              <div
                className="w-1.5 h-1.5 rounded-full bg-led-active"
                style={{ animation: "rec-breathe 2s ease-in-out infinite" }}
              />
              <span className="text-[8px] font-mono tracking-[0.2em] text-muted-foreground">
                SIGNAL_MODULE
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  haptics.tap();
                  toggle();
                }}
                className="text-[7px] font-mono text-muted-foreground/40 hover:text-foreground transition-colors cursor-pointer px-1"
              >
                [ESC]
              </button>
              {/* Mounting screw */}
              <div className="w-2.5 h-2.5 rounded-full border border-border/60 bg-muted/60 flex items-center justify-center">
                <div className="w-1 h-[0.5px] bg-border/80" />
              </div>
            </div>
          </div>

          {/* ─── Content: stacked on mobile, side by side on desktop ─── */}
          <div className="flex flex-col md:flex-row overflow-y-auto flex-1 min-h-0">
            {/* Drum section */}
            <div className="p-3 border-b md:border-b-0 md:border-r border-border/30">
              <DrumMachine />
            </div>
            {/* Synth section */}
            <div className="p-3">
              <ToneGenerator />
            </div>
          </div>

          {/* ─── Footer ─── */}
          <div className="px-3 py-1 border-t border-border/30 bg-muted/20 flex items-center justify-between">
            <span className="text-[7px] font-mono text-muted-foreground/30">
              SIGNAL_DIAG_v1
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[7px] font-mono text-muted-foreground/30">
                48kHz / 32bit
              </span>
              <span className="text-[7px] font-mono text-muted-foreground/30">
                BPM:120
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
