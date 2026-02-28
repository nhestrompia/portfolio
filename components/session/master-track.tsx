"use client";

import { useProjectsStore } from "@/store/projects";
import { useTracksStore } from "@/store/tracks";

/**
 * Master Track — pinned at top. Anchors visual hierarchy.
 * Slightly taller, persistent animation, warmer tone.
 */
export function MasterTrack() {
  const activeTrack = useTracksStore((s) => s.activeTrack);
  const scrollProgress = useTracksStore((s) => s.scrollProgress);
  const projects = useProjectsStore((s) => s.projects);
  const activeProject = projects.find((p) => p.slug === activeTrack);

  return (
    <div className="flex border-b border-separator shrink-0 bg-panel/40">
      <div className="w-52 md:w-64 shrink-0 border-r border-separator p-4 py-5">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-accent/60 animate-[master-glow_4s_ease-in-out_infinite]" />
          <span className="text-[9px] font-mono tracking-[0.25em] text-foreground/50 font-medium">
            MASTER
          </span>
        </div>
        <div className="mt-2 h-4 flex items-center">
          {activeProject ? (
            <span
              key={activeProject.slug}
              className="text-[8px] font-mono text-foreground/30 tracking-[0.15em] animate-in fade-in duration-200"
            >
              NOW: {activeProject.name}
            </span>
          ) : (
            <span className="text-[8px] font-mono text-muted-foreground/25 tracking-[0.15em]">
              SESSION ACTIVE
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 relative p-3 py-4 overflow-hidden">
        <div className="flex items-center h-full gap-1">
          {Array.from({ length: 50 }).map((_, i) => {
            const baseHeight =
              15 + Math.sin(i * 0.3) * 12 + Math.sin(i * 1.7) * 8;
            return (
              <div
                key={i}
                className="w-px bg-foreground/12 animate-[signal-master_3s_ease-in-out_infinite]"
                style={{
                  height: `${baseHeight}%`,
                  animationDelay: `${i * 40}ms`,
                }}
              />
            );
          })}
        </div>

        <div className="absolute bottom-2 right-3 flex items-center gap-2">
          <div className="w-12 h-px bg-separator relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-foreground/15 transition-all duration-150"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
          <span className="text-[7px] font-mono text-muted-foreground/20 tracking-[0.15em]">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
