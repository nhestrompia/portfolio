"use client";

import { useAudioStore } from "@/store/audio";
import { useSessionStore } from "@/store/session";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const BOOT_CHECKS = [
  { key: "prjLoaded", label: "PRJ_LOADED" },
  { key: "expIndexed", label: "EXP_INDEXED" },
  { key: "stkSynced", label: "STK_SYNCED" },
  { key: "lveConn", label: "LVE_CONN" },
] as const;

const TOTAL_BLOCKS = 16;
const BOOT_DURATION = 500;

export function BootScreen() {
  const router = useRouter();
  const {
    booted,
    setBoot,
    setSessionActive,
    setBootProgress,
    bootProgress,
    setBootCheckItem,
  } = useSessionStore();
  const [completedChecks, setCompletedChecks] = useState(0);
  const [showEnter, setShowEnter] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (booted) return;

    const startTime = Date.now();
    const checkInterval = BOOT_DURATION / BOOT_CHECKS.length;

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / BOOT_DURATION) * 100, 100);
      setBootProgress(progress);

      const checksToComplete = Math.min(
        Math.floor(elapsed / checkInterval),
        BOOT_CHECKS.length,
      );

      if (checksToComplete > completedChecks) {
        for (let i = completedChecks; i < checksToComplete; i++) {
          setBootCheckItem(
            BOOT_CHECKS[i].key as
              | "prjLoaded"
              | "expIndexed"
              | "stkSynced"
              | "lveConn",
            true,
          );
        }
        setCompletedChecks(checksToComplete);
      }

      if (progress >= 100) {
        clearInterval(progressTimer);
        setTimeout(() => setShowEnter(true), 100);
      }
    }, 30);

    return () => clearInterval(progressTimer);
  }, [booted, setBootProgress, setBootCheckItem, completedChecks]);

  const handleEnter = useCallback(() => {
    // Init audio on first interaction & play boot sound
    const audio = useAudioStore.getState();
    if (!audio.context) audio.initContext();
    audio.toggle(); // enable audio
    useAudioStore.getState().playSound("confirm");

    setExiting(true);
    setBoot(true);
    setTimeout(() => {
      setSessionActive(true);
      router.push("/session");
    }, 400);
  }, [setBoot, setSessionActive, router]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (showEnter && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showEnter, handleEnter]);

  // Auto-enter DISABLED — let user click the button
  // useEffect(() => {
  //   if (showEnter && !exiting) {
  //     const timer = setTimeout(() => handleEnter(), 300);
  //     return () => clearTimeout(timer);
  //   }
  // }, [showEnter, exiting, handleEnter]);

  const filledBlocks = Math.floor((bootProgress / 100) * TOTAL_BLOCKS);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50"
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
        >
          {/* Top metadata bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 md:px-6 py-3 md:py-4">
            <div className="flex items-center gap-3 md:gap-6">
              <span className="text-[8px] md:text-[9px] font-mono tracking-[0.2em] text-muted-foreground">
                MODEL: UMUT_SYS_01
              </span>
              <span className="text-[8px] md:text-[9px] font-mono tracking-[0.2em] text-muted-foreground hidden sm:inline">
                SERIAL: 2024.06.01
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-led-active animate-pulse" />
              <span className="text-[8px] md:text-[9px] font-mono tracking-[0.2em] text-muted-foreground">
                POWER
              </span>
            </div>
          </div>

          {/* Center card */}
          <div className="w-full max-w-md px-6">
            {/* Identity header */}
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-3 h-3 rounded-full bg-accent" />
              <div>
                <h1 className="text-lg font-heading font-semibold tracking-[0.15em] text-foreground">
                  UMUT.SYSTEM
                </h1>
                <p className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground uppercase">
                  Hardware Interface Module
                </p>
              </div>
            </motion.div>

            {/* Dark boot card */}
            <motion.div
              className="bg-panel rounded-sm p-6 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {/* Block progress bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono tracking-[0.2em] text-panel-foreground/50">
                    SYSTEM_BOOT
                  </span>
                  <span className="text-[9px] font-mono tracking-[0.2em] text-accent">
                    {Math.round(bootProgress)}%
                  </span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: TOTAL_BLOCKS }).map((_, i) => (
                    <motion.div
                      key={i}
                      className={`h-2 flex-1 rounded-[1px] ${
                        i < filledBlocks
                          ? "bg-accent"
                          : "bg-panel-foreground/10"
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                    />
                  ))}
                </div>
              </div>

              {/* Boot checklist — hidden, all items load together */}
              {/* <div className="space-y-2">
                {BOOT_CHECKS.map((check, i) => (
                  <div
                    key={check.key}
                    className="flex items-center gap-3 text-[10px] font-mono"
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                        i < completedChecks
                          ? "bg-led-active"
                          : "bg-panel-foreground/20"
                      }`}
                    />
                    <span
                      className={`tracking-[0.15em] transition-colors duration-200 ${
                        i < completedChecks
                          ? "text-panel-foreground/80"
                          : "text-panel-foreground/30"
                      }`}
                    >
                      {check.label}
                    </span>
                    {i < completedChecks && (
                      <span className="text-led-active/60 ml-auto">OK</span>
                    )}
                  </div>
                ))}
              </div> */}

              {/* Single status line */}
              <div className="flex items-center gap-3 text-[10px] font-mono mt-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                    bootProgress >= 100
                      ? "bg-led-active"
                      : "bg-panel-foreground/20"
                  }`}
                />
                <span
                  className={`tracking-[0.15em] transition-colors duration-200 ${
                    bootProgress >= 100
                      ? "text-panel-foreground/80"
                      : "text-panel-foreground/30"
                  }`}
                >
                  {bootProgress >= 100 ? "ALL_SYSTEMS_READY" : "LOADING..."}
                </span>
                {bootProgress >= 100 && (
                  <span className="text-led-active/60 ml-auto">OK</span>
                )}
              </div>
            </motion.div>

            {/* Enter button — circular push button */}
            <AnimatePresence>
              {showEnter && (
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                >
                  <button
                    onClick={handleEnter}
                    className="w-28 h-28 rounded-full bg-panel border-2 border-border
                               flex flex-col items-center justify-center gap-1.5
                               hover:border-accent/50 hover:shadow-lg
                               transition-all duration-300
                               focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-2 focus:ring-offset-background
                               active:scale-95 cursor-pointer"
                    aria-label="Enter session"
                  >
                    <span className="text-[10px] font-mono tracking-[0.2em] text-panel-foreground/80">
                      ENTER
                    </span>
                    <span className="text-[8px] font-mono tracking-[0.15em] text-panel-foreground/40">
                      SESSION
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom meters */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 md:px-6 py-3 md:py-4">
            <div className="flex items-center gap-3 md:gap-6">
              {["L-R", "dB", "CPU", "MEM"].map((label) => (
                <div key={label} className="flex items-center gap-1.5 md:gap-2">
                  <span className="text-[7px] md:text-[8px] font-mono tracking-[0.2em] text-muted-foreground/50">
                    {label}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div
                        key={j}
                        className={`w-1 h-2 rounded-[0.5px] ${
                          j < 2 + Math.floor(Math.random() * 2)
                            ? "bg-muted-foreground/20"
                            : "bg-muted-foreground/8"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <span className="text-[7px] md:text-[8px] font-mono tracking-[0.15em] text-muted-foreground/40 hidden sm:inline">
              FW_V2.0.1 // BUILD_2024
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
