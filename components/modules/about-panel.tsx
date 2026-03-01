"use client";

import { motion } from "framer-motion";

const SPEC_FIELDS = [
  { label: "MODEL", value: "UMUT_SYS_01" },
  { label: "CORE", value: "FULLSTACK_DEVELOPER" },
  { label: "OUTPUT", value: "PRODUCTS / SYSTEMS / PROTOCOLS  " },
  { label: "FREQUENCY", value: "MULTI-CHAIN" },
];

const INPUT_PORTS = [
  { label: "GitHub", href: "https://github.com/nhestrompia", icon: "GitHub" },
  {
    label: "Twitter",
    href: "https://twitter.com/nhestrompia",
    icon: "Twitter",
  },
  { label: "Email", href: "mailto:nhestrompia@gmail.com", icon: "Email" },
];

const STACK_BADGES = [
  "TypeScript",
  "React",
  "Next.js",
  "React Native",
  "TailwindCSS",
  "Framer Motion",
  "GraphQL",
  "Zustand",
  "Ethereum",
  "Solidity",
  "Foundry",
  "Wagmi/Viem",
  "Noir",
  "Solana",
  "Rust",
  "Anchor",
  "Node.js",
  "PostgreSQL",
  "MongoDB",
  "Prisma",
  "DrizzleORM",
];

const HACKATHONS = [
  { event: "ETHGlobal Bangkok", result: "Finalist" },
  { event: "zkHack Istanbul", result: "o1Labs Game Track Winner" },
  {
    event: "Aleo zkHackathon Istanbul",
    result: "Overall 2nd, 1st (Obscura), 3rd (Puzzle Wallet)",
  },
  {
    event: "ETH Taipei 2024",
    result: "1st (Polygon & Scroll), Best Project (Ten Protocol)",
  },
];

export function AboutPanel() {
  return (
    <div className="min-h-full p-3 md:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[10px] font-mono tracking-[0.25em] text-muted-foreground">
            OPERATOR MANUAL
          </h2>
          <span className="text-[8px] font-mono tracking-[0.15em] text-muted-foreground/50">
            REV_2.0
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column — illustration + specs */}
          <div className="space-y-5">
            {/* Geometric illustration placeholder */}
            <div className="bg-surface border border-border rounded-sm p-8 flex items-center justify-center aspect-square max-h-64">
              <div className="relative w-32 h-32">
                {/* Abstract hardware illustration */}
                <div className="absolute inset-0 border-2 border-border rounded-sm" />
                <div className="absolute inset-4 border border-accent/30 rounded-sm" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent" />
                {/* Decorative lines */}
                <div className="absolute top-0 left-1/2 w-px h-4 bg-border -translate-x-1/2" />
                <div className="absolute bottom-0 left-1/2 w-px h-4 bg-border -translate-x-1/2" />
                <div className="absolute left-0 top-1/2 w-4 h-px bg-border -translate-y-1/2" />
                <div className="absolute right-0 top-1/2 w-4 h-px bg-border -translate-y-1/2" />
              </div>
            </div>

            {/* Physical specs */}
            <div className="bg-surface border border-border rounded-sm p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono tracking-[0.15em] text-muted-foreground">
                  UPTIME
                </span>
                <span className="text-[9px] font-mono text-foreground/70">
                  27 YRS
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono tracking-[0.15em] text-muted-foreground">
                  INTERESTS
                </span>
                <span className="text-[9px] font-mono text-foreground/70">
                  Music, Basketball, Calisthenics, Chess
                </span>
              </div>
            </div>
          </div>

          {/* Right column — info fields */}
          <div className="space-y-5">
            {/* Spec fields */}
            <div className="bg-surface border border-border rounded-sm divide-y divide-border">
              {SPEC_FIELDS.map((field, i) => (
                <motion.div
                  key={field.label}
                  className="px-4 py-3"
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.15 }}
                >
                  <span className="text-[8px] font-mono tracking-[0.2em] text-muted-foreground block mb-1">
                    {field.label}
                  </span>
                  <span className="text-[10px] font-mono text-foreground/80">
                    {field.value}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Bio */}
            <div className="bg-panel rounded-sm p-4">
              <span className="text-[8px] font-mono tracking-[0.2em] text-panel-foreground/40 block mb-2">
                BIO
              </span>
              <p className="text-[10px] font-mono text-panel-foreground/70 leading-relaxed">
                Fullstack Engineer specializing in realtime systems, on-chain
                economics, and execution infrastructure. Building the interfaces
                between blockchain protocols and human experience.
              </p>
            </div>

            {/* Stack badges */}
            <div>
              <span className="text-[8px] font-mono tracking-[0.2em] text-muted-foreground block mb-2">
                STACK
              </span>
              <div className="flex flex-wrap gap-1.5">
                {STACK_BADGES.map((badge) => (
                  <span
                    key={badge}
                    className="text-[8px] font-mono tracking-[0.1em] px-2 py-1 bg-muted text-foreground/60 border border-border rounded-sm"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Input ports (contact links) */}
            <div>
              <span className="text-[8px] font-mono tracking-[0.2em] text-muted-foreground block mb-2">
                HACKATHONS
              </span>
              <div className="bg-surface border border-border rounded-sm divide-y divide-border">
                {HACKATHONS.map((h, i) => (
                  <motion.div
                    key={h.event}
                    className="px-4 py-2.5 flex items-start justify-between gap-3"
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.15 }}
                  >
                    <span className="text-[9px] font-mono text-foreground/70 shrink-0">
                      {h.event}
                    </span>
                    <span className="text-[8px] font-mono text-accent tracking-[0.05em] text-right leading-snug">
                      {h.result}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact links */}
            <div>
              <span className="text-[8px] font-mono tracking-[0.2em] text-muted-foreground block mb-2">
                CONTACT
              </span>
              <div className="flex gap-2">
                {INPUT_PORTS.map((port) => (
                  <a
                    key={port.label}
                    href={port.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-10 rounded-sm bg-surface border border-border
                               flex items-center justify-center
                               text-[9px] font-mono text-muted-foreground
                               hover:border-accent hover:text-accent transition-colors"
                  >
                    {port.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <a
                href="mailto:nhestrompia@gmail.com"
                className="flex-1 text-center text-[9px] font-mono tracking-[0.15em] py-2.5
                           bg-accent text-accent-foreground rounded-sm
                           hover:bg-accent/90 transition-colors"
              >
                SEND_SIGNAL
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
