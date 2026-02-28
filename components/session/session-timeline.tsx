"use client";

import type { ProjectMeta } from "@/lib/projects";
import { useAudioStore } from "@/store/audio";
import { useProjectsStore } from "@/store/projects";
import { useTracksStore } from "@/store/tracks";
import { useTransportStore } from "@/store/transport";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { PanelOverlay } from "../modules/panel-overlay";

interface SessionTimelineProps {
  projects: ProjectMeta[];
}

/* Clip color mapping — solid, vibrant, matching reference */
const CLIP_COLORS: Record<string, string> = {
  tridash: "bg-clip-orange",
  "shielded-x402": "bg-clip-blue",
  "trading-infra": "bg-clip-yellow",
  about: "bg-emerald-500",
};

const CLIP_BORDER_COLORS: Record<string, string> = {
  tridash: "border-foreground/20",
  "shielded-x402": "border-foreground/20",
  "trading-infra": "border-foreground/20",
  about: "border-foreground/20",
};

/* Badge labels shown on each clip */
const CLIP_BADGE: Record<string, string> = {
  tridash: "ENGINE_FLOW",
  "shielded-x402": "X402_PULSE",
  "trading-infra": "INFRA_CHAIN",
  about: "OPER_INFO",
};

/* Subtitle text for each clip */
const CLIP_SUBTITLE: Record<string, string> = {
  tridash: "CORE ARCH",
  "shielded-x402": "SCALING LOGIC",
  "trading-infra": "ASSET LIBRARY",
  about: "BIO & STACK",
};

/* Visualization type per clip */
type VizType = "waveform" | "midi" | "dots";
const CLIP_VIZ: Record<string, VizType> = {
  tridash: "waveform",
  "shielded-x402": "dots",
  "trading-infra": "midi",
  about: "waveform",
};

/* All clip positions as percentage of total duration (0–100) */
const TOTAL_LANES = 4;

/* start/width in % of timeline; lane is the default index (overridden by trackOrder) */
const CLIP_LAYOUT: Record<string, { start: number; width: number }> = {
  tridash: { start: 3, width: 28 },
  "shielded-x402": { start: 34, width: 26 },
  about: { start: 55, width: 16 },
  "trading-infra": { start: 64, width: 20 },
};

/* Default order (used if store hasn't been initialised yet) */
const DEFAULT_TRACK_ORDER = [
  "tridash",
  "shielded-x402",
  "about",
  "trading-infra",
];

/* About track virtual data */
const ABOUT_CLIP = {
  slug: "about",
  name: "ABOUT",
  number: "00",
  chain: "OPERATOR",
  shortDescription:
    "Full-stack & blockchain engineer. Building decentralized infra, real-time systems, and polished interfaces.",
};

const AUTO_PLAY_SPEED = 0.06; // percentage per frame (~3.6%/sec at 60fps → full loop ~28s)

/* Time ruler marker count */
const RULER_DIVISIONS = 16;

/* Waveform presets — jagged, prominent peaks like the reference */
const WAVEFORM_PRESETS: Record<string, number[]> = {
  tridash: [
    50, 30, 65, 18, 78, 12, 85, 25, 70, 8, 88, 22, 75, 15, 82, 10, 90, 28, 68,
    14, 80, 20, 72, 35, 58, 22, 75, 18, 82, 30, 62, 16, 78, 10, 88, 38, 55, 20,
    78, 14, 85, 32, 60, 25, 68, 50,
  ],
  about: [
    50, 40, 60, 35, 65, 30, 70, 38, 62, 34, 66, 28, 72, 40, 58, 36, 64, 30, 68,
    38, 62, 35, 65, 42, 56, 36, 64, 40, 58, 38, 62, 34, 66, 40, 60, 36, 64, 42,
    56, 38, 62, 50,
  ],
};

/* Build a mirrored waveform SVG path from amplitude values */
function buildWaveformPath(amplitudes: number[]): string {
  const step = 100 / (amplitudes.length - 1);
  let top = `M0,${amplitudes[0]}`;
  for (let i = 1; i < amplitudes.length; i++) {
    top += ` L${(i * step).toFixed(1)},${amplitudes[i]}`;
  }
  let bottom = "";
  for (let i = amplitudes.length - 1; i >= 0; i--) {
    const mirroredY = 100 - amplitudes[i];
    bottom += ` L${(i * step).toFixed(1)},${mirroredY}`;
  }
  return `${top}${bottom} Z`;
}

