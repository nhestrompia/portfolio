"use client";

import { useSignalStore, type DrumChannel } from "@/store/signal";
import { useCallback, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════
   SIGNAL_DRUM_MACHINE — 4×2 pad grid
   Keyboard: A S D F / J K L ;

   Each sound uses layered synthesis for quality:
   - Kick: pitched sine body + sub click
   - Snare: pitched body + filtered noise rattle
   - Hats: bandpass-filtered noise + metallic ping
   - Rim: sharp high-passed click with resonance
   - FX: filtered noise sweep
   - Stab: detuned saw chord
   ═══════════════════════════════════════════════ */
const DRUM_PADS: {
  ch: DrumChannel;
  label: string;
  key: string;
  keyLabel: string;
}[] = [
  { ch: "kick", label: "KICK", key: "a", keyLabel: "A" },
  { ch: "snare", label: "SNARE", key: "s", keyLabel: "S" },
  { ch: "closedHat", label: "CH", key: "d", keyLabel: "D" },
  { ch: "openHat", label: "OH", key: "f", keyLabel: "F" },
  { ch: "perc", label: "PERC", key: "j", keyLabel: "J" },
  { ch: "click", label: "RIM", key: "k", keyLabel: "K" },
  { ch: "noise", label: "CLAP", key: "l", keyLabel: "L" },
  { ch: "toneHit", label: "STAB", key: ";", keyLabel: ";" },
];

const PAD_COLORS: Record<DrumChannel, string> = {
  kick: "#ff6b35",
  snare: "#facc15",
  closedHat: "#4ade80",
  openHat: "#34d399",
  perc: "#a78bfa",
  click: "#60a5fa",
  noise: "#f87171",
  toneHit: "#fb923c",
};

/* ─── Custom drum trigger functions using raw AudioContext for quality ─── */
type TriggerFn = (ctx: AudioContext, time: number) => void;

function createKick(ctx: AudioContext, time: number) {
  // Body oscillator: sine that pitch-drops from 150Hz → 40Hz
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(40, time + 0.07);
  gain.gain.setValueAtTime(0.9, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
  osc.connect(gain).connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.5);

  // Click transient
  const click = ctx.createOscillator();
  const clickGain = ctx.createGain();
  click.type = "sine";
  click.frequency.setValueAtTime(800, time);
  click.frequency.exponentialRampToValueAtTime(60, time + 0.02);
  clickGain.gain.setValueAtTime(0.6, time);
  clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
  click.connect(clickGain).connect(ctx.destination);
  click.start(time);
  click.stop(time + 0.05);
}

function createSnare(ctx: AudioContext, time: number) {
  // Body: pitched sine ~180Hz
  const body = ctx.createOscillator();
  const bodyGain = ctx.createGain();
  body.type = "triangle";
  body.frequency.setValueAtTime(180, time);
  body.frequency.exponentialRampToValueAtTime(80, time + 0.04);
  bodyGain.gain.setValueAtTime(0.7, time);
  bodyGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
  body.connect(bodyGain).connect(ctx.destination);
  body.start(time);
  body.stop(time + 0.13);

  // Noise rattle through bandpass
  const bufferSize = ctx.sampleRate * 0.2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const noiseGain = ctx.createGain();
  const hpf = ctx.createBiquadFilter();
  hpf.type = "highpass";
  hpf.frequency.value = 1000;
  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.value = 9000;
  noiseGain.gain.setValueAtTime(0.55, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
  noise.connect(hpf).connect(lpf).connect(noiseGain).connect(ctx.destination);
  noise.start(time);
  noise.stop(time + 0.2);
}

function createClosedHat(ctx: AudioContext, time: number) {
  // Bandpass-filtered noise for sizzle
  const bufferSize = ctx.sampleRate * 0.06;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const gain = ctx.createGain();
  const hpf = ctx.createBiquadFilter();
  hpf.type = "highpass";
  hpf.frequency.value = 7000;
  const bpf = ctx.createBiquadFilter();
  bpf.type = "bandpass";
  bpf.frequency.value = 10000;
  bpf.Q.value = 1.5;
  gain.gain.setValueAtTime(0.45, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
  noise.connect(hpf).connect(bpf).connect(gain).connect(ctx.destination);
  noise.start(time);
  noise.stop(time + 0.06);

  // Metallic ping
  const ping = ctx.createOscillator();
  const pingGain = ctx.createGain();
  ping.type = "square";
  ping.frequency.value = 6500;
  pingGain.gain.setValueAtTime(0.08, time);
  pingGain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
  ping.connect(pingGain).connect(ctx.destination);
  ping.start(time);
  ping.stop(time + 0.025);
}

function createOpenHat(ctx: AudioContext, time: number) {
  // Longer filtered noise
  const bufferSize = ctx.sampleRate * 0.35;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const gain = ctx.createGain();
  const hpf = ctx.createBiquadFilter();
  hpf.type = "highpass";
  hpf.frequency.value = 6000;
  const bpf = ctx.createBiquadFilter();
  bpf.type = "bandpass";
  bpf.frequency.value = 9000;
  bpf.Q.value = 1.0;
  gain.gain.setValueAtTime(0.4, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
  noise.connect(hpf).connect(bpf).connect(gain).connect(ctx.destination);
  noise.start(time);
  noise.stop(time + 0.35);
}

function createPerc(ctx: AudioContext, time: number) {
  // Tuned tom/conga: sine with pitch drop
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(250, time);
  osc.frequency.exponentialRampToValueAtTime(120, time + 0.06);
  gain.gain.setValueAtTime(0.8, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
  osc.connect(gain).connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.22);
}

function createRim(ctx: AudioContext, time: number) {
  // Sharp resonant click at ~800Hz with harmonics
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  const hpf = ctx.createBiquadFilter();
  hpf.type = "highpass";
  hpf.frequency.value = 600;
  hpf.Q.value = 8;
  osc1.type = "triangle";
  osc1.frequency.value = 830;
  osc2.type = "square";
  osc2.frequency.value = 1350;
  const osc2gain = ctx.createGain();
  osc2gain.gain.value = 0.3;
  gain.gain.setValueAtTime(0.6, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);
  osc1.connect(hpf).connect(gain).connect(ctx.destination);
  osc2.connect(osc2gain).connect(hpf);
  osc1.start(time);
  osc2.start(time);
  osc1.stop(time + 0.03);
  osc2.stop(time + 0.03);
}

function createClap(ctx: AudioContext, time: number) {
  // Layered noise bursts with micro-delays to simulate hand clap
  const bufferSize = ctx.sampleRate * 0.2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const bpf = ctx.createBiquadFilter();
  bpf.type = "bandpass";
  bpf.frequency.value = 2500;
  bpf.Q.value = 1.2;
  bpf.connect(ctx.destination);

  // 3 micro-flams + main hit
  const delays = [0, 0.01, 0.02, 0.035];
  const volumes = [0.3, 0.35, 0.35, 0.5];
  delays.forEach((d, i) => {
    const n = ctx.createBufferSource();
    n.buffer = buffer;
    const g = ctx.createGain();
    g.gain.setValueAtTime(volumes[i], time + d);
    g.gain.exponentialRampToValueAtTime(0.001, time + d + 0.15);
    n.connect(g).connect(bpf);
    n.start(time + d);
    n.stop(time + d + 0.16);
  });
}

function createStab(ctx: AudioContext, time: number) {
  // Detuned saw chord stab
  const freqs = [261.6, 329.6, 392.0]; // C4 E4 G4
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.3, time);
  master.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
  master.connect(ctx.destination);

  freqs.forEach((f) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = f + (Math.random() - 0.5) * 4; // slight detune
    osc.connect(master);
    osc.start(time);
    osc.stop(time + 0.26);
  });
}

const TRIGGER_MAP: Record<DrumChannel, TriggerFn> = {
  kick: createKick,
  snare: createSnare,
  closedHat: createClosedHat,
  openHat: createOpenHat,
  perc: createPerc,
  click: createRim,
  noise: createClap,
  toneHit: createStab,
};

export function DrumMachine() {
  const { active, litPads, lightPad } = useSignalStore();
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (ctxRef.current && ctxRef.current.state !== "closed")
      return ctxRef.current;
    ctxRef.current = new AudioContext();
    return ctxRef.current;
  }, []);

  const trigger = useCallback(
    async (ch: DrumChannel) => {
      const ctx = getCtx();
      if (ctx.state === "suspended") await ctx.resume();
      TRIGGER_MAP[ch](ctx, ctx.currentTime);
      lightPad(ch);
    },
    [getCtx, lightPad],
  );

  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const pad = DRUM_PADS.find((p) => p.key === e.key.toLowerCase());
      if (pad) {
        e.preventDefault();
        trigger(pad.ch);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, trigger]);

  useEffect(() => {
    return () => {
      if (ctxRef.current && ctxRef.current.state !== "closed") {
        ctxRef.current.close();
        ctxRef.current = null;
      }
    };
  }, []);

  if (!active) return null;

  return (
    <div className="space-y-2 w-[200px]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-[8px] font-mono tracking-[0.2em] text-muted-foreground">
          DRUM_MACHINE
        </span>
        <div className="flex-1 h-px bg-border/30" />
      </div>

      {/* 4×2 pad grid */}
      <div className="grid grid-cols-4 gap-[3px]">
        {DRUM_PADS.map((pad) => {
          const lit = litPads.has(pad.ch);
          const color = PAD_COLORS[pad.ch];
          return (
            <button
              key={pad.ch}
              onPointerDown={() => trigger(pad.ch)}
              className="relative flex flex-col items-center justify-center rounded-[2px] border bg-muted/20 py-2 cursor-pointer select-none"
              style={{
                borderColor: lit ? `${color}60` : "var(--color-border)",
                backgroundColor: lit ? `${color}12` : undefined,
                /* 1px inward press — no bounce, pure mechanical */
                transform: lit ? "translateY(1px)" : "translateY(0)",
                /* 80ms snap-in, 120ms decay-out */
                transition: lit
                  ? "transform 0.08s linear, border-color 0.08s linear, background-color 0.08s linear"
                  : "transform 0.12s ease-out, border-color 0.12s ease-out, background-color 0.12s ease-out",
              }}
            >
              {/* LED — sharp on, linear fade off */}
              <div
                className="w-[5px] h-[5px] rounded-full mb-1"
                style={{
                  backgroundColor: lit
                    ? color
                    : "var(--color-muted-foreground)",
                  opacity: lit ? 1 : 0.1,
                  boxShadow: lit
                    ? `0 0 4px ${color}90, 0 0 8px ${color}40`
                    : "none",
                  transition: lit
                    ? "opacity 0s, box-shadow 0s, background-color 0s" /* instant on */
                    : "opacity 0.12s linear, box-shadow 0.12s linear, background-color 0.12s linear" /* 120ms decay */,
                }}
              />
              {/* Label */}
              <span
                className="text-[6.5px] font-mono tracking-[0.08em] leading-none"
                style={{
                  color: lit ? color : "var(--color-muted-foreground)",
                  opacity: lit ? 0.9 : 0.4,
                  transition: lit
                    ? "color 0s, opacity 0s"
                    : "color 0.12s linear, opacity 0.12s linear",
                }}
              >
                {pad.label}
              </span>
              {/* Key */}
              <span className="text-[6px] font-mono text-muted-foreground/20 mt-0.5 leading-none">
                {pad.keyLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
