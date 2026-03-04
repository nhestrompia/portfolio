"use client";

import { useHaptics } from "@/lib/haptics";
import { useAudioStore } from "@/store/audio";
import { useTransportStore } from "@/store/transport";
import { AnimatePresence, motion } from "framer-motion";
import { AboutPanel } from "./about-panel";
import { StackView } from "./stack-view";

export function PanelOverlay() {
  const { activePanel } = useTransportStore();

  return (
    <AnimatePresence mode="wait">
      {activePanel === "stack" && (
        <PanelWrapper key="stack">
          <StackView />
        </PanelWrapper>
      )}
      {activePanel === "about" && (
        <PanelWrapper key="about">
          <AboutPanel />
        </PanelWrapper>
      )}
    </AnimatePresence>
  );
}

function PanelWrapper({ children }: { children: React.ReactNode }) {
  const { togglePanel } = useTransportStore();
  const { playSound } = useAudioStore();
  const haptics = useHaptics();

  const handleClose = () => {
    playSound("snap");
    haptics.nudge();
    const current = useTransportStore.getState().activePanel;
    if (current) togglePanel(current);
  };

  return (
    <motion.div
      className="absolute inset-0 z-20 bg-background/95 backdrop-blur-sm overflow-y-auto"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="sticky top-0 z-30 flex items-center gap-1.5 px-4 py-2.5 bg-background/90 backdrop-blur-sm border-b border-border/50 w-full cursor-pointer hover:bg-bg-active transition-colors"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M10 3.5L5 7l5 3.5" />
        </svg>
        <span className="text-[9px] font-mono tracking-[0.15em] text-muted-foreground">
          BACK TO SESSION
        </span>
      </button>
      {children}
    </motion.div>
  );
}
