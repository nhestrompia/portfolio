"use client";

import { motion } from "framer-motion";

const LINKS = [
  {
    label: "GITHUB",
    url: "https://github.com/nhestrompia",
    display: "github.com/nhestrompia",
  },
  {
    label: "X / TWITTER",
    url: "https://x.com/",
    display: "@umut",
  },
  {
    label: "EMAIL",
    url: "mailto:hello@umut.dev",
    display: "hello@umut.dev",
  },
];

export function ContactPanel() {
  return (
    <div className="flex items-center justify-center min-h-full p-8">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <h2 className="text-[8px] font-mono tracking-[0.3em] text-muted-foreground/50 mb-8">
          CONTACT
        </h2>

        <div className="h-px bg-separator" />

        <div className="space-y-0">
          {LINKS.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.url}
              target={link.url.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex items-center justify-between border-b border-separator py-5 group"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15, delay: i * 0.04 }}
            >
              <span className="text-[8px] font-mono tracking-[0.2em] text-muted-foreground/30">
                {link.label}
              </span>
              <span className="text-[11px] font-mono text-muted-foreground/50 group-hover:text-foreground/60 transition-colors duration-150">
                {link.display}
              </span>
            </motion.a>
          ))}
        </div>

        <div className="mt-10 text-[7px] font-mono text-muted-foreground/15 tracking-[0.2em]">
          UMUT.SYSTEM v1.0 — {new Date().getFullYear()}
        </div>
      </motion.div>
    </div>
  );
}
