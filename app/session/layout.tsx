import { SessionShell } from "@/components/session/session-shell";
import { SystemBar } from "@/components/session/system-bar";
import { TransportBar } from "@/components/transport/transport-bar";

export default function SessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionShell>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Top system bar */}
        <SystemBar />
        {/* Main content area — timeline + panels */}
        <div className="flex-1 min-h-0">{children}</div>
        {/* Bottom transport bar */}
        <TransportBar />
      </div>
    </SessionShell>
  );
}
