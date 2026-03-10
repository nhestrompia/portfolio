"use client";

import { useTimerContext } from "@/lib/timer-context";
import { useTransportStore } from "@/store/transport";

export function SystemBar() {
  const { bpm, loopActive, syncLink } = useTransportStore();
  const { timecode } = useTimerContext();

  return (
    <div className="h-8 md:h-10 bg-background border-b border-border flex items-center justify-between px-2 md:px-4 shrink-0">
      {/* Left: System identity */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        <span className="text-[9px] md:text-[10px] font-mono tracking-[0.2em] text-foreground font-medium whitespace-nowrap">
          SYSTEM_01
        </span>
        <div className="w-px h-4 bg-border hidden sm:block" />
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] font-mono tracking-[0.15em] text-muted-foreground">
              TEMPO
            </span>
            <span className="text-[10px] font-mono text-foreground font-medium">
              {bpm}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] font-mono tracking-[0.15em] text-muted-foreground">
              METER
            </span>
            <span className="text-[10px] font-mono text-foreground font-medium">
              4/4
            </span>
          </div>
        </div>
      </div>

      {/* Center: Timecode display */}
      <div className="flex items-center gap-3">
        <div className="bg-accent/10 border border-accent/20 rounded-full px-3 md:px-4 py-0.5 md:py-1">
          <span className="text-[10px] md:text-[12px] font-mono tracking-[0.1em] text-accent font-semibold tabular-nums">
            {timecode}
          </span>
        </div>
      </div>

      {/* Right: Status indicators — hidden on small screens */}
      <div className="hidden md:flex items-center gap-4">
        {loopActive && (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-[8px] font-mono tracking-[0.15em] text-muted-foreground">
              LOOP
            </span>
          </div>
        )}
        {syncLink && (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-led-active" />
            <span className="text-[8px] font-mono tracking-[0.15em] text-muted-foreground">
              SYNC
            </span>
          </div>
        )}
        <div className="w-px h-4 bg-border" />
        <span className="text-[8px] font-mono tracking-[0.15em] text-muted-foreground">
          OUTPUT: STEREO
        </span>
      </div>
      {/* Mobile: just show a LED */}
      <div className="flex md:hidden items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-led-active" />
      </div>
    </div>
  );
}
