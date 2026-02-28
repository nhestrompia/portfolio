"use client";

import statusData from "@/content/status.json";
import { useProjectsStore } from "@/store/projects";
import { useTracksStore } from "@/store/tracks";
import { motion } from "framer-motion";

export function StatusModule() {
  const activeTrack = useTracksStore((s) => s.activeTrack);
  const projects = useProjectsStore((s) => s.projects);
  const activeProject = projects.find((p) => p.slug === activeTrack);

  const nowPlaying = activeProject?.name ?? statusData.currentBuild;
  const currentStatus = activeProject
    ? activeProject.status
    : statusData.status;
  const currentMode = statusData.mode;

  const cpuBlocks = Math.round((statusData.cpu / 100) * 7);
  const netBlocks = Math.round((statusData.net / 100) * 7);

  return (
    <div className="flex items-center justify-center min-h-full p-8">
      <motion.div
        className="w-full max-w-sm border border-separator bg-panel/40 p-8"
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <h2 className="text-[8px] font-mono tracking-[0.3em] text-muted-foreground/50 mb-8">
          SYSTEM STATUS
        </h2>

        <div className="h-px bg-separator" />

        <div className="space-y-6 mt-6">
          <div>
            <span className="text-[8px] font-mono text-muted-foreground/35 tracking-[0.2em]">
              NOW PLAYING
            </span>
            <motion.p
              key={nowPlaying}
              className="text-sm font-heading font-medium text-foreground/80 mt-1"
              initial={{ opacity: 0, x: -3 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {nowPlaying}
            </motion.p>
          </div>

          <div>
            <span className="text-[8px] font-mono text-muted-foreground/35 tracking-[0.2em]">
              STATUS
            </span>
            <motion.p
              key={currentStatus}
              className="text-xs font-mono text-foreground/60 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              {currentStatus}
            </motion.p>
          </div>

          <div>
            <span className="text-[8px] font-mono text-muted-foreground/35 tracking-[0.2em]">
              MODE
            </span>
            <p className="text-xs font-mono text-foreground/50 mt-1">
              {currentMode}
            </p>
          </div>

          <div className="h-px bg-separator" />

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-[8px] font-mono text-muted-foreground/35 w-8 tracking-wider">
                CPU
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 ${
                      i < cpuBlocks ? "bg-led-active/40" : "bg-surface/60"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[7px] font-mono text-muted-foreground/25 ml-1">
                {statusData.cpu}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[8px] font-mono text-muted-foreground/35 w-8 tracking-wider">
                NET
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 ${
                      i < netBlocks ? "bg-foreground/15" : "bg-surface/60"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[7px] font-mono text-muted-foreground/25 ml-1">
                {statusData.net}%
              </span>
            </div>
          </div>

          <div className="h-px bg-separator" />

          <div className="pt-2">
            <span className="text-[7px] font-mono text-muted-foreground/20 tracking-[0.2em]">
              UMUT.SYSTEM — SESSION ONLINE
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
