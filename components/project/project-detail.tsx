"use client";

import type { ProjectMeta } from "@/lib/projects";
import { useAudioStore } from "@/store/audio";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface ProjectDetailProps {
  meta: ProjectMeta;
  content: string;
}

function parseSections(content: string): { title: string; body: string }[] {
  const sections: { title: string; body: string }[] = [];
  const lines = content.split("\n");
  let currentTitle = "";
  let currentBody: string[] = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentTitle) {
        sections.push({
          title: currentTitle,
          body: currentBody.join("\n").trim(),
        });
      }
      currentTitle = line.replace("## ", "");
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  }

  if (currentTitle) {
    sections.push({
      title: currentTitle,
      body: currentBody.join("\n").trim(),
    });
  }

  return sections;
}

function RenderContent({ body }: { body: string }) {
  const paragraphs = body.split("\n\n").filter(Boolean);

  return (
    <div className="space-y-4">
      {paragraphs.map((p, i) => {
        if (p.startsWith("**") && p.includes("**")) {
          const parts = p.split("**").filter(Boolean);
          return (
            <div key={i}>
              {parts.map((part, j) =>
                j % 2 === 0 ? (
                  <span
                    key={j}
                    className="text-foreground/80 font-medium text-[11px]"
                  >
                    {part}
                  </span>
                ) : (
                  <span key={j} className="text-muted-foreground text-[11px]">
                    {part}
                  </span>
                ),
              )}
            </div>
          );
        }

        if (p.startsWith("- ")) {
          const items = p.split("\n").filter((l) => l.startsWith("- "));
          return (
            <ul key={i} className="space-y-2">
              {items.map((item, j) => {
                const text = item.replace(/^- /, "");
                const parts = text.split(/(\*\*[^*]+\*\*)/);
                return (
                  <li key={j} className="flex gap-2.5 text-[11px]">
                    <span className="text-accent shrink-0 mt-0.5">·</span>
                    <span className="text-muted-foreground leading-relaxed">
                      {parts.map((part, k) =>
                        part.startsWith("**") && part.endsWith("**") ? (
                          <span
                            key={k}
                            className="text-foreground/80 font-medium"
                          >
                            {part.replace(/\*\*/g, "")}
                          </span>
                        ) : (
                          <span key={k}>{part}</span>
                        ),
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          );
        }

        return (
          <p
            key={i}
            className="text-[11px] text-muted-foreground leading-relaxed"
          >
            {p}
          </p>
        );
      })}
    </div>
  );
}

export function ProjectDetail({ meta, content }: ProjectDetailProps) {
  const router = useRouter();
  const { playSound } = useAudioStore();
  const sections = parseSections(content);

  const handleBack = () => {
    playSound("snap");
    router.push("/session");
  };

  return (
    <motion.div
      className="flex-1 overflow-y-auto bg-background"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Top navigation bar */}
      <div className="border-b border-border px-3 md:px-6 py-2 md:py-3 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <button
          onClick={handleBack}
          className="text-[9px] font-mono tracking-[0.15em] text-muted-foreground hover:text-foreground
                     transition-colors duration-150 cursor-pointer"
        >
          ← BACK
        </button>
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-[8px] font-mono tracking-[0.15em] text-muted-foreground">
            V{meta.number}.0
          </span>
          <span
            className={`text-[8px] font-mono tracking-[0.15em] px-2 py-0.5 rounded-sm ${
              meta.status === "ACTIVE"
                ? "bg-led-active/15 text-led-active"
                : meta.status === "BUILDING"
                  ? "bg-accent/15 text-accent"
                  : meta.status === "NDA"
                    ? "bg-destructive/15 text-destructive"
                    : "bg-muted text-muted-foreground"
            }`}
          >
            {meta.status}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-3 md:px-6 py-4 md:py-8">
        {/* Project header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] font-mono text-accent tracking-[0.15em]">
              TRACK_{meta.number}
            </span>
            <span className="text-[8px] font-mono text-muted-foreground tracking-widest">
              {"// "}
              {meta.category}
            </span>
          </div>
          <h1 className="text-2xl font-heading font-semibold tracking-[0.08em] text-foreground mb-3">
            {meta.name}
          </h1>
          <p className="text-[12px] font-mono text-muted-foreground leading-relaxed max-w-xl">
            {meta.shortDescription}
          </p>

          {/* Action buttons */}
          <div className="flex gap-2 mt-5">
            {meta.links.demo && (
              <a
                href={meta.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] font-mono tracking-[0.15em] px-5 py-2
                           bg-accent text-accent-foreground rounded-sm
                           hover:bg-accent/90 transition-colors"
              >
                LIVE
              </a>
            )}
            {meta.links.source && (
              <a
                href={meta.links.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] font-mono tracking-[0.15em] px-5 py-2
                           bg-panel text-panel-foreground rounded-sm
                           hover:bg-panel/90 transition-colors"
              >
                CODE
              </a>
            )}
          </div>
        </motion.div>

        {/* Metric cards row */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3 mb-6 md:mb-8"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
          <div className="bg-panel rounded-sm p-4">
            <span className="text-[8px] font-mono tracking-[0.15em] text-panel-foreground/40 block mb-1">
              CHAIN
            </span>
            <span className="text-[11px] font-mono text-panel-foreground font-medium">
              {meta.chain}
            </span>
          </div>
          <div className="bg-panel rounded-sm p-4">
            <span className="text-[8px] font-mono tracking-[0.15em] text-panel-foreground/40 block mb-1">
              MODE
            </span>
            <span className="text-[11px] font-mono text-panel-foreground font-medium">
              {meta.category}
            </span>
          </div>
          <div className="bg-panel rounded-sm p-4">
            <span className="text-[8px] font-mono tracking-[0.15em] text-panel-foreground/40 block mb-1">
              IMPACT
            </span>
            <span className="text-[10px] font-mono text-panel-foreground/80 leading-relaxed">
              {meta.impact}
            </span>
          </div>
        </motion.div>

        {/* Content sections — numbered */}
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            className="mb-8"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05, duration: 0.2 }}
          >
            <div className="border-t border-border pt-5 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-[9px] font-mono text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-[10px] font-mono tracking-[0.2em] text-foreground/70 uppercase">
                  {section.title}
                </h2>
              </div>
            </div>
            <RenderContent body={section.body} />
          </motion.div>
        ))}

        {/* Stack section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.15 + sections.length * 0.05,
            duration: 0.2,
          }}
        >
          <div className="border-t border-border pt-5 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-[9px] font-mono text-accent">
                {String(sections.length + 1).padStart(2, "0")}
              </span>
              <h2 className="text-[10px] font-mono tracking-[0.2em] text-foreground/70 uppercase">
                ENGINEERING STACK
              </h2>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {meta.stack.map((tech) => (
              <span
                key={tech}
                className="text-[9px] font-mono text-foreground/70 bg-muted border border-border px-3 py-1.5 rounded-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
