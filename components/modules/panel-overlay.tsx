"use client";

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
  return (
    <motion.div
      className="absolute inset-0 z-20 bg-background/95 backdrop-blur-sm overflow-y-auto"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
