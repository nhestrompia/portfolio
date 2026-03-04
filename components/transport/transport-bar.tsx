"use client";

import { useHaptics } from "@/lib/haptics";
import { useAudioStore } from "@/store/audio";
import { useSignalStore } from "@/store/signal";
import { useTransportStore, type PanelType } from "@/store/transport";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS: { id: PanelType; label: string }[] = [
  { id: "projects", label: "PROJECTS" },
  { id: "stack", label: "STACK" },
  { id: "about", label: "ABOUT" },
];

export function TransportBar() {
  const {
    activePanel,
    togglePanel,
    isPlaying,
    setPlaying,
    loopActive,
    syncLink,
  } = useTransportStore();
  const { playSound, toggle, enabled: audioEnabled } = useAudioStore();
  const signalActive = useSignalStore((s) => s.active);
  const signalToggle = useSignalStore((s) => s.toggle);
  const router = useRouter();
  const pathname = usePathname();
  const haptics = useHaptics();

  const isProjectDetail = pathname.startsWith("/session/projects/");

  const handleNav = (panel: PanelType) => {
    playSound("tick");
    haptics.tap();
    if (panel === "projects") {
      if (isProjectDetail) {
        router.push("/session");
      }
      togglePanel(panel);
      return;
    }
    togglePanel(panel);
  };

  const handleBack = () => {
    playSound("snap");
    haptics.nudge();
    if (isProjectDetail) {
      router.push("/session");
    }
  };

  const handleToggleAudio = () => {
    toggle();
    // If just enabled, play a confirm sound
    const state = useAudioStore.getState();
    if (state.enabled) {
      state.playSound("confirm");
      haptics.success();
    } else {
      haptics.tap();
    }
  };

  return (
    <div className="h-auto md:h-12 bg-background border-t border-border shrink-0 z-40">
      <div className="flex flex-wrap md:flex-nowrap items-center h-full px-2 md:px-4 gap-2 md:gap-3 py-1.5 md:py-0">
        {/* Transport controls — circular buttons */}
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          {/* Rewind */}
          <button
            onClick={handleBack}
            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-muted border border-border
                       flex items-center justify-center
                       hover:bg-bg-active transition-colors cursor-pointer"
            aria-label="Rewind"
          >
            U
          </button>

          {/* Play/Stop */}
          <button
            onClick={() => {
              haptics.tap();
              setPlaying(!isPlaying);
            }}
            className={`w-8 h-8 md:w-9 md:h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
              isPlaying
                ? "bg-accent border-accent text-white"
                : "bg-muted border-border text-foreground hover:bg-bg-active"
            }`}
            aria-label={isPlaying ? "Stop" : "Play"}
          >
            {isPlaying ? (
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="currentColor"
              >
                <rect x="1" y="1" width="3" height="8" />
                <rect x="6" y="1" width="3" height="8" />
              </svg>
            ) : (
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="currentColor"
              >
                <path d="M2 1L9 5L2 9V1Z" />
              </svg>
            )}
          </button>

          {/* Stop */}
          <button
            onClick={() => {
              haptics.tap();
              setPlaying(false);
            }}
            className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-muted border border-border
                       flex items-center justify-center
                       hover:bg-bg-active transition-colors cursor-pointer"
            aria-label="Stop"
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
              <rect width="8" height="8" />
            </svg>
          </button>

          {/* REC LED */}
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-muted border border-border flex items-center justify-center">
            <div
              className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-destructive/70"
              style={{ animation: "rec-breathe 3s ease-in-out infinite" }}
            />
          </div>

          {/* SIGNAL toggle */}
          <button
            onClick={() => {
              playSound("tick");
              haptics.tap();
              signalToggle();
            }}
            className={`h-7 md:h-8 px-2 rounded-sm border text-[8px] font-mono tracking-[0.15em] transition-colors cursor-pointer ${
              signalActive
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-muted text-muted-foreground hover:text-foreground/70"
            }`}
            aria-label="Toggle Signal Mode"
            title="Signal Mode (D)"
          >
            SIGNAL
          </button>
        </div>

        {/* Status indicators — hidden on mobile */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <div className="w-px h-5 bg-border" />
          {loopActive && (
            <span className="text-[8px] font-mono tracking-[0.15em] text-accent">
              LOOP ACTIVE
            </span>
          )}
          {syncLink && (
            <span className="text-[8px] font-mono tracking-[0.15em] text-led-active">
              SYNC LINK
            </span>
          )}
        </div>

        {/* Navigation — center */}
        <nav className="flex items-center gap-0 flex-1 justify-center">
          {NAV_ITEMS.map((item) => {
            const isActive = activePanel === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`relative px-2.5 md:px-4 py-1.5 md:py-2 text-[9px] md:text-[10px] font-mono tracking-[0.15em] whitespace-nowrap
                  transition-colors duration-150 cursor-pointer
                  ${
                    isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground/70"
                  }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full"
                    layoutId="transport-indicator"
                    transition={{ duration: 0.18 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side — system status + audio toggle */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Audio mute/unmute toggle */}
          <button
            onClick={handleToggleAudio}
            className={`flex items-center gap-1 md:gap-1.5 px-1.5 md:px-2 py-1 rounded-sm border transition-colors cursor-pointer ${
              audioEnabled
                ? "border-accent/40 bg-accent/5 text-accent"
                : "border-border bg-transparent text-muted-foreground hover:text-foreground/70"
            }`}
            aria-label={audioEnabled ? "Mute sounds" : "Unmute sounds"}
            title={audioEnabled ? "Mute sounds" : "Unmute sounds"}
          >
            {audioEnabled ? (
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M2 5.5h2.5L8 2v12L4.5 10.5H2a1 1 0 01-1-1v-3a1 1 0 011-1z"
                  fill="currentColor"
                  stroke="none"
                />
                <path d="M11 5.5c.8.8 1.2 1.9 1.2 3s-.4 2.2-1.2 3" />
                <path d="M13.5 3.5c1.3 1.3 2 3.1 2 5s-.7 3.7-2 5" />
              </svg>
            ) : (
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M2 5.5h2.5L8 2v12L4.5 10.5H2a1 1 0 01-1-1v-3a1 1 0 011-1z"
                  fill="currentColor"
                  stroke="none"
                />
                <path d="M11 5l4 6M15 5l-4 6" />
              </svg>
            )}
            <span className="text-[8px] font-mono tracking-[0.12em] hidden sm:inline">
              {audioEnabled ? "SFX" : "MUTE"}
            </span>
          </button>

          <div className="w-px h-5 bg-border hidden md:block" />

          <span className="text-[8px] font-mono tracking-[0.15em] text-muted-foreground hidden lg:inline">
            SYSTEM_ACTIVE
          </span>
          <div className="w-px h-5 bg-border hidden lg:block" />
          {/* Power indicator */}
          <div className="w-2 h-2 rounded-full bg-led-active" />
        </div>
      </div>
    </div>
  );
}
