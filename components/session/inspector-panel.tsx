"use client";

import { ProjectMeta } from "@/lib/projects";
import { useTracksStore } from "@/store/tracks";

const ABOUT_INFO = {
  name: "UMUT",
  role: "FULLSTACK & BLOCKCHAIN ENGINEER",
  bio: "Building decentralized real-time systems and polished interfaces across Ethereum, Solana and multi-chain ecosystems.",
  specs: [
    { label: "MODEL", value: "UMUT_SYS_01" },
    { label: "CORE", value: "FULLSTACK_DEVELOPER" },
    { label: "FREQUENCY", value: "MULTICHAIN" },
    { label: "OUTPUT", value: "PRODUCTS / SYSTEMS / PROTOCOLS" },
  ],
  stack: [
    "TypeScript",
    "React",
    "Next.js",
    "Solidity",
    "Wagmi/Viem",
    "Rust",
    "Foundry",
    "Node.js",
    "PostgreSQL",
    "MongoDB",
  ],
  links: [
    { label: "GitHub", href: "https://github.com/nhestrompia" },
    { label: "Twitter", href: "https://twitter.com/nhestrompia" },
    { label: "Email", href: "mailto:nhestrompia@gmail.com" },
  ],
  hackathons: [
    { event: "ETHGlobal Bangkok", result: "Finalist" },
    { event: "zkHack Istanbul", result: "o1Labs Game Track Winner" },
    { event: "Aleo zkHackathon Istanbul", result: "Overall 2nd" },
    { event: "ETH Taipei 2024", result: "1st (Polygon & Scroll)" },
  ],
};

