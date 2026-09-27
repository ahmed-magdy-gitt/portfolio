export type ProjectCategory =
  | "Backend & Distributed Systems"
  | "Mobile Apps (Android & Flutter)"
  | "Web & E-Commerce Platforms";

export type FilterCategory = "All" | ProjectCategory;

export interface ProjectLinks {
  github?: string;
  demo?: string;
  store?: string;
}

export interface ProjectCaseStudy {
  /** The problem this project set out to solve, in a sentence or two. */
  problem: string;
  /** Architecture / systems breakdown, as short standalone bullets. */
  architecture: string[];
  /** Notable challenges solved during the build, as short standalone bullets. */
  challenges: string[];
}

export interface Project {
  id: string;
  title: string;
  titleAr?: string;
  category: ProjectCategory;
  role: string;
  /** One or two plain-language sentences on the value this project delivers, shown on the card. */
  summary: string;
  techStack: string[];
  links: ProjectLinks;
  /** Deeper highlight bullets, shown inside the case study modal rather than the card. */
  highlights: string[];
  /**
   * Gallery image paths for the card carousel + case study modal, e.g.
   * "/projects/coworking-hub-1.png". Drop the matching files into /public
   * (same path, minus the leading slash). Any path that fails to load, or
   * an empty/undefined array, falls back to the gradient placeholder.
   */
  images?: string[];
  /** Extra detail shown inside the case study modal. Optional. */
  caseStudy?: ProjectCaseStudy;
}

export interface Skill {
  name: string;
  /** Rough self-rated proficiency, 0–100, driving the fill bar on each skill chip. */
  level: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: Skill[];
}

export interface Stat {
  id: string;
  value: number;
  suffix?: string;
  prefix?: string;
  /** Overrides the animated numeric counter with a literal string (for non-numeric stats). */
  displayValue?: string;
  label: string;
  description: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  org: string;
  /** Official LinkedIn or organization page for `org`, used to make the
   *  entry's org name (and timeline dot) a direct clickable link. */
  orgUrl?: string;
  /** Optional certificate file that opens in the experience lightbox. */
  certificateUrl?: string;
  type: "degree" | "training" | "internship";
  /** Optional partner org shown inline next to `org`, e.g. a training
   *  program's implementation partner. */
  partner?: {
    name: string;
    url?: string;
  };
  description: string;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  whatsapp: string;
  github: string;
  linkedin: string;
  resume: string;
}
