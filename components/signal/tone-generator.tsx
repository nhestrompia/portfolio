"use client";

import { useHaptics } from "@/lib/haptics";
import { useSignalStore } from "@/store/signal";
import { useCallback, useEffect, useRef } from "react";
import * as Tone from "tone";

/* ═══════════════════════════════════════════════
   System Tone Generator
   Three rotary controls: FREQ · GAIN · MOD
   Triangle oscillator with LFO modulation
   Keyboard: Z/X = Freq ↓/↑, C/V = Mod ↓/↑, Space = toggle
   ═══════════════════════════════════════════════ */

/* Knob SVG — hardware-style rotary indicator */
function Knob({
  value,
  min,
  max,
  label,
  displayValue,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  label: string;
  displayValue: string;
  onChange: (v: number) => void;
}) {
  const dragging = useRef(false);
  const startY = useRef(0);
  const startVal = useRef(0);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const minRef = useRef(min);
  const maxRef = useRef(max);
  minRef.current = min;
  maxRef.current = max;

  const norm = (value - min) / (max - min); // 0–1
  const angle = norm * 270 - 135; // -135° to +135°

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const delta =
        (startY.current - e.clientY) *
        ((maxRef.current - minRef.current) / 200);
      const next = Math.max(
        minRef.current,
        Math.min(maxRef.current, startVal.current + delta),
      );
      onChangeRef.current(next);
    };
    const handleUp = () => {
      dragging.current = false;
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragging.current = true;
    startY.current = e.clientY;
    startVal.current = value;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-14 h-14 rounded-full bg-muted border border-border relative cursor-ns-resize select-none touch-none"
        onPointerDown={handlePointerDown}
      >
        {/* Track arc (background) */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 56 56"
        ></svg>
        {/* Indicator line */}
        <div
          className="absolute w-0.5 h-5 bg-foreground rounded-full left-1/2 origin-bottom"
          style={{
            bottom: "50%",
            transform: `translateX(-50%) rotate(${angle}deg)`,
          }}
        />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-border" />
        </div>
      </div>
      {/* Label */}
      <span className="text-[7px] font-mono tracking-[0.15em] text-muted-foreground">
        {label}
      </span>
      {/* Value readout */}
      <span className="text-[8px] font-mono text-foreground/50">
        {displayValue}
      </span>
    </div>
  );
}