/* Audio waveform visualization — jagged peaks like the reference */
function WaveformViz() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ opacity: 0.35 }}
    >
      <path
        d={buildWaveformPath(WAVEFORM_PRESETS.tridash)}
        fill="white"
        stroke="white"
        strokeWidth="0.5"
      />
      <line
        x1="0"
        y1="50"
        x2="100"
        y2="50"
        stroke="white"
        strokeWidth="0.2"
        opacity="0.4"
      />
    </svg>
  );
}

/* Gentle waveform for about clip */
function WaveformVizAbout() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ opacity: 0.25 }}
    >
      <path
        d={buildWaveformPath(WAVEFORM_PRESETS.about)}
        fill="white"
        stroke="white"
        strokeWidth="0.3"
      />
      <line
        x1="0"
        y1="50"
        x2="100"
        y2="50"
        stroke="white"
        strokeWidth="0.2"
        opacity="0.3"
      />
    </svg>
  );
}

/* MIDI block visualization — rectangular note blocks spread across the clip */
function MidiViz() {
  // Deterministic MIDI "notes" — positioned as (x%, y%, w%, h%)
  const notes = [
    { x: 5, y: 25, w: 12, h: 18 },
    { x: 20, y: 55, w: 8, h: 15 },
    { x: 32, y: 15, w: 14, h: 20 },
    { x: 50, y: 40, w: 6, h: 22 },
    { x: 60, y: 65, w: 10, h: 14 },
    { x: 74, y: 20, w: 8, h: 25 },
    { x: 85, y: 50, w: 10, h: 18 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {notes.map((n, i) => (
        <div
          key={i}
          className="absolute bg-white/20 rounded-[1px] border border-white/10"
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            width: `${n.w}%`,
            height: `${n.h}%`,
          }}
        />
      ))}
      {/* Horizontal grid lines for MIDI look */}
      {[20, 40, 60, 80].map((y) => (
        <div
          key={y}
          className="absolute left-0 right-0 h-px bg-white/8"
          style={{ top: `${y}%` }}
        />
      ))}
    </div>
  );
}

/* Dot/pulse visualization — scattered circles for electronic/digital feel */
function DotsViz() {
  const dots = [
    { x: 8, y: 30, r: 4 },
    { x: 18, y: 65, r: 3 },
    { x: 28, y: 40, r: 5 },
    { x: 38, y: 20, r: 3 },
    { x: 48, y: 55, r: 4 },
    { x: 55, y: 35, r: 6 },
    { x: 65, y: 70, r: 3 },
    { x: 72, y: 25, r: 4 },
    { x: 80, y: 50, r: 5 },
    { x: 90, y: 38, r: 3 },
  ];
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ opacity: 0.25 }}
    >
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="white" />
      ))}
      {/* Connecting line through some dots */}
      <polyline
        points={dots.map((d) => `${d.x},${d.y}`).join(" ")}
        fill="none"
        stroke="white"
        strokeWidth="0.4"
        opacity="0.4"
      />
    </svg>
  );
}

/* Unified clip visualization selector */
function ClipViz({ slug }: { slug: string }) {
  const vizType = CLIP_VIZ[slug] || "waveform";
  switch (vizType) {
    case "midi":
      return <MidiViz />;
    case "dots":
      return <DotsViz />;
    case "waveform":
    default:
      return slug === "about" ? <WaveformVizAbout /> : <WaveformViz />;
  }
}

