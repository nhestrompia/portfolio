import { create } from "zustand";

interface BootChecklist {
  prjLoaded: boolean;
  expIndexed: boolean;
  stkSynced: boolean;
  lveConn: boolean;
}

interface SessionState {
  booted: boolean;
  sessionActive: boolean;
  bootProgress: number;
  bootChecklist: BootChecklist;
  setBoot: (booted: boolean) => void;
  setSessionActive: (active: boolean) => void;
  setBootProgress: (progress: number) => void;
  setBootCheckItem: (key: keyof BootChecklist, value: boolean) => void;
  resetBootChecklist: () => void;
}

const defaultChecklist: BootChecklist = {
  prjLoaded: false,
  expIndexed: false,
  stkSynced: false,
  lveConn: false,
};

export const useSessionStore = create<SessionState>((set) => ({
  booted: false,
  sessionActive: false,
  bootProgress: 0,
  bootChecklist: { ...defaultChecklist },
  setBoot: (booted) => set({ booted }),
  setSessionActive: (active) => set({ sessionActive: active }),
  setBootProgress: (progress) => set({ bootProgress: progress }),
  setBootCheckItem: (key, value) =>
    set((state) => ({
      bootChecklist: { ...state.bootChecklist, [key]: value },
    })),
  resetBootChecklist: () => set({ bootChecklist: { ...defaultChecklist } }),
}));