export function ToneGenerator() {
  const {
    active,
    toneFreq,
    toneGain,
    toneMod,
    toneOn,
    setToneFreq,
    setToneGain,
    setToneMod,
    toggleTone,
  } = useSignalStore();
  const haptics = useHaptics();

  const oscRef = useRef<Tone.Oscillator | null>(null);
  const lfoRef = useRef<Tone.LFO | null>(null);
  const gainRef = useRef<Tone.Gain | null>(null);
  const analyserRef = useRef<Tone.Analyser | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);

  /* ─── Oscilloscope draw loop ─── */
  const drawScope = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const data = analyser.getValue() as Float32Array;

    ctx.clearRect(0, 0, w, h);

    /* Dark background */
    ctx.fillStyle = "#0a0f0a";
    ctx.fillRect(0, 0, w, h);

    /* Grid lines */
    ctx.strokeStyle = "rgba(74,222,128,0.06)";
    ctx.lineWidth = 0.5;
    for (let y = 0; y <= h; y += h / 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    for (let x = 0; x <= w; x += w / 8) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    /* Center line */
    ctx.strokeStyle = "rgba(74,222,128,0.12)";
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    /* Waveform */
    ctx.strokeStyle = toneOn ? "#4ade80" : "rgba(74,222,128,0.15)";
    ctx.lineWidth = toneOn ? 1.5 : 1;
    ctx.beginPath();

    const sliceWidth = w / data.length;
    let x = 0;
    for (let i = 0; i < data.length; i++) {
      const v = (data[i] + 1) / 2;
      const y = v * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.stroke();

    /* Glow when active */
    if (toneOn) {
      ctx.strokeStyle = "rgba(74,222,128,0.3)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      x = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] + 1) / 2;
        const y = v * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.stroke();
    }

    rafRef.current = requestAnimationFrame(drawScope);
  }, [toneOn]);

  /* Create / destroy audio nodes */
  useEffect(() => {
    if (!active) return;

    const gain = new Tone.Gain(toneGain).toDestination();
    const osc = new Tone.Oscillator({
      type: "triangle",
      frequency: toneFreq,
      volume: -6,
    }).connect(gain);

    const lfo = new Tone.LFO({
      frequency: toneMod,
      min: -600,
      max: 600,
    }).connect(osc.detune);

    /* Analyser for oscilloscope */
    const analyser = new Tone.Analyser("waveform", 1024);
    osc.connect(analyser);

    oscRef.current = osc;
    lfoRef.current = lfo;
    gainRef.current = gain;
    analyserRef.current = analyser;

    if (toneMod > 0) lfo.start();
    if (toneOn) {
      Tone.start().then(() => osc.start());
    }

    /* Start draw loop */
    rafRef.current = requestAnimationFrame(drawScope);

    return () => {
      cancelAnimationFrame(rafRef.current);
      osc.stop();
      osc.dispose();
      lfo.stop();
      lfo.dispose();
      gain.dispose();
      analyser.dispose();
      oscRef.current = null;
      lfoRef.current = null;
      gainRef.current = null;
      analyserRef.current = null;
    };
    // Only re-create on active changes — params are updated via refs below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  /* Sync params to audio nodes */
  useEffect(() => {
    if (oscRef.current) {
      oscRef.current.frequency.value = toneFreq;
    }
  }, [toneFreq]);

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = toneGain;
    }
  }, [toneGain]);

  useEffect(() => {
    if (lfoRef.current) {
      lfoRef.current.frequency.value = toneMod;
      // Scale detune depth with mod amount: 0Hz→0 cents, 12Hz→±600 cents
      const depth = (toneMod / 12) * 600;
      lfoRef.current.min = -depth;
      lfoRef.current.max = depth;
      if (toneMod > 0 && lfoRef.current.state !== "started")
        lfoRef.current.start();
      if (toneMod === 0 && lfoRef.current.state === "started")
        lfoRef.current.stop();
    }
  }, [toneMod]);

  useEffect(() => {
    if (!oscRef.current) return;
    if (toneOn && oscRef.current.state !== "started") {
      Tone.start().then(() => oscRef.current?.start());
    }
    if (!toneOn && oscRef.current.state === "started") {
      oscRef.current.stop();
    }
  }, [toneOn]);

  /* Keyboard controls */
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.repeat) return;
      switch (e.key.toLowerCase()) {
        case "z":
          setToneFreq(toneFreq - 20);
          break;
        case "x":
          setToneFreq(toneFreq + 20);
          break;
        case "c":
          setToneMod(toneMod - 1);
          break;
        case "v":
          setToneMod(toneMod + 1);
          break;
        case " ":
          if (useSignalStore.getState().active) {
            e.preventDefault();
            toggleTone();
          }
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, toneFreq, toneMod, setToneFreq, setToneMod, toggleTone]);

  if (!active) return null;

  return (
    <div className="space-y-2.5 w-[230px]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-[8px] font-mono tracking-[0.2em] text-muted-foreground">
          TONE_GENERATOR
        </span>
        <div className="flex-1 h-px bg-border/30" />
      </div>

      {/* ─── Oscilloscope ─── */}
      <div className="relative rounded-[2px] border border-border/40 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={428}
          height={80}
          className="block w-full h-[64px]"
          style={{ imageRendering: "pixelated" }}
        />
        {/* Scope label */}
        <span className="absolute top-1 left-1.5 text-[6px] font-mono text-muted-foreground/30">
          SCOPE
        </span>
        <span
          className="absolute top-1 right-1.5 text-[6px] font-mono"
          style={{
            color: toneOn ? "#4ade80" : "var(--color-muted-foreground)",
            opacity: toneOn ? 0.6 : 0.2,
          }}
        >
          {toneOn ? "ACTIVE" : "IDLE"}
        </span>
      </div>

      {/* Knob row */}
      <div className="flex items-start justify-center gap-4">
        <Knob
          value={toneFreq}
          min={60}
          max={1200}
          label="FREQ"
          displayValue={`${Math.round(toneFreq)}Hz`}
          onChange={setToneFreq}
        />
        <Knob
          value={toneGain}
          min={0}
          max={1}
          label="GAIN"
          displayValue={`${Math.round(toneGain * 100)}%`}
          onChange={setToneGain}
        />
        <Knob
          value={toneMod}
          min={0}
          max={12}
          label="MOD"
          displayValue={`${toneMod.toFixed(1)}Hz`}
          onChange={setToneMod}
        />
      </div>

      {/* Toggle button */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            Tone.start();
            toggleTone();
            haptics.nudge();
          }}
          className={`text-[7px] font-mono tracking-[0.15em] px-3 py-1 rounded-[2px] border transition-colors cursor-pointer
            ${
              toneOn
                ? "bg-led-active/15 text-led-active border-led-active/30"
                : "bg-muted/30 text-muted-foreground border-border hover:border-muted-foreground/50"
            }`}
        >
          {toneOn ? "■ TONE ON" : "▶ TONE OFF"}
        </button>
      </div>

      {/* Key hints */}
      <div className="flex justify-center gap-2 text-[6px] font-mono text-muted-foreground/25">
        <span>Z/X FREQ</span>
        <span>C/V MOD</span>
        <span>SPC TOGGLE</span>
      </div>
    </div>
  );
}
