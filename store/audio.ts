import { create } from "zustand";

type SoundType = "tick" | "snap" | "confirm" | "boot" | "hover";

interface AudioState {
  enabled: boolean;
  context: AudioContext | null;
  toggle: () => void;
  playSound: (type: SoundType) => void;
  initContext: () => void;
}

/**
 * Synthesise all sounds via Web Audio API — no .mp3 files needed.
 * Each sound is a tiny burst from an oscillator + gain envelope.
 */
function synthSound(ctx: AudioContext, type: SoundType) {
  const now = ctx.currentTime;

  switch (type) {
    case "tick": {
      // Short high-pitched click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(3200, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.04);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
      break;
    }
    case "snap": {
      // Quick percussive snap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
    }
    case "confirm": {
      // Two-tone ding (ascending)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(880, now);
      osc2.frequency.setValueAtTime(1320, now + 0.08);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.setValueAtTime(0.1, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc1.connect(gain).connect(ctx.destination);
      osc2.connect(gain);
      osc1.start(now);
      osc1.stop(now + 0.1);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.25);
      break;
    }
    case "boot": {
      // Low startup hum
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.3);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
      break;
    }
    case "hover": {
      // Very subtle high blip
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(2400, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
      break;
    }
  }
}

export const useAudioStore = create<AudioState>((set, get) => ({
  enabled: false,
  context: null,

  toggle: () => {
    const state = get();
    if (!state.context) {
      state.initContext();
    }
    set({ enabled: !state.enabled });
  },

  initContext: () => {
    if (get().context) return;
    try {
      const ctx = new AudioContext();
      set({ context: ctx });
    } catch {
      // AudioContext not supported
    }
  },

  playSound: (type) => {
    const { enabled, context } = get();
    if (!enabled || !context) return;
    if (context.state === "suspended") {
      context.resume();
    }
    try {
      synthSound(context, type);
    } catch {
      // Ignore audio errors silently
    }
  },
}));
