import { create } from "zustand";

export type TrackProximity = "ACTIVE" | "NEAR" | "FAR";

interface TracksState {
  /* Playhead-driven state */
  activeTrack: string | null;
  trackProximity: Record<string, TrackProximity>;
  scrollProgress: number;

  /* Timeline position (0-1) for horizontal playhead */
  playheadPosition: number;

  /* Track ordering — slugs in display order */
  trackOrder: string[];

  /* Mute/Solo per track */
  mutedTracks: Set<string>;
  soloedTracks: Set<string>;

  /* Hover / expand */
  expandedTrack: string | null;
  hoveredTrack: string | null;

  /* Actions */
  updatePlayhead: (
    activeTrack: string | null,
    proximity: Record<string, TrackProximity>,
    progress: number,
  ) => void;
  setPlayheadPosition: (pos: number) => void;
  setTrackOrder: (order: string[]) => void;
  reorderTrack: (fromIndex: number, toIndex: number) => void;
  setExpandedTrack: (slug: string | null) => void;
  setHoveredTrack: (slug: string | null) => void;
  toggleTrack: (slug: string) => void;
  toggleMute: (slug: string) => void;
  toggleSolo: (slug: string) => void;
}

export const useTracksStore = create<TracksState>((set, get) => ({
  activeTrack: null,
  trackProximity: {},
  scrollProgress: 0,
  playheadPosition: 0,
  trackOrder: [],
  mutedTracks: new Set(),
  soloedTracks: new Set(),
  expandedTrack: null,
  hoveredTrack: null,

  updatePlayhead: (activeTrack, proximity, progress) =>
    set({ activeTrack, trackProximity: proximity, scrollProgress: progress }),

  setPlayheadPosition: (pos) => set({ playheadPosition: pos }),

  setTrackOrder: (order) => set({ trackOrder: order }),

  reorderTrack: (fromIndex, toIndex) => {
    const order = [...get().trackOrder];
    const [moved] = order.splice(fromIndex, 1);
    order.splice(toIndex, 0, moved);
    set({ trackOrder: order });
  },

  setExpandedTrack: (slug) => set({ expandedTrack: slug }),
  setHoveredTrack: (slug) => set({ hoveredTrack: slug }),

  toggleTrack: (slug) => {
    const current = get().expandedTrack;
    set({ expandedTrack: current === slug ? null : slug });
  },
  toggleMute: (slug) => {
    const muted = new Set(get().mutedTracks);
    if (muted.has(slug)) muted.delete(slug);
    else muted.add(slug);
    set({ mutedTracks: muted });
  },
  toggleSolo: (slug) => {
    const soloed = new Set(get().soloedTracks);
    if (soloed.has(slug)) soloed.delete(slug);
    else soloed.add(slug);
    set({ soloedTracks: soloed });
  },
}));
