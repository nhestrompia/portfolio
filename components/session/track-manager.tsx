"use client";

import { ProjectMeta } from "@/lib/projects";
import { useAudioStore } from "@/store/audio";
import { useTracksStore } from "@/store/tracks";
import { useTransportStore } from "@/store/transport";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

/* Color mapping for project clips */
const CLIP_DOT_COLORS: Record<string, string> = {
  tridash: "bg-clip-orange",
  "shielded-x402": "bg-clip-blue",
  "trading-infra": "bg-clip-yellow",
  about: "bg-emerald-500",
};

interface TrackEntry {
  slug: string;
  name: string;
  category: string;
  isAbout?: boolean;
}

/* ═══════════════════════════════════════════════
   TrackRow — individual track row with drag grip
   ═══════════════════════════════════════════════ */
interface TrackRowProps {
  track: TrackEntry;
  isActive: boolean;
  isMuted: boolean;
  isSoloed: boolean;
  isDragTarget: boolean;
  isDragging: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  onToggleMute: () => void;
  onToggleSolo: () => void;
  onClick: () => void;
}

const TrackRow = forwardRef<HTMLDivElement, TrackRowProps>(function TrackRow(
  {
    track,
    isActive,
    isMuted,
    isSoloed,
    isDragTarget,
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onToggleMute,
    onToggleSolo,
    onClick,
  },
  ref,
) {
  const dotColor = CLIP_DOT_COLORS[track.slug] || "bg-muted-foreground";

  return (
    <div
      ref={ref}
      className={`border-b border-border px-4 py-3 transition-all duration-150 cursor-grab active:cursor-grabbing select-none touch-none
        ${isActive ? "bg-bg-active" : ""}
        ${isDragTarget ? "border-t-2 border-t-accent" : ""}
        ${isDragging ? "opacity-50 bg-accent/5" : ""}`}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Track header row */}
      <div className="flex items-center gap-2 mb-2">
        {/* Drag grip */}
        <div data-grip className="flex flex-col gap-[2px] p-0.5">
          <div className="w-4 h-[1.5px] bg-muted-foreground/30 rounded-full" />
          <div className="w-4 h-[1.5px] bg-muted-foreground/30 rounded-full" />
          <div className="w-4 h-[1.5px] bg-muted-foreground/30 rounded-full" />
        </div>
        <div className={`w-2 h-2 rounded-full ${dotColor}`} />
        <span
          className={`text-[10px] font-mono tracking-[0.1em] flex-1 truncate ${
            isActive ? "text-foreground font-medium" : "text-foreground/70"
          }`}
        >
          {track.name}
        </span>
      </div>

      {/* Controls row: S / M */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSolo();
          }}
          className={`w-6 h-5 text-[8px] font-mono tracking-wider rounded-[2px] border transition-colors cursor-pointer ${
            isSoloed
              ? "bg-clip-yellow text-foreground border-clip-yellow"
              : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground"
          }`}
        >
          S
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          className={`w-6 h-5 text-[8px] font-mono tracking-wider rounded-[2px] border transition-colors cursor-pointer ${
            isMuted
              ? "bg-destructive/80 text-white border-destructive"
              : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground"
          }`}
        >
          M
        </button>
        <div className="flex-1" />
        {/* Mini level meters */}
        <div className="flex gap-0.5 items-end">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-[0.5px] transition-all duration-300 ${
                isActive
                  ? i < 3
                    ? `${dotColor} opacity-70`
                    : "bg-muted-foreground/20"
                  : "bg-muted-foreground/15"
              }`}
              style={{
                height: `${6 + (isActive ? Math.random() * 6 : 2)}px`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Category sublabel */}
      <span className="text-[8px] font-mono tracking-[0.15em] text-muted-foreground mt-1.5 block">
        {track.category}
      </span>
    </div>
  );
});

/* ═══════════════════════════════════════════════
   TrackManager — sidebar on desktop, bottom tray on mobile
   Supports drag-to-reorder via pointer events
   ═══════════════════════════════════════════════ */
export function TrackManager({
  projects,
  variant = "sidebar",
}: {
  projects: ProjectMeta[];
  variant?: "sidebar" | "tray";
}) {
  const {
    activeTrack,
    mutedTracks,
    soloedTracks,
    trackOrder,
    toggleMute,
    toggleSolo,
    setTrackOrder,
    reorderTrack,
  } = useTracksStore();
  const { playSound } = useAudioStore();

  /* Build default track list */
  const defaultTracks: TrackEntry[] = [
    ...projects.map((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
    })),
    { slug: "about", name: "ABOUT", category: "OPERATOR", isAbout: true },
  ];

  /* Initialise store order on first render */
  useEffect(() => {
    if (trackOrder.length === 0) {
      setTrackOrder(defaultTracks.map((t) => t.slug));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Resolve ordered tracks from store order */
  const trackMap = new Map(defaultTracks.map((t) => [t.slug, t]));
  const orderedTracks: TrackEntry[] =
    trackOrder.length > 0
      ? trackOrder
          .map((slug) => trackMap.get(slug))
          .filter((t): t is TrackEntry => !!t)
      : defaultTracks;

  /* ── Drag-to-reorder state ── */
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleDragStart = useCallback(
    (e: React.PointerEvent, index: number) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDragIndex(index);
      setOverIndex(index);
      playSound("tick");
    },
    [playSound],
  );

  const handleDragMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragIndex === null) return;

      /* Determine which track we're hovering over */
      const y = e.clientY;
      for (let i = 0; i < trackRefs.current.length; i++) {
        const el = trackRefs.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (y >= rect.top && y <= rect.bottom) {
          setOverIndex(i);
          break;
        }
      }
    },
    [dragIndex],
  );

  const handleDragEnd = useCallback(() => {
    if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
      reorderTrack(dragIndex, overIndex);
      playSound("snap");
    }
    setDragIndex(null);
    setOverIndex(null);
  }, [dragIndex, overIndex, reorderTrack, playSound]);

  /* ── Tray (mobile) collapse state ── */
  const [trayOpen, setTrayOpen] = useState(false);

  /* Shared track list renderer (used by both variants) */
  const renderTrackList = () =>
    orderedTracks.map((track, index) => (
      <TrackRow
        key={track.slug}
        track={track}
        isActive={activeTrack === track.slug}
        isMuted={mutedTracks.has(track.slug)}
        isSoloed={soloedTracks.has(track.slug)}
        isDragTarget={
          overIndex === index && dragIndex !== null && dragIndex !== index
        }
        isDragging={dragIndex === index}
        ref={(el) => {
          trackRefs.current[index] = el;
        }}
        onPointerDown={(e) => handleDragStart(e, index)}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onToggleMute={() => {
          toggleMute(track.slug);
          playSound("snap");
        }}
        onToggleSolo={() => {
          toggleSolo(track.slug);
          playSound("tick");
        }}
        onClick={() => {
          if (track.isAbout) {
            useTransportStore.getState().setActivePanel("about");
          }
        }}
      />
    ));

  /* Bottom system readouts */
  const renderReadouts = (compact?: boolean) => (
    <div
      className={`border-t border-border ${
        compact ? "px-4 py-2 flex items-center gap-4" : "px-4 py-3 space-y-1.5"
      }`}
    >
      <div
        className={`flex items-center ${compact ? "gap-2" : "justify-between"}`}
      >
        <span className="text-[8px] font-mono tracking-[0.15em] text-muted-foreground">
          LATENCY
        </span>
        <span className="text-[9px] font-mono text-foreground/60">0.12ms</span>
      </div>
      <div
        className={`flex items-center ${compact ? "gap-2" : "justify-between"}`}
      >
        <span className="text-[8px] font-mono tracking-[0.15em] text-muted-foreground">
          CPU
        </span>
        <div className="flex gap-0.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-[0.5px] ${
                i < 3 ? "bg-led-active/60" : "bg-muted-foreground/15"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  /* ── TRAY variant (mobile) ── */
  if (variant === "tray") {
    return (
      <div className="md:hidden bg-background border-t border-border">
        {/* Tray handle — always visible */}
        <button
          onClick={() => {
            setTrayOpen(!trayOpen);
            playSound("tick");
          }}
          className="w-full flex items-center justify-between px-4 py-2 cursor-pointer active:bg-bg-active transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground">
              TRACK MANAGER
            </span>
            <span className="text-[8px] font-mono text-muted-foreground/60">
              {orderedTracks.length} TRACKS
            </span>
          </div>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`text-muted-foreground transition-transform duration-200 ${
              trayOpen ? "rotate-180" : ""
            }`}
          >
            <path
              d="M3 7.5L6 4.5L9 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Collapsed: compact inline track strips */}
        {!trayOpen && (
          <div className="flex gap-1.5 px-3 pb-2 overflow-x-auto scrollbar-none">
            {orderedTracks.map((track) => {
              const isActive = activeTrack === track.slug;
              const dotColor =
                CLIP_DOT_COLORS[track.slug] || "bg-muted-foreground";
              const isMuted = mutedTracks.has(track.slug);
              return (
                <div
                  key={track.slug}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md border shrink-0 transition-colors ${
                    isActive
                      ? "border-accent/40 bg-accent/5"
                      : "border-border bg-muted/30"
                  } ${isMuted ? "opacity-40" : ""}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                  <span className="text-[8px] font-mono tracking-[0.08em] text-foreground/70 whitespace-nowrap">
                    {track.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Expanded: full track list with drag reorder */}
        {trayOpen && (
          <div className="max-h-[45vh] overflow-y-auto border-t border-border/50">
            {renderTrackList()}
            {renderReadouts(true)}
          </div>
        )}
      </div>
    );
  }

  /* ── SIDEBAR variant (desktop) ── */
  return (
    <div className="w-[200px] bg-background border-r border-border flex flex-col shrink-0">
      {/* Header */}
      <div className="h-10 border-b border-border flex items-center px-4">
        <span className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground">
          TRACK MANAGER
        </span>
      </div>

      {/* Track list */}
      <div className="flex-1 overflow-y-auto">{renderTrackList()}</div>

      {/* Bottom system readouts */}
      {renderReadouts()}
    </div>
  );
}
