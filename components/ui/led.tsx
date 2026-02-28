"use client";

interface LEDProps {
  status: "ACTIVE" | "BUILDING" | "NDA" | "SHIPPED" | "LIVE" | string;
  size?: "sm" | "md";
  pulse?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-led-active",
  LIVE: "bg-led-active",
  BUILDING: "bg-led-building",
  SHIPPED: "bg-led-active/70",
  NDA: "bg-led-nda",
};

const SIZE_MAP = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
};

export function LED({ status, size = "sm", pulse }: LEDProps) {
  const colorClass = STATUS_COLORS[status] || "bg-led-inactive";
  const sizeClass = SIZE_MAP[size];
  const shouldPulse = pulse ?? status === "BUILDING";

  return (
    <span
      className={`inline-block rounded-full ${sizeClass} ${colorClass} ${
        shouldPulse ? "animate-pulse" : ""
      }`}
      aria-label={`Status: ${status}`}
    />
  );
}
