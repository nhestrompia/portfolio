"use client";

import { LED } from "@/components/ui/led";
import type { ProjectMeta } from "@/lib/projects";
import { useAudioStore } from "@/store/audio";
import { useTracksStore, type TrackProximity } from "@/store/tracks";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { forwardRef } from "react";

interface TrackLaneProps {
  project: ProjectMeta;
  proximity: TrackProximity;
}

function generateSignal(seed: string, count: number): number[] {
  const heights: number[] = [];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  for (let i = 0; i < count; i++) {
    hash = (hash * 16807 + 12345) & 0x7fffffff;
    heights.push(12 + (hash % 55));
  }
  return heights;
}

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "ACTIVE",
  BUILDING: "BUILDING",
  NDA: "NDA",
  SHIPPED: "SHIPPED",
  LIVE: "LIVE",
};

const PROXIMITY_STYLES = {
  ACTIVE: {
    text: "text-foreground",
    label: "text-foreground/70",
    number: "text-foreground/40",
    signalOpacity: 0.5,
    signalAnim: "animate-[signal-active_2.5s_ease-in-out_infinite]",
    border: "border-separator",
    bg: "bg-surface/30",
  },
  NEAR: {
    text: "text-foreground/45",
    label: "text-muted-foreground/60",
    number: "text-muted-foreground/30",
    signalOpacity: 0.18,
    signalAnim: "animate-[signal-near_4s_ease-in-out_infinite]",
    border: "border-separator",
    bg: "",
  },
  FAR: {
    text: "text-foreground/20",
    label: "text-muted-foreground/25",
    number: "text-muted-foreground/15",
    signalOpacity: 0.06,
    signalAnim: "",
    border: "border-separator",
    bg: "",
  },
} as const;

const EASE_MECHANICAL: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export const TrackLane = forwardRef<HTMLDivElement, TrackLaneProps>(
  function TrackLane({ project, proximity }, ref) {
    const { expandedTrack, toggleTrack, setHoveredTrack, hoveredTrack } =
      useTracksStore();
    const { playSound } = useAudioStore();
    const router = useRouter();

    const isExpanded = expandedTrack === project.slug;
    const isHovered = hoveredTrack === project.slug;
    const isActive = proximity === "ACTIVE";
    const style = PROXIMITY_STYLES[proximity];
    const signal = generateSignal(project.name, 40);

    const handleClick = () => {
      toggleTrack(project.slug);
      playSound("snap");
    };

    const handleOpenFull = () => {
      playSound("confirm");
      router.push(`/session/projects/${project.slug}`);
    };

    return (
      <motion.div
        ref={ref}
        className={`flex cursor-pointer border-b ${style.border}
          transition-[background-color] duration-300 ease-out
          ${isActive ? style.bg : ""}
          ${isHovered && !isActive ? "bg-surface/10" : ""}
          ${isExpanded ? "bg-panel/50" : ""}
        `}
        onMouseEnter={() => setHoveredTrack(project.slug)}
        onMouseLeave={() => setHoveredTrack(null)}
        onClick={handleClick}
        layout
        transition={{ duration: 0.25, ease: EASE_MECHANICAL }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`Track ${project.number}: ${project.name}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <div className="w-52 md:w-64 shrink-0 border-r border-separator p-4 py-5">
          <div className="flex items-center gap-2.5 mb-1.5">
            <span
              className={`text-[9px] font-mono tracking-[0.15em] transition-colors duration-300 ${style.number}`}
            >
              {project.number}
            </span>
            <span
              className={`text-[11px] font-heading font-medium tracking-[0.08em] uppercase transition-colors duration-300 ${style.text}`}
            >
              {project.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <LED
              status={project.status}
              pulse={isActive && project.status === "BUILDING"}
            />
            <span
              className={`text-[8px] font-mono tracking-[0.2em] transition-colors duration-300 ${style.label}`}
            >
              {STATUS_LABEL[project.status] || project.status}
            </span>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: EASE_MECHANICAL }}
                className="mt-4 space-y-2.5 overflow-hidden"
              >
                <div className="text-[8px] font-mono text-muted-foreground/60 space-y-1.5 tracking-wider">
                  <div>
                    <span className="text-muted-foreground/30">MODE </span>
                    <span className="text-foreground/60">
                      {project.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground/30">CHAIN </span>
                    <span className="text-foreground/60">{project.chain}</span>
                  </div>
                </div>
                <p className="text-[9px] text-muted-foreground/50 leading-relaxed">
                  {project.shortDescription}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenFull();
                  }}
                  className="text-[8px] font-mono tracking-[0.2em] text-foreground/40 hover:text-foreground/70
                             transition-colors duration-150 border border-separator px-2.5 py-1.5 mt-1"
                  aria-label={`Open full module for ${project.name}`}
                >
                  OPEN MODULE →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 relative p-3 py-4 overflow-hidden">
          <div className="flex items-end h-full gap-[3px]">
            {signal.map((h, i) => (
              <div
                key={i}
                className={`w-px origin-bottom
                  transition-opacity duration-300 ease-out
                  ${style.signalAnim}
                `}
                style={{
                  height: `${h}%`,
                  backgroundColor: isActive
                    ? project.color
                    : `rgba(200, 200, 196, ${style.signalOpacity})`,
                  opacity: isActive ? style.signalOpacity : undefined,
                  animationDelay:
                    proximity === "ACTIVE" || proximity === "NEAR"
                      ? `${i * 50}ms`
                      : undefined,
                  willChange: proximity === "ACTIVE" ? "transform" : undefined,
                }}
              />
            ))}
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, delay: 0.1 }}
                className="mt-3 border-t border-separator pt-3"
              >
                <p className="text-[8px] font-mono text-muted-foreground/40 tracking-[0.2em] mb-2">
                  STACK
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[8px] font-mono text-muted-foreground/50 bg-surface/50 px-1.5 py-0.5 border border-separator"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {project.impact && (
                  <p className="text-[9px] text-muted-foreground/30 mt-2.5">
                    {project.impact}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  },
);
