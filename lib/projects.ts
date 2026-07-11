import fs from "fs";
import matter from "gray-matter";
import path from "path";

export interface ProjectMeta {
  name: string;
  slug: string;
  number: string;
  category: string;
  chain: string;
  status:
    | "ACTIVE"
    | "BUILDING"
    | "NDA"
    | "SHIPPED"
    | "LIVE"
    | "RESEARCH"
    | "LIVE / BUILDING";
  shortDescription: string;
  stack: string[];
  links: {
    demo?: string;
    source?: string;
    docs?: string;
  };
  color: string;
  impact: string;
}

export interface Project {
  meta: ProjectMeta;
  content: string;
}

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");
// Keep the MDX around, but hide TriDash from the portfolio for now.
const HIDDEN_PROJECT_SLUGS = new Set(["tridash"]);

export function getAllProjects(): ProjectMeta[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".mdx"));

  const projects = files
    .map((filename) => {
      const filePath = path.join(PROJECTS_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);
      return data as ProjectMeta;
    })
    .filter((project) => !HIDDEN_PROJECT_SLUGS.has(project.slug));

  // Sort by track number
  return projects.sort((a, b) => a.number.localeCompare(b.number));
}

export function getProject(slug: string): Project | null {
  if (HIDDEN_PROJECT_SLUGS.has(slug)) return null;

  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    meta: data as ProjectMeta,
    content,
  };
}

export function getAllProjectSlugs(): string[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""))
    .filter((slug) => !HIDDEN_PROJECT_SLUGS.has(slug));
}
