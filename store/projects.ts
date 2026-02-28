import type { ProjectMeta } from "@/lib/projects";
import { create } from "zustand";

interface ProjectsState {
  projects: ProjectMeta[];
  setProjects: (projects: ProjectMeta[]) => void;
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
}));