export function InspectorPanel({ projects }: { projects: ProjectMeta[] }) {
  const { activeTrack } = useTracksStore();

  const isAbout = activeTrack === "about";
  const activeProject = !isAbout
    ? projects.find((p) => p.slug === activeTrack) || projects[0]
    : null;

  // Knob data for the rotary display
  const knobs = isAbout
    ? []
    : [
        { label: "STK_DEPTH", value: activeProject?.stack.length || 0, max: 8 },
        { label: "LOGIC_GAIN", value: 7, max: 10 },
        { label: "CHAIN_SYNC", value: 9, max: 10 },
      ];

  return (
    <div className="w-[260px] lg:w-[300px] bg-background flex flex-col shrink-0 h-full min-h-0">
      {/* Header */}
      <div className="h-10 border-b border-border flex items-center px-4">
        <span className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground">
          INSPECTOR // {isAbout ? "OPERATOR_BIO" : "PROJECT_INFO"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ── ABOUT / BIO mode ── */}
        {isAbout && (
          <>
            <div className="bg-panel rounded-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono tracking-[0.15em] text-panel-foreground/50">
                  OPERATOR_PROFILE
                </span>
                <span className="text-[8px] font-mono tracking-[0.15em] px-2 py-0.5 rounded-sm bg-led-active/20 text-led-active">
                  ONLINE
                </span>
              </div>
              <h3 className="text-sm font-heading font-semibold tracking-[0.1em] text-panel-foreground mb-1">
                {ABOUT_INFO.name}
              </h3>
              <p className="text-[9px] font-mono text-accent tracking-[0.1em] mb-2">
                {ABOUT_INFO.role}
              </p>
              <p className="text-[10px] font-mono text-panel-foreground/50 leading-relaxed">
                {ABOUT_INFO.bio}
              </p>
            </div>

            {/* Specs */}
            <div>
              <span className="text-[8px] font-mono tracking-[0.2em] text-muted-foreground block mb-2">
                SYSTEM SPECS
              </span>
              <div className="space-y-1.5">
                {ABOUT_INFO.specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-[8px] font-mono tracking-[0.12em] text-muted-foreground/60">
                      {s.label}
                    </span>
                    <span className="text-[8px] font-mono tracking-[0.1em] text-foreground/70">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rotary knobs */}
            <div>
              {!isAbout && (
                <span className="text-[8px] font-mono tracking-[0.2em] text-muted-foreground block mb-3">
                  PARAMETERS
                </span>
              )}
              <div className="grid grid-cols-3 gap-3">
                {knobs.map((knob) => {
                  const rotation = (knob.value / knob.max) * 270 - 135;
                  return (
                    <div
                      key={knob.label}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-muted border border-border relative">
                        <div
                          className="absolute w-0.5 h-4 bg-foreground rounded-full left-1/2 -translate-x-1/2 origin-bottom"
                          style={{
                            bottom: "50%",
                            transform: `translateX(-50%) rotate(${rotation}deg)`,
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-border" />
                        </div>
                      </div>
                      <span className="text-[7px] font-mono tracking-[0.15em] text-muted-foreground">
                        {knob.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stack */}
            <div>
              <span className="text-[8px] font-mono tracking-[0.2em] text-muted-foreground block mb-2">
                ENGINEERING STACK
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ABOUT_INFO.stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[8px] font-mono tracking-[0.1em] px-2 py-1 bg-muted text-foreground/70 border border-border rounded-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Hackathons */}
            <div>
              <span className="text-[8px] font-mono tracking-[0.2em] text-muted-foreground block mb-2">
                HACKATHON WINS
              </span>
              <div className="space-y-2">
                {ABOUT_INFO.hackathons.map((h) => (
                  <div
                    key={h.event}
                    className="bg-muted/50 rounded-sm px-3 py-2"
                  >
                    <span className="text-[9px] font-mono text-foreground/80 block">
                      {h.event}
                    </span>
                    <span className="text-[8px] font-mono text-accent">
                      {h.result}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-2">
              {ABOUT_INFO.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center text-[9px] font-mono tracking-[0.15em] py-2 bg-panel text-panel-foreground rounded-sm hover:bg-panel/90 transition-colors"
                >
                  {link.label.toUpperCase()}
                </a>
              ))}
            </div>
          </>
        )}

        {/* ── PROJECT mode ── */}
        {activeProject && (
          <>
            {/* Active project card — dark panel */}
            <div className="bg-panel rounded-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono tracking-[0.15em] text-panel-foreground/50">
                  ACTIVE_PROJECT
                </span>
                <span
                  className={`text-[8px] font-mono tracking-[0.15em] px-2 py-0.5 rounded-sm ${
                    activeProject.status === "ACTIVE" ||
                    activeProject.status === "LIVE" ||
                    activeProject.status === "LIVE / BUILDING"
                      ? "bg-led-active/20 text-led-active"
                      : activeProject.status === "BUILDING"
                        ? "bg-accent/20 text-accent"
                        : activeProject.status === "NDA"
                          ? "bg-destructive/20 text-destructive"
                          : activeProject.status === "RESEARCH"
                            ? "bg-sky-500/20 text-sky-500"
                            : "bg-muted text-muted-foreground"
                  }`}
                >
                  {activeProject.status}
                </span>
              </div>
              <h3 className="text-sm font-heading font-semibold tracking-[0.1em] text-panel-foreground mb-1">
                {activeProject.name}
              </h3>
              <p className="text-[10px] font-mono text-panel-foreground/50 leading-relaxed mb-3">
                {activeProject.shortDescription}
              </p>
              <div className="flex items-center gap-3 text-[8px] font-mono">
                <span className="text-panel-foreground/40">
                  CHAIN: {activeProject.chain}
                </span>
                <span className="text-panel-foreground/40">
                  TRK: {activeProject.number}
                </span>
              </div>
            </div>

            {/* Rotary knobs */}
            <div>
              <span className="text-[8px] font-mono tracking-[0.2em] text-muted-foreground block mb-3">
                PARAMETERS
              </span>
              <div className="grid grid-cols-3 gap-3">
                {knobs.map((knob) => {
                  const rotation = (knob.value / knob.max) * 270 - 135;
                  return (
                    <div
                      key={knob.label}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-muted border border-border relative">
                        <div
                          className="absolute w-0.5 h-4 bg-foreground rounded-full left-1/2 -translate-x-1/2 origin-bottom"
                          style={{
                            bottom: "50%",
                            transform: `translateX(-50%) rotate(${rotation}deg)`,
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-border" />
                        </div>
                      </div>
                      <span className="text-[7px] font-mono tracking-[0.15em] text-muted-foreground">
                        {knob.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Engineering stack */}
            <div>
              <span className="text-[8px] font-mono tracking-[0.2em] text-muted-foreground block mb-2">
                ENGINEERING STACK
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeProject.stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[8px] font-mono tracking-[0.1em] px-2 py-1 bg-muted text-foreground/70 border border-border rounded-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            {(activeProject.links.demo || activeProject.links.source) && (
              <div className="flex gap-2">
                {activeProject.links.demo && (
                  <a
                    href={activeProject.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-[9px] font-mono tracking-[0.15em] py-2 bg-accent text-accent-foreground rounded-sm hover:bg-accent/90 transition-colors"
                  >
                    LIVE
                  </a>
                )}
                {activeProject.links.source && (
                  <a
                    href={activeProject.links.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-[9px] font-mono tracking-[0.15em] py-2 bg-panel text-panel-foreground rounded-sm hover:bg-panel/90 transition-colors"
                  >
                    CODE
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
