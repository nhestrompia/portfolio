"use client";

import { motion } from "framer-motion";

/* SVG icons for categories */
const CategoryIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "FRONTEND":
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="text-accent"
        >
          <rect
            x="1"
            y="1"
            width="5"
            height="5"
            rx="0.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <rect
            x="8"
            y="1"
            width="5"
            height="5"
            rx="0.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <rect
            x="1"
            y="8"
            width="5"
            height="5"
            rx="0.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <rect
            x="8"
            y="8"
            width="5"
            height="5"
            rx="0.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      );
    case "WEB3":
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="text-accent"
        >
          <path
            d="M7 1L13 7L7 13L1 7L7 1Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1" />
        </svg>
      );
    case "BACKEND":
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="text-accent"
        >
          <rect
            x="2"
            y="2"
            width="10"
            height="3"
            rx="0.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <rect
            x="2"
            y="7"
            width="10"
            height="3"
            rx="0.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle cx="4.5" cy="3.5" r="0.8" fill="currentColor" />
          <circle cx="4.5" cy="8.5" r="0.8" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
};

/* Entry icon mapping */
const EntryIcon = ({ name }: { name: string }) => {
  // Simple geometric icons per tech
  const getPath = () => {
    switch (name) {
      case "React":
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1" />
            <ellipse
              cx="8"
              cy="8"
              rx="7"
              ry="3"
              stroke="currentColor"
              strokeWidth="0.8"
            />
            <ellipse
              cx="8"
              cy="8"
              rx="7"
              ry="3"
              stroke="currentColor"
              strokeWidth="0.8"
              transform="rotate(60 8 8)"
            />
            <ellipse
              cx="8"
              cy="8"
              rx="7"
              ry="3"
              stroke="currentColor"
              strokeWidth="0.8"
              transform="rotate(120 8 8)"
            />
          </svg>
        );
      case "Next.js":
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle
              cx="8"
              cy="8"
              r="6.5"
              stroke="currentColor"
              strokeWidth="0.8"
            />
            <path d="M5 11V5L11 13" stroke="currentColor" strokeWidth="1" />
            <path d="M10.5 5V9" stroke="currentColor" strokeWidth="1" />
          </svg>
        );
      case "Solana":
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 11L13 11L10 14H3"
              stroke="currentColor"
              strokeWidth="0.8"
            />
            <path
              d="M3 5L13 5L10 2H3"
              stroke="currentColor"
              strokeWidth="0.8"
            />
            <path
              d="M13 8L3 8L6 11H13"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect
              x="3"
              y="3"
              width="10"
              height="10"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="0.8"
            />
            <circle
              cx="8"
              cy="8"
              r="2"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </svg>
        );
    }
  };
  return <span className="text-muted-foreground/60 shrink-0">{getPath()}</span>;
};

const STACK_DATA = [
  {
    id: "01",
    label: "FRONTEND",
    entries: [
      { name: "TypeScript", sub: "Type System", active: true },
      { name: "React", sub: "UI Framework", active: true },
      { name: "Next.js", sub: "Meta Framework", active: true },
      { name: "React Native", sub: "Mobile", active: true },
      { name: "TailwindCSS", sub: "Utility Styles", active: true },
      { name: "Framer Motion", sub: "Animation", active: true },
      { name: "React Query", sub: "Data Fetching", active: true },
      { name: "GraphQL", sub: "Query Language", active: true },
      { name: "Redux", sub: "State Management", active: true },
      { name: "Zustand", sub: "State Management", active: true },
      { name: "Vitest", sub: "Testing", active: true },
    ],
  },
  {
    id: "02",
    label: "WEB3",
    entries: [
      { name: "Solana", sub: "L1 Chain", active: true },
      { name: "Ethereum", sub: "L1 Chain", active: true },
      { name: "Solidity", sub: "Smart Contracts", active: true },
      { name: "Rust", sub: "Programs", active: true },
      { name: "Anchor", sub: "Framework", active: true },
      { name: "Foundry", sub: "EVM Tooling", active: true },
      { name: "Wagmi/Viem", sub: "Web3 Client", active: true },
    ],
  },
  {
    id: "03",
    label: "BACKEND",
    entries: [
      { name: "Node.js", sub: "Runtime", active: true },
      { name: "MongoDB", sub: "NoSQL Database", active: true },
      { name: "PostgreSQL", sub: "SQL Database", active: true },
      { name: "Prisma", sub: "ORM", active: true },
      { name: "DrizzleORM", sub: "ORM", active: true },
      { name: "WebSocket", sub: "Realtime", active: true },
      { name: "Custom Indexers", sub: "Data Pipeline", active: true },
    ],
  },
];

