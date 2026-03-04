"use client";

import { useWebHaptics } from "web-haptics/react";

/**
 * Haptic feedback patterns mapped to audio cues used across the app.
 *
 * "success"  → confirm sound  (enter session, audio toggle on)
 * "nudge"    → snap sound     (back nav, panel close, drag end, mute toggle)
 * "tap"      → tick sound     (clip click, nav button, solo, tray toggle)
 * "pad"      → drum pad hit   (short punchy tap)
 */
export function useHaptics() {
  const { trigger, cancel, isSupported } = useWebHaptics();

  return {
    /** Two quick taps – mirrors "confirm" audio (built-in preset) */
    success: () => trigger("success"),

    /** Strong tap + soft tail – mirrors "snap" audio (built-in preset) */
    nudge: () => trigger("nudge"),

    /** Light single tap – mirrors "tick" audio */
    tap: () => trigger([{ duration: 25, intensity: 0.4 }]),

    /** Punchy drum pad hit — sharp attack */
    pad: () =>
      trigger([
        { duration: 40, intensity: 0.9 },
        { delay: 20, duration: 15, intensity: 0.3 },
      ]),

    /** Scrub / drag feedback — subtle short pulse */
    scrub: () => trigger([{ duration: 15, intensity: 0.3 }]),

    /** Stop any ongoing vibration */
    cancel,

    /** Whether the device supports the Vibration API */
    isSupported,

    /** Raw trigger for custom patterns */
    trigger,
  };
}
