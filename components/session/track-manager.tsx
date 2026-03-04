"use client";

import { useHaptics } from "@/lib/haptics";
import { ProjectMeta } from "@/lib/projects";
import { useAudioStore } from "@/store/audio";
import { useTracksStore } from "@/store/tracks";
import { useTransportStore } from "@/store/transport";
import { useRouter } from "next/navigation";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

/* Color mapping for project clips */
const CLIP_DOT_COLORS: Record<string, string> = {
  tridash: "bg-clip-orange",
  "shielded-x402": "bg-clip-blue",
  seloria: "bg-violet-400",
  zkblackjack: "bg-emerald-400",
  about: "bg-clip-yellow",
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
      className={`border-b border-border px-3 flex-1 flex items-center transition-all duration-150 cursor-grab active:cursor-grabbing select-none touch-none
        ${isActive ? "bg-bg-active" : ""}
        ${isDragTarget ? "border-t-2 border-t-accent" : ""}
        ${isDragging ? "opacity-50 bg-accent/5" : ""}`}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Compact single-row track */}
      <div className="flex items-center gap-2 w-full">
        {/* Drag grip */}
        <div data-grip className="flex flex-col gap-[2px] p-0.5 shrink-0">
          <div className="w-3.5 h-[1.5px] bg-muted-foreground/30 rounded-full" />
          <div className="w-3.5 h-[1.5px] bg-muted-foreground/30 rounded-full" />
          <div className="w-3.5 h-[1.5px] bg-muted-foreground/30 rounded-full" />
        </div>
        <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
        <div className="flex-1 min-w-0">
          <span
            className={`text-[10px] font-mono tracking-[0.1em] block truncate ${
              isActive ? "text-foreground font-medium" : "text-foreground/70"
            }`}
          >
            {track.name}
          </span>
          <span className="text-[7px] font-mono tracking-[0.12em] text-muted-foreground/60 block truncate">
            {track.category}
          </span>
        </div>
        {/* S / M buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSolo();
            }}
            className={`w-5 h-4 text-[7px] font-mono tracking-wider rounded-[2px] border transition-colors cursor-pointer ${
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
            className={`w-5 h-4 text-[7px] font-mono tracking-wider rounded-[2px] border transition-colors cursor-pointer ${
              isMuted
                ? "bg-destructive/80 text-white border-destructive"
                : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground"
            }`}
          >
            M
          </button>
        </div>
      </div>
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

  const router = useRouter();
  const haptics = useHaptics();

  /* Desired default order */
  const DESIRED_ORDER = [
    "about",
    "shielded-x402",
    "tridash",
    "seloria",
    "zkblackjack",
  ];

  /* Build default track list */
  const projectMap = new Map(projects.map((p) => [p.slug, p]));
  const aboutEntry: TrackEntry = {
    slug: "about",
    name: "ABOUT",
    category: "OPERATOR",
    isAbout: true,
  };
  const defaultTracks: TrackEntry[] = DESIRED_ORDER.map((slug) => {
    if (slug === "about") return aboutEntry;
    const p = projectMap.get(slug);
    return p ? { slug: p.slug, name: p.name, category: p.category } : null;
  }).filter((t): t is TrackEntry => t !== null);

  /* Initialise store order on first render or when project count changes */
  useEffect(() => {
    const allSlugs = defaultTracks.map((t) => t.slug);
    if (
      trackOrder.length === 0 ||
      trackOrder.length !== allSlugs.length ||
      !allSlugs.every((s) => trackOrder.includes(s))
    ) {
      setTrackOrder(allSlugs);
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
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const didDrag = useRef(false);
  const DRAG_THRESHOLD = 6; // px — movement below this is a click, above is a drag

  const handleDragStart = useCallback(
    (e: React.PointerEvent, index: number) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      didDrag.current = false;
      setDragIndex(index);
      setOverIndex(index);
    },
    [],
  );

  const handleDragMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragIndex === null) return;

      /* Check if movement exceeds drag threshold */
      if (!didDrag.current && dragStartPos.current) {
        const dx = Math.abs(e.clientX - dragStartPos.current.x);
        const dy = Math.abs(e.clientY - dragStartPos.current.y);
        if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
          didDrag.current = true;
          playSound("tick");
          haptics.tap();
        }
      }

      if (!didDrag.current) return;

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
    [dragIndex, playSound],
  );

  const handleDragEnd = useCallback(() => {
    if (
      didDrag.current &&
      dragIndex !== null &&
      overIndex !== null &&
      dragIndex !== overIndex
    ) {
      reorderTrack(dragIndex, overIndex);
      playSound("snap");
      haptics.nudge();
    }
    dragStartPos.current = null;
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
          haptics.nudge();
        }}
        onToggleSolo={() => {
          toggleSolo(track.slug);
          playSound("tick");
          haptics.tap();
        }}
        onClick={() => {
          /* Only navigate if this wasn't a drag gesture */
          if (didDrag.current) return;
          if (track.isAbout) {
            useTransportStore.getState().setActivePanel("about");
          } else {
            playSound("tick");
            haptics.tap();
            router.push(`/session/projects/${track.slug}`);
          }
        }}
      />
    ));

  /* ── TRAY variant (mobile) ── */
  if (variant === "tray") {
    return (
      <div className="bg-background border-t border-border">
        {/* Tray handle — always visible */}
        <button
          onClick={() => {
            setTrayOpen(!trayOpen);
            playSound("tick");
            haptics.tap();
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
                <button
                  key={track.slug}
                  onClick={() => {
                    playSound("tick");
                    haptics.tap();
                    if (track.isAbout) {
                      useTransportStore.getState().setActivePanel("about");
                    } else {
                      router.push(`/session/projects/${track.slug}`);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md border shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? "border-accent/40 bg-accent/5"
                      : "border-border bg-muted/30"
                  } ${isMuted ? "opacity-40" : ""}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                  <span className="text-[8px] font-mono tracking-[0.08em] text-foreground/70 whitespace-nowrap">
                    {track.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Expanded: full track list with drag reorder */}
        {trayOpen && (
          <div className="max-h-[45vh] overflow-y-auto border-t border-border/50">
            {renderTrackList()}
          </div>
        )}
      </div>
    );
  }

  /* ── SIDEBAR variant (desktop) ── */
  return (
    <div className="w-[200px] bg-background border-r border-border flex flex-col shrink-0 h-full">
      {/* Header — matches timeline ruler height */}
      <div className="h-6 md:h-8 border-b border-border flex items-center px-4 shrink-0">
        <span className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground">
          TRACK MANAGER
        </span>
      </div>

      {/* Track list — each row is 1/N of available height to match timeline lanes */}
      <div className="flex-1 flex flex-col min-h-0">{renderTrackList()}</div>
    </div>
  );
}
