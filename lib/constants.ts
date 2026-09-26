import { Server, Smartphone, Globe } from "lucide-react";
import type { FilterCategory, Project, ProjectCategory } from "./types";

export const filterCategories: FilterCategory[] = [
  "All",
  "Backend & Distributed Systems",
  "Mobile Apps (Android & Flutter)",
  "Web & E-Commerce Platforms",
];

/**
 * The clickable tech pills under the hero bio. Clicking one scrolls to
 * #projects and filters the grid down to projects that use that tech —
 * see TECH_FILTER_EVENT below for how Hero and ProjectsGrid talk to
 * each other without a shared parent state tree.
 */
export const heroTechFilters = ["Flutter", "Kotlin", "Java / Spring Boot", ".NET 8"] as const;
export type HeroTechFilter = (typeof heroTechFilters)[number];

export const TECH_FILTER_EVENT = "portfolio:filter-tech";

const techFilterKeywords: Record<HeroTechFilter, string[]> = {
  Flutter: ["flutter"],
  Kotlin: ["kotlin"],
  "Java / Spring Boot": ["java", "spring boot", "spring cloud", "spring data"],
  ".NET 8": [".net", "asp.net"],
};

export function projectMatchesTechFilter(project: Project, filter: HeroTechFilter): boolean {
  const keywords = techFilterKeywords[filter];
  return project.techStack.some((tech) =>
    keywords.some((keyword) => tech.toLowerCase().includes(keyword))
  );
}

export const categoryAccent: Record<
  ProjectCategory,
  { border: string; glow: string; text: string; dot: string }
> = {
  "Backend & Distributed Systems": {
    border: "hover:border-glow-indigo/60",
    glow: "hover:shadow-glow-indigo",
    text: "text-glow-indigo",
    dot: "bg-glow-indigo",
  },
  "Mobile Apps (Android & Flutter)": {
    border: "hover:border-glow-violet/60",
    glow: "hover:shadow-glow-violet",
    text: "text-glow-violet",
    dot: "bg-glow-violet",
  },
  "Web & E-Commerce Platforms": {
    border: "hover:border-glow-cyan/60",
    glow: "hover:shadow-glow-cyan",
    text: "text-glow-cyan",
    dot: "bg-glow-cyan",
  },
};

export const categoryIcon: Record<ProjectCategory, typeof Server> = {
  "Backend & Distributed Systems": Server,
  "Mobile Apps (Android & Flutter)": Smartphone,
  "Web & E-Commerce Platforms": Globe,
};

/** Gradient classes for the no-image placeholder banner, keyed by category. */
export const categoryPlaceholder: Record<ProjectCategory, string> = {
  "Backend & Distributed Systems": "from-glow-indigo/25 via-base-raised to-base-surface",
  "Mobile Apps (Android & Flutter)": "from-glow-violet/25 via-base-raised to-base-surface",
  "Web & E-Commerce Platforms": "from-glow-cyan/25 via-base-raised to-base-surface",
};
