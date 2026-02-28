"use client";

import { useSessionStore } from "@/store/session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function SessionShell({ children }: { children: React.ReactNode }) {
  const { booted } = useSessionStore();
  const router = useRouter();

  // Redirect to boot if not booted (direct URL access)
  useEffect(() => {
    if (!booted) {
      router.replace("/");
    }
  }, [booted, router]);

  // Show nothing while redirecting
  if (!booted) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <p className="text-[9px] font-mono text-muted-foreground/30 tracking-[0.25em]">
          SESSION NOT INITIALIZED
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