export function SessionTimeline({ projects }: SessionTimelineProps) {
  const router = useRouter();
  const { activePanel, isPlaying, setPlaying } = useTransportStore();
  const { activeTrack, updatePlayhead, setPlayheadPosition, trackOrder } =
    useTracksStore();

  /* Resolve lane index from trackOrder (falls back to default) */
  const effectiveOrder =
    trackOrder.length > 0 ? trackOrder : DEFAULT_TRACK_ORDER;
  const laneOf = (slug: string) => {
    const idx = effectiveOrder.indexOf(slug);
    return idx >= 0 ? idx : DEFAULT_TRACK_ORDER.indexOf(slug);
  };
  const { playSound } = useAudioStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const playheadRef = useRef(0); // 0–100 percentage
  const isDragging = useRef(false);

  const [playheadPos, setPlayheadPos] = useState(0); // for rendering
  const [previewProject, setPreviewProject] = useState<ProjectMeta | null>(
    null,
  );
  const [previewAbout, setPreviewAbout] = useState(false);
  const previewTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showTimeline = activePanel === "projects" || activePanel === null;

  /* All clips for detection — projects + about */
  const allClips = [
    ...projects.map((p) => ({ slug: p.slug, isAbout: false })),
    { slug: "about", isAbout: true },
  ];

  // Initialize projects in store
  useEffect(() => {
    useProjectsStore.getState().setProjects(projects);
  }, [projects]);

  // Auto-start playback
  useEffect(() => {
    if (!isPlaying) setPlaying(true);
  }, [isPlaying, setPlaying]);

  // Compute which clip the playhead is over
  const computeActiveClip = useCallback(
    (pos: number) => {
      let foundSlug: string | null = null;

      for (const clip of allClips) {
        const layout = CLIP_LAYOUT[clip.slug];
        if (!layout) continue;
        if (pos >= layout.start && pos <= layout.start + layout.width) {
          foundSlug = clip.slug;
          break;
        }
      }

      // Update store proximity
      const proximity: Record<string, "ACTIVE" | "NEAR" | "FAR"> = {};
      for (const clip of allClips) {
        const layout = CLIP_LAYOUT[clip.slug];
        if (!layout) {
          proximity[clip.slug] = "FAR";
          continue;
        }
        const clipCenter = layout.start + layout.width / 2;
        const dist = Math.abs(pos - clipCenter);
        if (clip.slug === foundSlug) {
          proximity[clip.slug] = "ACTIVE";
        } else if (dist < 15) {
          proximity[clip.slug] = "NEAR";
        } else {
          proximity[clip.slug] = "FAR";
        }
      }

      const progress = pos / 100;
      updatePlayhead(foundSlug, proximity, Math.max(0, Math.min(1, progress)));
      setPlayheadPosition(Math.max(0, Math.min(1, progress)));

      return foundSlug;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projects, updatePlayhead, setPlayheadPosition],
  );

  // Derive preview from active track
  useEffect(() => {
    if (activeTrack === "about") {
      setPreviewProject(null);
      setPreviewAbout(true);
    } else if (activeTrack) {
      setPreviewAbout(false);
      const found = projects.find((p) => p.slug === activeTrack) || null;
      setPreviewProject(found);
    } else {
      setPreviewProject(null);
      setPreviewAbout(false);
    }

    if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    if (activeTrack) {
      previewTimerRef.current = setTimeout(() => {
        setPreviewProject(null);
        setPreviewAbout(false);
      }, 6000);
    }
    return () => {
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTrack]);

  // Auto-play: move playhead from left to right
  useEffect(() => {
    if (!isPlaying || !showTimeline) return;

    const animate = () => {
      if (!isDragging.current) {
        playheadRef.current += AUTO_PLAY_SPEED;
        if (playheadRef.current > 100) playheadRef.current = 0;
        setPlayheadPos(playheadRef.current);
        computeActiveClip(playheadRef.current);
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, showTimeline, computeActiveClip]);

  // Click / drag to scrub — smooth, no play/pause toggling
  const getPositionFromEvent = useCallback((clientX: number) => {
    if (!containerRef.current) return playheadRef.current;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    return Math.max(0, Math.min(100, pct));
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      const pos = getPositionFromEvent(e.clientX);
      playheadRef.current = pos;
      setPlayheadPos(pos);
      computeActiveClip(pos);
      playSound("snap");
    },
    [getPositionFromEvent, computeActiveClip, playSound],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const pos = getPositionFromEvent(e.clientX);
      playheadRef.current = pos;
      setPlayheadPos(pos);
      computeActiveClip(pos);
    },
    [getPositionFromEvent, computeActiveClip],
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Time ruler markers
  const rulerMarkers = Array.from({ length: RULER_DIVISIONS + 1 }, (_, i) => ({
    pct: (i / RULER_DIVISIONS) * 100,
    label: `${String(i + 1).padStart(2, "0")}.0.0`,
    isMajor: i % 4 === 0,
  }));

  const laneHeight = 100 / TOTAL_LANES;

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative h-full">
      <PanelOverlay />

      {showTimeline && (
        <div className="flex-1 flex flex-col relative">
          {/* Time ruler */}
          <div className="h-6 md:h-8 border-b border-border bg-background relative overflow-hidden select-none">
            {rulerMarkers.map((marker) => (
              <div
                key={marker.pct}
                className="absolute top-0 h-full flex flex-col justify-end"
                style={{ left: `${marker.pct}%` }}
              >
                {marker.isMajor && (
                  <span className="text-[8px] font-mono tracking-[0.1em] text-muted-foreground px-1 pb-1">
                    {marker.label}
                  </span>
                )}
                <div
                  className={`w-px ${marker.isMajor ? "h-3 bg-border" : "h-1.5 bg-border/50"}`}
                />
              </div>
            ))}
            {/* Playhead marker on ruler */}
            <div
              className="absolute top-0 h-full w-px bg-accent/70 z-10 pointer-events-none"
              style={{ left: `${playheadPos}%` }}
            />
          </div>

          {/* Clip lanes */}
          <div
            ref={containerRef}
            className="flex-1 relative overflow-hidden cursor-crosshair select-none touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Lane backgrounds */}
            <div className="absolute inset-0">
              {Array.from({ length: TOTAL_LANES }).map((_, i) => (
                <div
                  key={`lane-${i}`}
                  className={`border-b border-border ${
                    i % 2 === 0 ? "bg-background" : "bg-muted/30"
                  }`}
                  style={{ height: `${laneHeight}%` }}
                />
              ))}
            </div>

            {/* Vertical grid lines */}
            <div className="absolute inset-0 pointer-events-none">
              {rulerMarkers.map((marker) => (
                <div
                  key={`grid-${marker.pct}`}
                  className={`absolute top-0 bottom-0 w-px ${
                    marker.isMajor ? "bg-border/40" : "bg-border/20"
                  }`}
                  style={{ left: `${marker.pct}%` }}
                />
              ))}
            </div>

            {/* Project clips */}
            {projects.map((project) => {
              const layout = CLIP_LAYOUT[project.slug];
              if (!layout) return null;
              const lane = laneOf(project.slug);
              const isActive = activeTrack === project.slug;
              const clipColor =
                CLIP_COLORS[project.slug] || "bg-muted-foreground";
              const borderColor =
                CLIP_BORDER_COLORS[project.slug] ||
                "border-muted-foreground/30";

              return (
                <motion.div
                  key={project.slug}
                  className={`absolute rounded-md border-2 ${borderColor} ${clipColor} cursor-pointer overflow-hidden
                             transition-shadow duration-200
                             ${isActive ? "shadow-lg ring-1 ring-foreground/10" : "shadow-sm"}`}
                  style={{
                    left: `${layout.start}%`,
                    width: `${layout.width}%`,
                    top: `calc(${lane * laneHeight}% + 6px)`,
                    height: `calc(${laneHeight}% - 12px)`,
                    transition: "top 0.3s ease",
                  }}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: isActive ? 1.01 : 1 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    playSound("tick");
                    router.push(`/session/projects/${project.slug}`);
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Visualization layer */}
                  <ClipViz slug={project.slug} />
                  {/* Badge + subtitle label — top-left */}
                  <div className="absolute top-1.5 left-2 z-[1] flex flex-col gap-0.5">
                    <span className="text-[8px] font-mono tracking-[0.1em] text-white/90 bg-black/30 px-1.5 py-0.5 rounded-[2px] inline-block w-fit backdrop-blur-sm">
                      {CLIP_BADGE[project.slug] || project.number}
                    </span>
                    <span className="text-[11px] font-heading font-bold tracking-[0.06em] text-white drop-shadow-md">
                      {CLIP_SUBTITLE[project.slug] || project.name}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* About clip */}
            {(() => {
              const layout = CLIP_LAYOUT.about;
              const aboutLane = laneOf("about");
              const isActive = activeTrack === "about";
              return (
                <motion.div
                  className={`absolute rounded-md border-2 ${CLIP_BORDER_COLORS.about} ${CLIP_COLORS.about} cursor-pointer overflow-hidden
                             transition-shadow duration-200
                             ${isActive ? "shadow-lg ring-1 ring-foreground/10" : "shadow-sm"}`}
                  style={{
                    left: `${layout.start}%`,
                    width: `${layout.width}%`,
                    top: `calc(${aboutLane * laneHeight}% + 6px)`,
                    height: `calc(${laneHeight}% - 12px)`,
                    transition: "top 0.3s ease",
                  }}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: isActive ? 1.01 : 1 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    playSound("tick");
                    useTransportStore.getState().setActivePanel("about");
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <ClipViz slug="about" />
                  <div className="absolute top-1.5 left-2 z-[1] flex flex-col gap-0.5">
                    <span className="text-[8px] font-mono tracking-[0.1em] text-white/90 bg-black/30 px-1.5 py-0.5 rounded-[2px] inline-block w-fit backdrop-blur-sm">
                      {CLIP_BADGE.about}
                    </span>
                    <span className="text-[11px] font-heading font-bold tracking-[0.06em] text-white drop-shadow-md">
                      {CLIP_SUBTITLE.about}
                    </span>
                  </div>
                </motion.div>
              );
            })()}

            {/* Moving playhead — vertical orange line */}
            <div
              className="absolute top-0 bottom-0 z-20 pointer-events-none"
              style={{
                left: `${playheadPos}%`,
                transition: isDragging.current ? "none" : undefined,
              }}
            >
              <div className="w-px h-full bg-accent/70" />
              <div
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-accent rounded-full"
                style={{ animation: "playhead-pulse 2s ease-in-out infinite" }}
              />
            </div>
          </div>

          {/* Auto-preview popup — hidden for now, using inspector panel instead */}
          <AnimatePresence>
            {false && (previewProject || previewAbout) && (
              <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-panel rounded-md shadow-xl border border-border p-4 w-72
                           cursor-pointer"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  if (previewAbout) {
                    useTransportStore.getState().setActivePanel("about");
                  } else if (previewProject) {
                    router.push(`/session/projects/${previewProject.slug}`);
                  }
                }}
                onMouseEnter={() => {
                  if (previewTimerRef.current)
                    clearTimeout(previewTimerRef.current);
                }}
                onMouseLeave={() => {
                  previewTimerRef.current = setTimeout(() => {
                    setPreviewProject(null);
                    setPreviewAbout(false);
                  }, 2000);
                }}
              >
                {previewAbout ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-mono tracking-[0.15em] text-panel-foreground/50">
                        OPERATOR_INFO
                      </span>
                    </div>
                    <h4 className="text-sm font-heading font-semibold tracking-[0.08em] text-panel-foreground mb-1">
                      About — Umut
                    </h4>
                    <p className="text-[9px] font-mono text-panel-foreground/50 leading-relaxed">
                      {ABOUT_CLIP.shortDescription}
                    </p>
                  </>
                ) : previewProject ? (
                  (() => {
                    const pp = previewProject!;
                    return (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              CLIP_COLORS[
                                pp.slug as keyof typeof CLIP_COLORS
                              ] || "bg-muted-foreground"
                            }`}
                          />
                          <span className="text-[10px] font-mono tracking-[0.15em] text-panel-foreground/50">
                            ACTIVE_PROJECT
                          </span>
                        </div>
                        <h4 className="text-sm font-heading font-semibold tracking-[0.08em] text-panel-foreground mb-1">
                          {pp.name}
                        </h4>
                        <p className="text-[9px] font-mono text-panel-foreground/50 leading-relaxed mb-3">
                          {pp.shortDescription}
                        </p>
                        <div className="flex gap-2">
                          {pp.links.demo && (
                            <a
                              href={pp.links.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[8px] font-mono tracking-[0.15em] px-3 py-1.5 bg-accent text-white rounded-sm hover:bg-accent/90"
                              onClick={(e) => e.stopPropagation()}
                            >
                              LIVE
                            </a>
                          )}
                          {pp.links.source && (
                            <a
                              href={pp.links.source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[8px] font-mono tracking-[0.15em] px-3 py-1.5 bg-panel-foreground/10 text-panel-foreground rounded-sm hover:bg-panel-foreground/20"
                              onClick={(e) => e.stopPropagation()}
                            >
                              CODE
                            </a>
                          )}
                        </div>
                      </>
                    );
                  })()
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
