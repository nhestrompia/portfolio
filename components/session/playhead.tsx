"use client";

/**
 * Playhead — horizontal indicator line fixed at the vertical center of the track area.
 * Design doc: "slightly brighter than tracks, faint glow only, slow micro pulse"
 * Playhead = system heartbeat
 */
export function Playhead() {
  return (
    <div
      className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
      aria-hidden="true"
    >
      {/* Faint glow layer */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-[1px] h-[3px] bg-foreground/[0.03] blur-sm animate-[playhead-pulse_5s_ease-in-out_infinite]" />

      {/* Core line — thin, warm */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-px h-px bg-foreground/[0.15] animate-[playhead-pulse_5s_ease-in-out_infinite]" />

      {/* Left tick mark */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2">
        <div className="w-1 h-2 bg-foreground/20" />
      </div>

      {/* Right tick mark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2">
        <div className="w-1 h-2 bg-foreground/20" />
      </div>

      {/* NOW label — whisper quiet */}
      <div className="absolute left-3.5 -top-3">
        <span className="text-[7px] font-mono text-foreground/15 tracking-[0.25em]">
          NOW
        </span>
      </div>
    </div>
  );
}