export function StackView() {
  return (
    <div className="min-h-full p-3 md:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Top system bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 px-1 gap-1">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground/70">
              SYSTEM_CONFIG
            </span>
            <span className="text-[9px] font-mono tracking-[0.1em] text-muted-foreground/40">
              //
            </span>
            <span className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground/70">
              STACK_VIEW
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-[8px] font-mono tracking-[0.15em] text-muted-foreground/50">
              LATENCY 0.12ms
            </span>
            <span className="text-[8px] font-mono tracking-[0.15em] text-muted-foreground/50">
              HARDWARE_ID: SYS_01
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[11px] font-mono tracking-[0.25em] text-foreground/80 font-medium">
            SYSTEM CONFIGURATION
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-led-active animate-pulse" />
            <span className="text-[9px] font-mono tracking-[0.15em] text-muted-foreground/60">
              {STACK_DATA.reduce(
                (acc, cat) => acc + cat.entries.filter((e) => e.active).length,
                0,
              )}{" "}
              ACTIVE
            </span>
          </div>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STACK_DATA.map((category, catIdx) => (
            <motion.div
              key={category.id}
              className="bg-surface border border-border rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: catIdx * 0.06 }}
            >
              {/* Category header */}
              <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center gap-3">
                <CategoryIcon type={category.label} />
                <div>
                  <span className="text-[8px] font-mono text-accent tracking-[0.15em] block mb-0.5">
                    MODULE {category.id}
                  </span>
                  <span className="text-[11px] font-mono tracking-[0.15em] text-foreground font-semibold">
                    {category.label}
                  </span>
                </div>
              </div>

              {/* Tech entries */}
              <div className="divide-y divide-border/60">
                {category.entries
                  .filter((e) => e.active)
                  .map((entry, i) => (
                    <motion.div
                      key={entry.name}
                      className="px-5 py-4 flex items-center gap-4 hover:bg-bg-active transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: catIdx * 0.06 + i * 0.03 }}
                    >
                      {/* Entry icon */}
                      <EntryIcon name={entry.name} />

                      {/* Name + subtitle */}
                      <div className="flex-1 min-w-0">
                        <span className="text-[12px] font-mono text-foreground font-medium block truncate leading-tight">
                          {entry.name}
                        </span>
                        <span className="text-[9px] font-mono text-muted-foreground/60 tracking-[0.1em]">
                          {entry.sub}
                        </span>
                      </div>

                      {/* Toggle switch */}
                      <div className="w-10 h-5 rounded-full flex items-center px-0.5 transition-colors shrink-0 bg-accent/20">
                        <div className="w-4 h-4 rounded-full transition-all duration-200 shadow-sm bg-accent translate-x-[18px]" />
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom status bar */}
        <div className="mt-6 flex items-center justify-between px-1">
          <div className="flex items-center gap-4">
            <span className="text-[8px] font-mono tracking-[0.15em] text-muted-foreground/40">
              OPERATIONAL STATUS: NOMINAL
            </span>
          </div>
          <span className="text-[8px] font-mono tracking-[0.15em] text-muted-foreground/30">
            FW_V2.0.1 // STACK_SYNC_OK
          </span>
        </div>
      </motion.div>
    </div>
  );
}
