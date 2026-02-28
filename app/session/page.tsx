import { InspectorPanel } from "@/components/session/inspector-panel";
import { SessionTimeline } from "@/components/session/session-timeline";
import { TrackManager } from "@/components/session/track-manager";
import { getAllProjects } from "@/lib/projects";

export default function SessionPage() {
  const projects = getAllProjects();

  return (
    <div className="flex flex-col h-full">
      {/* Main row: sidebar + timeline + inspector */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Track Manager sidebar — hidden on mobile */}
        <div className="hidden md:block">
          <TrackManager projects={projects} variant="sidebar" />
        </div>
        {/* Center: Timeline — full width on mobile */}
        <div className="flex-1 min-w-0 md:border-x border-border">
          <SessionTimeline projects={projects} />
        </div>
        {/* Right: Inspector — hidden on mobile & tablet */}
        <div className="hidden lg:block">
          <InspectorPanel projects={projects} />
        </div>
      </div>
      {/* Bottom: Track Manager tray — mobile only */}
      <TrackManager projects={projects} variant="tray" />
    </div>
  );
}
