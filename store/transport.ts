import { create } from "zustand";

export type PanelType = "projects" | "stack" | "about" | null;

interface TransportState {
  activePanel: PanelType;
  bpm: number;
  isPlaying: boolean;
  loopActive: boolean;
  syncLink: boolean;
  timecode: string;
  setActivePanel: (panel: PanelType) => void;
  togglePanel: (panel: PanelType) => void;
  setPlaying: (playing: boolean) => void;
  setLoopActive: (active: boolean) => void;
  setSyncLink: (active: boolean) => void;
  setTimecode: (tc: string) => void;
}

export const useTransportStore = create<TransportState>((set, get) => ({
  activePanel: "projects",
  bpm: 120,
  isPlaying: false,
  loopActive: true,
  syncLink: true,
  timecode: "00:00:00:00",
  setActivePanel: (panel) => set({ activePanel: panel }),
  togglePanel: (panel) => {
    const current = get().activePanel;
    set({ activePanel: current === panel ? null : panel });
  },
  setPlaying: (playing) => set({ isPlaying: playing }),
  setLoopActive: (active) => set({ loopActive: active }),
  setSyncLink: (active) => set({ syncLink: active }),
  setTimecode: (tc) => set({ timecode: tc }),
}));
