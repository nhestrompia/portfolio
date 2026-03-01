import { create } from "zustand";

export type DrumChannel =
  | "kick"
  | "snare"
  | "closedHat"
  | "openHat"
  | "perc"
  | "click"
  | "noise"
  | "toneHit";

export interface SignalState {
  /* Signal Mode on/off */
  active: boolean;
  toggle: () => void;

  /* Drum machine — which pad is lit (fades after 120ms) */
  litPads: Set<DrumChannel>;
  lightPad: (ch: DrumChannel) => void;

  /* Tone generator params */
  toneFreq: number; // Hz  60–1200
  toneGain: number; // 0–1
  toneMod: number; // LFO Hz  0–12
  toneOn: boolean;
  setToneFreq: (v: number) => void;
  setToneGain: (v: number) => void;
  setToneMod: (v: number) => void;
  toggleTone: () => void;

  /* Idle timer */
  lastActivity: number;
  touch: () => void;
}

export const useSignalStore = create<SignalState>((set, get) => ({
  active: false,
  toggle: () => set((s) => ({ active: !s.active, lastActivity: Date.now() })),

  litPads: new Set(),
  lightPad: (ch) => {
    const pads = new Set(get().litPads);
    pads.add(ch);
    set({ litPads: pads, lastActivity: Date.now() });
    setTimeout(() => {
      const current = new Set(get().litPads);
      current.delete(ch);
      set({ litPads: current });
    }, 120);
  },

  toneFreq: 220,
  toneGain: 0.5,
  toneMod: 0,
  toneOn: false,
  setToneFreq: (v) => set({ toneFreq: Math.max(60, Math.min(1200, v)), lastActivity: Date.now() }),
  setToneGain: (v) => set({ toneGain: Math.max(0, Math.min(1, v)), lastActivity: Date.now() }),
  setToneMod: (v) => set({ toneMod: Math.max(0, Math.min(12, v)), lastActivity: Date.now() }),
  toggleTone: () => set((s) => ({ toneOn: !s.toneOn, lastActivity: Date.now() })),

  lastActivity: Date.now(),
  touch: () => set({ lastActivity: Date.now() }),
}));
