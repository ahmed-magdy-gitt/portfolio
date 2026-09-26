import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/lib/data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-base-border/70">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-6 py-10 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between md:px-10">
        <p>
          © {year} {profile.name}. Built with Next.js, Tailwind CSS and Framer Motion.
        </p>
        <div className="flex items-center gap-4">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
            aria-label="GitHub"
          >
            <Github size={17} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
            aria-label="LinkedIn"
          >
            <Linkedin size={17} />
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="transition-colors hover:text-ink"
            aria-label="Email"
          >
            <Mail size={17} />
          </a>
        </div>
      </div>
    </footer>
  );
}
